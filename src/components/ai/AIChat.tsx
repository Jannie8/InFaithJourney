"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, X, Mic, Send, Bot, Wand2, Star, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiConciergeFlow } from '@/ai/flows/ai-concierge-flow';
import { VendorCard } from '@/components/vendors/VendorCard';

interface Message {
  role: 'ai' | 'user';
  content: string;
  recommendations?: any[];
}

interface AIChatProps {
  initialOpen?: boolean;
  inline?: boolean;
}

const SUGGESTIONS = [
  "I want a venue in Stellenbosch under R120000",
  "Recommend photographers in Cape Town",
  "Looking for a luxury garden venue for 100 guests",
  "Best wedding cake makers in Johannesburg",
];

export function AIChat({ initialOpen = false, inline = false }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Welcome to InFaith Journey. I'm your AI Concierge. How can I help you plan your magical global wedding today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await aiConciergeFlow({ 
        message: userMsg, 
        history: messages.map(m => ({ role: m.role, content: m.content })) 
      });
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: result.response, 
        recommendations: result.recommendations 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered a slight glitch. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-ZA';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => handleSend(transcript), 500);
    };
    recognition.start();
  };

  const chatContent = (
    <div className={cn(
      "relative bg-background border border-primary/20 rounded-[32px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto",
      inline 
        ? "w-full h-full border-none shadow-none rounded-none" 
        : "w-[94vw] max-w-[420px] h-[82vh] aspect-[1/1.55]",
      !inline && "animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
    )}>
      <div className="shrink-0 p-6 border-b border-primary/10 flex items-center justify-between bg-primary/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-[18px] text-foreground">AI Concierge</h3>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold opacity-70">A Magical Journey</p>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <ScrollArea className="flex-1 px-6 pt-6 watercolor-bg" ref={scrollRef}>
        <div className="space-y-6 pb-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col gap-3", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[88%] p-4 rounded-[20px] text-[15px] font-medium leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-white border border-primary/10 text-foreground rounded-tl-none"
              )}>
                {msg.content}
              </div>
              
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="w-full mt-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {msg.recommendations.map((vendor: any) => (
                    <div key={vendor.id} className="space-y-3">
                      <VendorCard {...vendor} />
                      <div className="mx-4 p-4 bg-secondary/5 border-l-2 border-secondary rounded-r-xl text-[13px] italic text-foreground/80">
                        {vendor.whyItMatches}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2.5 text-primary opacity-70 px-2 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-[13px] italic">Seeking perfection...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="shrink-0 p-6 border-t border-primary/10 bg-white">
        <div className="flex items-center gap-3 relative mb-2">
          <button 
            onClick={handleSpeech}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full transition-all shrink-0",
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-primary/10 text-primary"
            )}
          >
            <Mic className="w-5.5 h-5.5" />
          </button>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Your global vision..."
              className="h-12 rounded-full border-primary/20 pl-5 pr-12 shadow-inner"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-primary disabled:opacity-30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 opacity-40">
          <Info className="w-3 h-3" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Concierge powered by Gemini</span>
        </div>
      </div>
    </div>
  );

  if (inline) return chatContent;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 rounded-full button-rose shadow-2xl z-[150] flex items-center justify-center transition-all hover:scale-110 ai-floating-pulse",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="AI Concierge"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[190] animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            {chatContent}
          </div>
        </>
      )}
    </>
  );
}