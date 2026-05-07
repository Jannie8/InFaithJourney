"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, ClipboardCheck, TrendingUp, AlertCircle, 
  ArrowRight, CheckCircle, XCircle, Filter, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && (!user || user.email !== 'admin@infaithjourney.com')) {
      // router.push('/dashboard'); 
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  const stats = [
    { label: "Pending Apps", value: "8", icon: ClipboardCheck, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Active Vendors", value: "142", icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "Leads (30d)", value: "324", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Review Required", value: "3", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-6 pt-44 md:pt-44 pb-24 w-full">
        <header className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-4 border-b border-primary/10 pb-8 text-center md:text-left">
          <div className="space-y-2">
            <h1 className="font-headline text-[32px] md:text-[48px] leading-tight">Admin Headquarters</h1>
            <p className="text-[14px] md:text-[16px] text-muted-foreground italic font-medium">Welcome back, Ricardo. You have 8 applications waiting for your expert eye.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Button variant="outline" className="rounded-full px-5 md:px-6 h-10 md:h-12 border-primary/20 text-primary uppercase font-bold text-[10px] md:text-[12px] tracking-widest">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <Button asChild className="h-10 md:h-12 px-6 md:px-8 button-rose text-[10px] md:text-[12px]">
              <Link href="/admin/review">REVIEW QUEUE</Link>
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-soft rounded-[24px] md:rounded-[28px] overflow-hidden group hover:shadow-glow transition-all golden-glow-hover">
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("w-6 md:w-7 h-6 md:h-7", stat.color)} />
                  </div>
                  <Badge variant="outline" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Live</Badge>
                </div>
                <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-[28px] md:text-[36px] font-headline font-bold">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Queue Summary */}
        <section className="rounded-[24px] md:rounded-[40px] border border-primary/10 p-6 md:p-10 shadow-soft">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-10 pb-4 md:pb-6 border-b border-primary/10 gap-4">
            <h2 className="font-headline text-[24px] md:text-[32px]">Pending Applications</h2>
            <Link href="/admin/review" className="text-primary text-[11px] md:text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
              View All Queue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Aurora Estate', category: 'Venues', date: '2 hours ago', status: 'Pending AI Summary' },
              { name: 'Velvet Lens Studio', category: 'Photography', date: '5 hours ago', status: 'Ready to Approve' },
              { name: 'Bloom & Petal', category: 'Florist', date: '1 day ago', status: 'Ready to Approve' },
            ].map((app, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[20px] md:rounded-[24px] hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 golden-glow-hover text-center md:text-left">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline text-xl md:text-2xl shrink-0">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                    <h4 className="font-bold text-[16px] md:text-[18px]">{app.name}</h4>
                    <Badge variant="secondary" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                      {app.category}
                    </Badge>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-muted-foreground italic font-medium">Submitted {app.date} • {app.status}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline" size="sm" className="flex-1 md:flex-none h-9 md:h-10 px-4 md:px-6 rounded-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 text-[10px]">
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button size="sm" className="flex-1 md:flex-none h-9 md:h-10 px-4 md:px-6 button-rose text-[10px] shadow-sm">
                    <CheckCircle className="w-4 h-4 mr-2" /> Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
