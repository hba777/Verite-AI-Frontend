import axios from 'axios';
import { AdminStats } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    // Get total users
    const usersRes = await axios.get(`${API_BASE}/users/test/count`);
    const totalUsers = usersRes.data.total_users;

    // Get total anomalies
    const anomaliesRes = await axios.get(`${API_BASE}/video/test/anomalies/count`);
    const totalAnomalies = anomaliesRes.data.total_anomalies;

    // Get all videos for recent uploads
    const videosRes = await axios.get(`${API_BASE}/video/test/all`);
    const videos = videosRes.data.videos;

    // Map recent uploads (last 5)
    const recentUploads = videos.slice(-5).map((video: any) => ({
      id: video.task_id,
      user: video.user.username,
      filename: video.video_path.split('/').pop() || video.video_path,
      timestamp: new Date(video.created_at).toLocaleString(),
      status: video.has_anomalies ? 'Malicious' as const : video.status === 'completed' ? 'Clean' as const : 'Suspicious' as const,
      size: 'Unknown', // Not stored
    }));

    // Mock trends for now
    const trends = [
      { date: "Mon", uploads: 400, anomalies: 24 },
      { date: "Tue", uploads: 300, anomalies: 18 },
      { date: "Wed", uploads: 600, anomalies: 45 },
      { date: "Thu", uploads: 800, anomalies: 72 },
      { date: "Fri", uploads: 500, anomalies: 30 },
      { date: "Sat", uploads: 900, anomalies: 112 },
      { date: "Sun", uploads: 700, anomalies: 65 },
    ];

    return {
      totalUploads: videos.length,
      anomaliesFound: totalAnomalies,
      activeUsers: totalUsers,
      systemHealth: 98, // Mock
      recentUploads,
      trends,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};