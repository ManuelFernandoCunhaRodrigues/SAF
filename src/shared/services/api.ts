import axios from "axios";

const DEFAULT_API_URL = "http://localhost:3333/api";

function resolveApiBaseUrl(url = DEFAULT_API_URL) {
  const normalizedUrl = url.replace(/\/+$/, "");
  return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@saf:token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
