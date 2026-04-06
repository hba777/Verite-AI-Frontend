import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Search, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AdminStats, AudioAnalysis } from "../../types";
import { getAdminStats } from "../../services/adminDashboardapi";
import { fetchAudioHistory } from "../../services/videoApi";
import { useUser } from "../../context/UserContext";

const AdminDashboard: React.FC = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const itemsPerPage = 10;
  const [audios, setAudios] = useState<AudioAnalysis[]>([]);
  const [audioCurrentPage, setAudioCurrentPage] = useState(1);
  const audioItemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // Don't fetch if not logged in or not admin
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getAdminStats(selectedPeriod.toLowerCase());
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        // Fallback to mock data if API fails
        const mockData: AdminStats = {
          totalUploads: 0,
          anomaliesFound: 0,
          activeUsers: 0,
          systemHealth: 98,
          recentUploads: [],
          trends: [
            { date: "Mon", uploads: 0, anomalies: 0 },
            { date: "Tue", uploads: 0, anomalies: 0 },
            { date: "Wed", uploads: 0, anomalies: 0 },
            { date: "Thu", uploads: 0, anomalies: 0 },
            { date: "Fri", uploads: 0, anomalies: 0 },
            { date: "Sat", uploads: 0, anomalies: 0 },
            { date: "Sun", uploads: 0, anomalies: 0 },
          ],
        };
        setStats(mockData);
      }
    };
    fetchStats();
  }, [user, selectedPeriod]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAudio = async () => {
      try {
        const audioData = await fetchAudioHistory();
        setAudios(audioData.audio_analyses || []);
      } catch (error) {
        console.error('Failed to fetch audio history:', error);
        setAudios([]);
      }
    };
    fetchAudio();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-20 text-center font-mono text-red-400">
        ACCESS DENIED: ADMIN PRIVILEGES REQUIRED
      </div>
    );
  }

  if (!stats)
    return (
      <div className="p-20 text-center animate-pulse font-mono text-cyan-400">
        INITIALIZING SYSTEM DATA...
      </div>
    );

  const filteredUploads = stats.recentUploads.filter((row) =>
    row.user.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUploads = filteredUploads.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const audioTotalPages = Math.ceil(audios.length / audioItemsPerPage);
  const audioStartIndex = (audioCurrentPage - 1) * audioItemsPerPage;
  const paginatedAudios = audios.slice(audioStartIndex, audioStartIndex + audioItemsPerPage);

  const handleAudioPrevious = () => {
    if (audioCurrentPage > 1) setAudioCurrentPage(audioCurrentPage - 1);
  };

  const handleAudioNext = () => {
    if (audioCurrentPage < audioTotalPages) setAudioCurrentPage(audioCurrentPage + 1);
  };

  const handleAudioPageClick = (page: number) => {
    setAudioCurrentPage(page);
  };

  // Reset to page 1 when search changes

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
                onClick={() => setSelectedPeriod(t)}
                className={`px-3 py-1 rounded-md text-xs font-mono ${t === selectedPeriod
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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
            {paginatedUploads.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03]">
                <td className="px-8 py-5 text-sm text-white">{row.user}</td>
                <td className="px-8 py-5 text-sm text-gray-400">
                  {row.filename}
                </td>
                <td className="px-8 py-5 text-sm text-gray-400">
                  {new Date(row.timestamp).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${row.status === "Malicious"
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
            SHOWING {paginatedUploads.length} OF {filteredUploads.length} RECORDS (PAGE {currentPage} OF {totalPages})
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              PREV
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-2 py-1 rounded text-xs ${page === currentPage
                    ? "bg-white/10 text-white"
                    : "hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              NEXT
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Table Section */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10">
          <h3 className="font-semibold text-white">Audio Analysis Ledger</h3>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs text-gray-400 uppercase border-b border-white/10">
            <tr>
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Filename</th>
              <th className="px-8 py-4">Analysis Time</th>
              <th className="px-8 py-4">Verdict</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {paginatedAudios.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-5 text-center text-gray-500">
                  No audio analyses found
                </td>
              </tr>
            ) : (
              paginatedAudios.map(audio => (
                <tr key={audio.analysis_id} className="hover:bg-white/[0.03]">
                  <td className="px-8 py-5 text-sm text-white">{(audio.audio_file as any).user?.username || 'N/A'}</td>
                  <td className="px-8 py-5 text-sm text-gray-400 truncate max-w-xs">{audio.audio_file.filename}</td>
                  <td className="px-8 py-5 text-sm text-gray-400">{audio.analysis_time ? new Date(audio.analysis_time).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}</td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${audio.verdict === 'FAKE'
                          ? "bg-red-400/10 text-red-400 border border-red-400/20"
                          : "bg-green-400/10 text-green-400 border border-green-400/20"
                        }`}
                    >
                      {audio.verdict}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-8 py-4 border-t border-white/10 flex justify-between text-xs text-gray-400">
          <span>
            SHOWING {paginatedAudios.length} OF {audios.length} RECORDS (PAGE {audioCurrentPage} OF {audioTotalPages})
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAudioPrevious}
              disabled={audioCurrentPage === 1}
              className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              PREV
            </button>
            {Array.from({ length: audioTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handleAudioPageClick(page)}
                className={`px-2 py-1 rounded text-xs ${page === audioCurrentPage
                    ? "bg-white/10 text-white"
                    : "hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleAudioNext}
              disabled={audioCurrentPage === audioTotalPages}
              className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              NEXT
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
