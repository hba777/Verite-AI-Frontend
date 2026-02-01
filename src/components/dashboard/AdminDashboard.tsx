
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Video, 
  AlertCircle, 
  Zap, 
  TrendingUp, 
  Search, 
  Filter, 
  Download,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AdminStats } from '@/types';
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [report, setReport] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    // Simulated initial data load
    const mockData: AdminStats = {
      totalUploads: 14202,
      anomaliesFound: 842,
      activeUsers: 124,
      systemHealth: 98,
      recentUploads: [
        { id: 'TX-904', user: 'Investigator_Alpha', filename: 'deepfake_test_01.mp4', timestamp: '2 mins ago', status: 'Malicious', size: '124 MB' },
        { id: 'TX-903', user: 'Sentinel_Bot', filename: 'cctv_feed_104.avi', timestamp: '14 mins ago', status: 'Clean', size: '890 MB' },
        { id: 'TX-902', user: 'Analyst_J', filename: 'interview_raw.mov', timestamp: '1 hour ago', status: 'Suspicious', size: '2.4 GB' },
        { id: 'TX-901', user: 'Investigator_Beta', filename: 'social_media_clip.mp4', timestamp: '3 hours ago', status: 'Clean', size: '12 MB' },
        { id: 'TX-900', user: 'Root', filename: 'training_data_batch.zip', timestamp: '5 hours ago', status: 'Clean', size: '14.2 GB' },
      ],
      trends: [
        { date: 'Mon', uploads: 400, anomalies: 24 },
        { date: 'Tue', uploads: 300, anomalies: 18 },
        { date: 'Wed', uploads: 600, anomalies: 45 },
        { date: 'Thu', uploads: 800, anomalies: 72 },
        { date: 'Fri', uploads: 500, anomalies: 30 },
        { date: 'Sat', uploads: 900, anomalies: 112 },
        { date: 'Sun', uploads: 700, anomalies: 65 },
      ]
    };
    setStats(mockData);
    generateAdminReport(mockData);
  }, []);

  const generateAdminReport = async (data: AdminStats) => {
    setLoadingReport(true);
    try {
      if (!ai) {
        // Placeholder when no API key is available
        setReport("System analysis pending API configuration. All forensic cycles operating within normal parameters. Anomaly detection algorithms remain active at 99.2% confidence.");
        return;
      }
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a System Admin for a Forensic AI. Analyze these stats: Total Uploads ${data.totalUploads}, Anomalies: ${data.anomaliesFound}, Growth in Sat/Sun. Write a 3 sentence professional "Daily Security Briefing". Keep it technical and concise.`
      });
      setReport(response.text || "Report generation failed.");
    } catch (e) {
      setReport("Security Briefing unavailable. System logs indicated API connection issues.");
    } finally {
      setLoadingReport(false);
    }
  };

  if (!stats) return <div className="p-20 text-center animate-pulse font-mono text-electric-teal">INITIALIZING SYSTEM DATA...</div>;

  return (
    <div className="flex-1 bg-black p-6 lg:p-10 space-y-10 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-high mb-2">Command Center</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-neural-green text-xs font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-neural-green animate-pulse"></span>
              System Operational
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="text-text-med text-xs font-mono uppercase">Last Sync: Today 08:42:10</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center justify-center rounded-full py-3 px-8 font-normal text-white sm:w-auto"
            style={{
              backgroundImage:
                "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "2px solid transparent",
              transition:
                "background-color 0.3s ease, background-image 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(#222323, #222323), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
          >
            <Download className="w-4 h-4 mr-2" />
            Export Audit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Forensic Cycles', val: stats.totalUploads, change: '+12.4%', icon: Video, color: 'text-electric-teal' },
          { label: 'Anomalies Neutralized', val: stats.anomaliesFound, change: '+5.2%', icon: ShieldAlert, color: 'text-hyper-red' },
          { label: 'Active Investigators', val: stats.activeUsers, change: '+2', icon: Users, color: 'text-neural-green' },
          { label: 'System Integrity', val: `${stats.systemHealth}%`, change: 'Stable', icon: Cpu, color: 'text-text-high' },
        ].map((card, idx) => (
          <div key={idx} className="bg-surface border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon className={`w-12 h-12 ${card.color}`} />
            </div>
            <p className="text-[10px] font-mono text-text-med uppercase tracking-widest mb-2">{card.label}</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl font-display font-bold text-text-high">{card.val}</h3>
              <span className={`text-[10px] font-mono ${card.change.includes('+') ? 'text-neural-green' : 'text-text-med'}`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-surface border border-white/5 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <TrendingUp className="text-electric-teal w-5 h-5" />
                <h3 className="font-display font-semibold text-text-high">Investigation Volume Trends</h3>
             </div>
             <div className="flex bg-deep-void p-1 rounded-lg border border-white/5">
                {['24H', '7D', '30D'].map(t => (
                  <button key={t} className={`px-3 py-1 rounded-md text-[10px] font-mono ${t === '7D' ? 'bg-white/10 text-white' : 'text-text-med hover:text-white'}`}>{t}</button>
                ))}
             </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trends}>
                <defs>
                  <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121416', borderColor: '#333', borderRadius: '12px' }} 
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="uploads" stroke="#93C5FD" fillOpacity={1} fill="url(#colorUploads)" strokeWidth={3} />
                <Area type="monotone" dataKey="anomalies" stroke="#FF2D55" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Briefing Side Card */}
        <div className="bg-surface border border-white/5 rounded-2xl p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-teal via-neural-green to-hyper-red"></div>
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-neural-green w-5 h-5" />
            <h3 className="font-display font-semibold text-text-high">AI Security Briefing</h3>
          </div>
          <div className="flex-1 bg-deep-void/50 border border-white/5 rounded-xl p-6 relative">
            <div className="absolute top-2 right-2 flex gap-1">
               <span className="w-1 h-1 rounded-full bg-electric-teal"></span>
               <span className="w-1 h-1 rounded-full bg-electric-teal opacity-50"></span>
            </div>
            {loadingReport ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-2 bg-white/5 rounded w-full"></div>
                <div className="h-2 bg-white/5 rounded w-5/6"></div>
                <div className="h-2 bg-white/5 rounded w-full"></div>
                <div className="h-2 bg-white/5 rounded w-4/6"></div>
              </div>
            ) : (
              <p className="text-sm text-text-med leading-relaxed italic font-sans">
                "{report}"
              </p>
            )}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-med uppercase">Trust Score: 99.2%</span>
              <span className="text-[10px] font-mono text-electric-teal">GEN-3 ENGINE</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => stats && generateAdminReport(stats)} 
              className="text-[10px] font-mono text-text-med hover:text-electric-teal transition-colors"
            >
              REFRESH ANALYSIS
            </button>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="font-display font-semibold text-text-high">Master Audit Ledger</h3>
           <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-med" />
                <input 
                  type="text" 
                  placeholder="Filter records..." 
                  className="bg-deep-void border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-text-high focus:outline-none focus:border-electric-teal w-64"
                />
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 text-text-med">
                <Filter className="w-4 h-4" />
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-[10px] font-mono text-text-med uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-4 font-semibold">Asset ID</th>
                <th className="px-8 py-4 font-semibold">Investigator</th>
                <th className="px-8 py-4 font-semibold">Filename</th>
                <th className="px-8 py-4 font-semibold">Timestamp</th>
                <th className="px-8 py-4 font-semibold">Status</th>
                <th className="px-8 py-4 font-semibold">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentUploads.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5 text-xs font-mono text-electric-teal">{row.id}</td>
                  <td className="px-8 py-5 text-xs text-text-high">{row.user}</td>
                  <td className="px-8 py-5 text-xs text-text-med truncate max-w-[200px]">{row.filename}</td>
                  <td className="px-8 py-5 text-xs text-text-med">{row.timestamp}</td>
                  <td className="px-8 py-5">
                    <span className={`
                      px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter
                      ${row.status === 'Malicious' ? 'bg-hyper-red/10 text-hyper-red border border-hyper-red/20' : 
                        row.status === 'Suspicious' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        'bg-neural-green/10 text-neural-green border border-neural-green/20'}
                    `}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-text-med font-mono">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-text-med">
           <span>SHOWING 5 OF 1,402 RECORDS</span>
           <div className="flex gap-4">
              <button className="hover:text-white transition-colors">PREVIOUS</button>
              <button className="text-white">1</button>
              <button className="hover:text-white transition-colors">2</button>
              <button className="hover:text-white transition-colors">NEXT</button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;