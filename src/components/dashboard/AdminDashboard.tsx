import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Search, ShieldAlert } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AdminStats } from "../../types";
import { getAdminStats } from "../../services/adminDashboardapi";
import { useUser } from "../../context/UserContext";

const AdminDashboard: React.FC = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mockData: AdminStats = {
      totalUploads: 14202,
      anomaliesFound: 842,
      activeUsers: 124,
      systemHealth: 98,
      recentUploads: [
        {
          id: "TX-904",
          user: "Investigator_Alpha",
          filename: "deepfake_test_01.mp4",
          timestamp: "2 mins ago",
          status: "Malicious",
          size: "124 MB",
        },
        {
          id: "TX-903",
          user: "Sentinel_Bot",
          filename: "cctv_feed_104.avi",
          timestamp: "14 mins ago",
          status: "Clean",
          size: "890 MB",
        },
        {
          id: "TX-902",
          user: "Analyst_J",
          filename: "interview_raw.mov",
          timestamp: "1 hour ago",
          status: "Clean",
          size: "2.4 GB",
        },
        {
          id: "TX-901",
          user: "Investigator_Beta",
          filename: "social_media_clip.mp4",
          timestamp: "3 hours ago",
          status: "Clean",
          size: "12 MB",
        },
        {
          id: "TX-900",
          user: "Root",
          filename: "training_data_batch.zip",
          timestamp: "5 hours ago",
          status: "Clean",
          size: "14.2 GB",
        },
      ],
      trends: [
        { date: "Mon", uploads: 400, anomalies: 24 },
        { date: "Tue", uploads: 300, anomalies: 18 },
        { date: "Wed", uploads: 600, anomalies: 45 },
        { date: "Thu", uploads: 800, anomalies: 72 },
        { date: "Fri", uploads: 500, anomalies: 30 },
        { date: "Sat", uploads: 900, anomalies: 112 },
        { date: "Sun", uploads: 700, anomalies: 65 },
      ],
    };
    setStats(mockData);
  }, []);

  if (!stats)
    return (
      <div className="p-20 text-center animate-pulse font-mono text-cyan-400">
        INITIALIZING SYSTEM DATA...
      </div>
    );

  return (
    <div className="flex-1 bg-black p-6 lg:p-10 space-y-10 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <div className="flex items-center gap-2 text-green-400 text-xs font-mono uppercase">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          System Operational
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: "Total User Count",
            val: stats.activeUsers,
            icon: Users,
            color: "text-cyan-400",
          },
          {
            label: "Total Anomalies",
            val: stats.anomaliesFound,
            icon: ShieldAlert,
            color: "text-red-400",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon className={`w-12 h-12 ${card.color}`} />
            </div>
            <p className="text-xs text-gray-400 uppercase mb-2">{card.label}</p>
            <h3 className="text-3xl font-bold text-white">{card.val}</h3>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-cyan-400 w-5 h-5" />
            <h3 className="font-semibold text-white">
              Investigation Volume Trends
            </h3>
          </div>

          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
            {["24H", "7D", "30D"].map((t) => (
              <button
                key={t}
                className={`px-3 py-1 rounded-md text-xs font-mono ${
                  t === "7D"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.trends}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff10"
                vertical={false}
              />
              <XAxis dataKey="date" stroke="#aaa" fontSize={10} />
              <YAxis stroke="#aaa" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  borderColor: "#333",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="uploads"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.1}
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="anomalies"
                stroke="#f87171"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between">
          <h3 className="font-semibold text-white">Master Audit Ledger</h3>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by username..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs text-gray-400 uppercase border-b border-white/10">
            <tr>
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Filename</th>
              <th className="px-8 py-4">Timestamp</th>
              <th className="px-8 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {stats.recentUploads
              .filter((row) =>
                row.user.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03]">
                  <td className="px-8 py-5 text-sm text-white">{row.user}</td>
                  <td className="px-8 py-5 text-sm text-gray-400">
                    {row.filename}
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400">
                    {row.timestamp}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        row.status === "Malicious"
                          ? "bg-red-400/10 text-red-400 border border-red-400/20"
                          : "bg-green-400/10 text-green-400 border border-green-400/20"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="px-8 py-4 border-t border-white/10 flex justify-between text-xs text-gray-400">
          <span>
            SHOWING{" "}
            {
              stats.recentUploads.filter((row) =>
                row.user.toLowerCase().includes(searchQuery.toLowerCase()),
              ).length
            }{" "}
            OF {stats.recentUploads.length} RECORDS
          </span>
          <div className="flex gap-4">
            <button className="hover:text-white">PREVIOUS</button>
            <button className="text-white">1</button>
            <button className="hover:text-white">2</button>
            <button className="hover:text-white">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
