
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import LandingPage from './components/LandingPage';
import { apiService } from './services/apiService';
import { 
  Customer, Message, KnowledgeBaseItem, LeadStatus, 
  MessageDirection, MessageType, User 
} from './types';

// Mock Initial Data
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    business_id: 'b1',
    name: 'Alice Johnson',
    phone_number: '+1 555-0102',
    tags: ['interest_in_premium', 'returning'],
    lead_status: LeadStatus.WARM,
    notes: 'Inquired about annual billing discounts last week.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    business_id: 'b1',
    name: 'Bob Smith',
    phone_number: '+1 555-0103',
    tags: ['cold_outreach'],
    lead_status: LeadStatus.COLD,
    notes: 'Not interested right now, follow up in 6 months.',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    last_message_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '3',
    business_id: 'b1',
    name: 'Charlie Davis',
    phone_number: '+1 555-0104',
    tags: ['urgent', 'high_budget'],
    lead_status: LeadStatus.HOT,
    notes: 'Ready to sign contract as soon as pricing is confirmed.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    last_message_at: new Date().toISOString(),
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    business_id: 'b1',
    customer_id: '1',
    direction: MessageDirection.INCOMING,
    content: 'Hi, I saw your premium plan. Does it include multiple user accounts?',
    message_type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'm2',
    business_id: 'b1',
    customer_id: '1',
    direction: MessageDirection.OUTGOING,
    content: 'Hello Alice! Yes, the Premium plan includes up to 5 staff accounts.',
    message_type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 'm3',
    business_id: 'b1',
    customer_id: '3',
    direction: MessageDirection.INCOMING,
    content: "I'm ready to move forward. Can you send me the final quote for the enterprise package?",
    message_type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

const INITIAL_KB: KnowledgeBaseItem[] = [
  {
    id: 'k1',
    business_id: 'b1',
    title: 'Premium Plan Details',
    content: 'Our Premium plan costs $49/mo and includes unlimited customers, 5 staff accounts, and priority support.',
    category: 'PRICING',
    created_at: new Date().toISOString()
  },
  {
    id: 'k2',
    business_id: 'b1',
    title: 'Refund Policy',
    content: 'We offer a full 14-day money back guarantee if you are not satisfied with the product.',
    category: 'POLICY',
    created_at: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [knowledgeBase] = useState<KnowledgeBaseItem[]>(INITIAL_KB);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const businessName = "Tesla Motors (Mock)";

  useEffect(() => {
    // Check for saved session
    const savedToken = localStorage.getItem('sa_token');
    if (savedToken) {
      apiService.verifyToken(savedToken)
        .then(setUser)
        .catch(() => localStorage.removeItem('sa_token'))
        .finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, []);

  const handleLogin = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem('sa_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCustomerId(null);
    localStorage.removeItem('sa_token');
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl mb-4"></div>
          <div className="h-2 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;
  const filteredMessages = messages.filter(m => m.customer_id === selectedCustomerId);

  const handleSendMessage = (content: string) => {
    if (!selectedCustomerId) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      business_id: 'b1',
      customer_id: selectedCustomerId,
      direction: MessageDirection.OUTGOING,
      content,
      message_type: MessageType.TEXT,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    
    // Update last message timestamp for customer
    setCustomers(customers.map(c => 
      c.id === selectedCustomerId ? { ...c, last_message_at: newMessage.timestamp } : c
    ));
  };

  const handleUpdateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        businessName={businessName} 
        onLogout={handleLogout}
        userName={user.name}
        userRole={user.role}
      />

      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'dashboard' ? (
          <>
            {/* Conversation List */}
            <div className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
                <div className="mt-4 relative">
                  <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full bg-slate-50 border-0 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {customers
                  .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
                  .map(customer => {
                    const lastMsg = messages
                      .filter(m => m.customer_id === customer.id)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                    return (
                      <button
                        key={customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={`w-full text-left p-4 flex gap-3 transition-colors hover:bg-slate-50 border-b border-slate-50 ${
                          selectedCustomerId === customer.id ? 'bg-emerald-50/50 border-emerald-100' : ''
                        }`}
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className="font-semibold text-slate-800 text-sm truncate">{customer.name}</h4>
                            <span className="text-[10px] text-slate-400">
                              {new Date(customer.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mb-2">
                            {lastMsg ? lastMsg.content : 'No messages yet'}
                          </p>
                          <div className="flex gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                              customer.lead_status === LeadStatus.HOT ? 'bg-red-50 text-red-600 border-red-100' :
                              customer.lead_status === LeadStatus.WARM ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              customer.lead_status === LeadStatus.COLD ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                              {customer.lead_status}
                            </span>
                            {customer.tags.slice(0, 1).map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 text-slate-500 truncate max-w-[60px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })
                }
              </div>
            </div>

            {/* Main Chat Interface */}
            <ChatWindow 
              customer={selectedCustomer}
              messages={filteredMessages}
              onSendMessage={handleSendMessage}
              onUpdateCustomer={handleUpdateCustomer}
              knowledgeBase={knowledgeBase}
              businessName={businessName}
            />
          </>
        ) : (
          <div className="flex-1 bg-white p-10 overflow-y-auto">
             <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                <p className="text-slate-500 mb-8">Management console for your AI Sales Agent parameters.</p>
                
                {activeTab === 'knowledge' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-slate-800">Knowledge Articles</h3>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                        Add Article
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {knowledgeBase.map(kb => (
                        <div key={kb.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-1 bg-white border border-slate-100 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                              {kb.category}
                            </span>
                            <h4 className="font-bold text-slate-800 mb-1">{kb.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{kb.content}</p>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                             </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'automation' && (
                  <div className="space-y-6">
                    <div className="p-6 border border-emerald-100 rounded-3xl bg-emerald-50/20">
                      <div className="flex justify-between items-center mb-4">
                         <div>
                            <h3 className="text-lg font-semibold text-emerald-900">AI Auto-Reply</h3>
                            <p className="text-sm text-emerald-700/60">Allow Gemini to respond instantly to new inquiries using the Knowledge Base.</p>
                         </div>
                         <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none bg-emerald-600">
                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-slate-100 rounded-3xl">
                        <h4 className="font-bold text-slate-800 mb-1">Drip Follow-up</h4>
                        <p className="text-sm text-slate-500 mb-4">Send a message after 24h of inactivity.</p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">ENABLED</span>
                          <button className="text-xs text-emerald-600 font-bold hover:underline">Edit Sequence</button>
                        </div>
                      </div>
                      <div className="p-6 border border-slate-100 rounded-3xl opacity-50 grayscale cursor-not-allowed">
                        <h4 className="font-bold text-slate-800 mb-1">Keyword Trigger</h4>
                        <p className="text-sm text-slate-500 mb-4">Trigger actions based on specific words (e.g. "Price").</p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">DISABLED</span>
                          <button className="text-xs text-slate-600 font-bold">Upgrade to Pro</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                   <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Business Information</h3>
                          <div className="space-y-3">
                             <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">Company Name</label>
                                <input type="text" defaultValue="Tesla Motors" className="w-full bg-slate-50 border-0 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">WhatsApp Phone Number</label>
                                <input type="text" defaultValue="+1 555-0000" className="w-full bg-slate-50 border-0 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">API Configuration</h3>
                          <div className="space-y-3">
                             <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">WhatsApp Cloud API Key</label>
                                <input type="password" value="••••••••••••••••••••" readOnly className="w-full bg-slate-50 border-0 rounded-xl py-2 px-4 text-sm" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">Gemini Thinking Budget</label>
                                <input type="number" defaultValue="2000" className="w-full bg-slate-50 border-0 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                             </div>
                          </div>
                       </div>
                     </div>
                     <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button className="bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-all shadow-lg active:scale-95">
                          Save Settings
                        </button>
                     </div>
                   </div>
                )}

                {activeTab === 'customers' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {customers.map(c => (
                          <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                  {c.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-slate-800 text-sm">{c.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-slate-500 font-mono">{c.phone_number}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                c.lead_status === LeadStatus.HOT ? 'bg-red-50 text-red-600' :
                                c.lead_status === LeadStatus.WARM ? 'bg-orange-50 text-orange-600' :
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {c.lead_status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => { setSelectedCustomerId(c.id); setActiveTab('dashboard'); }}
                                className="text-emerald-600 text-xs font-bold hover:underline"
                              >
                                View Chat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
