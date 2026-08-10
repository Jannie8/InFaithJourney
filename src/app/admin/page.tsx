"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, ClipboardCheck, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Loader2, ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  useUser, useFirestore, useMemoFirebase, useCollection, useDoc,
} from '@/firebase';
import {
  collection, query, where, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  // Admin check: a document must exist at roles_admin/{uid}.
  const adminRoleRef = useMemoFirebase(
    () => (user && db ? doc(db, 'roles_admin', user.uid) : null),
    [user, db]
  );
  const { data: adminRole, isLoading: isRoleLoading } = useDoc<any>(adminRoleRef);
  const isAdmin = !!adminRole;

  // Pending applications queue.
  const pendingQuery = useMemoFirebase(
    () =>
      isAdmin && db
        ? query(
            collection(db, 'vendorApplications'),
            where('applicationStatus', '==', 'pending')
          )
        : null,
    [isAdmin, db]
  );
  const { data: pendingRaw, isLoading: isQueueLoading } = useCollection<any>(pendingQuery);
  const pending = pendingRaw
    ? [...pendingRaw].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    : null;

  const decide = async (id: string, decision: 'approved' | 'rejected') => {
    if (!db) return;
    try {
      setBusyId(id);
      await updateDoc(doc(db, 'vendorApplications', id), {
        applicationStatus: decision,
        reviewedAt: serverTimestamp(),
        reviewedBy: user?.uid ?? null,
      });
      toast({
        title: decision === 'approved' ? 'Application Approved' : 'Application Rejected',
        description:
          decision === 'approved'
            ? 'The vendor can now activate their membership.'
            : 'The applicant has been marked as not approved.',
      });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Action Failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Block non-admins.
  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-44 text-center">
          <div className="max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h1 className="font-headline text-[28px]">Admin Access Only</h1>
            <p className="text-muted-foreground italic font-medium">
              This area is restricted to InFaith Journey administrators.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingCount = pending?.length ?? 0;
  const stats = [
    { label: "Pending Apps", value: String(pendingCount), icon: ClipboardCheck, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Active Vendors", value: "—", icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "Leads (30d)", value: "—", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Review Required", value: String(pendingCount), icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-6 pt-44 md:pt-44 pb-24 w-full">
        <header className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-4 border-b border-primary/10 pb-8 text-center md:text-left">
          <div className="space-y-2">
            <h1 className="font-headline text-[32px] md:text-[48px] leading-tight">Admin Headquarters</h1>
            <p className="text-[14px] md:text-[16px] text-muted-foreground italic font-medium">
              Welcome back. You have {pendingCount} application{pendingCount === 1 ? '' : 's'} waiting for review.
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-soft rounded-[24px] md:rounded-[28px] overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("w-6 md:w-7 h-6 md:h-7", stat.color)} />
                  </div>
                </div>
                <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-[28px] md:text-[36px] font-headline font-bold">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Queue */}
        <section className="rounded-[24px] md:rounded-[40px] border border-primary/10 p-6 md:p-10 shadow-soft">
          <div className="flex items-center justify-between mb-8 md:mb-10 pb-4 md:pb-6 border-b border-primary/10">
            <h2 className="font-headline text-[24px] md:text-[32px]">Pending Applications</h2>
          </div>

          {isQueueLoading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : pendingCount === 0 ? (
            <p className="py-12 text-center text-muted-foreground italic font-medium">
              No applications waiting. You're all caught up.
            </p>
          ) : (
            <div className="space-y-4">
              {pending!.map((app) => (
                <div key={app.id} className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-primary/10 text-center md:text-left">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline text-xl md:text-2xl shrink-0">
                    {(app.businessName || '?').charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                      <h4 className="font-bold text-[16px] md:text-[18px]">{app.businessName || 'Unnamed Business'}</h4>
                      {app.category && (
                        <Badge variant="secondary" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                          {app.category}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[9px] uppercase tracking-widest">
                        {app.selectedPlan === 'featured' ? 'Featured · R1,199' : 'Standard · R499'}
                      </Badge>
                    </div>
                    <p className="text-[13px] md:text-[14px] text-muted-foreground italic font-medium">
                      {app.ownerName ? `${app.ownerName} · ` : ''}{app.email || ''}{app.location ? ` · ${app.location}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      variant="outline" size="sm" disabled={busyId === app.id}
                      onClick={() => decide(app.id, 'rejected')}
                      className="flex-1 md:flex-none h-9 md:h-10 px-4 md:px-6 rounded-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 text-[10px]"
                    >
                      {busyId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-2" /> Reject</>}
                    </Button>
                    <Button
                      size="sm" disabled={busyId === app.id}
                      onClick={() => decide(app.id, 'approved')}
                      className="flex-1 md:flex-none h-9 md:h-10 px-4 md:px-6 button-rose text-[10px] shadow-sm"
                    >
                      {busyId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Approve</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
