
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, Briefcase, Mail, Star, Settings, LogOut, 
  BarChart3, CreditCard, Edit3, MessageSquare, Sparkles, TrendingUp,
  Clock, CheckCircle2, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const isLoggedIn = user || isSimulating;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed", error);
      // For the prototype demo, we'll allow simulation if real auth fails or is empty
      if (!email || !password) {
        setIsSimulating(true);
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
          <Card className="max-w-md w-full bg-white/90 backdrop-blur-md p-2 rounded-[32px] border border-primary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <CardHeader className="text-center space-y-2 pb-8 pt-10">
              <CardTitle className="font-headline text-[36px] md:text-[42px] leading-tight text-foreground">Vendor Dashboard</CardTitle>
              <CardDescription className="text-muted-foreground italic text-[15px]">Log in to manage your listing, view inquiries, and track AI referrals</CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-12 space-y-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] tracking-widest font-bold text-primary">Email Address</Label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-primary/10 bg-background/50 focus:ring-primary/20" 
                    placeholder="name@business.com" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] tracking-widest font-bold text-primary">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-primary/10 bg-background/50 focus:ring-primary/20 pr-12" 
                      placeholder="••••••••" 
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
                    <Checkbox id="remember" className="rounded border-primary/20 data-[state=checked]:bg-primary" />
                    <Label htmlFor="remember" className="text-[13px] text-muted-foreground font-medium cursor-pointer">Remember me</Label>
                  </div>
                  <button type="button" className="text-[12px] font-bold text-primary hover:underline underline-offset-4">Forgot Password?</button>
                </div>

                <Button type="submit" className="w-full h-14 button-rose text-[15px] font-bold tracking-widest">
                  LOGIN TO DASHBOARD
                </Button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/10"></span></div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-widest"><span className="bg-white px-4 text-muted-foreground font-bold">OR</span></div>
              </div>

              <div className="text-center space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSimulating(true)}
                  className="w-full h-14 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold tracking-widest text-[13px] uppercase"
                >
                  Simulate Demo Login
                </Button>
                <p className="text-[14px] text-muted-foreground font-medium">
                  Don't have an account? <Link href="/plans" className="text-primary font-bold hover:underline decoration-secondary decoration-2 underline-offset-4">Apply as a Vendor</Link>
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
      
      <main className="flex-1 section-padding px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="font-headline text-[42px] md:text-[54px] leading-tight">Welcome back</h1>
                <div className="bg-secondary/10 text-secondary px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 border border-secondary/20 shadow-sm animate-pulse">
                  <Star className="w-4 h-4 fill-secondary" /> Featured Vendor
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
            
            {/* Sidebar Stats */}
            <aside className="lg:col-span-1 space-y-8">
              <Card className="bg-white border-primary/10 shadow-sm rounded-[24px] overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                  <CardTitle className="text-[12px] uppercase tracking-[0.2em] text-primary font-bold">Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[20px] font-headline font-bold">Featured Plan</p>
                    <p className="text-[13px] text-muted-foreground font-medium">R1,199 / Month</p>
                    <p className="text-[11px] text-muted-foreground/60 uppercase font-bold">Next Renewal: Dec 15, 2025</p>
                  </div>
                  <div className="pt-4 border-t border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Active & Listed
                    </div>
                    <div className="bg-secondary/5 p-3 rounded-xl border border-secondary/10 space-y-2">
                       <p className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        AI Priority Active
                       </p>
                       <p className="text-[12px] text-foreground/70 font-medium">Your business is 5x more likely to be recommended by the AI Concierge.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/10 shadow-sm rounded-[24px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[12px] uppercase tracking-[0.2em] text-primary font-bold">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-[14px] font-medium">Profile Views</span>
                      </div>
                      <span className="font-headline text-[22px]">1,240</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-[14px] font-medium">Direct Leads</span>
                      </div>
                      <span className="font-headline text-[22px]">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-secondary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[14px] font-bold">AI Referrals</span>
                      </div>
                      <span className="font-headline text-[22px] text-secondary">8</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-primary/10">
                    <div className="flex items-end gap-1.5 h-16">
                      {[35, 65, 45, 85, 55, 95, 75].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-primary/20 rounded-t-sm hover:bg-secondary/40 transition-colors" 
                          style={{ height: `${h}%` }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-center text-muted-foreground font-bold mt-3">AI Referral Growth (7 Days)</p>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-10">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Edit Listing", icon: Edit3, desc: "Portfolio & Services", color: "primary" },
                  { title: "Direct Leads", icon: Mail, desc: "12 New Messages", color: "primary" },
                  { title: "Analytics", icon: BarChart3, desc: "Traffic Deep Dive", color: "secondary" }
                ].map((item, i) => (
                  <Card key={i} className="bg-white border-primary/10 shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-[24px] overflow-hidden border-b-4 border-b-primary/5 hover:border-b-primary/40">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                      <div className={`w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm`}>
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

              {/* AI Referral Tracker */}
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-secondary/20 shadow-md space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Sparkles className="w-48 h-48 text-secondary" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-primary/10 pb-6 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="font-headline text-[28px] md:text-[32px]">AI Concierge Referrals</h2>
                      <p className="text-[14px] text-muted-foreground font-medium italic">Smart matches generated for high-intent couples</p>
                    </div>
                  </div>
                  <div className="bg-secondary/5 px-8 py-4 rounded-2xl border border-secondary/10 text-center md:text-left shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-secondary mb-1">AI Matches This Month</p>
                    <p className="text-[32px] font-headline font-bold text-foreground leading-none">8 Referrals</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto -mx-4 px-4 pb-2">
                   <table className="w-full text-left border-separate border-spacing-y-4">
                     <thead>
                       <tr className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                         <th className="px-6 pb-2">Date</th>
                         <th className="px-6 pb-2">Couple's Vision</th>
                         <th className="px-6 pb-2">Match Reasoning</th>
                         <th className="px-6 pb-2">Status</th>
                         <th className="px-6 pb-2 text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="space-y-4">
                       {[
                         { date: '24 May 2026', vision: 'Stellenbosch vineyard under R120k for 120 guests', reason: 'Budget & Location Fit', status: 'Quoted', icon: CheckCircle2, color: 'text-green-500' },
                         { date: '23 May 2026', vision: 'Romantic garden wedding style near Franschhoek', reason: 'Featured Priority Match', status: 'New', icon: Clock, color: 'text-secondary' },
                         { date: '22 May 2026', vision: 'Luxury photographer with golden hour aesthetic', reason: 'Style Match', status: 'Contacted', icon: Mail, color: 'text-primary' },
                         { date: '21 May 2026', vision: 'Elegant forest venue with twinkling lights', reason: 'Atmosphere Preference', status: 'New', icon: Clock, color: 'text-secondary' }
                       ].map((referral, i) => (
                         <tr key={i} className="group bg-primary/5 hover:bg-white transition-all border border-transparent hover:border-primary/10 rounded-2xl shadow-sm">
                           <td className="px-6 py-6 rounded-l-2xl">
                             <span className="text-[14px] font-bold text-muted-foreground">{referral.date}</span>
                           </td>
                           <td className="px-6 py-6 max-w-[280px]">
                             <p className="text-[15px] font-medium text-foreground italic leading-relaxed">"{referral.vision}"</p>
                           </td>
                           <td className="px-6 py-6">
                             <span className="text-[12px] font-bold uppercase tracking-wider text-primary/70">{referral.reason}</span>
                           </td>
                           <td className="px-6 py-6">
                             <div className={`flex items-center gap-2 text-[13px] font-bold ${referral.color}`}>
                               <referral.icon className="w-4 h-4" />
                               {referral.status}
                             </div>
                           </td>
                           <td className="px-6 py-6 rounded-r-2xl text-right">
                             <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary/10 h-10 px-6 font-bold text-[11px] uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                               Details <ArrowRight className="w-3.5 h-3.5 ml-2" />
                             </Button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>

              {/* Direct Activity Feed */}
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-primary/10 shadow-sm space-y-8">
                <div className="flex justify-between items-center border-b border-primary/10 pb-6">
                  <h2 className="font-headline text-[28px]">Recent Direct Leads</h2>
                  <Button variant="link" className="text-primary font-bold uppercase tracking-widest text-[12px] hover:no-underline hover:text-secondary">View All Leads</Button>
                </div>
                
                <div className="space-y-6">
                  {[
                    { name: 'Sarah J. & Michael B.', time: '2 hours ago', detail: 'Wedding Date: Dec 12, 2025 • Cape Town', icon: Mail },
                    { name: 'Leigh-Anne V.', time: '1 day ago', detail: 'Inquiry: "We saw your work via the AI Assistant and loved it!"', icon: MessageSquare }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 p-6 rounded-2xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10">
                      <div className={`w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-white`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-[18px] group-hover:text-primary transition-colors">{item.name}</p>
                          <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-1">{item.time}</span>
                        </div>
                        <p className="text-[15px] text-muted-foreground leading-relaxed italic font-medium">"{item.detail}"</p>
                        <div className="pt-4 flex gap-3">
                          <Button className="h-10 px-8 button-rose text-[11px] font-bold tracking-widest uppercase shadow-md">Reply</Button>
                          <Button variant="outline" className="h-10 px-8 rounded-full border-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase hover:bg-primary/5">Archive</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

