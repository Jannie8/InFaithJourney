import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, Mail, Star, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock login state
  const isLoggedIn = true;
  const userRole = 'vendor'; // or 'couple'

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen watercolor-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-12 rounded-[20px] border border-primary/10 shadow-lg text-center space-y-8">
            <h1 className="font-headline text-[36px]">Welcome Back</h1>
            <p className="text-muted-foreground italic">Please log in to access your dashboard.</p>
            <Button className="w-full h-14 button-rose">LOG IN</Button>
            <p className="text-[14px]">Don't have an account? <Link href="/apply" className="text-primary font-bold hover:underline">Register here</Link></p>
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 pb-8">
            <div className="space-y-2">
              <h1 className="font-headline text-[48px] leading-tight">Vendor Dashboard</h1>
              <p className="text-[18px] text-muted-foreground italic">Welcome back, Evergold Photography</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-full border-primary/20 text-primary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="rounded-full border-red-200 text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Stats */}
            <aside className="lg:col-span-1 space-y-6">
              <Card className="bg-white border-primary/10 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[14px] uppercase tracking-widest text-primary">Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-green-600 font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Active & Listed
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-2">Plan: Standard Vendor</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/10 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[14px] uppercase tracking-widest text-primary">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Views</span>
                    <span className="font-bold">1,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">New Inquiries</span>
                    <span className="font-bold text-primary">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-bold">4.9 ★</span>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-primary/10 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-headline text-[24px]">Edit Listing</h3>
                      <p className="text-muted-foreground text-[14px]">Update your portfolio and info</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/10 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-headline text-[24px]">View Inquiries</h3>
                      <p className="text-muted-foreground text-[14px]">You have 12 unread messages</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-white p-10 rounded-[20px] border border-primary/10 shadow-md">
                <h2 className="font-headline text-[28px] mb-8">Recent Activity</h2>
                <div className="space-y-6">
                  {[
                    { action: 'New Inquiry from Sarah J.', time: '2 hours ago', detail: 'Wedding Date: Dec 12, 2025' },
                    { action: 'Review received from Michael B.', time: '1 day ago', detail: '★★★★★ "Amazing work!"' },
                    { action: 'Profile View Spike', time: '2 days ago', detail: '+45% views from Cape Town' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.action}</p>
                        <p className="text-[13px] text-muted-foreground">{item.time} • {item.detail}</p>
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
