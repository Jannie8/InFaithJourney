
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, X, Mic, Send, Bot, Wand2 } from 'lucide-react';
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

export function AIChat({ initialOpen = false, inline = false }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Welcome to InFaith Journey. I'm your AI Concierge. How can I help you plan your magical golden-hour wedding today?" }
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

  useEffect(() => {
    if (isOpen && !inline) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, inline]);

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
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognition.start();
  };

  const chatContent = (
    <div className={cn(
      "relative bg-background border border-primary/20 rounded-[24px] shadow-2xl flex flex-col overflow-hidden watercolor-bg pointer-events-auto",
      inline 
        ? "w-full h-full border-none shadow-none rounded-none" 
        : "w-[90vw] max-w-[360px] sm:max-w-[420px] h-full max-h-[75vh] sm:max-h-[85vh] aspect-[1/1.5]",
      !inline && "animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
    )}>
      {/* Header */}
      <div className="shrink-0 p-5 md:p-6 border-b border-primary/10 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-[18px] text-foreground leading-tight">AI Concierge</h3>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold opacity-70">Golden Hour Planner</p>
          </div>
        </div>
        {!inline && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 md:px-6 pt-6 chat-scrollbar" ref={scrollRef}>
        <div className="space-y-6 pb-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col gap-2.5", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[88%] p-4 rounded-[20px] text-[15px] font-medium leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-white border border-primary/10 text-foreground rounded-tl-none"
              )}>
                {msg.content}
              </div>
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="w-full mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-primary px-2">Hand-picked for you</p>
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
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-[13px] italic font-medium">Whispering to the sunset...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input - Fixed at Bottom */}
      <div className="shrink-0 p-5 md:p-6 border-t border-primary/10 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={handleSpeech}
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-full transition-all shrink-0",
              isListening ? "bg-red-100 text-red-500 animate-pulse" : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            title="Speak"
          >
            <Mic className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about venues..."
              className="h-11 rounded-full border-primary/20 pl-4 pr-10 text-[14px] shadow-inner bg-white/90 focus-visible:ring-primary/30"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary hover:text-secondary disabled:opacity-30 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (inline) return chatContent;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full button-rose shadow-2xl z-[150] flex items-center justify-center transition-all hover:scale-110 ai-floating-pulse golden-glow-premium",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="Open AI Planner"
      >
        <Wand2 className="w-7 h-7 md:w-8 md:h-8 text-white" />
      </button>

      {/* Backdrop with Dimming */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[190] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
          {chatContent}
        </div>
      )}
    </>
  );
}
