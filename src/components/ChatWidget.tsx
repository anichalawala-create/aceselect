"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! 👋 I'm the Ace Select AI assistant. Whether you're looking for **branding solutions**, **brand activation**, **customized gifts**, or just want to know more about what we do — I'm here to help! How can I assist you today?",
  timestamp: new Date(),
};



function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
          isUser ? "bg-solvorry-accent" : "bg-gradient-to-br from-solvorry-light to-solvorry border border-solvorry-light/30"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-base leading-relaxed font-body shadow-sm ${
          isUser
            ? "bg-solvorry-light text-white rounded-tr-sm"
            : "bg-white/10 border border-white/10 text-white rounded-tl-sm backdrop-blur-sm"
        }`}
        dangerouslySetInnerHTML={{
          __html: message.content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline text-solvorry-accent hover:text-white transition-colors">$1</a>')
            .replace(/\n/g, "<br/>"),
        }}
      />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solvorry-light to-solvorry border border-solvorry-light/30 flex items-center justify-center shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="px-5 py-4 bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm backdrop-blur-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-solvorry-light animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    // Add user message to state
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("API Error:", errData);
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: errData.error === "Groq API key not configured" 
            ? "⚠️ **Setup Required:** My AI brain is offline because the Groq API key hasn't been loaded. If you just added the `.env.local` file, please **restart your terminal/server** (`npm run dev`) so it can read the new key!"
            : "I'm having trouble connecting to my brain right now. Please try again later or contact us directly at **info@aceselect.in**.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting to my brain right now. Please try again later or contact us directly at **info@aceselect.in**.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="w-[340px] sm:w-[400px] h-[550px] bg-solvorry-dark/95 backdrop-blur-xl border border-solvorry-light/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          role="dialog"
          aria-label="Ace Select AI Chat"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-solvorry to-solvorry-mid border-b border-solvorry-light/20 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-glow backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg tracking-wide">Ace Select AI</h3>
              <p className="text-solvorry-accent text-xs font-body flex items-center gap-1.5 mt-0.5 font-medium tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-solvorry-accent animate-pulse" />
                Online Now
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-solvorry-light scrollbar-track-transparent">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-solvorry-light/20 bg-solvorry-dark/50">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-solvorry-light/50 focus-within:bg-white/10 rounded-2xl px-4 py-2 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our services..."
                className="flex-1 bg-transparent text-white text-base py-1.5 font-body placeholder:text-neutral-400 outline-none"
                aria-label="Chat message input"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-solvorry hover:bg-solvorry-light disabled:opacity-30 disabled:hover:bg-solvorry disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-[4px] bg-solvorry-DEFAULT hover:bg-solvorry-dark shadow-sm transition-all duration-300 flex items-center justify-center group"
        aria-label={isOpen ? "Close chat" : "Open chat with Ace Select AI"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-300 rotate-90 group-hover:rotate-0" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-y-0.5" />
        )}
        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-solvorry-light border-2 border-white" />
        )}
      </button>
    </div>
  );
}
