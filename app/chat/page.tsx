'use client';

import React from "react"

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardNav from '@/components/dashboard/nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || streaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      console.log('[v0] Sending chat message:', input);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[v0] Chat API error:', error);
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreaming(true);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // AI SDK data stream format: lines like '0:"text chunk"\n'
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.slice(2));
              fullContent += text;
            } catch {
              // not valid JSON, skip
            }
          }
        }

        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            ...prev[prev.length - 1],
            content: fullContent,
          },
        ]);
      }
      console.log('[v0] Chat response completed');
    } catch (error: any) {
      console.error('[v0] Chat error:', error);
      // Remove the incomplete assistant message if there's an error
      setMessages((prev) => prev.filter((m) => m.role !== 'assistant' || m.content.length > 0));
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav user={user!} />
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-6 animate-slide-in-right">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">FitMate AI Coach</h1>
          </div>
          <p className="text-muted-foreground">Get personalized fitness advice and guidance</p>
        </div>

        <Card className="card-elevated flex-1 flex flex-col p-6 mb-4 overflow-hidden animate-fade-in shadow-lg shadow-orange-500/5">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Sparkles className="w-12 h-12 text-primary/50 mb-4" />
                <p className="text-lg font-bold text-foreground mb-2">
                  Welcome to your AI fitness coach!
                </p>
                <p className="text-muted-foreground max-w-md text-sm">
                  Ask me anything about workouts, nutrition, form, recovery, or fitness goals. I'm here
                  to help you succeed.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-[#FF6B35] text-white rounded-br-none shadow-lg shadow-orange-500/20'
                        : 'bg-secondary/80 text-foreground rounded-bl-none border border-border/50'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 font-medium ${
                        message.role === 'user' ? 'text-white/60' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {streaming && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground px-4 py-3 rounded-lg border border-border/30">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-smooth" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-smooth" style={{ animationDelay: '100ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-smooth" style={{ animationDelay: '200ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3 mt-auto bg-secondary/40 border border-border/50 rounded-xl p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fitness, diet, exercises..."
              disabled={loading || streaming}
              className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground flex-1 focus:outline-none rounded-lg px-3"
            />
            <Button
              type="submit"
              disabled={loading || streaming || !input.trim()}
              className="bg-[#FF6B35] hover:bg-[#FF8A5E] text-white font-semibold smooth-transition rounded-lg h-10 px-4"
            >
              {loading || streaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
