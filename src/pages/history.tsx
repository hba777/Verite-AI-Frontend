import { useEffect, useState } from 'react';
import { fetchVideoHistory, fetchAudioHistory } from '@/services/videoApi';
import { Video, AudioAnalysis } from '@/types';

const History = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [audios, setAudios] = useState<AudioAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoPage, setVideoPage] = useState(0);
  const [audioPage, setAudioPage] = useState(0);
  const itemsPerPage = 10;

  const displayedVideos = videos.slice(videoPage * itemsPerPage, (videoPage + 1) * itemsPerPage);
  const displayedAudios = audios.slice(audioPage * itemsPerPage, (audioPage + 1) * itemsPerPage);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [videoData, audioData] = await Promise.all([
          fetchVideoHistory(),
          fetchAudioHistory()
        ]);
        setVideos(videoData.videos || []);
        setAudios(audioData.audio_analyses || []);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
          <span>Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-8">Analysis History</h1>

      <div className="mb-12">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/10">
            <h3 className="font-semibold text-white">Video Analyses</h3>
          </div>

          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs text-gray-400 uppercase border-b border-white/10">
              <tr>
                <th className="px-8 py-4">Task ID</th>
                <th className="px-8 py-4">Video Path</th>
                <th className="px-8 py-4">Created At</th>
                <th className="px-8 py-4">Completed At</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {displayedVideos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-5 text-center text-gray-500">
                    No video analyses found
                  </td>
                </tr>
              ) : (
                displayedVideos.map(video => (
                  <tr key={video.task_id} className="hover:bg-white/[0.03]">
                    <td className="px-8 py-5 text-sm text-white font-mono">{video.task_id}</td>
                    <td className="px-8 py-5 text-sm text-gray-400 truncate max-w-xs">{video.video_path}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{video.created_at ? new Date(video.created_at).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}) : 'N/A'}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{video.completed_at ? new Date(video.completed_at).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}) : 'N/A'}</td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          video.has_anomalies
                            ? "bg-red-400/10 text-red-400 border border-red-400/20"
                            : "bg-green-400/10 text-green-400 border border-green-400/20"
                        }`}
                      >
                        {video.has_anomalies ? 'Malicious' : 'Clean'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="px-8 py-4 border-t border-white/10 text-xs text-gray-400 flex justify-between items-center">
            <span>
              SHOWING {displayedVideos.length} OF {videos.length} RECORDS
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setVideoPage(p => Math.max(0, p - 1))}
                disabled={videoPage === 0}
                className="px-3 py-1 bg-white/10 rounded disabled:opacity-50 hover:bg-white/20"
              >
                Previous
              </button>
              <span className="px-2">Page {videoPage + 1}</span>
              <button
                onClick={() => setVideoPage(p => p + 1)}
                disabled={(videoPage + 1) * itemsPerPage >= videos.length}
                className="px-3 py-1 bg-white/10 rounded disabled:opacity-50 hover:bg-white/20"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/10">
            <h3 className="font-semibold text-white">Audio Analyses</h3>
          </div>

          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs text-gray-400 uppercase border-b border-white/10">
              <tr>
                <th className="px-8 py-4">Analysis ID</th>
                <th className="px-8 py-4">Filename</th>
                <th className="px-8 py-4">File Size (MB)</th>
                <th className="px-8 py-4">Verdict</th>
                <th className="px-8 py-4">Confidence</th>
                <th className="px-8 py-4">Fake Prob</th>
                <th className="px-8 py-4">Real Prob</th>
                <th className="px-8 py-4">Duration (s)</th>
                <th className="px-8 py-4">Upload Time</th>
                <th className="px-8 py-4">Analysis Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {displayedAudios.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-8 py-5 text-center text-gray-500">
                    No audio analyses found
                  </td>
                </tr>
              ) : (
                displayedAudios.map(audio => (
                  <tr key={audio.analysis_id} className="hover:bg-white/[0.03]">
                    <td className="px-8 py-5 text-sm text-white font-mono">{audio.analysis_id}</td>
                    <td className="px-8 py-5 text-sm text-gray-400 truncate max-w-xs">{audio.audio_file.filename}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{(audio.audio_file.file_size / (1024 * 1024)).toFixed(2)}</td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          audio.verdict === 'FAKE'
                            ? "bg-red-400/10 text-red-400 border border-red-400/20"
                            : "bg-green-400/10 text-green-400 border border-green-400/20"
                        }`}
                      >
                        {audio.verdict}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">{audio.confidence}%</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{audio.fake_prob.toFixed(4)}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{audio.real_prob.toFixed(4)}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{audio.duration_seconds.toFixed(2)}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{audio.audio_file.upload_time ? new Date(audio.audio_file.upload_time).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}) : 'N/A'}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{audio.analysis_time ? new Date(audio.analysis_time).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}) : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="px-8 py-4 border-t border-white/10 text-xs text-gray-400 flex justify-between items-center">
            <span>
              SHOWING {displayedAudios.length} OF {audios.length} RECORDS
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setAudioPage(p => Math.max(0, p - 1))}
                disabled={audioPage === 0}
                className="px-3 py-1 bg-white/10 rounded disabled:opacity-50 hover:bg-white/20"
              >
                Previous
              </button>
              <span className="px-2">Page {audioPage + 1}</span>
              <button
                onClick={() => setAudioPage(p => p + 1)}
                disabled={(audioPage + 1) * itemsPerPage >= audios.length}
                className="px-3 py-1 bg-white/10 rounded disabled:opacity-50 hover:bg-white/20"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;