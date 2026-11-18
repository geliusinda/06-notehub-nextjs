import axios from 'axios';

const api = axios.create({
  timeout: 15000,
  baseURL: 'https://notehub-public.goit.study/api',
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}` },
});

export default api;
