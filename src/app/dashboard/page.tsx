
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
  BarChart3, CreditCard, Edit3, MessageSquare, Sparkles, TrendingUp,
  Clock, CheckCircle2, ArrowRight, Eye, EyeOff, LayoutDashboard,
  FileText, PieChart, Menu, X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white p-6 rounded-[24px] border border-primary/10 shadow-sm space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[14px] font-bold uppercase tracking-widest transition-all duration-300",
                        activeTab === item.name 
                          ? "bg-primary text-white shadow-md golden-glow-premium" 
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", activeTab === item.name ? "text-white" : "text-primary")} />
                      {item.name}
                    </button>
                  ))}
                  
                  <div className="pt-6 mt-4 border-t border-primary/10">
                    <Button 
                      onClick={handleLogout}
                      variant="ghost" 
                      className="w-full justify-start gap-4 px-4 py-3.5 h-auto text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold uppercase tracking-widest text-[14px]"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Status Mini Card */}
                <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Featured Plan</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground font-medium italic">You are currently receiving maximum AI visibility.</p>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-10">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
                <div className="space-y-2">
                  <h1 className="font-headline text-[36px] md:text-[48px] leading-tight">Vendor Command Center</h1>
                  <p className="text-[16px] text-muted-foreground italic font-medium">Evergold Photography Studio — Johannesburg, GP</p>
                </div>
                <Button className="h-12 px-8 button-rose text-[13px] font-bold tracking-widest uppercase">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit My Listing
                </Button>
              </div>

              {/* Performance Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Profile Views", value: "1,240", change: "+14%", icon: Eye, color: "text-blue-500" },
                  { label: "Direct Leads", value: "12", change: "+8%", icon: Mail, color: "text-green-500" },
                  { label: "AI Referrals", value: "24", change: "+12%", icon: Sparkles, color: "text-secondary" }
                ].map((stat, i) => (
                  <Card key={i} className="bg-white border-primary/10 shadow-sm hover:shadow-md transition-all rounded-[24px] overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-3 rounded-2xl bg-primary/5", stat.color)}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</h3>
                      <p className="text-[32px] font-headline font-bold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content: Overview Tab */}
              {activeTab === 'Overview' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* AI Referrals Section */}
                  <div className="bg-white p-8 rounded-[32px] border border-secondary/20 shadow-md space-y-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="font-headline text-[28px]">AI Concierge Referrals</h2>
                          <p className="text-[14px] text-muted-foreground font-medium italic">Intelligent matches for premium couples</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-secondary border-secondary/30 px-4 py-1.5 uppercase tracking-widest font-bold">Featured Priority</Badge>
                    </div>

                    <div className="overflow-x-auto -mx-4 px-4 pb-2">
                      <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                            <th className="px-6 pb-2">Date</th>
                            <th className="px-6 pb-2">Couple's Vision</th>
                            <th className="px-6 pb-2">Match Reason</th>
                            <th className="px-6 pb-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: '24 May', vision: 'Luxury photographer with golden hour aesthetic', reason: 'Style Preference Match', status: 'New' },
                            { date: '23 May', vision: 'Stellenbosch vineyard for 120 guests', reason: 'Capacity & Location Match', status: 'Contacted' }
                          ].map((ref, i) => (
                            <tr key={i} className="bg-primary/5 hover:bg-white transition-all border border-transparent hover:border-primary/10 rounded-2xl shadow-sm">
                              <td className="px-6 py-5 rounded-l-2xl font-bold text-muted-foreground text-[14px]">{ref.date}</td>
                              <td className="px-6 py-5 italic text-[15px]">"{ref.vision}"</td>
                              <td className="px-6 py-5">
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-secondary/5 text-secondary border-secondary/20">{ref.reason}</Badge>
                              </td>
                              <td className="px-6 py-5 rounded-r-2xl text-right">
                                <Button size="sm" className="h-9 px-6 button-rose text-[11px] font-bold uppercase tracking-widest shadow-sm">View Match</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Direct Leads Section */}
                  <div className="bg-white p-8 rounded-[32px] border border-primary/10 shadow-sm space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b border-primary/10">
                      <h2 className="font-headline text-[28px]">Recent Direct Inquiries</h2>
                      <Link href="#" className="text-[12px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors">See All</Link>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { name: 'Sarah J. & Michael B.', time: '2 hours ago', detail: 'Wedding Date: Dec 12, 2025 • Cape Town', status: 'New' },
                        { name: 'Leigh-Anne V.', time: '1 day ago', detail: 'Inquiry: "We saw your work via the AI Assistant and loved it!"', status: 'Pending' }
                      ].map((lead, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10">
                          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-[18px] group-hover:text-primary transition-colors">{lead.name}</p>
                              <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{lead.time}</span>
                            </div>
                            <p className="text-[15px] text-muted-foreground italic font-medium">"{lead.detail}"</p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="h-10 px-8 button-rose text-[11px] font-bold tracking-widest uppercase shadow-md">Reply</Button>
                            <Button variant="outline" className="h-10 px-6 rounded-xl border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest hover:bg-primary/5">Archive</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Placeholder for other tabs */}
              {activeTab !== 'Overview' && (
                <div className="bg-white p-20 rounded-[32px] border border-primary/10 text-center animate-in fade-in duration-500">
                  <PieChart className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                  <h2 className="font-headline text-[32px] mb-2">{activeTab}</h2>
                  <p className="text-muted-foreground italic">This section is coming soon to your command center.</p>
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
