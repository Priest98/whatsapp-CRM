
import React, { useState, useRef, useEffect } from 'react';
import { Customer, Message, MessageDirection, MessageType, KnowledgeBaseItem, LeadStatus } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatWindowProps {
  customer: Customer | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
  knowledgeBase: KnowledgeBaseItem[];
  businessName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  customer, 
  messages, 
  onSendMessage, 
  onUpdateCustomer,
  knowledgeBase,
  businessName
}) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [analysisReasoning, setAnalysisReasoning] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Auto-summarize when messages change
    if (messages.length > 0 && !summary) {
      handleSummarize();
    }
  }, [messages, customer]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleAiReply = async () => {
    setIsGenerating(true);
    const reply = await geminiService.generateReply(messages, knowledgeBase, businessName);
    setInputText(reply);
    setIsGenerating(false);
  };

  const handleClassify = async () => {
    if (!customer) return;
    setIsGenerating(true);
    const result = await geminiService.classifyLead(messages);
    onUpdateCustomer(customer.id, { lead_status: result.status });
    setAnalysisReasoning(result.reasoning);
    setIsGenerating(false);
  };

  const handleSummarize = async () => {
    if (messages.length === 0) return;
    const res = await geminiService.summarizeConversation(messages);
    setSummary(res);
  };

  if (!customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <div className="p-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025 4.417 4.417 0 0 0-.115-1.562C4.302 15.861 3.25 14.053 3.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Your Sales Inbox</h2>
          <p className="text-sm">Select a conversation from the left to start qualifying leads and closing deals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 leading-none">{customer.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{customer.phone_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSummarize}
            className="text-xs bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Summarize
          </button>
          <button 
            onClick={handleClassify}
            disabled={isGenerating}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Score Lead
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.direction === MessageDirection.OUTGOING ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    m.direction === MessageDirection.OUTGOING 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <div className={`text-[10px] mt-1.5 ${m.direction === MessageDirection.OUTGOING ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   </div>
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">AI THINKING...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            {/* AI Suggest Toolbar */}
            <div className="max-w-4xl mx-auto mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAiReply}
                  disabled={isGenerating}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-all border border-emerald-100 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  {isGenerating ? 'Drafting Suggestion...' : 'Magic Suggest'}
                </button>
                {inputText && (
                  <button 
                    onClick={() => setInputText('')}
                    className="text-[10px] text-slate-400 hover:text-red-500 font-medium transition-colors"
                  >
                    Clear Draft
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Shift + Enter for new line</span>
            </div>

            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message or use Magic Suggest..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 resize-none max-h-32 transition-all"
                  rows={2}
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="w-72 border-l border-slate-100 flex flex-col p-6 space-y-8 overflow-y-auto">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Lead Classification</h4>
            <div className="flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                customer.lead_status === LeadStatus.HOT ? 'border-red-100 bg-red-50 text-red-600' :
                customer.lead_status === LeadStatus.WARM ? 'border-orange-100 bg-orange-50 text-orange-600' :
                customer.lead_status === LeadStatus.COLD ? 'border-blue-100 bg-blue-50 text-blue-600' :
                'border-slate-100 bg-slate-50 text-slate-400'
              }`}>
                <span className="text-2xl font-black">{customer.lead_status}</span>
                <span className="text-[10px] font-medium opacity-60">SCORE</span>
              </div>
              {analysisReasoning && (
                <p className="mt-4 text-[11px] text-slate-500 italic text-center">"{analysisReasoning}"</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">AI Summary</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed">
                {summary || "Analyzing conversation..."}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">CRM Details</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {customer.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                      #{tag}
                    </span>
                  ))}
                  <button className="px-2 py-0.5 border border-dashed border-slate-300 rounded text-[10px] text-slate-400 hover:border-emerald-300 hover:text-emerald-500">
                    + Add
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Internal Notes</label>
                <textarea 
                  value={customer.notes}
                  onChange={(e) => onUpdateCustomer(customer.id, { notes: e.target.value })}
                  className="w-full text-xs bg-transparent border-0 focus:ring-0 p-0 text-slate-600 placeholder:text-slate-300"
                  placeholder="Click to add private notes about this lead..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
