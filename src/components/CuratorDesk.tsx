import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCuratorResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface CuratorDeskProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CuratorDesk: React.FC<CuratorDeskProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Здравствуйте. Я ваш Куратор на пути индивидуации. Вы можете задать любой вопрос о пути, поделиться тем, что вас беспокоит, или попросить помочь разобраться в образе или переживании. О чём вы думаете сейчас?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const response = await getCuratorResponse(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-[#faf9f6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-800 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-stone-800">Куратор пути</h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">Обратная связь</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-400" />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 overflow-y-auto" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                      m.role === 'user' ? 'bg-stone-100' : 'bg-stone-800'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-stone-500" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' ? 'bg-stone-50 text-stone-800 rounded-tr-none' : 'bg-white border border-stone-100 text-stone-700 rounded-tl-none shadow-sm'
                    }`}>
                      <div className="prose prose-stone prose-sm max-w-none">
                        <ReactMarkdown>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-4 rounded-2xl bg-stone-50 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-stone-100 bg-[#faf9f6]">
              <div className="relative">
                <textarea 
                  rows={1}
                  placeholder="Ваш вопрос Куратору..."
                  className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[9px] text-center text-stone-400 mt-3 italic">
                Куратор сопровождает вас на протяжении всего пути.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
