import api from '../lib/api';
import { AdminStats } from '../types';

export const getAdminStats = async (period: string = '7d'): Promise<AdminStats> => {
  try {
    // Get total users
    const usersRes = await api.get('/users/count');
    const totalUsers = usersRes.data.total_users;

    // Get total anomalies
    const anomaliesRes = await api.get('/video/anomalies/count');
    const totalAnomalies = anomaliesRes.data.total_anomalies;

    // Get all videos for uploads
    const videosRes = await api.get('/video/all');
    const videos = videosRes.data.videos;

    // Map all uploads
    const recentUploads = videos.map((video: any) => ({
      id: video.task_id,
      user: video.user.username,
      filename: video.video_path.split('/').pop() || video.video_path,
      timestamp: new Date(video.created_at).toLocaleString(),
      status: video.has_anomalies ? 'Malicious' as const : video.status === 'completed' ? 'Clean' as const : 'Suspicious' as const,
      size: 'Unknown', // Not stored
    }));

    // Get trends
    const trendsRes = await api.get(`/video/trends?period=${period}`);
    const trends = trendsRes.data.trends;

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