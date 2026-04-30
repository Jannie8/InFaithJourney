
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, Briefcase, Mail, Star, Settings, LogOut, 
  BarChart3, CreditCard, Edit3, MessageSquare, Sparkles, TrendingUp,
  Clock, CheckCircle2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const isLoggedIn = user || isSimulating;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      signOut(auth);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 section-padding">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-10 md:p-12 rounded-[32px] border border-primary/20 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h1 className="font-headline text-[36px] md:text-[42px] leading-tight">Vendor Dashboard</h1>
              <p className="text-muted-foreground italic text-[15px]">Log in to manage your listing and inquiries.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="uppercase text-[11px] tracking-widest font-bold text-primary">Email Address</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-primary/10 bg-background/50" 
                  placeholder="name@business.com" 
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="uppercase text-[11px] tracking-widest font-bold text-primary">Password</Label>
                  <button type="button" className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors">FORGOT PASSWORD?</button>
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-primary/10 bg-background/50" 
                  placeholder="••••••••" 
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="rounded border-primary/20" />
                <Label htmlFor="remember" className="text-[13px] text-muted-foreground font-medium cursor-pointer">Remember me for 30 days</Label>
              </div>
              <Button type="submit" className="w-full h-14 button-rose text-[15px] font-bold tracking-widest">
                LOGIN TO DASHBOARD
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/10"></span></div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest"><span className="bg-white px-4 text-muted-foreground font-bold">OR</span></div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setIsSimulating(true)}
              className="w-full h-14 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold tracking-widest text-[13px]"
            >
              SIMULATE VENDOR LOGIN
            </Button>

            <p className="text-[14px] text-center text-muted-foreground font-medium">
              Don't have an account? <Link href="/plans" className="text-primary font-bold hover:underline decoration-secondary decoration-2 underline-offset-4">Apply as a Vendor</Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      <main className="flex-1 section-padding px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="font-headline text-[42px] md:text-[54px] leading-tight">Welcome back</h1>
                <div className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 border border-secondary/20 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-secondary" /> Featured Vendor
                </div>
              </div>
              <p className="text-[18px] text-muted-foreground italic font-medium">Evergold Photography Studio — Johannesburg, GP</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-full border-primary/20 text-primary h-12 px-6 font-bold text-[13px] uppercase tracking-widest hover:bg-primary/5">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="rounded-full border-red-200 text-red-500 hover:bg-red-50 h-12 px-6 font-bold text-[13px] uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            
            {/* Sidebar Columns */}
            <aside className="lg:col-span-1 space-y-8">
              <Card className="bg-white border-primary/10 shadow-sm rounded-[24px] overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                  <CardTitle className="text-[12px] uppercase tracking-[0.2em] text-primary font-bold">Subscription Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[20px] font-headline font-bold">Featured Plan</p>
                    <p className="text-[13px] text-muted-foreground font-medium">Renews: Dec 15, 2025</p>
                  </div>
                  <div className="pt-4 border-t border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Listed & Searchable
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-secondary uppercase tracking-wider bg-secondary/5 p-2 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Priority Placement Active
                    </div>
                    <Button variant="link" className="p-0 text-primary text-[13px] font-bold uppercase tracking-widest h-auto">View Billing History</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/10 shadow-sm rounded-[24px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[12px] uppercase tracking-[0.2em] text-primary font-bold">Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-[14px] font-medium">Profile Views</span>
                    </div>
                    <span className="font-headline text-[20px]">1,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="text-[14px] font-medium">Inquiries</span>
                    </div>
                    <span className="font-headline text-[20px]">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <span className="text-[14px] font-medium">AI Referrals</span>
                    </div>
                    <span className="font-headline text-[20px] text-secondary">8</span>
                  </div>

                  {/* Micro Chart Placeholder */}
                  <div className="pt-4 flex items-end gap-1.5 h-16">
                    {[35, 65, 45, 85, 55, 95, 75].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-primary/20 rounded-t-sm hover:bg-secondary/40 transition-colors" 
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-center text-muted-foreground font-bold mt-2">AI Referral Growth (Last 7 Days)</p>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content Areas */}
            <div className="lg:col-span-3 space-y-10">
              
              {/* Primary Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Edit Listing", icon: Edit3, desc: "Update your portfolio", color: "primary" },
                  { title: "Direct Inquiries", icon: Mail, desc: "12 new messages", color: "primary" },
                  { title: "Analytics", icon: BarChart3, desc: "View detailed traffic", color: "secondary" }
                ].map((item, i) => (
                  <Card key={i} className="bg-white border-primary/10 shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-[24px] overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                      <div className={`w-14 h-14 rounded-full bg-${item.color}/5 flex items-center justify-center text-${item.color} group-hover:bg-${item.color} group-hover:text-white transition-all duration-500`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-headline text-[22px]">{item.title}</h3>
                        <p className="text-muted-foreground text-[13px] font-medium">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Referrals Section */}
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-secondary/20 shadow-md space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Sparkles className="w-32 h-32 text-secondary" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-primary/10 pb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-headline text-[28px]">AI Concierge Referrals</h2>
                      <p className="text-[13px] text-muted-foreground font-medium">Smart matches generated by the AI Wedding Assistant</p>
                    </div>
                  </div>
                  <div className="bg-secondary/5 px-6 py-3 rounded-2xl border border-secondary/10">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-secondary mb-1">AI Referrals This Month</p>
                    <p className="text-[28px] font-headline font-bold text-foreground">8 Matches</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-separate border-spacing-y-4">
                     <thead>
                       <tr className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                         <th className="px-4 pb-2">Date</th>
                         <th className="px-4 pb-2">User Vision / Request</th>
                         <th className="px-4 pb-2">Recommended As</th>
                         <th className="px-4 pb-2">Status</th>
                         <th className="px-4 pb-2 text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="space-y-4">
                       {[
                         { date: '24 May 2026', vision: 'Stellenbosch vineyard under R120k for 120 guests', type: 'Primary Match', status: 'Quoted', icon: CheckCircle2, color: 'text-green-500' },
                         { date: '23 May 2026', vision: 'Romantic garden wedding style near Franschhoek', type: 'Featured Referral', status: 'New', icon: Clock, color: 'text-secondary' },
                         { date: '22 May 2026', vision: 'Luxury photographer with golden hour aesthetic', type: 'Direct Recommendation', status: 'Contacted', icon: Mail, color: 'text-primary' },
                         { date: '21 May 2026', vision: 'Elegant forest venue with twinkling lights', type: 'Style Match', status: 'New', icon: Clock, color: 'text-secondary' }
                       ].map((referral, i) => (
                         <tr key={i} className="group bg-primary/5 hover:bg-white transition-all border border-transparent hover:border-primary/10 rounded-2xl">
                           <td className="px-4 py-6 rounded-l-2xl">
                             <span className="text-[14px] font-bold text-muted-foreground">{referral.date}</span>
                           </td>
                           <td className="px-4 py-6 max-w-[280px]">
                             <p className="text-[14.5px] font-medium text-foreground leading-relaxed italic">"{referral.vision}"</p>
                           </td>
                           <td className="px-4 py-6">
                             <span className="text-[12px] font-bold uppercase tracking-wider text-primary/70">{referral.type}</span>
                           </td>
                           <td className="px-4 py-6">
                             <div className={`flex items-center gap-2 text-[13px] font-bold ${referral.color}`}>
                               <referral.icon className="w-4 h-4" />
                               {referral.status}
                             </div>
                           </td>
                           <td className="px-4 py-6 rounded-r-2xl text-right">
                             <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary/10 h-10 px-6 font-bold text-[11px] uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                               View Inquiry <ArrowRight className="w-3.5 h-3.5 ml-2" />
                             </Button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>

              {/* Recent Activity (Traditional) */}
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-primary/10 shadow-sm space-y-8">
                <div className="flex justify-between items-center border-b border-primary/10 pb-6">
                  <h2 className="font-headline text-[28px]">Direct Leads & Reviews</h2>
                  <Button variant="link" className="text-primary font-bold uppercase tracking-widest text-[12px]">View All Direct Leads</Button>
                </div>
                
                <div className="space-y-6">
                  {[
                    { type: 'inquiry', name: 'Sarah J. & Michael B.', time: '2 hours ago', detail: 'Wedding Date: Dec 12, 2025 • Cape Town', icon: Mail },
                    { type: 'review', name: 'Leigh-Anne V.', time: '1 day ago', detail: '★★★★★ "The AI recommended them and we are so glad!"', icon: Star }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 p-6 rounded-2xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${
                        item.type === 'ai' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <p className="font-bold text-[17px] group-hover:text-primary transition-colors">{item.name}</p>
                          <span className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-widest">{item.time}</span>
                        </div>
                        <p className="text-[14.5px] text-muted-foreground leading-relaxed italic">{item.detail}</p>
                        {item.type === 'inquiry' && (
                          <div className="pt-3 flex gap-3">
                            <Button className="h-9 px-6 button-rose text-[11px] font-bold tracking-widest uppercase">Reply Now</Button>
                            <Button variant="outline" className="h-9 px-6 rounded-full border-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase hover:bg-primary/5">Archive</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Promo (Only for Free/Standard) */}
              <div className="p-10 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-[32px] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:scale-110"></div>
                <div className="relative z-10 space-y-3 text-center md:text-left">
                  <h3 className="font-headline text-[32px] leading-tight">Dominate AI Recommendations</h3>
                  <p className="text-muted-foreground font-medium max-w-md">Featured vendors are 5x more likely to be suggested by the AI Concierge. Get priority placement in the most popular planning tool.</p>
                </div>
                <Button className="relative z-10 h-16 px-12 button-rose text-[15px] font-bold tracking-widest shadow-xl">
                  UPGRADE FOR PRIORITY
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
