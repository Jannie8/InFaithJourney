
'use client';

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
  }, [messages]);

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
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-16 h-16 rounded-full button-rose shadow-2xl z-50 flex items-center justify-center transition-all hover:scale-110 golden-glow-premium",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <Sparkles className="w-8 h-8 text-white animate-pulse" />
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-[460px] h-[75vh] min-h-[500px] bg-background border border-primary/20 rounded-[24px] shadow-2xl flex flex-col overflow-hidden watercolor-bg">
            {/* Header */}
            <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline text-[20px] text-foreground leading-tight">AI Concierge</h3>
                  <p className="text-[12px] uppercase tracking-widest text-primary font-bold opacity-70">Always Here for You</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6 space-y-6" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-[20px] text-[15px] font-medium leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white border border-primary/10 text-foreground rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="w-full mt-4 space-y-4">
                        <p className="text-[13px] uppercase tracking-widest font-bold text-primary px-2">Top Recommendations</p>
                        <div className="grid grid-cols-1 gap-4">
                          {msg.recommendations.map((vendor: any) => (
                            <div key={vendor.id} className="scale-95 origin-top">
                              <VendorCard {...vendor} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-primary opacity-60">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span className="text-[13px] italic font-medium">Seeking magic...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Bar */}
            <div className="p-6 border-t border-primary/10 bg-white/50">
              <div className="flex items-center gap-3 relative">
                <button 
                  onClick={handleSpeech}
                  className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  title="Speak to AI"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about venues, budget, or style..."
                  className="h-12 rounded-full border-primary/20 pl-4 pr-12 text-[15px]"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-secondary disabled:opacity-30 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
