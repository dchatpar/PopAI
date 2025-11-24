import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Upload, MapPin, BadgeCheck, ChevronDown, ChevronUp, Mail, MessageCircle, Phone, Database, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { Property, PropertyStatus, Activity } from '../types';
import { predictLeadScore } from '../services/geminiService';

// Mock Data
const MOCK_PROPERTIES: Property[] = [
  { id: '1', dldReference: 'DLD-230492', title: 'Luxury Villa, Palm Jumeirah', location: 'Frond N, Palm Jumeirah', price: 15000000, areaSqFt: 5000, status: PropertyStatus.ACTIVE, lastActionDate: '2023-10-25', leadScore: 88, predictedCloseProbability: 92, ownerName: 'Ahmed S.' },
  { id: '2', dldReference: 'DLD-110293', title: '1BR Apartment, Downtown', location: 'Burj Khalifa Area', price: 1800000, areaSqFt: 950, status: PropertyStatus.PENDING, lastActionDate: '2023-10-24', leadScore: 65, predictedCloseProbability: 45, ownerName: 'Sarah J.' },
  { id: '3', dldReference: 'DLD-993821', title: 'Studio, JVC', location: 'Jumeirah Village Circle', price: 650000, areaSqFt: 450, status: PropertyStatus.LEASED, lastActionDate: '2023-10-20', leadScore: 30, predictedCloseProbability: 15, ownerName: 'InvestCorp LLC' },
  { id: '4', dldReference: 'DLD-773829', title: '3BR Penthouse, Marina', location: 'Dubai Marina', price: 5500000, areaSqFt: 2200, status: PropertyStatus.ACTIVE, lastActionDate: '2023-10-26', leadScore: 95, predictedCloseProbability: 98, ownerName: 'Global Holdings' },
];

const MOCK_TIMELINE: Activity[] = [
  { id: 'a1', type: 'system', title: 'Inspection Booked', description: 'Owner scheduled inspection via Calendly link.', timestamp: 'Today, 10:30 AM', status: 'completed' },
  { id: 'a2', type: 'whatsapp', title: 'Auto-Follow Up', description: 'Template: "Did you see our email?"', timestamp: 'Yesterday, 2:00 PM', status: 'completed', mechanism: 'Rule: No email reply > 24h' },
  { id: 'a3', type: 'email', title: 'Inspection Request Sent', description: 'Template: "Inspection Due Notice"', timestamp: 'Oct 24, 09:00 AM', status: 'completed', mechanism: 'Trigger: DLD Inspection Date' },
  { id: 'a4', type: 'ai', title: 'Lead Scored: HOT', description: 'Score increased from 45 to 88 based on asset value.', timestamp: 'Oct 24, 08:55 AM', status: 'completed' },
  { id: 'a5', type: 'dld', title: 'DLD Data Synced', description: 'New owner info and expiry dates updated.', timestamp: 'Oct 24, 08:00 AM', status: 'completed' },
];

export const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [loadingScore, setLoadingScore] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleAIScore = async (propertyId: string) => {
    setLoadingScore(propertyId);
    // Simulate API call
    const prop = properties.find(p => p.id === propertyId);
    if (prop) {
      const prediction = await predictLeadScore({ 
        title: prop.title, 
        price: prop.price, 
        location: prop.location,
        lastInteraction: '2 days ago - Email Clicked'
      });
      
      setProperties(prev => prev.map(p => {
        if (p.id === propertyId) {
          return { ...p, leadScore: prediction.score };
        }
        return p;
      }));
    }
    setLoadingScore(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Property & DLD Data Hub</h2>
          <p className="text-slate-500 text-sm mt-1">Manage leads and view detailed engagement journeys.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Upload size={16} /> Import CSV
          </button>
          <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 shadow-md shadow-brand-500/20 flex items-center gap-2">
            <RefreshCw size={16} /> Sync DLD
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by DLD Ref, Owner, or Location..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> Status
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
            <BadgeCheck size={16} /> Lead Score
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="w-10 px-6 py-4"></th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Property</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">AI Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Owner</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((p) => (
              <React.Fragment key={p.id}>
                <tr className={`hover:bg-slate-50 transition-colors group cursor-pointer ${expandedRow === p.id ? 'bg-slate-50' : ''}`} onClick={() => toggleRow(p.id)}>
                  <td className="px-6 py-4 text-slate-400">
                    {expandedRow === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{p.title}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {p.location}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{p.dldReference}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      p.status === PropertyStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-200' :
                      p.status === PropertyStatus.SOLD ? 'bg-slate-100 text-slate-600 border-slate-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[80px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            p.leadScore > 80 ? 'bg-green-500' : p.leadScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${p.leadScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{p.leadScore}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAIScore(p.id); }}
                      className="text-[10px] text-brand-600 hover:underline mt-1 disabled:opacity-50"
                      disabled={loadingScore === p.id}
                    >
                      {loadingScore === p.id ? 'Analyzing...' : 'Refresh Score'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {p.ownerName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-brand-600 font-medium bg-brand-50 px-3 py-1.5 rounded-md border border-brand-100 w-fit">
                        <Phone size={12} /> Call Scheduled: Tomorrow
                    </div>
                  </td>
                </tr>
                {/* Expanded Journey View */}
                {expandedRow === p.id && (
                  <tr>
                    <td colSpan={6} className="px-0 py-0">
                      <div className="bg-slate-50 border-y border-slate-200 p-8 flex gap-8 animate-fade-in">
                        {/* Timeline Column */}
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <BrainCircuit size={20} className="text-brand-600"/> Engagement Journey
                          </h3>
                          <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                            {MOCK_TIMELINE.map((activity, idx) => (
                              <div key={activity.id} className="relative pl-6">
                                <div className={`absolute -left-[23px] top-0 w-8 h-8 rounded-full border-4 border-slate-50 flex items-center justify-center ${
                                  activity.type === 'ai' ? 'bg-purple-100 text-purple-600' :
                                  activity.type === 'dld' ? 'bg-slate-200 text-slate-600' :
                                  activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                                  activity.type === 'whatsapp' ? 'bg-green-100 text-green-600' :
                                  'bg-brand-100 text-brand-600'
                                }`}>
                                   {activity.type === 'ai' && <BrainCircuit size={14} />}
                                   {activity.type === 'dld' && <Database size={14} />}
                                   {activity.type === 'email' && <Mail size={14} />}
                                   {activity.type === 'whatsapp' && <MessageCircle size={14} />}
                                   {activity.type === 'system' && <CheckCircle2 size={14} />}
                                </div>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{activity.title}</h4>
                                    <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                                    {activity.mechanism && (
                                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide bg-white border border-slate-200 px-1.5 py-0.5 rounded w-fit">
                                        {activity.mechanism}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-400 font-mono">{activity.timestamp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary / Metadata Column */}
                        <div className="w-1/3 space-y-6">
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="font-bold text-slate-900 text-sm mb-4">Lead Intelligence</h4>
                             <div className="space-y-4">
                                <div>
                                   <label className="text-xs text-slate-500 uppercase font-semibold">Predicted Value</label>
                                   <p className="text-lg font-bold text-slate-900">AED 15,250,000</p>
                                </div>
                                <div>
                                   <label className="text-xs text-slate-500 uppercase font-semibold">Churn Risk</label>
                                   <div className="flex items-center gap-2 mt-1">
                                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 w-[15%] h-full"></div>
                                      </div>
                                      <span className="text-xs font-bold text-slate-700">Low</span>
                                   </div>
                                </div>
                                <div>
                                   <label className="text-xs text-slate-500 uppercase font-semibold">Preferred Channel</label>
                                   <div className="flex items-center gap-2 mt-1">
                                      <MessageCircle size={14} className="text-green-600" />
                                      <span className="text-sm font-medium text-slate-900">WhatsApp (80% response)</span>
                                   </div>
                                </div>
                             </div>
                             <button className="w-full mt-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 shadow-md">
                               Override & Contact Manually
                             </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};