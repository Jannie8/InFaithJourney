"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, ClipboardCheck, TrendingUp, AlertCircle, 
  ArrowRight, CheckCircle, XCircle, Filter 
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

  if (isUserLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const stats = [
    { label: "Pending Apps", value: "8", icon: ClipboardCheck, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Active Vendors", value: "142", icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "Leads (30d)", value: "324", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Review Required", value: "3", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-primary/10 pb-8">
          <div className="space-y-2">
            <h1 className="font-headline text-[48px] leading-tight">Admin Headquarters</h1>
            <p className="text-muted-foreground italic font-medium">Welcome back, Ricardo. You have 8 applications waiting for your expert eye.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-full px-6 h-12 border-primary/20 text-primary uppercase font-bold text-[12px] tracking-widest">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <Button asChild className="h-12 px-8 button-rose text-[12px]">
              <Link href="/admin/review">REVIEW QUEUE</Link>
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-soft rounded-[28px] overflow-hidden group hover:shadow-glow transition-all">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-4 rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("w-7 h-7", stat.color)} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">Live</Badge>
                </div>
                <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-[36px] font-headline font-bold">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Queue Summary */}
        <section className="rounded-[40px] border border-primary/10 p-10 shadow-soft">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-primary/10">
            <h2 className="font-headline text-[32px]">Pending Applications</h2>
            <Link href="/admin/review" className="text-primary text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
              View All Queue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Aurora Estate', category: 'Venues', date: '2 hours ago', status: 'Pending AI Summary' },
              { name: 'Velvet Lens Studio', category: 'Photography', date: '5 hours ago', status: 'Ready to Approve' },
              { name: 'Bloom & Petal', category: 'Florist', date: '1 day ago', status: 'Ready to Approve' },
            ].map((app, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[24px] hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline text-2xl">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-[18px]">{app.name}</h4>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                      {app.category}
                    </Badge>
                  </div>
                  <p className="text-[14px] text-muted-foreground italic font-medium">Submitted {app.date} • {app.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-10 px-6 rounded-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600">
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button size="sm" className="h-10 px-6 button-rose text-[11px] shadow-sm">
                    <CheckCircle className="w-4 h-4 mr-2" /> Review Details
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
