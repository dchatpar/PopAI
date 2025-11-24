import React from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Building2, 
  Users, 
  Settings, 
  PieChart, 
  LogOut,
  BrainCircuit
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">PropelliQ AI</h1>
          <p className="text-xs text-slate-500">v2.4.0 Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Platform</div>
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
        <NavItem to="/campaigns" icon={Megaphone} label="Campaigns" active={location.pathname === '/campaigns'} />
        <NavItem to="/properties" icon={Building2} label="Properties & DLD" active={location.pathname === '/properties'} />
        <NavItem to="/contacts" icon={Users} label="Contacts" active={location.pathname === '/contacts'} />
        
        <div className="mt-8 px-4 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Analytics</div>
        <NavItem to="/analytics" icon={PieChart} label="Performance" active={location.pathname === '/analytics'} />
        
        <div className="mt-8 px-4 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">System</div>
        <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors">
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};