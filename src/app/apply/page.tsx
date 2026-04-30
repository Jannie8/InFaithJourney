import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Upload, User, Briefcase, CreditCard, Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function ApplyPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-apply');

  const steps = [
    { title: "Step 1. Create Account", desc: "Sign up and verify your email address to start your vendor journey.", icon: User },
    { title: "Step 2. Business Details", desc: "Provide your business name, category, and a high-end description.", icon: Briefcase },
    { title: "Step 3. Choose a Plan", desc: "Select from our membership plans that best fit your business goals.", icon: CreditCard },
    { title: "Step 4. Submit Portfolio", desc: "Upload your stunning wedding work to be reviewed by our team.", icon: ImageIcon }
  ];

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Romantic couple under floral arch"
          fill
          className="object-cover sepia-overlay brightness-[0.8]"
          data-ai-hint="wedding couple floral"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-6xl md:text-8xl font-headline mb-8 drop-shadow-2xl">Apply as a Vendor</h1>
          <p className="text-xl md:text-2xl italic tracking-[0.25em] uppercase font-bold opacity-90">Elevate your wedding business</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
          
          {/* How It Works Sidebar */}
          <div className="lg:col-span-1 space-y-16">
            <h2 className="font-headline text-5xl mb-12">How It Works</h2>
            <div className="relative space-y-16">
              <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-primary/20"></div>
              {steps.map((step, i) => (
                <div key={i} className="relative pl-24 group">
                  <div className="absolute left-0 top-0 w-20 h-20 bg-white rounded-full border border-primary/20 flex items-center justify-center z-10 shadow-xl shadow-primary/5 transition-all duration-700 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <step.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-headline text-3xl mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-[16px] text-muted-foreground leading-relaxed font-medium opacity-80">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-32 luxury-card p-12 text-center relative overflow-hidden">
              <div className="font-script text-6xl text-primary/15 absolute -top-4 -left-4">"</div>
              <h4 className="font-headline text-3xl mb-8 italic leading-relaxed">"Joining InFaith Journey transformed my bridal business. The quality of leads is unmatched."</h4>
              <p className="text-[12px] text-primary font-bold uppercase tracking-[0.4em]">— Sarah, Rosa Melia Floral Design</p>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2 luxury-card p-12 md:p-24 space-y-20">
            <h2 className="font-headline text-5xl mb-16 border-b border-primary/10 pb-8">Vendor Application</h2>
            
            <form className="space-y-16">
              <div className="space-y-10">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-primary/30"></div>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label htmlFor="firstName" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">First Name</Label>
                    <Input id="firstName" placeholder="John" className="bg-white/50 border-primary/20 h-16 rounded-2xl px-8 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="lastName" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-white/50 border-primary/20 h-16 rounded-2xl px-8 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <Label htmlFor="email" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white/50 border-primary/20 h-16 rounded-2xl px-8 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-primary/30"></div>
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label htmlFor="businessName" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">Business Name</Label>
                    <Input id="businessName" placeholder="Your Luxury Brand" className="bg-white/50 border-primary/20 h-16 rounded-2xl px-8 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="category" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">Primary Category</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-primary/20 h-16 rounded-2xl px-8 focus:ring-primary/20">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venue">Wedding Venue</SelectItem>
                        <SelectItem value="photo">Photographer</SelectItem>
                        <SelectItem value="floral">Floral Designer</SelectItem>
                        <SelectItem value="catering">Catering & Cuisine</SelectItem>
                        <SelectItem value="bridal">Bridal Fashion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <Label htmlFor="description" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">Short Description</Label>
                    <Textarea id="description" placeholder="Tell us about your services and unique style..." className="min-h-[220px] bg-white/50 border-primary/20 rounded-2xl px-8 py-6 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <Label htmlFor="hearAboutUs" className="uppercase text-[11px] tracking-[0.3em] font-bold opacity-60">How did you hear about us?</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-primary/20 h-16 rounded-2xl px-8 focus:ring-primary/20">
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

              <div className="space-y-10">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-primary/30"></div>
                  Portfolio Upload
                </h3>
                <div className="border-2 border-dashed border-primary/20 rounded-[40px] p-20 text-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group shadow-inner">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform border border-primary/10">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-2xl font-headline mb-4">Or click to upload</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-bold">JPG, PNG (MAX 5MB per file)</p>
                </div>
              </div>

              <div className="pt-16 text-center">
                <Button className="w-full h-20 button-rose text-[15px] shadow-2xl">
                  SUBMIT APPLICATION
                </Button>
                <p className="text-[13px] text-muted-foreground mt-10 italic font-medium opacity-80">
                  *Billed manually & securely after application approval.
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
