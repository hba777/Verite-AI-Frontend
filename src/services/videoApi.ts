import api from '@/lib/api';
export const fetchVideoHistory = async () => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/video/all`);
  return response.data;
};

export const fetchAudioHistory = async () => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/audio/all`
);
  return response.data;
};