"use client";

import { useState } from 'react';
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
  PieChart, CreditCard, Edit3
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const isLoggedIn = user || isSimulating;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed", error);
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

  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Profile', icon: User },
    { name: 'Inquiries', icon: Mail },
    { name: 'AI Referrals', icon: Sparkles },
    { name: 'Subscription & Billing', icon: CreditCard },
    { name: 'Analytics', icon: PieChart },
  ];

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg items-center justify-center">
        <Sparkles className="w-12 h-12 text-secondary animate-pulse" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-32">
          <Card className="max-w-md w-full bg-card/80 backdrop-blur-md p-2 rounded-[32px] border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <CardHeader className="text-center space-y-2 pb-8 pt-10">
              <CardTitle className="font-headline text-[32px] md:text-[36px] leading-tight text-foreground">Vendor Portal</CardTitle>
              <CardDescription className="text-muted-foreground italic text-[15px]">Sign in to manage your luxury listing and track referrals.</CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-12 space-y-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] tracking-widest font-bold text-secondary">Email Address</Label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-white/10 bg-white/5 focus:ring-secondary/20" 
                    placeholder="name@business.com" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] tracking-widest font-bold text-secondary">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-white/10 bg-white/5 focus:ring-secondary/20 pr-12" 
                      placeholder="••••••••" 
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="rounded border-white/20 data-[state=checked]:bg-secondary" />
                    <Label htmlFor="remember" className="text-[13px] text-muted-foreground font-medium cursor-pointer">Remember me</Label>
                  </div>
                  <button type="button" className="text-[12px] font-bold text-secondary hover:underline underline-offset-4">Forgot Password?</button>
                </div>

                <Button type="submit" className="w-full h-14 button-rose text-[15px] font-bold tracking-widest">
                  SIGN IN
                </Button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-widest"><span className="bg-card px-4 text-muted-foreground font-bold">OR</span></div>
              </div>

              <div className="text-center space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSimulating(true)}
                  className="w-full h-14 rounded-xl border-white/10 text-foreground hover:bg-white/5 font-bold tracking-widest text-[13px] uppercase"
                >
                  Demo Access
                </Button>
                <p className="text-[14px] text-muted-foreground font-medium">
                  New here? <Link href="/plans" className="text-secondary font-bold hover:underline decoration-secondary decoration-2 underline-offset-4">Apply as a Vendor</Link>
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
      
      <main className="flex-1 section-padding px-6 pt-32">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-28 space-y-6">
                <div className="bg-card/50 p-6 rounded-[24px] border border-white/5 shadow-sm space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[14px] font-bold uppercase tracking-widest transition-all duration-300",
                        activeTab === item.name 
                          ? "bg-secondary text-background shadow-md golden-glow-premium" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-secondary"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", activeTab === item.name ? "text-background" : "text-secondary")} />
                      {item.name}
                    </button>
                  ))}
                  
                  <div className="pt-6 mt-4 border-t border-white/5">
                    <Button 
                      onClick={handleLogout}
                      variant="ghost" 
                      className="w-full justify-start gap-4 px-4 py-3.5 h-auto text-red-400 hover:bg-red-400/10 rounded-xl font-bold uppercase tracking-widest text-[14px]"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                  <h1 className="font-headline text-[36px] md:text-[48px] leading-tight text-foreground">Command Center</h1>
                  <p className="text-[16px] text-muted-foreground italic font-medium">Evergold Photography — Johannesburg, GP</p>
                </div>
                <Button className="h-12 px-8 button-rose text-[13px] font-bold tracking-widest uppercase">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Listing
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Profile Views", value: "1,240", change: "+14%", icon: Eye, color: "text-blue-400" },
                  { label: "Direct Leads", value: "12", change: "+8%", icon: Mail, color: "text-emerald-400" },
                  { label: "AI Referrals", value: "24", change: "+12%", icon: Sparkles, color: "text-secondary" }
                ].map((stat, i) => (
                  <Card key={i} className="bg-card border-white/5 shadow-sm hover:shadow-md transition-all rounded-[24px] overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</h3>
                      <p className="text-[32px] font-headline font-bold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Overview Tab Content */}
              {activeTab === 'Overview' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-card p-8 rounded-[32px] border border-white/5 shadow-md space-y-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="font-headline text-[28px]">Recent AI Matches</h2>
                          <p className="text-[14px] text-muted-foreground font-medium italic">Intelligent recommendations for your brand.</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-secondary border-secondary/30 px-4 py-1.5 uppercase tracking-widest font-bold">Featured</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
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
                            <tr key={i} className="bg-white/5 hover:bg-white/10 transition-all rounded-2xl shadow-sm">
                              <td className="px-6 py-5 rounded-l-2xl font-bold text-muted-foreground text-[14px]">{ref.date}</td>
                              <td className="px-6 py-5 italic text-[15px]">"{ref.vision}"</td>
                              <td className="px-6 py-5 rounded-r-2xl text-right">
                                <Button size="sm" className="h-9 px-6 button-rose text-[11px] font-bold uppercase tracking-widest">Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
