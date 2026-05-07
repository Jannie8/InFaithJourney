"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, User, ImageIcon, CreditCard, 
  ArrowRight, ArrowLeft, CheckCircle2, Upload,
  Sparkles, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 1, name: 'Business Info', icon: User },
  { id: 2, name: 'Business Details', icon: Briefcase },
  { id: 3, name: 'Media Uploads', icon: ImageIcon },
  { id: 4, name: 'Confirmation', icon: CreditCard },
];

const CATEGORIES = [
  'Venues', 'Photography & Videography', 'Beauty', 'Flowers & Decor', 
  'Catering', 'Honeymoon Destinations', 'Music & Entertainment', 
  'Planning & Coordination', 'Fashion', 'Stationery', 'Wedding Cakes', 'Jewelry'
];

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'standard';
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    websiteUrl: '',
    instagramHandle: '',
    location: '',
    category: '',
    description: '',
    yearsInBusiness: '',
    pricingRange: '',
    servicesOffered: '',
    selectedPlan: initialPlan,
    agreedToTerms: false
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: "Account Required",
        description: "Please sign in to continue with your application.",
      });
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    if (step < 4) {
      handleNext();
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'vendorApplications'), {
        ...formData,
        submitterUid: user.uid,
        applicationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push('/membership/success');
    } catch (error) {
      console.error("Submission failed", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) return <div className="h-screen flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Progress Stepper */}
      <div className="flex justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/10 -translate-y-1/2 z-0"></div>
        {STEPS.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center">
            <div className={cn(
              "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500",
              step >= s.id ? "bg-primary border-primary text-white shadow-lg" : "bg-white border-primary/20 text-primary/40"
            )}>
              {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className={cn(
              "absolute -bottom-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-opacity duration-500",
              step === s.id ? "opacity-100 text-primary" : "opacity-40"
            )}>
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md rounded-[40px] border border-primary/10 p-10 md:p-16 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/5">
          <motion.div 
            className="h-full bg-secondary"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h2 className="font-headline text-[32px] italic">Business Information</h2>
                <p className="text-muted-foreground italic font-medium">Let's start with the essentials of your brand.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Business Name</Label>
                  <Input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="The Golden Studio" required className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Owner Name</Label>
                  <Input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Ricardo de Jager" required className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Email Address</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ricardo@infaith.com" required className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Phone Number</Label>
                  <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+27 78 442 0278" required className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Website URL</Label>
                  <Input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Instagram Handle</Label>
                  <Input name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} placeholder="@yourbrand" className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Primary Location</Label>
                  <Input name="location" value={formData.location} onChange={handleChange} placeholder="Cape Town, South Africa" required className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h2 className="font-headline text-[32px] italic">Business Details</h2>
                <p className="text-muted-foreground italic font-medium">Help us understand the artistry behind your service.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Vendor Category</Label>
                  <Select onValueChange={(v) => handleSelectChange('category', v)} value={formData.category}>
                    <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-primary/10">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Business Description</Label>
                  <Textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe your unique approach and experience..." 
                    className="min-h-[160px] rounded-2xl bg-white/50 border-primary/10" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Years in Business</Label>
                    <Input type="number" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} placeholder="5" className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Pricing Range</Label>
                    <Input name="pricingRange" value={formData.pricingRange} onChange={handleChange} placeholder="From R15,000" className="h-14 rounded-2xl bg-white/50 border-primary/10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Services Offered</Label>
                  <Textarea 
                    name="servicesOffered" 
                    value={formData.servicesOffered} 
                    onChange={handleChange} 
                    placeholder="List your key packages or specialized services..." 
                    className="min-h-[100px] rounded-2xl bg-white/50 border-primary/10" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="font-headline text-[32px] italic">Media Portfolio</h2>
                <p className="text-muted-foreground italic font-medium">Visuals are the heart of your profile. Upload high-quality imagery.</p>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Brand Logo</Label>
                    <div className="border-2 border-dashed border-primary/10 rounded-2xl p-8 text-center bg-white/20 hover:bg-primary/5 transition-all cursor-pointer group">
                      <Upload className="w-8 h-8 text-primary/40 mx-auto mb-3 group-hover:text-primary transition-colors" />
                      <p className="text-[12px] font-bold uppercase tracking-widest opacity-60">Upload Logo</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Cover Banner</Label>
                    <div className="border-2 border-dashed border-primary/10 rounded-2xl p-8 text-center bg-white/20 hover:bg-primary/5 transition-all cursor-pointer group">
                      <Upload className="w-8 h-8 text-primary/40 mx-auto mb-3 group-hover:text-primary transition-colors" />
                      <p className="text-[12px] font-bold uppercase tracking-widest opacity-60">Upload Banner</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="uppercase text-[11px] font-bold tracking-widest opacity-70">Portfolio Images (Min 5)</Label>
                  <div className="border-2 border-dashed border-primary/10 rounded-[32px] p-20 text-center bg-white/20 hover:bg-primary/5 transition-all cursor-pointer group">
                    <ImageIcon className="w-12 h-12 text-primary/30 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                    <p className="font-headline text-2xl italic mb-2">Drag and drop your finest work</p>
                    <p className="text-muted-foreground italic text-sm">Select multiple high-resolution JPEG or PNG files.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="font-headline text-[32px] italic">Final Confirmation</h2>
                <p className="text-muted-foreground italic font-medium">Review your selected tier and finalize your application.</p>
              </div>

              <div className="bg-primary/5 rounded-3xl p-10 border border-primary/10 space-y-8">
                <div className="flex justify-between items-center border-b border-primary/10 pb-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Selected Plan</p>
                    <h3 className="font-headline text-2xl italic uppercase tracking-wider">{formData.selectedPlan} Vendor</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Investment</p>
                    <h3 className="text-2xl font-bold">{formData.selectedPlan === 'standard' ? 'R499' : 'R1,199'} <span className="text-sm font-medium opacity-60">/ month</span></h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[12px] font-bold uppercase tracking-widest opacity-60">Key Features Included:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Full Editorial Profile",
                      "Verified Vendor Badge",
                      "Direct Client Inquiry Form",
                      formData.selectedPlan === 'featured' ? "Homepage Priority Placement" : "Search Priority",
                      formData.selectedPlan === 'featured' ? "Social Media Highlights" : "Standard Listing"
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm italic font-medium">
                        <CheckCircle2 className="w-4 h-4 text-secondary" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreedToTerms} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToTerms: !!checked }))}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed italic font-medium cursor-pointer">
                  I agree to the InFaith Journey terms of service and acknowledge that my application will undergo a review process before activation.
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 pt-10 border-t border-primary/10 flex justify-between items-center">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="text-[11px] font-bold uppercase tracking-widest hover:bg-primary/5 px-8 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="button-rose px-12 h-14 text-[12px] font-bold tracking-widest shadow-xl"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 4 ? (
              <>SUBMIT APPLICATION <Sparkles className="w-4 h-4 ml-2" /></>
            ) : (
              <>CONTINUE <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      <main className="flex-1 pt-44 pb-32 px-6">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
          <ApplyForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
