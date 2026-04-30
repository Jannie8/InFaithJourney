"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, X, Mic, Send, Bot, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiConciergeFlow } from '@/ai/flows/ai-concierge-flow';
import { VendorCard } from '@/components/vendors/VendorCard';

interface Message {
  role: 'ai' | 'user';
  content: string;
  recommendations?: any[];
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Welcome to InFaith Journey. I'm your AI Concierge. How can I help you plan your magical golden-hour wedding today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
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
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered a slight glitch in the magic. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-ZA';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <>
      {/* Floating Toggle Button - Optimized Size */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full button-rose shadow-2xl z-[150] flex items-center justify-center transition-all hover:scale-110 golden-glow-premium",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white animate-pulse" />
      </button>

      {/* Responsive Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={cn(
            "relative w-full max-w-[480px] h-full max-h-[92vh] md:max-h-[800px] bg-background border border-primary/20 rounded-[28px] shadow-2xl flex flex-col overflow-hidden watercolor-bg",
            "animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
          )}>
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-primary/10 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                  <h3 className="font-headline text-[18px] md:text-[22px] text-foreground leading-tight">AI Concierge</h3>
                  <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-primary font-bold opacity-70">Magical Planning Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            {/* Messages Area - Fluid Scroll */}
            <ScrollArea className="flex-1 p-5 md:p-8 chat-scrollbar" ref={scrollRef}>
              <div className="space-y-6 md:space-y-8 pb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-2.5", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[88%] p-4 md:p-5 rounded-[22px] text-[15px] md:text-[16px] font-medium leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white border border-primary/10 text-foreground rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="w-full mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-[11px] md:text-[12px] uppercase tracking-widest font-bold text-primary px-2">Top Personalized Recommendations</p>
                        <div className="grid grid-cols-1 gap-5">
                          {msg.recommendations.map((vendor: any) => (
                            <div key={vendor.id} className="scale-95 hover:scale-100 transition-transform origin-center">
                              <VendorCard {...vendor} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2.5 text-primary opacity-70 px-2 animate-pulse">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span className="text-[14px] italic font-medium">Whispering to the magic...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Bar - Sticky & Accessible */}
            <div className="p-5 md:p-6 border-t border-primary/10 bg-white/60">
              <div className="flex items-center gap-3 relative">
                <button 
                  onClick={handleSpeech}
                  className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all shrink-0"
                  title="Speak to Assistant"
                >
                  <Mic className="w-5.5 h-5.5" />
                </button>
                <div className="relative flex-1">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about venues, budget, or styles..."
                    className="h-12 md:h-14 rounded-full border-primary/20 pl-5 pr-12 text-[15px] md:text-[16px] shadow-inner bg-white/80"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-primary hover:text-secondary disabled:opacity-30 transition-all"
                  >
                    <Send className="w-5.5 h-5.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
