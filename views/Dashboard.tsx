import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { MessageSquare, Users, Building, Zap, Activity, Filter, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';

const chartData = [
  { name: 'Mon', email: 4000, whatsapp: 2400, sms: 2400 },
  { name: 'Tue', email: 3000, whatsapp: 1398, sms: 2210 },
  { name: 'Wed', email: 2000, whatsapp: 9800, sms: 2290 },
  { name: 'Thu', email: 2780, whatsapp: 3908, sms: 2000 },
  { name: 'Fri', email: 1890, whatsapp: 4800, sms: 2181 },
  { name: 'Sat', email: 2390, whatsapp: 3800, sms: 2500 },
  { name: 'Sun', email: 3490, whatsapp: 4300, sms: 2100 },
];

const funnelData = [
  { name: 'DLD Leads Ingested', value: 5000 },
  { name: 'AI Qualified (Hot/Warm)', value: 3200 },
  { name: 'Auto-Outreach Sent', value: 2800 },
  { name: 'Engaged (Replied/Clicked)', value: 1200 },
  { name: 'Inspections Booked', value: 450 },
];

const FUNNEL_COLORS = ['#94a3b8', '#64748b', '#38bdf8', '#0ea5e9', '#0284c7'];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time pulse of your automated outreach ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 shadow-md shadow-brand-500/20">
            + New Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Outreach" 
          value="12,543" 
          trend="+12.5%" 
          trendUp={true} 
          icon={MessageSquare} 
        />
        <StatCard 
          title="Response Rate" 
          value="24.8%" 
          trend="+4.2%" 
          trendUp={true} 
          icon={Activity} 
        />
        <StatCard 
          title="Pending Inspections" 
          value="142" 
          trend="+8.5%" 
          trendUp={true} 
          icon={Building} 
        />
        <StatCard 
          title="AI Leads Qualified" 
          value="342" 
          trend="+18.2%" 
          trendUp={true} 
          icon={Zap} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Multi-Channel Performance</h3>
            <select className="text-sm border-none bg-slate-50 rounded-md px-2 py-1 text-slate-600">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="whatsapp" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorWhatsapp)" strokeWidth={3} />
                <Area type="monotone" dataKey="email" stroke="#94a3b8" fillOpacity={0.1} fill="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Funnel Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Lead Engagement Pipeline</h3>
          <p className="text-xs text-slate-500 mb-6">From DLD Ingestion to Inspection Booking</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" barSize={30}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} interval={0} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live AI Pulse Feed */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-white">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-brand-400" />
            <h3 className="font-semibold text-sm tracking-wide">Live AI Pulse: Automations in Action</h3>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-xs text-slate-400">System Active</span>
          </div>
        </div>
        <div className="p-0">
          {[
            { time: 'Just now', type: 'Trigger', msg: 'DLD Transaction #99238 detected.', detail: 'High-value transfer in Palm Jumeirah.', icon: Building, color: 'text-indigo-400' },
            { time: '1 min ago', type: 'Decision', msg: 'AI Scored Lead: Hot (92/100).', detail: 'Matching logic: Previous investor + High Liquidity Area.', icon: Zap, color: 'text-yellow-400' },
            { time: '2 mins ago', type: 'Action', msg: 'Campaign Step Executed.', detail: 'Sent "Property Inspection Request" via WhatsApp to Owner.', icon: MessageSquare, color: 'text-brand-400' },
            { time: '15 mins ago', type: 'Inbound', msg: 'Response Received.', detail: 'Owner clicked "Schedule Call" link in Email Campaign.', icon: ArrowRight, color: 'text-green-400' },
          ].map((item, i) => (
            <div key={i} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors flex items-start gap-4">
              <div className={`mt-1 p-2 rounded-lg bg-slate-800 ${item.color}`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between">
                    <p className="text-sm font-medium text-slate-200">{item.msg}</p>
                    <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                 </div>
                 <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                 <div className="mt-2 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 uppercase tracking-wider">{item.type}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-slate-800/30 text-center">
          <button className="text-xs text-slate-400 hover:text-white transition-colors">View System Logs &rarr;</button>
        </div>
      </div>
    </div>
  );
};