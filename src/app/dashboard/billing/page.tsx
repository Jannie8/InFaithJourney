'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard, Loader2, ArrowLeft, CheckCircle, AlertCircle,
  ShieldAlert, XCircle, Receipt, RotateCw,
} from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Shape of the subscription payload returned by /api/paystack/subscription
type Subscription = {
  subscriptionCode: string;
  status: string;
  planName: string;
  amount: number;          // ZAR cents
  currency: string;
  interval: string;
  nextPaymentDate: string | null;
  tier: 'standard' | 'featured' | null;
  card: {
    last4: string | null;
    brand: string | null;
    expMonth: string | null;
    expYear: string | null;
  };
};

type Invoice = {
  id: number | string;
  reference: string | null;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  channel: string | null;
};

// Money in ZAR cents -> "R 1,199.00"
function formatAmount(cents: number, currency = 'ZAR') {
  const value = (cents ?? 0) / 100;
  // Use en-ZA so the currency symbol is "R" with proper grouping.
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(value);
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function titleCase(s: string | null | undefined) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function BillingPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  // Membership doc — used to gate the page (only active members should land here)
  // and to display the email used by PayStack.
  const vendorDocRef = useMemoFirebase(
    () => (user && db ? doc(db, 'vendors', user.uid) : null),
    [user, db]
  );
  const { data: vendorDoc, isLoading: isVendorLoading } = useDoc<any>(vendorDocRef);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(true);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [changingPlan, setChangingPlan] = useState<'standard' | 'featured' | null>(null);

  const billingEmail = user?.email ?? vendorDoc?.email ?? null;

  // Pull subscription + invoices on mount once we know the email to query against.
  const loadAll = async () => {
    if (!billingEmail) return;
    setIsLoadingSub(true);
    setIsLoadingInvoices(true);
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Please sign in again to load billing details.');
      const [subRes, invRes] = await Promise.all([
        fetch('/api/paystack/subscription', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/paystack/invoices', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const subData = await subRes.json();
      const invData = await invRes.json();
      if (!subRes.ok) throw new Error(subData?.error ?? 'Could not load subscription.');
      if (!invRes.ok) throw new Error(invData?.error ?? 'Could not load payment history.');
      setSubscription(subData?.subscription ?? null);
      setInvoices(Array.isArray(invData?.invoices) ? invData.invoices : []);
    } catch (e: any) {
      toast({
        title: 'Could not load billing details',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSub(false);
      setIsLoadingInvoices(false);
    }
  };

  const changePlan = async (tier: 'standard' | 'featured') => {
    if (!user || tier === (subscription?.tier ?? vendorDoc?.membershipTier)) return;
    try {
      setChangingPlan(tier);
      const token = await user.getIdToken();
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, applicationId: vendorDoc?.applicationId, changePlan: true }),
      });
      const data = await res.json();
      if (!res.ok || !data?.authorizationUrl) throw new Error(data?.error ?? 'Could not change plan.');
      window.location.assign(data.authorizationUrl);
    } catch (e: any) {
      toast({ title: 'Could not change plan', description: e?.message ?? 'Please try again.', variant: 'destructive' });
      setChangingPlan(null);
    }
  };

  useEffect(() => {
    if (billingEmail) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingEmail]);

  const updateCard = async () => {
    if (!billingEmail) return;
    try {
      setIsOpeningPortal(true);
      const token = await user?.getIdToken();
      if (!token) throw new Error('Please sign in again.');
      const res = await fetch('/api/paystack/manage', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data?.link) {
        throw new Error(data?.error ?? 'Could not open the card update page.');
      }
      window.open(data.link, '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      toast({
        title: 'Could not open card update page',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const cancelSubscription = async () => {
    if (!billingEmail || !user) return;
    try {
      setIsCancelling(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/paystack/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: vendorDoc?.applicationId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? 'Could not cancel subscription.');
      }
      toast({
        title: 'Subscription cancelled',
        description: "Your subscription, application, and public listing have been cancelled.",
      });
      setConfirmingCancel(false);
      // Refresh details — PayStack updates "status" to non-renewing immediately.
      loadAll();
    } catch (e: any) {
      toast({
        title: 'Cancel failed',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // --- Render guards -------------------------------------------------------

  if (isUserLoading || isVendorLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Only signed-in active members get here — otherwise bounce back to the dashboard
  // (which renders the right state: sign-in, apply, pending, approved → activate, etc.)
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-44 text-center">
          <div className="max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h1 className="font-headline text-[28px]">Sign in first</h1>
            <p className="text-muted-foreground italic font-medium">
              You need to be signed in to manage your billing.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="button-rose">
              Go to dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isActive = vendorDoc?.membershipStatus === 'active';

  if (!isActive) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-44 text-center">
          <div className="max-w-md space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h1 className="font-headline text-[28px]">No active membership</h1>
            <p className="text-muted-foreground italic font-medium">
              You don't have an active membership yet. Activate from your dashboard to start.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="button-rose">
              Go to dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tierLabel =
    subscription?.tier === 'featured' ? 'Featured Vendor'
    : subscription?.tier === 'standard' ? 'Standard Vendor'
    : subscription?.planName || (vendorDoc?.membershipTier === 'featured' ? 'Featured Vendor' : 'Standard Vendor');

  // --- Render --------------------------------------------------------------

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-6 pt-44 md:pt-44 pb-24 w-full">
        {/* Header */}
        <div className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/10 pb-8">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="font-headline text-[32px] md:text-[44px] leading-tight">Manage Billing</h1>
            <p className="text-[14px] md:text-[15px] text-muted-foreground italic font-medium">
              Your payment method, plan details, and billing history.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAll}
            disabled={isLoadingSub || isLoadingInvoices}
            className="rounded-full h-9 px-4 text-[11px] uppercase tracking-widest"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-2 ${(isLoadingSub || isLoadingInvoices) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Loading */}
        {isLoadingSub && (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* No subscription found on PayStack side */}
        {!isLoadingSub && !subscription && (
          <Card className="border-amber-200 shadow-soft rounded-[24px] mb-8">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4">
              <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
              <div className="flex-1 space-y-1">
                <h3 className="font-headline text-[20px]">Membership active, but no PayStack record yet</h3>
                <p className="text-[13px] text-muted-foreground italic font-medium">
                  Your membership is marked active in our records. Your billing details from PayStack
                  haven't synced yet — give it a minute, then click Refresh.
                </p>
                <div className="flex flex-wrap gap-3 pt-3">
                  {(['standard', 'featured'] as const).map(tier => (
                    <Button key={tier} size="sm" variant={vendorDoc?.membershipTier === tier ? 'outline' : 'default'} disabled={vendorDoc?.membershipTier === tier || changingPlan !== null} onClick={() => changePlan(tier)} className="rounded-full capitalize">
                      {changingPlan === tier ? <Loader2 className="w-4 h-4 animate-spin" /> : `${tier === 'featured' ? 'Featured · R1,199' : 'Standard · R499'} / month`}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription details */}
        {!isLoadingSub && subscription && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Current plan */}
              <Card className="rounded-[24px] md:rounded-[28px] shadow-soft border border-primary/10">
                <CardContent className="p-6 md:p-8 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Plan</p>
                      <h2 className="font-headline text-[24px] md:text-[28px]">{tierLabel}</h2>
                      <p className="text-[13px] text-muted-foreground italic font-medium mt-1">
                        {formatAmount(subscription.amount, subscription.currency)} · billed {subscription.interval}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        subscription.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold uppercase tracking-widest'
                          : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold uppercase tracking-widest'
                      }
                    >
                      {titleCase(subscription.status?.replace('-', ' '))}
                    </Badge>
                  </div>
                  <div className="pt-3 border-t border-primary/10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Bill</p>
                    <p className="text-[14px] font-medium">
                      {subscription.status === 'active'
                        ? formatDate(subscription.nextPaymentDate)
                        : 'No upcoming charge'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card on file */}
              <Card className="rounded-[24px] md:rounded-[28px] shadow-soft border border-primary/10">
                <CardContent className="p-6 md:p-8 space-y-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Payment Method</p>
                    {subscription.card.last4 ? (
                      <>
                        <h2 className="font-headline text-[24px] md:text-[28px]">
                          {titleCase(subscription.card.brand)} •••• {subscription.card.last4}
                        </h2>
                        <p className="text-[13px] text-muted-foreground italic font-medium mt-1">
                          Expires {subscription.card.expMonth}/{subscription.card.expYear}
                        </p>
                      </>
                    ) : (
                      <p className="text-[14px] text-muted-foreground italic">No card on file.</p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-primary/10">
                    <Button
                      onClick={updateCard}
                      disabled={isOpeningPortal}
                      variant="outline"
                      className="w-full rounded-full h-11 text-[12px] font-bold uppercase tracking-widest border-primary/20"
                    >
                      {isOpeningPortal ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Opening...</>
                      ) : (
                        <><CreditCard className="w-4 h-4 mr-2" /> Update Card</>
                      )}
                    </Button>
                    <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      Opens PayStack's secure portal
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice history */}
            <Card className="rounded-[24px] md:rounded-[28px] shadow-soft border border-primary/10 mb-8">
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-primary" />
                  <h2 className="font-headline text-[20px] md:text-[24px]">Payment History</h2>
                </div>

                {isLoadingInvoices ? (
                  <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                ) : !invoices || invoices.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground italic font-medium py-2">
                    No payments yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-primary/10">
                    {invoices.map((inv) => {
                      const succeeded = inv.status === 'success';
                      return (
                        <li key={inv.id} className="py-3 flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${succeeded ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            {succeeded
                              ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                              : <XCircle className="w-4 h-4 text-rose-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium">{formatAmount(inv.amount, inv.currency)}</p>
                            <p className="text-[11px] uppercase tracking-widest text-muted-foreground truncate">
                              {formatDate(inv.paidAt)} {inv.reference ? `· ${inv.reference}` : ''}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              succeeded
                                ? 'text-emerald-700 border-emerald-200 bg-emerald-50 text-[10px] uppercase tracking-widest'
                                : 'text-rose-700 border-rose-200 bg-rose-50 text-[10px] uppercase tracking-widest'
                            }
                          >
                            {titleCase(inv.status)}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[24px] md:rounded-[28px] shadow-soft border border-primary/10 mb-8">
              <CardContent className="p-6 md:p-8 space-y-5">
                <div>
                  <h2 className="font-headline text-[20px] md:text-[24px]">Choose your plan</h2>
                  <p className="text-[13px] text-muted-foreground italic mt-1">
                    Upgrade or downgrade securely. Your current plan stays active until the new payment succeeds.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {([
                    { tier: 'standard' as const, name: 'Standard Vendor', price: 'R499 / month', detail: 'A complete listing with direct inquiries.' },
                    { tier: 'featured' as const, name: 'Featured Vendor', price: 'R1,199 / month', detail: 'Priority placement, social links, and maximum visibility.' },
                  ]).map(plan => {
                    const current = plan.tier === (subscription?.tier ?? vendorDoc?.membershipTier);
                    return (
                      <div key={plan.tier} className={`rounded-2xl border p-5 ${current ? 'border-emerald-300 bg-emerald-50/50' : 'border-primary/10'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-headline text-[20px]">{plan.name}</h3>
                            <p className="text-[13px] font-bold mt-1">{plan.price}</p>
                          </div>
                          {current && <Badge className="bg-emerald-600">Current</Badge>}
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-3 min-h-9">{plan.detail}</p>
                        <Button
                          onClick={() => changePlan(plan.tier)}
                          disabled={current || changingPlan !== null}
                          variant={current ? 'outline' : 'default'}
                          className="w-full rounded-full mt-4"
                        >
                          {changingPlan === plan.tier ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening checkout...</> : current ? 'Current plan' : plan.tier === 'featured' ? 'Upgrade' : 'Downgrade'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Danger zone — cancel */}
            <Card className="rounded-[24px] md:rounded-[28px] shadow-soft border border-rose-200 bg-rose-50/30">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-500 mt-1" />
                  <div>
                    <h2 className="font-headline text-[20px] md:text-[22px]">Cancel Subscription</h2>
                    <p className="text-[13px] text-muted-foreground italic font-medium mt-1">
                      Your membership stays active until the end of the current billing period.
                      You won't be charged again. You can resubscribe any time.
                    </p>
                  </div>
                </div>

                {confirmingCancel ? (
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end pt-2">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-rose-700 mr-auto">
                      Are you sure?
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCancelling}
                      onClick={() => setConfirmingCancel(false)}
                      className="rounded-full h-9 px-5 text-[11px] uppercase tracking-widest"
                    >
                      Keep Subscription
                    </Button>
                    <Button
                      size="sm"
                      disabled={isCancelling}
                      onClick={cancelSubscription}
                      className="rounded-full h-9 px-5 text-[11px] uppercase tracking-widest bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      {isCancelling ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cancelling...</>
                      ) : (
                        'Yes, Cancel'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmingCancel(true)}
                      className="rounded-full h-10 px-5 text-[11px] uppercase tracking-widest border-rose-300 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
