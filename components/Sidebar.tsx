
import React from 'react';
import { Icons, COLORS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  businessName: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  businessName, 
  userName, 
  userRole, 
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.Chat /> },
    { id: 'customers', label: 'Customers', icon: <Icons.Users /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <Icons.Database /> },
    { id: 'automation', label: 'Automations', icon: <Icons.Automation /> },
    { id: 'settings', label: 'Settings', icon: <Icons.Settings /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
            W
          </div>
          <h1 className="text-xl font-bold text-slate-800">SalesAgent</h1>
        </div>
        <p className="text-xs text-slate-500 truncate">{businessName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className={activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="group relative">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{userRole}</p>
            </div>
          </button>
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
