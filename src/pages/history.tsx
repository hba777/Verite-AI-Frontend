import { useEffect, useState } from 'react';
import { fetchVideoHistory, fetchAudioHistory } from '@/services/videoApi';
import { Video, AudioAnalysis } from '@/types';

const History = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [audios, setAudios] = useState<AudioAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

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
            <h3 className="font-semibold text-white">File Analyses</h3>
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
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-5 text-center text-gray-500">
                    No file analyses found
                  </td>
                </tr>
              ) : (
                videos.map(video => (
                  <tr key={video.task_id} className="hover:bg-white/[0.03]">
                    <td className="px-8 py-5 text-sm text-white font-mono">{video.task_id}</td>
                    <td className="px-8 py-5 text-sm text-gray-400 truncate max-w-xs">{video.video_path}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{video.created_at || 'N/A'}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{video.completed_at || 'N/A'}</td>
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

          <div className="px-8 py-4 border-t border-white/10 text-xs text-gray-400">
            <span>
              SHOWING {videos.length} RECORDS
            </span>
          </div>
        </div>
      </div>

      {/* <div>
        <h2 className="text-2xl mb-4">Audio Analyses</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-3 text-left">Analysis ID</th>
                <th className="border border-gray-700 p-3 text-left">Filename</th>
                <th className="border border-gray-700 p-3 text-left">File Size (MB)</th>
                <th className="border border-gray-700 p-3 text-left">Verdict</th>
                <th className="border border-gray-700 p-3 text-left">Confidence</th>
                <th className="border border-gray-700 p-3 text-left">Fake Prob</th>
                <th className="border border-gray-700 p-3 text-left">Real Prob</th>
                <th className="border border-gray-700 p-3 text-left">Duration (s)</th>
                <th className="border border-gray-700 p-3 text-left">Upload Time</th>
                <th className="border border-gray-700 p-3 text-left">Analysis Time</th>
              </tr>
            </thead>
            <tbody>
              {audios.length === 0 ? (
                <tr>
                  <td colSpan={10} className="border border-gray-700 p-3 text-center text-gray-500">
                    No audio analyses found
                  </td>
                </tr>
              ) : (
                audios.map(audio => (
                  <tr key={audio.analysis_id} className="hover:bg-gray-700">
                    <td className="border border-gray-700 p-3 font-mono text-sm">{audio.analysis_id}</td>
                    <td className="border border-gray-700 p-3 truncate max-w-xs">{audio.audio_file.filename}</td>
                    <td className="border border-gray-700 p-3">{(audio.audio_file.file_size / (1024 * 1024)).toFixed(2)}</td>
                    <td className="border border-gray-700 p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        audio.verdict === 'FAKE' ? 'bg-red-600' : 'bg-green-600'
                      }`}>
                        {audio.verdict}
                      </span>
                    </td>
                    <td className="border border-gray-700 p-3">{audio.confidence}%</td>
                    <td className="border border-gray-700 p-3">{audio.fake_prob.toFixed(4)}</td>
                    <td className="border border-gray-700 p-3">{audio.real_prob.toFixed(4)}</td>
                    <td className="border border-gray-700 p-3">{audio.duration_seconds.toFixed(2)}</td>
                    <td className="border border-gray-700 p-3">{audio.audio_file.upload_time || 'N/A'}</td>
                    <td className="border border-gray-700 p-3">{audio.analysis_time || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default History;