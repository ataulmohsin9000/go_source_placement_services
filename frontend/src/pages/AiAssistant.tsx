import React, { useState } from 'react';
import api from '../api';
import { Bot, Send, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Operations Assistant for Go Source Placement Services. You can ask me about active visa cases, pipeline leads, document checklists, or client summaries.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const res: any = await api.post('/ai/chat', { message: userText });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.content, timestamp: res.data.timestamp },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not process that request. Please verify the API connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How many active visa cases do we have?',
    'What is our current leads pipeline?',
    'What are the mandatory document requirements for UK student visas?',
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="page-eyebrow">Operational support</p>
        <h1 className="page-title">AI assistant</h1>
        <p className="page-description">Ask questions about your authorised CRM data and visa workflows.</p>
      </div>
      <div className="surface-card flex h-[calc(100vh-15rem)] min-h-[420px] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">AI Digital Operations Assistant</h2>
            <p className="text-xs text-slate-500">Grounded in authorised CRM data & checklists</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" /> Operational
        </span>
      </div>

      {/* Message History */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-2xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3.5 rounded-xl text-sm bg-slate-100 text-slate-500 animate-pulse">
              Querying database and generating summary...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-2 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50/50">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setInput(p)}
            className="text-xs bg-white border border-slate-200 hover:border-brand-500 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-3 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about active cases, lead conversion, or visa procedures..."
          className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <span>Send</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
      </div>
    </div>
  );
};

