"use client";

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Users, ClipboardCheck, AlertCircle, CheckCircle, XCircle, Loader2,
  ShieldAlert, Eye, Search, Mail, Phone, MapPin, Globe, Instagram,
  Calendar, Banknote, ImageIcon, FileText, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type AdminView = 'applications' | 'vendors';

const PLAN_LABELS: Record<string, string> = {
  free: 'Free Listing',
  standard: 'Standard · R499',
  featured: 'Featured · R1,199',
};

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [view, setView] = useState<AdminView>('applications');
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [vendorSearch, setVendorSearch] = useState('');

  const adminRoleRef = useMemoFirebase(
    () => (user && db ? doc(db, 'roles_admin', user.uid) : null),
    [user, db]
  );
  const { data: adminRole, isLoading: isRoleLoading } = useDoc<any>(adminRoleRef);
  const isAdmin = !!adminRole;

  const pendingQuery = useMemoFirebase(
    () => isAdmin && db
      ? query(collection(db, 'vendorApplications'), where('applicationStatus', '==', 'pending'))
      : null,
    [isAdmin, db]
  );
  const approvedQuery = useMemoFirebase(
    () => isAdmin && db
      ? query(collection(db, 'vendorApplications'), where('applicationStatus', '==', 'approved'))
      : null,
    [isAdmin, db]
  );
  const vendorsQuery = useMemoFirebase(
    () => isAdmin && db ? collection(db, 'vendors') : null,
    [isAdmin, db]
  );

  const { data: pendingRaw, isLoading: isQueueLoading } = useCollection<any>(pendingQuery);
  const { data: approvedRaw, isLoading: isApprovedLoading } = useCollection<any>(approvedQuery);
  const { data: membershipsRaw, isLoading: isMembershipLoading } = useCollection<any>(vendorsQuery);

  const pending = pendingRaw
    ? [...pendingRaw].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    : [];
  const membershipByUid = useMemo(
    () => new Map((membershipsRaw ?? []).map(membership => [membership.id, membership])),
    [membershipsRaw]
  );
  const vendors = useMemo(() => {
    const term = vendorSearch.trim().toLowerCase();
    return (approvedRaw ?? [])
      .map(application => ({ ...application, membership: membershipByUid.get(application.submitterUid) }))
      .filter(vendor => !term || [vendor.businessName, vendor.ownerName, vendor.email, vendor.category, vendor.location]
        .some(value => String(value ?? '').toLowerCase().includes(term)))
      .sort((a, b) => String(a.businessName ?? '').localeCompare(String(b.businessName ?? '')));
  }, [approvedRaw, membershipByUid, vendorSearch]);

  const decide = async (id: string, decision: 'approved' | 'rejected') => {
    if (!user) return;
    try {
      setBusyId(id);
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/vendor-applications/${encodeURIComponent(id)}/decision`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not review the application.');
      setSelectedApplication(null);
      toast({
        title: decision === 'approved' ? 'Application Approved' : 'Application Rejected',
        description: decision === 'approved'
          ? result.emailSent
            ? 'The vendor was emailed a direct link to activate their chosen plan.'
            : result.emailError || 'Approved, but the notification email was not sent.'
          : 'The applicant has been marked as not approved.',
        variant: decision === 'approved' && !result.emailSent ? 'destructive' : 'default',
      });
    } catch (error: any) {
      toast({ title: 'Action Failed', description: error?.message, variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  if (isUserLoading || isRoleLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-44 text-center">
          <div className="max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h1 className="font-headline text-[28px]">Admin Access Only</h1>
            <p className="text-muted-foreground italic font-medium">This area is restricted to InFaith Journey administrators.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingCount = pending.length;
  const activeCount = (approvedRaw ?? []).filter(app => membershipByUid.get(app.submitterUid)?.membershipStatus === 'active').length;
  const stats = [
    { label: 'Pending Applications', value: String(pendingCount), icon: ClipboardCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Approved Vendors', value: String(approvedRaw?.length ?? 0), icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Active Memberships', value: String(activeCount), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Review Required', value: String(pendingCount), icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-6 pt-44 pb-24 w-full">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-primary/10 pb-8 text-center md:text-left">
          <div className="space-y-2">
            <h1 className="font-headline text-[32px] md:text-[48px] leading-tight">Admin Headquarters</h1>
            <p className="text-[14px] md:text-[16px] text-muted-foreground italic font-medium">
              Review applications and manage every vendor from one private workspace.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map(stat => (
            <Card key={stat.label} className="border-none shadow-soft rounded-[24px] overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className={cn('p-3 rounded-xl w-fit mb-5', stat.bg)}><stat.icon className={cn('w-6 h-6', stat.color)} /></div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-[32px] font-headline font-bold">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6 p-1.5 rounded-2xl bg-muted w-full sm:w-fit">
          <Button variant={view === 'applications' ? 'default' : 'ghost'} onClick={() => setView('applications')} className="rounded-xl px-6">
            <ClipboardCheck className="w-4 h-4 mr-2" /> Applications {pendingCount > 0 && <Badge className="ml-2 bg-white text-primary">{pendingCount}</Badge>}
          </Button>
          <Button variant={view === 'vendors' ? 'default' : 'ghost'} onClick={() => setView('vendors')} className="rounded-xl px-6">
            <Users className="w-4 h-4 mr-2" /> Vendors
          </Button>
        </div>

        {view === 'applications' ? (
          <section className="rounded-[24px] md:rounded-[40px] border border-primary/10 p-6 md:p-10 shadow-soft">
            <div className="mb-8 pb-5 border-b border-primary/10">
              <h2 className="font-headline text-[24px] md:text-[32px]">Pending Applications</h2>
              <p className="text-sm text-muted-foreground mt-1">Open an application to inspect every submitted detail and photo before deciding.</p>
            </div>
            {isQueueLoading ? <Loading /> : pendingCount === 0 ? <Empty text="No applications waiting. You're all caught up." /> : (
              <div className="space-y-4">
                {pending.map(app => (
                  <ApplicationRow key={app.id} application={app} busy={busyId === app.id} onView={() => setSelectedApplication(app)} onDecide={decide} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-[24px] md:rounded-[40px] border border-primary/10 p-6 md:p-10 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-5 border-b border-primary/10">
              <div>
                <h2 className="font-headline text-[24px] md:text-[32px]">Vendor Management</h2>
                <p className="text-sm text-muted-foreground mt-1">View approved vendors, their membership state, profiles, and media.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={vendorSearch} onChange={event => setVendorSearch(event.target.value)} placeholder="Search vendors..." className="pl-11 rounded-full" />
              </div>
            </div>
            {isApprovedLoading || isMembershipLoading ? <Loading /> : vendors.length === 0 ? <Empty text={vendorSearch ? 'No vendors match your search.' : 'No approved vendors yet.'} /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map(vendor => (
                  <button key={vendor.id} onClick={() => setSelectedVendor(vendor)} className="text-left p-5 rounded-[22px] border border-primary/10 hover:border-primary/30 hover:shadow-soft transition-all">
                    <div className="flex items-start gap-4">
                      {vendor.logoUrl ? <img src={vendor.logoUrl} alt="" className="w-14 h-14 rounded-xl object-cover border" /> : <Initial name={vendor.businessName} />}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold truncate">{vendor.businessName || 'Unnamed Business'}</h3>
                          <MembershipBadge status={vendor.membership?.membershipStatus} selectedPlan={vendor.selectedPlan} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{vendor.category || 'No category'}{vendor.location ? ` · ${vendor.location}` : ''}</p>
                        <p className="text-xs text-primary mt-2 inline-flex items-center"><Eye className="w-3.5 h-3.5 mr-1.5" /> View vendor details</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />

      <VendorDetailDialog
        record={selectedApplication}
        open={!!selectedApplication}
        onOpenChange={open => !open && setSelectedApplication(null)}
        title="Vendor Application"
        subtitle="Review all information supplied by this applicant before approving or rejecting."
        footer={selectedApplication && (
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button variant="outline" disabled={busyId === selectedApplication.id} onClick={() => decide(selectedApplication.id, 'rejected')} className="rounded-full border-red-200 text-red-600">
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
            <Button disabled={busyId === selectedApplication.id} onClick={() => decide(selectedApplication.id, 'approved')} className="button-rose rounded-full">
              {busyId === selectedApplication.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Approve Vendor</>}
            </Button>
          </DialogFooter>
        )}
      />
      <VendorDetailDialog
        record={selectedVendor}
        open={!!selectedVendor}
        onOpenChange={open => !open && setSelectedVendor(null)}
        title="Vendor Details"
        subtitle="Complete vendor profile and membership information."
        membership={selectedVendor?.membership}
        showMembership
      />
    </div>
  );
}

function ApplicationRow({ application, busy, onView, onDecide }: { application: any; busy: boolean; onView: () => void; onDecide: (id: string, decision: 'approved' | 'rejected') => void }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6 rounded-[22px] border border-primary/10 text-center md:text-left">
      {application.logoUrl ? <img src={application.logoUrl} alt="" className="w-16 h-16 rounded-xl object-cover border" /> : <Initial name={application.businessName} />}
      <button onClick={onView} className="flex-1 min-w-0 group text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1">
          <h4 className="font-bold text-[17px] group-hover:text-primary">{application.businessName || 'Unnamed Business'}</h4>
          {application.category && <Badge variant="secondary">{application.category}</Badge>}
          <Badge variant="outline">{PLAN_LABELS[application.selectedPlan] || application.selectedPlan}</Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{application.ownerName}{application.email ? ` · ${application.email}` : ''}{application.location ? ` · ${application.location}` : ''}</p>
        <span className="inline-flex items-center text-xs text-primary mt-2"><Eye className="w-3.5 h-3.5 mr-1.5" /> View full application</span>
      </button>
      <div className="flex gap-2 w-full md:w-auto">
        <Button variant="outline" size="sm" disabled={busy} onClick={() => onDecide(application.id, 'rejected')} className="flex-1 rounded-full border-red-100 text-red-500"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
        <Button size="sm" disabled={busy} onClick={() => onDecide(application.id, 'approved')} className="flex-1 button-rose rounded-full">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Approve</>}</Button>
      </div>
    </div>
  );
}

function VendorDetailDialog({ record, open, onOpenChange, title, subtitle, membership, showMembership = false, footer }: { record: any; open: boolean; onOpenChange: (open: boolean) => void; title: string; subtitle: string; membership?: any; showMembership?: boolean; footer?: React.ReactNode }) {
  if (!record) return null;
  const details = [
    { icon: Mail, label: 'Email', value: record.email }, { icon: Phone, label: 'Phone', value: record.phoneNumber },
    { icon: MapPin, label: 'Location', value: record.location }, { icon: Globe, label: 'Website', value: record.websiteUrl },
    { icon: Instagram, label: 'Instagram', value: record.instagramHandle }, { icon: Calendar, label: 'Years in business', value: record.yearsInBusiness },
    { icon: Banknote, label: 'Pricing range', value: record.pricingRange }, { icon: ClipboardCheck, label: 'Selected plan', value: PLAN_LABELS[record.selectedPlan] || record.selectedPlan },
  ];
  const photos = [record.logoUrl, record.coverImageUrl, ...(record.portfolioImageUrls ?? [])].filter(Boolean);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] p-0">
        {record.coverImageUrl && <img src={record.coverImageUrl} alt="" className="w-full h-48 object-cover" />}
        <div className="p-6 md:p-8 space-y-7">
          <DialogHeader>
            <div className="flex items-start gap-4 pr-8">
              {record.logoUrl ? <img src={record.logoUrl} alt="" className="w-16 h-16 rounded-xl object-cover border" /> : <Initial name={record.businessName} />}
              <div>
                <DialogTitle className="font-headline text-2xl md:text-3xl">{record.businessName || title}</DialogTitle>
                <DialogDescription className="mt-1">{subtitle}</DialogDescription>
                <div className="flex flex-wrap gap-2 mt-3"><Badge>{record.category || 'No category'}</Badge><Badge variant="outline">{PLAN_LABELS[record.selectedPlan] || record.selectedPlan}</Badge>{showMembership && <MembershipBadge status={membership?.membershipStatus} selectedPlan={record.selectedPlan} />}</div>
              </div>
            </div>
          </DialogHeader>

          <section>
            <h3 className="font-headline text-xl mb-3">Owner & Business Information</h3>
            <p className="font-semibold mb-4">{record.ownerName || 'Owner name not provided'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {details.map(detail => <Detail key={detail.label} {...detail} />)}
            </div>
          </section>
          {membership && <section className="rounded-2xl bg-muted p-5"><h3 className="font-headline text-xl mb-3">Membership</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Detail icon={CheckCircle} label="Status" value={membership.membershipStatus} /><Detail icon={Sparkles} label="Tier" value={membership.membershipTier || record.selectedPlan} /></div></section>}
          <TextSection icon={FileText} title="About the business" value={record.description} />
          <TextSection icon={Sparkles} title="Services offered" value={record.servicesOffered} />
          <section>
            <h3 className="font-headline text-xl mb-3 flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-primary" /> Submitted Photos</h3>
            {photos.length ? <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{photos.map((url: string, index: number) => <img key={`${url}-${index}`} src={url} alt={`Vendor media ${index + 1}`} className="w-full h-36 rounded-xl object-cover border" />)}</div> : <p className="text-sm text-muted-foreground italic">No photos submitted.</p>}
          </section>
          {footer}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return <div className="flex gap-3 rounded-xl border p-3"><Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" /><div className="min-w-0"><p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p><p className="text-sm break-words capitalize">{value || '—'}</p></div></div>;
}
function TextSection({ icon: Icon, title, value }: { icon: any; title: string; value: string }) {
  return <section><h3 className="font-headline text-xl mb-3 flex items-center"><Icon className="w-5 h-5 mr-2 text-primary" />{title}</h3><p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">{value || 'Not provided.'}</p></section>;
}
function MembershipBadge({ status, selectedPlan }: { status?: string; selectedPlan?: string }) {
  if (selectedPlan === 'free') return <Badge variant="secondary">Free listing</Badge>;
  const active = status === 'active';
  return <Badge className={active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>{active ? 'Active' : status === 'past_due' ? 'Past due' : 'Awaiting activation'}</Badge>;
}
function Initial({ name }: { name?: string }) {
  return <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-headline text-xl shrink-0">{(name || '?').charAt(0).toUpperCase()}</div>;
}
function Loading() { return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>; }
function Empty({ text }: { text: string }) { return <p className="py-12 text-center text-muted-foreground italic font-medium">{text}</p>; }
