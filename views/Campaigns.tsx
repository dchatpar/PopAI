import React, { useState } from 'react';
import { Plus, Play, Pause, MoreVertical, MessageCircle, Mail, Clock, MousePointer, Sparkles, LayoutTemplate, Edit3, Save, Eye, ArrowRight } from 'lucide-react';
import { Campaign, CampaignStep, Channel, Template } from '../types';
import { generateOutreachMessage, optimizeTemplateText } from '../services/geminiService';

// Mock Templates
const MOCK_TEMPLATES: Template[] = [
  { 
    id: 't1', 
    name: 'Property Inspection Request', 
    channel: Channel.EMAIL, 
    category: 'Inspection',
    subject: 'Urgent: Inspection Required for {{property_title}}',
    content: "Dear {{owner_name}},\n\nWe noticed your property at {{location}} has an inspection due on {{inspection_date}}. As per DLD regulations, ensuring compliance is key to maintaining asset value.\n\nWe offer a complimentary pre-inspection assessment. Would you be available this week?\n\nBest,\nPropelliQ Team",
    variables: ['owner_name', 'location', 'inspection_date', 'property_title'],
    lastModified: '2023-10-25'
  },
  { 
    id: 't2', 
    name: 'Lease Renewal WhatsApp', 
    channel: Channel.WHATSAPP, 
    category: 'Renewal',
    content: "Hi {{owner_name}} 👋, your lease for {{property_title}} expires in 60 days. Market rates in {{location}} have risen by 12%. Let's discuss your renewal strategy? - Agent Smith",
    variables: ['owner_name', 'property_title', 'location'],
    lastModified: '2023-10-20'
  }
];

export const Campaigns: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'builder'>('campaigns');
  
  // Template State
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Workflow State
  const [steps, setSteps] = useState<CampaignStep[]>([
    { id: '1', type: 'trigger', label: 'DLD Trigger: Inspection Due < 30 Days', stats: { processed: 1240, converted: 1240 } },
    { id: '2', type: 'action', label: 'Send Email: Inspection Request', channel: Channel.EMAIL, stats: { processed: 1240, converted: 840 } },
    { id: '3', type: 'delay', label: 'Wait 24 Hours', stats: { processed: 840, converted: 840 } },
    { id: '4', type: 'condition', label: 'If: No Response', stats: { processed: 840, converted: 400 } },
    { id: '5', type: 'action', label: 'Send WhatsApp Follow-up', channel: Channel.WHATSAPP, stats: { processed: 400, converted: 150 } },
  ]);

  const handleOptimizeTemplate = async () => {
    if (!editingTemplate || !aiInstruction) return;
    setIsAiLoading(true);
    const newContent = await optimizeTemplateText(editingTemplate.content, aiInstruction);
    setEditingTemplate({ ...editingTemplate, content: newContent });
    setIsAiLoading(false);
    setAiInstruction('');
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-900">Message Templates</h2>
           <p className="text-slate-500 text-sm">Manage NLG templates for your automated flows.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 shadow-md flex items-center gap-2">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.channel === Channel.EMAIL ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {t.channel === Channel.EMAIL ? <Mail size={20} /> : <MessageCircle size={20} />}
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded tracking-wider">{t.category}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{t.name}</h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2 font-mono bg-slate-50 p-2 rounded border border-slate-100">
              {t.content}
            </p>
            <div className="flex items-center gap-2 mb-4">
              {t.variables.map(v => (
                <span key={v} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
            <button 
              onClick={() => { setEditingTemplate(t); setActiveTab('templates'); }}
              className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 size={14} /> Edit Template
            </button>
          </div>
        ))}
      </div>

      {editingTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex overflow-hidden">
            {/* Editor Side */}
            <div className="w-1/2 p-8 border-r border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">Edit Template</h3>
                <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-600">Close</button>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Template Name</label>
                  <input type="text" value={editingTemplate.name} className="w-full p-2 border border-slate-300 rounded-lg text-sm" readOnly />
                </div>
                {editingTemplate.channel === Channel.EMAIL && (
                   <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject Line</label>
                    <input type="text" value={editingTemplate.subject} className="w-full p-2 border border-slate-300 rounded-lg text-sm" readOnly />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Content Body</label>
                  <textarea 
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})} 
                    className="w-full h-64 p-4 border border-slate-300 rounded-lg text-sm font-mono leading-relaxed resize-none focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* AI Tools */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-600 mb-2">
                   <Sparkles size={16} /> AI Optimization
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Make it more professional, shorter, or more urgent..."
                    className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                    value={aiInstruction}
                    onChange={(e) => setAiInstruction(e.target.value)}
                  />
                  <button 
                    onClick={handleOptimizeTemplate}
                    disabled={isAiLoading}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {isAiLoading ? 'Refining...' : 'Refine'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Side */}
            <div className="w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center">
               <div className="mb-4 flex items-center gap-2 text-slate-500">
                 <Eye size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Live Preview</span>
               </div>
               {editingTemplate.channel === Channel.WHATSAPP ? (
                 <div className="w-[300px] bg-[#e5ddd5] rounded-lg shadow-xl overflow-hidden border border-slate-300">
                    <div className="bg-[#075e54] h-12 flex items-center px-4">
                      <div className="w-8 h-8 rounded-full bg-white/20"></div>
                      <div className="ml-3">
                        <div className="h-2 w-20 bg-white/40 rounded mb-1"></div>
                        <div className="h-1.5 w-12 bg-white/20 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 min-h-[300px] flex flex-col">
                       <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-800 self-start max-w-[90%]">
                         {editingTemplate.content}
                         <div className="text-[10px] text-slate-400 text-right mt-1">10:42 AM</div>
                       </div>
                    </div>
                 </div>
               ) : (
                  <div className="w-full max-w-sm bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
                     <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                     </div>
                     <div className="p-6">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                           <div className="text-xs text-slate-500 mb-1">Subject:</div>
                           <div className="font-bold text-slate-800 text-sm">{editingTemplate.subject}</div>
                        </div>
                        <div className="text-sm text-slate-600 whitespace-pre-wrap">
                           {editingTemplate.content}
                        </div>
                     </div>
                  </div>
               )}
               <button onClick={() => { /* Save Logic */ setEditingTemplate(null); }} className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
                 <Save size={16} /> Save Changes
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Campaign Manager</h2>
            <div className="flex bg-slate-200 p-1 rounded-lg">
               <button 
                onClick={() => setActiveTab('campaigns')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'campaigns' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Campaigns
               </button>
               <button 
                onClick={() => setActiveTab('templates')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'templates' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Templates
               </button>
               <button 
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'builder' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Workflow Builder
               </button>
            </div>
          </div>
        </div>

        {activeTab === 'templates' && renderTemplatesTab()}

        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             {/* Simple List View as before but cleaner */}
             <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Campaign Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Trigger</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Engagement</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => setActiveTab('builder')}>
                  <td className="px-6 py-4 font-medium text-brand-600">Inspection Reminder - Marina</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">Inspection Due {'<'} 30 Days</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                       <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-green-500"></div></div>
                       <span className="text-xs font-bold">68%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Edit3 size={16} className="text-slate-400 hover:text-brand-600"/></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden animate-fade-in">
            {/* Workflow Canvas */}
            <div className="col-span-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 overflow-y-auto relative min-h-[500px]">
              <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="max-w-xl mx-auto space-y-0 relative z-10">
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-300 -z-10"></div>
                {steps.map((step, index) => (
                  <div key={step.id} className="group relative pl-20 pb-8 last:pb-0">
                    {/* Visual Connector Line */}
                    <div className="absolute left-[30px] top-6 -translate-x-1/2 flex flex-col items-center justify-center bg-white z-10 py-2">
                        {index > 0 && <ArrowRight className="text-slate-300 rotate-90" size={16} />}
                    </div>

                    <div className={`p-4 rounded-xl shadow-sm border transition-all cursor-pointer relative overflow-hidden ${
                      step.type === 'trigger' ? 'bg-indigo-50 border-indigo-200' :
                      step.type === 'action' ? 'bg-white border-slate-200 hover:border-brand-400 hover:shadow-md' :
                      'bg-slate-100 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          step.type === 'trigger' ? 'bg-indigo-100 text-indigo-600' :
                          step.type === 'action' ? 'bg-brand-50 text-brand-600' :
                          'bg-slate-200 text-slate-500'
                        }`}>
                           {step.channel === Channel.WHATSAPP && <MessageCircle size={20} />}
                           {step.channel === Channel.EMAIL && <Mail size={20} />}
                           {step.type === 'delay' && <Clock size={20} />}
                           {step.type === 'trigger' && <MousePointer size={20} />}
                           {step.type === 'condition' && <span className="text-sm font-bold">?</span>}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{step.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{step.type}</span>
                             {step.channel && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{step.channel}</span>}
                          </div>
                        </div>
                        
                        {/* Stats Badge */}
                        {step.stats && (
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-700">{step.stats.processed}</span>
                            <span className="text-[10px] text-slate-400">Hits</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Detailed metrics on hover (simulated) */}
                      {step.stats && step.type === 'action' && (
                         <div className="mt-3 pt-3 border-t border-slate-100 flex gap-4">
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase">Delivered</p>
                               <p className="text-xs font-bold text-slate-700">98%</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase">Opened</p>
                               <p className="text-xs font-bold text-slate-700">64%</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase">Clicked</p>
                               <p className="text-xs font-bold text-brand-600">12%</p>
                            </div>
                         </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button className="ml-20 w-[calc(100%-5rem)] py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50 transition-all flex items-center justify-center gap-2 mt-4">
                  <Plus size={18} /> Add Workflow Step
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};