"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore, useFirebaseApp } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, User, ImageIcon, CreditCard, 
  ArrowRight, ArrowLeft, CheckCircle2, Upload,
  Sparkles, Loader2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

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

const PLAN_OPTIONS = [
  {
    id: 'free',
    name: 'Free Listing',
    price: 'Free',
    period: '',
    description: 'Get discovered by local couples.',
    benefits: ['Business name', '1 category', 'Location', 'Short description'],
  },
  {
    id: 'standard',
    name: 'Standard Vendor',
    price: 'R499',
    period: '/ month',
    description: 'Start receiving direct inquiries.',
    benefits: ['Full Editorial Profile', 'Verified Vendor Badge', 'Direct Client Inquiry Form', 'Search Priority', 'Standard Listing'],
  },
  {
    id: 'featured',
    name: 'Featured Vendor',
    price: 'R1,199',
    period: '/ month',
    description: 'Maximum exposure for elite brands.',
    benefits: ['Full Editorial Profile', 'Verified Vendor Badge', 'Direct Client Inquiry Form', 'Homepage Priority Placement', 'Social Media Highlights'],
  },
] as const;

type PlanId = (typeof PLAN_OPTIONS)[number]['id'];

function isPlanId(value: string): value is PlanId {
  return PLAN_OPTIONS.some(plan => plan.id === value);
}

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get('plan') || 'standard';
  const initialPlan: PlanId = isPlanId(requestedPlan) ? requestedPlan : 'standard';
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const app = useFirebaseApp();
  const storage = getStorage(app);
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasExistingApp, setHasExistingApp] = useState(false);
  
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
    agreedToTerms: false,
    logoUrl: '',
    coverImageUrl: '',
    portfolioImageUrls: [] as string[]
  });
  const selectedPlan = PLAN_OPTIONS.find(plan => plan.id === formData.selectedPlan) ?? PLAN_OPTIONS[1];

  // Check for existing pending applications
  useEffect(() => {
    async function checkExisting() {
      if (!user || !db) return;
      const q = query(
        collection(db, 'vendorApplications'),
        where('submitterUid', '==', user.uid),
        where('applicationStatus', '==', 'pending'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setHasExistingApp(true);
      }
    }
    checkExisting();
  }, [user, db]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: "Account Required",
        description: "Please sign in or create an account to start your vendor application.",
      });
      router.replace('/signup');
    }
  }, [initialPlan, user, isUserLoading, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover' | 'portfolio') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    const invalidFile = Array.from(files).find(file => !file.type.startsWith('image/') || file.size >= 10 * 1024 * 1024);
    if (invalidFile) {
      toast({
        title: "Invalid Image",
        description: "Please upload image files smaller than 10 MB each.",
        variant: "destructive",
      });
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileRef = ref(storage, `applications/${user.uid}/${type}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });

      const urls = await Promise.all(uploadPromises);

      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logoUrl: urls[0] }));
        toast({ title: "Logo Uploaded", description: "Your business logo has been saved." });
      } else if (type === 'cover') {
        setFormData(prev => ({ ...prev, coverImageUrl: urls[0] }));
        toast({ title: "Banner Uploaded", description: "Your profile banner has been saved." });
      } else if (type === 'portfolio') {
        setFormData(prev => ({ ...prev, portfolioImageUrls: [...prev.portfolioImageUrls, ...urls] }));
        toast({ title: "Images Added", description: `${urls.length} images added to your portfolio.` });
      }
    } catch (error) {
      console.error("Upload error", error);
      toast({ title: "Upload Failed", description: "Could not upload the image. Check your connection and try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleNext = () => {
    // Basic validation per step
    if (step === 1 && (!formData.businessName || !formData.ownerName || !formData.email || !formData.phoneNumber)) {
      toast({ title: "Missing Info", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (step === 2 && (!formData.category || !formData.description)) {
      toast({ title: "Missing Details", description: "Category and description are required.", variant: "destructive" });
      return;
    }
    if (step === 3 && (!formData.logoUrl || !formData.coverImageUrl || formData.portfolioImageUrls.length === 0)) {
      toast({ title: "Media Required", description: "Please upload a logo, cover banner, and at least one portfolio image.", variant: "destructive" });
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    if (step < 4) {
      handleNext();
      return;
    }

    if (!formData.agreedToTerms) {
      toast({ title: "Terms Required", description: "Please agree to the terms to proceed.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/vendor-applications', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not submit the application.');
      router.push('/membership/success');
    } catch (error: any) {
      console.error("Submission failed", error);
      toast({ title: "Submission Failed", description: error?.message || "There was an error saving your application.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-muted-foreground italic font-medium">Preparing your application...</p>
    </div>
  );

  if (hasExistingApp) return (
    <div className="max-w-2xl mx-auto w-full text-center space-y-8 animate-fade-up pt-12">
      <div className="w-20 md:w-24 h-20 md:h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100">
        <AlertCircle className="w-10 md:w-12 h-10 md:h-12 text-amber-500" />
      </div>
      <div className="space-y-4">
        <h2 className="font-headline text-[28px] md:text-[32px] italic">Application Pending</h2>
        <p className="text-muted-foreground italic font-medium leading-relaxed px-4">
          You already have an active application under review. Ricardo and the team will get back to you shortly.
        </p>
      </div>
      <Button asChild variant="outline" className="rounded-full px-10 h-12 border-primary/20 text-primary uppercase font-bold tracking-widest text-[11px] md:text-[12px]">
        <Link href="/dashboard">BACK TO DASHBOARD</Link>
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pt-12 md:pt-0">
      {/* Progress Stepper */}
      <div className="flex justify-between mb-16 md:mb-20 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/10 -translate-y-1/2 z-0"></div>
        {STEPS.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-500",
              step >= s.id ? "bg-primary border-primary text-white shadow-glow" : "bg-white border-primary/20 text-primary/40"
            )}>
              {step > s.id ? <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6" /> : <s.icon className="w-4 md:w-5 h-4 md:h-5" />}
            </div>
            <span className={cn(
              "absolute -bottom-8 whitespace-nowrap text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-opacity duration-500",
              step === s.id ? "opacity-100 text-primary" : "opacity-40"
            )}>
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl rounded-[24px] md:rounded-[40px] border border-primary/10 p-6 md:p-16 shadow-soft relative overflow-hidden golden-glow-premium">
        <div className="absolute top-0 left-0 w-full h-1 md:h-1.5 bg-primary/5">
          <motion.div 
            className="h-full bg-secondary"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 md:space-y-10"
            >
              <div className="space-y-2 text-center md:text-left">
                <h2 className="font-headline text-[28px] md:text-[32px] italic">Business Information</h2>
                <p className="text-[14px] md:text-[15px] text-muted-foreground italic font-medium">Let's start with the heart of your brand.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Business Name</Label>
                  <Input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. Your Business Name" required className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Owner Name</Label>
                  <Input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="e.g. Your Full Name" required className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Email Address</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" required className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Phone Number</Label>
                  <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="e.g. +27 12 345 6789" required className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Website URL</Label>
                  <Input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="e.g. https://yourbusiness.com" className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Instagram Handle</Label>
                  <Input name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} placeholder="e.g. @yourbusiness" className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Primary Location</Label>
                  <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. City, Province" required className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10 focus:ring-secondary/30" />
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
              className="space-y-8 md:space-y-10"
            >
              <div className="space-y-2 text-center md:text-left">
                <h2 className="font-headline text-[28px] md:text-[32px] italic">Business Details</h2>
                <p className="text-[14px] md:text-[15px] text-muted-foreground italic font-medium">Describe the artistry behind your premium services.</p>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Vendor Category</Label>
                  <Select onValueChange={(v) => handleSelectChange('category', v)} value={formData.category}>
                    <SelectTrigger className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Business Description</Label>
                  <Textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Tell our couples about your unique approach and experience..." 
                    className="min-h-[140px] md:min-h-[160px] rounded-2xl bg-white/50 border-primary/10 text-[15px]" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Years in Business</Label>
                    <Input type="number" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} placeholder="e.g. 5" className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Pricing Range</Label>
                    <Input name="pricingRange" value={formData.pricingRange} onChange={handleChange} placeholder="e.g. From R5,000" className="h-12 md:h-14 rounded-2xl bg-white/50 border-primary/10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Services Offered</Label>
                  <Textarea 
                    name="servicesOffered" 
                    value={formData.servicesOffered} 
                    onChange={handleChange} 
                    placeholder="List your key packages or specialized services..." 
                    className="min-h-[80px] md:min-h-[100px] rounded-2xl bg-white/50 border-primary/10 text-[15px]" 
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
              className="space-y-10 md:space-y-12"
            >
              <div className="space-y-2 text-center md:text-left">
                <h2 className="font-headline text-[28px] md:text-[32px] italic">Media Portfolio</h2>
                <p className="text-[14px] md:text-[15px] text-muted-foreground italic font-medium">Visuals are everything. Upload your high-resolution artistry.</p>
              </div>

              <div className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Brand Logo <span className="text-destructive">*</span></Label>
                    <div className="relative group">
                      <Input type="file" onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" id="logo-upload" accept="image/*" aria-required="true" />
                      <label htmlFor="logo-upload" className="border-2 border-dashed border-primary/10 rounded-2xl p-6 md:p-8 text-center bg-white/20 hover:bg-primary/5 transition-all cursor-pointer block group-hover:border-secondary/40">
                        {formData.logoUrl ? (
                          <div className="relative w-16 md:w-20 h-16 md:h-20 mx-auto">
                            <Image src={formData.logoUrl} alt="Logo" fill className="object-contain" data-ai-hint="logo" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 md:w-8 h-6 md:h-8 text-primary/40 mx-auto mb-2 md:mb-3" />
                            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest opacity-60">Upload Logo</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Cover Banner <span className="text-destructive">*</span></Label>
                    <div className="relative group">
                      <Input type="file" onChange={(e) => handleFileUpload(e, 'cover')} className="hidden" id="cover-upload" accept="image/*" aria-required="true" />
                      <label htmlFor="cover-upload" className="border-2 border-dashed border-primary/10 rounded-2xl p-6 md:p-8 text-center bg-white/20 hover:bg-primary/5 transition-all cursor-pointer block group-hover:border-secondary/40">
                        {formData.coverImageUrl ? (
                          <div className="relative h-16 md:h-20 w-full">
                            <Image src={formData.coverImageUrl} alt="Banner" fill className="object-cover rounded-md" data-ai-hint="wedding banner" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 md:w-8 h-6 md:h-8 text-primary/40 mx-auto mb-2 md:mb-3" />
                            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest opacity-60">Upload Banner</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="uppercase text-[10px] md:text-[11px] font-bold tracking-widest opacity-70">Portfolio Images <span className="text-destructive">*</span> ({formData.portfolioImageUrls.length} added)</Label>
                  <div className="relative group">
                    <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'portfolio')} className="hidden" id="portfolio-upload" accept="image/*" aria-required="true" />
                    <label htmlFor="portfolio-upload" className="border-2 border-dashed border-primary/10 rounded-[24px] md:rounded-[32px] p-10 md:p-16 text-center bg-white/20 hover:bg-primary/5 transition-all cursor-pointer block group-hover:border-secondary/40">
                      <ImageIcon className="w-10 md:w-12 h-10 md:h-12 text-primary/30 mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                      <p className="font-headline text-xl md:text-2xl italic mb-1 md:mb-2 text-primary">Add your finest work</p>
                      <p className="text-muted-foreground italic text-[12px] md:text-[13px] md:text-sm">At least one image is required. Maximum 10 MB per file.</p>
                    </label>
                  </div>
                  {formData.portfolioImageUrls.length > 0 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3 pt-4">
                      {formData.portfolioImageUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-primary/10">
                          <Image src={url} alt={`Portfolio ${i}`} fill className="object-cover" data-ai-hint="wedding detail" />
                        </div>
                      ))}
                    </div>
                  )}
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
              className="space-y-10 md:space-y-12"
            >
              <div className="space-y-2 text-center md:text-left">
                <h2 className="font-headline text-[28px] md:text-[32px] italic">Final Confirmation</h2>
                <p className="text-[14px] md:text-[15px] text-muted-foreground italic font-medium">Choose your listing plan and review your application.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Vendor membership plan">
                {PLAN_OPTIONS.map((plan) => {
                  const isSelected = formData.selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setFormData(prev => ({ ...prev, selectedPlan: plan.id }))}
                      className={cn(
                        "relative rounded-2xl border p-5 text-left transition-all",
                        isSelected
                          ? "border-secondary bg-secondary/10 shadow-md ring-1 ring-secondary"
                          : "border-primary/10 bg-white/50 hover:border-secondary/40 hover:bg-white"
                      )}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-secondary" />
                      )}
                      <p className="pr-7 font-headline text-lg italic text-primary">{plan.name}</p>
                      <p className="mt-3 text-2xl font-bold text-primary">
                        {plan.price}{plan.period && <span className="text-xs font-medium text-muted-foreground"> {plan.period}</span>}
                      </p>
                      <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground">{plan.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-primary/5 rounded-[24px] md:rounded-3xl p-6 md:p-10 border border-primary/10 space-y-6 md:space-y-8 golden-glow-premium">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-primary/10 pb-6 text-center sm:text-left">
                  <div>
                    <p className="text-[9px] md:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Selected Plan</p>
                    <h3 className="font-headline text-xl md:text-2xl italic uppercase tracking-wider">{selectedPlan.name}</h3>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-[9px] md:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Investment</p>
                    <h3 className="text-xl md:text-2xl font-bold">
                      {selectedPlan.price}
                      {selectedPlan.period && <span className="text-[12px] md:text-[13px] md:text-sm font-medium opacity-60"> {selectedPlan.period}</span>}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] md:text-[11px] md:text-[12px] font-bold uppercase tracking-widest opacity-60">Tier Benefits:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {selectedPlan.benefits.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-[13px] md:text-[14px] italic font-medium">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-2 md:p-4">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreedToTerms} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToTerms: !!checked }))}
                  className="mt-1 shrink-0"
                />
                <Label htmlFor="terms" className="text-[12px] md:text-[13px] md:text-sm text-muted-foreground leading-relaxed italic font-medium cursor-pointer">
                  I agree to the InFaith Journey terms of service and acknowledge that my application will undergo a review process by Ricardo and his team before activation.
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-primary/10 flex flex-col-reverse sm:flex-row justify-between items-center gap-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleBack}
            disabled={step === 1 || isSubmitting || isUploading}
            className="w-full sm:w-auto text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-primary/5 px-8 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="w-full sm:w-auto button-rose px-10 md:px-12 h-12 md:h-14 text-[11px] md:text-[12px] font-bold tracking-widest shadow-xl"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isUploading ? (
              <>UPLOADING... <Loader2 className="w-4 h-4 ml-2 animate-spin" /></>
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
      
      <main className="flex-1 pt-44 md:pt-44 pb-24 md:pb-32 px-6">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
          <ApplyForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
