
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Upload, CheckCircle2 } from 'lucide-react';

export default function ApplyPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'apply-hero');

  const steps = [
    { title: "1. Create Account", desc: "Sign up and verify your email address to start your vendor journey." },
    { title: "2. Business Details", desc: "Provide your business name, category, and a high-end description." },
    { title: "3. Choose a Plan", desc: "Select from our membership plans that best fit your business goals." },
    { title: "4. Submit Portfolio", desc: "Upload your stunning wedding work to be reviewed by our team." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Floral background"
          fill
          className="object-cover sepia-overlay brightness-[0.9]"
          data-ai-hint="floral arch"
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-headline mb-4 drop-shadow-md">Apply as a Vendor</h1>
          <p className="text-lg italic tracking-widest uppercase">Elevate your wedding business</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* How It Works Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="font-headline text-3xl mb-10">How It Works</h2>
            <div className="relative space-y-12">
              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-primary/10"></div>
              {steps.map((step, i) => (
                <div key={i} className="relative pl-16">
                  <div className="absolute left-0 top-0 w-12 h-12 bg-white rounded-full border-2 border-primary flex items-center justify-center z-10 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-headline text-xl mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-white p-8 rounded-2xl border border-primary/10 shadow-xl shadow-primary/5">
              <h4 className="font-headline text-xl mb-4 italic">"Joining InFaith Journey transformed my bridal business. The quality of leads is unmatched."</h4>
              <p className="text-sm text-primary font-bold uppercase tracking-widest">— Sarah, Rosa Melia Floral Design</p>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2 bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-primary/10 shadow-2xl">
            <h2 className="font-headline text-3xl mb-8">Vendor Application Form</h2>
            
            <form className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary pb-2 border-b border-primary/10">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" className="bg-white border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-white border-primary/20" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white border-primary/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary pb-2 border-b border-primary/10">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="Your Luxury Brand" className="bg-white border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Primary Category</Label>
                    <Select>
                      <SelectTrigger className="bg-white border-primary/20">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venue">Wedding Venue</SelectItem>
                        <SelectItem value="photo">Photographer</SelectItem>
                        <SelectItem value="floral">Floral Designer</SelectItem>
                        <SelectItem value="cake">Wedding Cake Artist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea id="description" placeholder="Tell us about your services and unique style..." className="min-h-[150px] bg-white border-primary/20" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
                    <Select>
                      <SelectTrigger className="bg-white border-primary/20">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="friend">Word of Mouth</SelectItem>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary pb-2 border-b border-primary/10">Portfolio Upload</h3>
                <div className="border-2 border-dashed border-primary/20 rounded-2xl p-12 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-1">Drag and drop your high-resolution photos</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">JPG, PNG (MAX 5MB per file)</p>
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary/20">
                  SUBMIT APPLICATION
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 italic">
                  Billed manually & securely after application approval.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
