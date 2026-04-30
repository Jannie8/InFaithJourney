import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Upload, CheckCircle2, User, Briefcase, CreditCard, Image as ImageIcon } from 'lucide-react';

export default function ApplyPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-apply');

  const steps = [
    { title: "1. Create Account", desc: "Sign up and verify your email address to start your vendor journey.", icon: User },
    { title: "2. Business Details", desc: "Provide your business name, category, and a high-end description.", icon: Briefcase },
    { title: "3. Choose a Plan", desc: "Select from our membership plans that best fit your business goals.", icon: CreditCard },
    { title: "4. Submit Portfolio", desc: "Upload your stunning wedding work to be reviewed by our team.", icon: ImageIcon }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Romantic couple"
          fill
          className="object-cover sepia-overlay brightness-[0.8]"
          data-ai-hint="wedding flowers"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-6xl md:text-7xl font-headline mb-6 drop-shadow-xl">Apply as a Vendor</h1>
          <p className="text-xl italic tracking-[0.2em] uppercase font-bold">Elevate your wedding business</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          
          {/* How It Works Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="font-headline text-4xl mb-12">How It Works</h2>
            <div className="relative space-y-14">
              <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-primary/20"></div>
              {steps.map((step, i) => (
                <div key={i} className="relative pl-20">
                  <div className="absolute left-0 top-0 w-16 h-16 bg-white rounded-full border border-primary/20 flex items-center justify-center z-10 shadow-xl shadow-primary/5 group transition-all duration-500 hover:scale-110">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-headline text-2xl mb-3">{step.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 luxury-card p-10 text-center relative overflow-hidden">
              <div className="font-script text-5xl text-primary/20 absolute -top-4 -left-4">"</div>
              <h4 className="font-headline text-2xl mb-6 italic leading-relaxed">"Joining InFaith Journey transformed my bridal business. The quality of leads is unmatched."</h4>
              <p className="text-[11px] text-primary font-bold uppercase tracking-[0.3em]">— Sarah, Rosa Melia Floral Design</p>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2 luxury-card p-10 md:p-20">
            <h2 className="font-headline text-4xl mb-12">Vendor Application Form</h2>
            
            <form className="space-y-12">
              <div className="space-y-8">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary pb-3 border-b border-primary/10">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="uppercase text-[11px] tracking-widest font-bold opacity-60">First Name</Label>
                    <Input id="firstName" placeholder="John" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="email" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary pb-3 border-b border-primary/10">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="businessName" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Business Name</Label>
                    <Input id="businessName" placeholder="Your Luxury Brand" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="category" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Primary Category</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-primary/10 h-14 rounded-xl px-6">
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
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="description" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Business Description</Label>
                    <Textarea id="description" placeholder="Tell us about your services and unique style..." className="min-h-[180px] bg-white/50 border-primary/10 rounded-xl px-6 py-4" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="hearAboutUs" className="uppercase text-[11px] tracking-widest font-bold opacity-60">How did you hear about us?</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-primary/10 h-14 rounded-xl px-6">
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

              <div className="space-y-8">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary pb-3 border-b border-primary/10">Portfolio Upload</h3>
                <div className="border-2 border-dashed border-primary/20 rounded-3xl p-16 text-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform border border-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-headline mb-2">Drag and drop your high-resolution photos</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold">JPG, PNG (MAX 5MB per file)</p>
                </div>
              </div>

              <div className="pt-10">
                <Button className="w-full h-16 button-rose text-[14px] font-bold tracking-[0.3em] uppercase rounded-full">
                  SUBMIT APPLICATION
                </Button>
                <p className="text-center text-[12px] text-muted-foreground mt-6 italic font-medium">
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
