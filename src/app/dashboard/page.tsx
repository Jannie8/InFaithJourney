
"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  User, Briefcase, Mail, Star, Settings, LogOut,
  Sparkles, Eye, EyeOff, LayoutDashboard,
  PieChart, CreditCard, Edit3, Loader2, CheckCircle,
  Phone, MapPin, Globe, Instagram, Tag, Calendar,
  Banknote, FileText, ImageIcon, AlertCircle,
  ShieldCheck, XCircle, ClipboardCheck, Clock,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useUser, useAuth, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  collection, query, where, doc, setDoc, addDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaying, setIsPaying] = useState<null | 'standard' | 'featured'>(null);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  // Open PayStack's hosted billing portal where the customer can update their card,
  // view past invoices, or cancel their subscription. We mint a fresh link on each
  // click via the server (which is the only place the secret key lives).
  const openBillingPortal = async () => {
    const userEmail = user?.email ?? vendorDoc?.email;
    if (!userEmail) {
      toast({
        title: 'No email on file',
        description: 'Sign back in so we can open your billing portal.',
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsOpeningPortal(true);
      const res = await fetch('/api/paystack/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.link) {
        throw new Error(data?.error ?? 'Could not open billing portal.');
      }
      // Open in a new tab — keeps the dashboard intact for when they come back.
      window.open(data.link, '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      toast({
        title: 'Billing Portal Error',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const isLoggedIn = user || isSimulating;

  // This vendor's most recent application (drives the approval gate).
  const applicationQuery = useMemoFirebase(
    () =>
      user && db
        ? query(
            collection(db, 'vendorApplications'),
            where('submitterUid', '==', user.uid)
          )
        : null,
    [user, db]
  );
  const { data: applications } = useCollection<any>(applicationQuery);
  // Pick the most recent application (sorted in code to avoid a composite index).
  const application =
    applications && applications.length > 0
      ? [...applications].sort(
          (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
        )[0]
      : null;

  // This vendor's live membership record (set after a successful payment).
  const vendorDocRef = useMemoFirebase(
    () => (user && db ? doc(db, 'vendors', user.uid) : null),
    [user, db]
  );
  const { data: vendorDoc } = useDoc<any>(vendorDocRef);

  const isMembershipActive = vendorDoc?.membershipStatus === 'active';
  const appStatus: string | null = application?.applicationStatus ?? null;
  const approvedTier: 'standard' | 'featured' =
    application?.selectedPlan === 'featured' ? 'featured' : 'standard';

  // Admin role detection — drives the conditional "Admin" tab in the sidebar.
  const adminRoleRef = useMemoFirebase(
    () => (user && db ? doc(db, 'roles_admin', user.uid) : null),
    [user, db]
  );
  const { data: adminRole } = useDoc<any>(adminRoleRef);
  const isAdmin = !!adminRole;

  // The vendor's own pending edit request (if any). We only allow one at a time
  // so the admin queue stays tidy and the vendor isn't confused by overlapping versions.
  const myPendingEditQuery = useMemoFirebase(
    () =>
      user && db
        ? query(
            collection(db, 'vendorEditRequests'),
            where('vendorUid', '==', user.uid),
            where('status', '==', 'pending')
          )
        : null,
    [user, db]
  );
  const { data: myPendingEdits } = useCollection<any>(myPendingEditQuery);
  const myPendingEdit = (myPendingEdits && myPendingEdits.length > 0) ? myPendingEdits[0] : null;

  // Admin queues — only fetched when the signed-in user is an admin (avoids
  // permission errors for everyone else, since list rules require admin).
  const adminApplicationsQuery = useMemoFirebase(
    () =>
      isAdmin && db
        ? query(collection(db, 'vendorApplications'), where('applicationStatus', '==', 'pending'))
        : null,
    [isAdmin, db]
  );
  const { data: adminPendingApps } = useCollection<any>(adminApplicationsQuery);

  const adminEditsQuery = useMemoFirebase(
    () =>
      isAdmin && db
        ? query(collection(db, 'vendorEditRequests'), where('status', '==', 'pending'))
        : null,
    [isAdmin, db]
  );
  const { data: adminPendingEdits } = useCollection<any>(adminEditsQuery);

  // Edit-form UI state for "Request Edit" on the My Profile tab.
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Editable text fields — pull from the application as the source of truth.
  const editableFields: Array<{ key: string; label: string; multiline?: boolean }> = [
    { key: 'businessName', label: 'Business Name' },
    { key: 'ownerName', label: 'Owner Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'websiteUrl', label: 'Website' },
    { key: 'instagramHandle', label: 'Instagram Handle' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' },
    { key: 'yearsInBusiness', label: 'Years in Business' },
    { key: 'pricingRange', label: 'Pricing Range' },
    { key: 'description', label: 'About / Description', multiline: true },
    { key: 'servicesOffered', label: 'Services Offered', multiline: true },
  ];

  const openEditForm = () => {
    if (!application) return;
    // Prefill the form with current values so the vendor only changes what they want.
    const initial: Record<string, any> = {};
    editableFields.forEach((f) => { initial[f.key] = application[f.key] ?? ''; });
    setEditForm(initial);
    setIsEditing(true);
  };

  const submitEditRequest = async () => {
    if (!user || !db || !application) return;
    // Compute the diff — only include fields the vendor actually changed.
    const changes: Record<string, any> = {};
    editableFields.forEach((f) => {
      const newVal = (editForm[f.key] ?? '').trim();
      const oldVal = (application[f.key] ?? '').toString().trim();
      if (newVal !== oldVal) changes[f.key] = newVal;
    });
    if (Object.keys(changes).length === 0) {
      toast({ title: 'No changes to submit', description: 'Update at least one field first.' });
      return;
    }
    try {
      setIsSavingEdit(true);
      await addDoc(collection(db, 'vendorEditRequests'), {
        vendorUid: user.uid,
        applicationId: application.id,
        status: 'pending',
        changes,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Edit request submitted',
        description: 'An admin will review your changes shortly.',
      });
      setIsEditing(false);
    } catch (e: any) {
      toast({ title: 'Could not submit', description: e?.message ?? 'Try again.', variant: 'destructive' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Admin actions: approve/decline a vendor application.
  const decideApplication = async (id: string, decision: 'approved' | 'rejected') => {
    if (!user) return;
    try {
      setReviewingId(id);
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/vendor-applications/${encodeURIComponent(id)}/decision`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not review the application.');
      toast({
        title: decision === 'approved' ? 'Application Approved' : 'Application Rejected',
        description:
          decision === 'approved'
            ? result.emailSent
              ? 'The vendor was emailed a direct link to activate their chosen plan.'
              : result.emailError || 'Approved, but the notification email was not sent.'
            : 'The applicant has been marked as not approved.',
        variant: decision === 'approved' && !result.emailSent ? 'destructive' : 'default',
      });
    } catch (e: any) {
      toast({ title: 'Action Failed', description: e?.message, variant: 'destructive' });
    } finally {
      setReviewingId(null);
    }
  };

  // Admin actions: approve/decline an edit request. Approval applies the diff to
  // the underlying vendorApplication so it's the source of truth going forward.
  const decideEditRequest = async (request: any, decision: 'approved' | 'rejected') => {
    if (!db) return;
    try {
      setReviewingId(request.id);
      if (decision === 'approved' && request.applicationId && request.changes) {
        await updateDoc(doc(db, 'vendorApplications', request.applicationId), {
          ...request.changes,
          updatedAt: serverTimestamp(),
        });
      }
      await updateDoc(doc(db, 'vendorEditRequests', request.id), {
        status: decision,
        reviewedAt: serverTimestamp(),
        reviewedBy: user?.uid ?? null,
      });
      toast({
        title: decision === 'approved' ? 'Edit Approved' : 'Edit Declined',
        description:
          decision === 'approved'
            ? "The vendor's profile has been updated."
            : 'The edit request was declined.',
      });
    } catch (e: any) {
      toast({ title: 'Action Failed', description: e?.message, variant: 'destructive' });
    } finally {
      setReviewingId(null);
    }
  };

  // Start a PayStack subscription checkout for the chosen tier.
  const handleActivate = async (tier: 'standard' | 'featured') => {
    try {
      setIsPaying(tier);
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          email: user?.email || 'vendor-test@infaithjourney.com',
          uid: user?.uid || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start payment.');
      // Send the vendor to PayStack's secure payment page.
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Payment Error', description: err.message, variant: 'destructive' });
      setIsPaying(null);
    }
  };

  // When PayStack redirects back, confirm the payment with our server.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paystack') !== 'return') return;
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) return;

    (async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();
        if (data.success) {
          // Record the membership on the vendor's own record (rules allow owner writes).
          if (user && db) {
            await setDoc(
              doc(db, 'vendors', user.uid),
              {
                membershipStatus: 'active',
                membershipTier: data.tier ?? approvedTier,
                paystackReference: data.reference ?? reference,
                email: user.email ?? null,
                submitterUid: user.uid,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
          setActiveTab('Subscription & Billing');
          toast({ title: 'Membership Active', description: 'Your payment was confirmed. Welcome aboard!' });
        } else {
          toast({ title: 'Payment Not Completed', description: 'We could not confirm your payment.', variant: 'destructive' });
        }
      } catch (e: any) {
        toast({ title: 'Verification Error', description: e.message, variant: 'destructive' });
      } finally {
        // Clean the URL so a refresh doesn't re-trigger verification.
        window.history.replaceState({}, '', '/dashboard');
      }
    })();
  }, [toast, user, db, approvedTier]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login failed", error);
      if (!email || !password) {
        setIsSimulating(true);
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleLogout = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      signOut(auth);
    }
  };

  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Profile', icon: User },
    { name: 'Inquiries', icon: Mail },
    { name: 'AI Referrals', icon: Sparkles },
    { name: 'Subscription & Billing', icon: CreditCard },
    { name: 'Analytics', icon: PieChart },
    // Admin tab is only inserted for users with a /roles_admin/{uid} doc so
    // regular vendors never see it.
    ...(isAdmin ? [{ name: 'Admin', icon: ShieldCheck }] : []),
  ];

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-56 md:pt-[120px]">
          <Card className="max-w-md w-full bg-card rounded-[24px] md:rounded-[32px] border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <CardHeader className="text-center space-y-2 pb-6 md:pb-8 pt-8 md:pt-10">
              <CardTitle className="font-headline text-[28px] md:text-[32px] leading-tight text-foreground">Vendor Portal</CardTitle>
              <CardDescription className="text-muted-foreground italic text-[14px] md:text-[15px]">Sign in to manage your luxury listing and track referrals.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 md:px-10 pb-10 md:pb-12 space-y-6 md:space-y-8">
              <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] tracking-widest font-bold text-muted-foreground">Email Address</Label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-border bg-background" 
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] tracking-widest font-bold text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-border bg-background pr-12" 
                      placeholder="Password"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="rounded border-border data-[state=checked]:bg-primary" />
                    <Label htmlFor="remember" className="text-[12px] md:text-[13px] text-muted-foreground font-medium cursor-pointer">Remember me</Label>
                  </div>
                  <button type="button" className="text-[11px] md:text-[12px] font-bold text-primary hover:underline underline-offset-4">Forgot Password?</button>
                </div>

                <Button type="submit" className="w-full h-12 md:h-14 button-rose text-[14px] md:text-[15px] font-bold tracking-widest">
                  SIGN IN
                </Button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
                <div className="relative flex justify-center text-[10px] md:text-[11px] uppercase tracking-widest"><span className="bg-card px-4 text-muted-foreground font-bold">OR</span></div>
              </div>

              <div className="text-center space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSimulating(true)}
                  className="w-full h-12 md:h-14 rounded-xl border-border text-foreground hover:bg-muted font-bold tracking-widest text-[12px] md:text-[13px] uppercase"
                >
                  Demo Access
                </Button>
                <p className="text-[13px] md:text-[14px] text-muted-foreground font-medium">
                  New here? <Link href="/membership" className="text-primary font-bold hover:underline decoration-primary decoration-2 underline-offset-4">Apply as a Vendor</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      <main className="flex-1 py-8 md:py-16 px-6 pt-56 md:pt-[120px]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="bg-card p-4 md:p-6 rounded-[24px] border border-border shadow-soft space-y-2">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={cn(
                          "flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl text-[11px] md:text-[13px] font-bold uppercase tracking-widest transition-all duration-300",
                          activeTab === item.name 
                            ? "bg-primary text-white shadow-md golden-glow-premium" 
                            : "text-muted-foreground hover:bg-muted hover:text-primary"
                        )}
                      >
                        <item.icon className={cn("w-4 md:w-5 h-4 md:h-5", activeTab === item.name ? "text-white" : "text-primary")} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-border">
                    <Button 
                      onClick={handleLogout}
                      variant="ghost" 
                      className="w-full justify-start gap-4 px-4 py-3 h-auto text-red-500 hover:bg-red-50 rounded-xl font-bold uppercase tracking-widest text-[11px] md:text-[13px]"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-8 md:space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border text-center md:text-left">
                <div className="space-y-2">
                  <h1 className="font-headline text-[32px] md:text-[42px] leading-tight text-foreground">Command Center</h1>
                  <p className="text-[14px] md:text-[15px] text-muted-foreground italic font-medium">Evergold Photography — Johannesburg, GP</p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button className="h-12 px-8 button-rose text-[12px] md:text-[13px] font-bold tracking-widest uppercase">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Listing
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Profile Views", value: "1,240", change: "+14%", icon: Eye, color: "text-blue-600" },
                  { label: "Direct Leads", value: "12", change: "+8%", icon: Mail, color: "text-emerald-600" },
                  { label: "AI Referrals", value: "24", change: "+12%", icon: Sparkles, color: "text-primary" }
                ].map((stat, i) => (
                  <Card key={i} className="bg-card border-border shadow-soft hover:shadow-md transition-all rounded-[24px] overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-3 rounded-2xl bg-muted", stat.color)}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</h3>
                      <p className="text-[28px] md:text-[32px] font-headline font-bold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Overview Tab Content */}
              {activeTab === 'Overview' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-card p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-border shadow-soft space-y-6 md:space-y-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                          <Sparkles className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                        <div>
                          <h2 className="font-headline text-[22px] md:text-[26px]">Recent AI Matches</h2>
                          <p className="text-[13px] md:text-[14px] text-muted-foreground font-medium italic">Intelligent recommendations for your brand.</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1.5 uppercase tracking-widest font-bold">Featured</Badge>
                    </div>

                    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                      <table className="w-full text-left border-separate border-spacing-y-3 min-w-[500px]">
                        <thead>
                          <tr className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                            <th className="px-6 pb-2">Date</th>
                            <th className="px-6 pb-2">Vision</th>
                            <th className="px-6 pb-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: '24 May', vision: 'Luxury photographer with golden hour aesthetic', status: 'New' },
                            { date: '23 May', vision: 'Stellenbosch vineyard for 120 guests', status: 'Contacted' }
                          ].map((ref, i) => (
                            <tr key={i} className="bg-muted/30 hover:bg-muted/50 transition-all rounded-2xl">
                              <td className="px-6 py-4 md:py-5 rounded-l-2xl font-bold text-muted-foreground text-[12px] md:text-[13px]">{ref.date}</td>
                              <td className="px-6 py-4 md:py-5 italic text-[13px] md:text-[14px]">"{ref.vision}"</td>
                              <td className="px-6 py-4 md:py-5 rounded-r-2xl text-right">
                                <Button size="sm" className="h-8 md:h-9 px-4 md:px-6 button-rose text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription & Billing Tab */}
              {activeTab === 'Subscription & Billing' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* 1. Already paying — active member */}
                  {isMembershipActive ? (
                    <div className="bg-card p-8 rounded-[24px] md:rounded-[32px] border border-emerald-200 shadow-soft text-center space-y-5">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h2 className="font-headline text-[24px] md:text-[28px]">Membership Active</h2>
                      <p className="text-muted-foreground italic font-medium">
                        Your {vendorDoc?.membershipTier === 'featured' ? 'Featured' : 'Standard'} Vendor subscription is confirmed and billing monthly. Thank you for joining InFaith Journey.
                      </p>
                      <div className="pt-2">
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="rounded-full h-11 px-6 text-[12px] font-bold uppercase tracking-widest border-primary/20"
                        >
                          <a href="/dashboard/billing">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Manage Billing
                          </a>
                        </Button>
                        <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                          Update card · View invoices · Cancel subscription
                        </p>
                      </div>
                    </div>
                  ) : !user ? (
                    /* 2. Demo / not really signed in */
                    <div className="bg-card p-8 rounded-[24px] border border-border shadow-soft text-center space-y-3">
                      <CreditCard className="w-10 h-10 text-primary mx-auto" />
                      <h2 className="font-headline text-[22px]">Sign in to manage membership</h2>
                      <p className="text-muted-foreground italic font-medium">
                        You're in demo mode. Sign in with your vendor account to see your application and activate membership.
                      </p>
                    </div>
                  ) : !application ? (
                    /* 3. Signed in, but hasn't applied yet */
                    <div className="bg-card p-8 rounded-[24px] border border-border shadow-soft text-center space-y-4">
                      <Briefcase className="w-10 h-10 text-primary mx-auto" />
                      <h2 className="font-headline text-[22px]">No application yet</h2>
                      <p className="text-muted-foreground italic font-medium">
                        Submit your vendor application first. Once it's approved, you can activate your membership here.
                      </p>
                      <Button asChild className="button-rose h-12 px-8 text-[12px] font-bold tracking-widest uppercase">
                        <Link href="/membership/apply">Apply as a Vendor</Link>
                      </Button>
                    </div>
                  ) : appStatus === 'pending' ? (
                    /* 4. Application under review */
                    <div className="bg-card p-8 rounded-[24px] border border-amber-200 shadow-soft text-center space-y-3">
                      <Loader2 className="w-10 h-10 text-amber-500 mx-auto" />
                      <h2 className="font-headline text-[22px]">Application Under Review</h2>
                      <p className="text-muted-foreground italic font-medium">
                        Ricardo and the team are reviewing your application. You'll be able to activate your membership here as soon as it's approved.
                      </p>
                    </div>
                  ) : appStatus === 'rejected' ? (
                    /* 5. Rejected */
                    <div className="bg-card p-8 rounded-[24px] border border-rose-200 shadow-soft text-center space-y-3">
                      <h2 className="font-headline text-[22px]">Application Not Approved</h2>
                      <p className="text-muted-foreground italic font-medium">
                        Unfortunately your application wasn't approved at this time. Please contact the team for details.
                      </p>
                    </div>
                  ) : (
                    /* 6. Approved — show the single plan they applied for */
                    <>
                      <div id="activate-membership" className="space-y-2 scroll-mt-40">
                        <h2 className="font-headline text-[24px] md:text-[28px]">Activate Your Membership</h2>
                        <p className="text-muted-foreground italic font-medium text-[14px] md:text-[15px]">
                          Your application is approved. Activate your {approvedTier === 'featured' ? 'Featured' : 'Standard'} Vendor listing — billed monthly in ZAR.
                        </p>
                      </div>
                      <div className="max-w-md">
                        <Card className="bg-card border-border shadow-soft rounded-[24px]">
                          <CardContent className="p-8 space-y-4 text-center">
                            <h3 className="font-headline text-[20px] uppercase tracking-wide">
                              {approvedTier === 'featured' ? 'Featured Vendor' : 'Standard Vendor'}
                            </h3>
                            <p className="text-[32px] font-bold">
                              {approvedTier === 'featured' ? 'R1,199' : 'R499'}
                              <span className="text-[14px] font-medium opacity-60"> / month</span>
                            </p>
                            <Button
                              onClick={() => handleActivate(approvedTier)}
                              disabled={isPaying !== null}
                              className="w-full h-12 button-rose text-[12px] font-bold tracking-widest uppercase"
                            >
                              {isPaying ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>Activate Membership</>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* My Profile Tab — pulls everything from the vendor's latest application */}
              {activeTab === 'My Profile' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!user ? (
                    <Card className="rounded-[24px] border-border shadow-soft">
                      <CardContent className="p-8 text-center space-y-3">
                        <User className="w-10 h-10 text-primary mx-auto" />
                        <h3 className="font-headline text-[20px]">Sign in to view your profile</h3>
                        <p className="text-muted-foreground italic font-medium text-[13px]">
                          You're in demo mode. Sign in with your vendor account to see your business details.
                        </p>
                      </CardContent>
                    </Card>
                  ) : !application ? (
                    <Card className="rounded-[24px] border-border shadow-soft">
                      <CardContent className="p-8 text-center space-y-4">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                        <h3 className="font-headline text-[20px]">No profile yet</h3>
                        <p className="text-muted-foreground italic font-medium text-[13px]">
                          You haven't submitted a vendor application yet. Once you apply, your business details will appear here.
                        </p>
                        <Button asChild className="button-rose mt-2">
                          <a href="/membership/apply">Apply as a Vendor</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Profile header — hero card with business name + status */}
                      <Card className="rounded-[24px] md:rounded-[32px] border border-primary/10 shadow-soft overflow-hidden">
                        <CardContent className="p-6 md:p-10 space-y-6">
                          <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-headline text-3xl md:text-4xl shrink-0 mx-auto md:mx-0">
                              {(application.businessName || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-2 text-center md:text-left">
                              <h2 className="font-headline text-[28px] md:text-[36px] leading-tight">
                                {application.businessName || 'Unnamed Business'}
                              </h2>
                              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {application.category && (
                                  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                                    {application.category}
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className={
                                    isMembershipActive
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold uppercase tracking-widest'
                                      : appStatus === 'approved'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold uppercase tracking-widest'
                                        : appStatus === 'pending'
                                          ? 'bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold uppercase tracking-widest'
                                          : 'bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold uppercase tracking-widest'
                                  }
                                >
                                  {isMembershipActive
                                    ? 'Active Member'
                                    : appStatus === 'approved'
                                      ? 'Approved · Awaiting Activation'
                                      : appStatus === 'pending'
                                        ? 'Application Pending'
                                        : 'Application Rejected'}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">
                                  {approvedTier === 'featured' ? 'Featured · R1,199' : 'Standard · R499'}
                                </Badge>
                              </div>
                              {application.location && (
                                <p className="text-[14px] text-muted-foreground italic font-medium pt-1">
                                  <MapPin className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                                  {application.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Two-column grid: contact info + business info */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Owner & Contact */}
                        <Card className="rounded-[24px] border border-primary/10 shadow-soft">
                          <CardContent className="p-6 md:p-8 space-y-5">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-primary" />
                              <h3 className="font-headline text-[20px]">Owner & Contact</h3>
                            </div>
                            <ul className="space-y-4 text-[14px]">
                              <ProfileRow icon={User} label="Owner" value={application.ownerName} />
                              <ProfileRow icon={Mail} label="Email" value={application.email} />
                              <ProfileRow icon={Phone} label="Phone" value={application.phoneNumber} />
                              <ProfileRow icon={Globe} label="Website" value={application.websiteUrl} isLink />
                              <ProfileRow
                                icon={Instagram}
                                label="Instagram"
                                value={application.instagramHandle ? `@${application.instagramHandle.replace(/^@/, '')}` : ''}
                              />
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Business Details */}
                        <Card className="rounded-[24px] border border-primary/10 shadow-soft">
                          <CardContent className="p-6 md:p-8 space-y-5">
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-primary" />
                              <h3 className="font-headline text-[20px]">Business Details</h3>
                            </div>
                            <ul className="space-y-4 text-[14px]">
                              <ProfileRow icon={Tag} label="Category" value={application.category} />
                              <ProfileRow icon={MapPin} label="Location" value={application.location} />
                              <ProfileRow icon={Calendar} label="Years in Business" value={application.yearsInBusiness} />
                              <ProfileRow icon={Banknote} label="Pricing Range" value={application.pricingRange} />
                              <ProfileRow icon={Star} label="Plan" value={approvedTier === 'featured' ? 'Featured Vendor' : 'Standard Vendor'} />
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Description */}
                      {application.description && (
                        <Card className="rounded-[24px] border border-primary/10 shadow-soft">
                          <CardContent className="p-6 md:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <h3 className="font-headline text-[20px]">About</h3>
                            </div>
                            <p className="text-[14px] leading-relaxed text-foreground/80 whitespace-pre-line">
                              {application.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Services Offered */}
                      {application.servicesOffered && (
                        <Card className="rounded-[24px] border border-primary/10 shadow-soft">
                          <CardContent className="p-6 md:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                              <Sparkles className="w-5 h-5 text-primary" />
                              <h3 className="font-headline text-[20px]">Services Offered</h3>
                            </div>
                            <p className="text-[14px] leading-relaxed text-foreground/80 whitespace-pre-line">
                              {application.servicesOffered}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Portfolio / Photos */}
                      {(application.logoUrl || application.coverImageUrl || (application.portfolioImageUrls?.length ?? 0) > 0) && (
                        <Card className="rounded-[24px] border border-primary/10 shadow-soft">
                          <CardContent className="p-6 md:p-8 space-y-5">
                            <div className="flex items-center gap-3">
                              <ImageIcon className="w-5 h-5 text-primary" />
                              <h3 className="font-headline text-[20px]">Photos</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {application.logoUrl && (
                                <div className="space-y-2">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Logo</p>
                                  <img src={application.logoUrl} alt="Logo" className="w-full h-32 object-cover rounded-xl border border-border" />
                                </div>
                              )}
                              {application.coverImageUrl && (
                                <div className="space-y-2">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cover</p>
                                  <img src={application.coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-xl border border-border" />
                                </div>
                              )}
                              {(application.portfolioImageUrls ?? []).map((url: string, i: number) => (
                                <div key={i} className="space-y-2">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Portfolio {i + 1}</p>
                                  <img src={url} alt={`Portfolio ${i + 1}`} className="w-full h-32 object-cover rounded-xl border border-border" />
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Edit request UI — vendors propose changes; admin reviews. */}
                      {myPendingEdit ? (
                        <Card className="rounded-[24px] border border-amber-200 bg-amber-50/40">
                          <CardContent className="p-5 md:p-6 flex items-start gap-3">
                            <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <h4 className="text-[14px] font-bold mb-1">Edit request pending review</h4>
                              <p className="text-[12px] text-muted-foreground italic">
                                You've submitted changes to your profile. An admin will review them shortly — we'll
                                update your profile once approved.
                              </p>
                              {myPendingEdit.changes && (
                                <ul className="mt-3 space-y-1 text-[12px]">
                                  {Object.keys(myPendingEdit.changes).map((k) => {
                                    const label = editableFields.find((f) => f.key === k)?.label ?? k;
                                    return <li key={k} className="text-muted-foreground">· {label}</li>;
                                  })}
                                </ul>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ) : isEditing ? (
                        <Card className="rounded-[24px] border border-primary/10 shadow-soft">
                          <CardContent className="p-6 md:p-8 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Edit3 className="w-5 h-5 text-primary" />
                                <h3 className="font-headline text-[20px]">Request Profile Edit</h3>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                                disabled={isSavingEdit}
                                className="text-[11px] uppercase tracking-widest"
                              >
                                Cancel
                              </Button>
                            </div>
                            <p className="text-[13px] text-muted-foreground italic">
                              Update what you'd like to change. Submit when ready — an admin reviews edits before they
                              take effect. Image edits aren't supported in this form yet; contact the team for those.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {editableFields.map((f) => (
                                <div key={f.key} className={f.multiline ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
                                  <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                    {f.label}
                                  </Label>
                                  {f.multiline ? (
                                    <Textarea
                                      value={editForm[f.key] ?? ''}
                                      onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                      className="min-h-[100px] rounded-xl"
                                      placeholder={`Update ${f.label.toLowerCase()}…`}
                                    />
                                  ) : (
                                    <Input
                                      value={editForm[f.key] ?? ''}
                                      onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                      className="rounded-xl"
                                      placeholder={`Update ${f.label.toLowerCase()}…`}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={isSavingEdit}
                                className="rounded-full h-10 px-5 text-[11px] uppercase tracking-widest"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={submitEditRequest}
                                disabled={isSavingEdit}
                                className="rounded-full h-10 px-5 button-rose text-[11px] uppercase tracking-widest"
                              >
                                {isSavingEdit ? (
                                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                                ) : (
                                  'Submit for Review'
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="rounded-[24px] border border-dashed border-primary/20 bg-primary/5">
                          <CardContent className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <Edit3 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <p className="text-[13px] text-muted-foreground italic flex-1">
                              Need to update your profile? Submit a request and an admin will review it.
                            </p>
                            <Button
                              onClick={openEditForm}
                              className="button-rose rounded-full h-10 px-5 text-[11px] uppercase tracking-widest"
                            >
                              <Edit3 className="w-4 h-4 mr-2" /> Request Edit
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Admin Tab — only rendered if the signed-in user has roles_admin */}
              {activeTab === 'Admin' && isAdmin && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Pending Applications */}
                  <Card className="rounded-[24px] md:rounded-[32px] border border-primary/10 shadow-soft">
                    <CardContent className="p-6 md:p-8 space-y-6">
                      <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                        <div className="flex items-center gap-3">
                          <ClipboardCheck className="w-5 h-5 text-primary" />
                          <h2 className="font-headline text-[22px] md:text-[26px]">Pending Vendor Applications</h2>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                          {adminPendingApps?.length ?? 0}
                        </Badge>
                      </div>
                      {!adminPendingApps ? (
                        <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                      ) : adminPendingApps.length === 0 ? (
                        <p className="py-6 text-center text-muted-foreground italic font-medium">
                          No applications waiting. You're all caught up.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {[...adminPendingApps]
                            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                            .map((app) => (
                              <div key={app.id} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl border border-primary/10 text-center md:text-left">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline text-lg shrink-0">
                                  {(app.businessName || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-1 min-w-0">
                                  <h4 className="font-bold text-[15px]">{app.businessName || 'Unnamed Business'}</h4>
                                  <p className="text-[12px] text-muted-foreground italic truncate">
                                    {app.ownerName ? `${app.ownerName} · ` : ''}{app.email || ''}{app.location ? ` · ${app.location}` : ''}
                                  </p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={reviewingId === app.id}
                                    onClick={() => decideApplication(app.id, 'rejected')}
                                    className="flex-1 md:flex-none h-9 rounded-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 text-[10px]"
                                  >
                                    {reviewingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1.5" /> Reject</>}
                                  </Button>
                                  <Button
                                    size="sm"
                                    disabled={reviewingId === app.id}
                                    onClick={() => decideApplication(app.id, 'approved')}
                                    className="flex-1 md:flex-none h-9 rounded-full button-rose text-[10px]"
                                  >
                                    {reviewingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1.5" /> Approve</>}
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pending Edit Requests */}
                  <Card className="rounded-[24px] md:rounded-[32px] border border-primary/10 shadow-soft">
                    <CardContent className="p-6 md:p-8 space-y-6">
                      <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                        <div className="flex items-center gap-3">
                          <Edit3 className="w-5 h-5 text-primary" />
                          <h2 className="font-headline text-[22px] md:text-[26px]">Pending Profile Edits</h2>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                          {adminPendingEdits?.length ?? 0}
                        </Badge>
                      </div>
                      {!adminPendingEdits ? (
                        <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                      ) : adminPendingEdits.length === 0 ? (
                        <p className="py-6 text-center text-muted-foreground italic font-medium">
                          No edit requests waiting.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {[...adminPendingEdits]
                            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                            .map((req) => (
                              <div key={req.id} className="p-4 md:p-5 rounded-2xl border border-primary/10 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[14px] mb-1">Requested by vendor {req.vendorUid?.slice(0, 8)}…</h4>
                                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                                      Application ID: {req.applicationId?.slice(0, 12)}…
                                    </p>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={reviewingId === req.id}
                                      onClick={() => decideEditRequest(req, 'rejected')}
                                      className="h-9 rounded-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 text-[10px]"
                                    >
                                      {reviewingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1.5" /> Decline</>}
                                    </Button>
                                    <Button
                                      size="sm"
                                      disabled={reviewingId === req.id}
                                      onClick={() => decideEditRequest(req, 'approved')}
                                      className="h-9 rounded-full button-rose text-[10px]"
                                    >
                                      {reviewingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1.5" /> Approve</>}
                                    </Button>
                                  </div>
                                </div>
                                {req.changes && Object.keys(req.changes).length > 0 && (
                                  <div className="pt-2 border-t border-primary/10 space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Proposed changes</p>
                                    <ul className="space-y-1.5">
                                      {Object.entries(req.changes).map(([k, v]) => {
                                        const label = editableFields.find((f) => f.key === k)?.label ?? k;
                                        return (
                                          <li key={k} className="text-[12px]">
                                            <span className="font-bold">{label}:</span>{' '}
                                            <span className="text-foreground/80 italic">"{String(v)}"</span>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// A single labelled row inside the profile cards.
// Renders an em-dash placeholder when the value is missing so the layout stays consistent.
function ProfileRow({
  icon: Icon,
  label,
  value,
  isLink = false,
}: {
  icon: any;
  label: string;
  value: string | undefined | null;
  isLink?: boolean;
}) {
  const hasValue = !!value;
  return (
    <li className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">{label}</p>
        {hasValue ? (
          isLink ? (
            <a
              href={value!.startsWith('http') ? value! : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium text-primary hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <p className="text-[14px] font-medium break-words">{value}</p>
          )
        ) : (
          <p className="text-[14px] text-muted-foreground italic">—</p>
        )}
      </div>
    </li>
  );
}
