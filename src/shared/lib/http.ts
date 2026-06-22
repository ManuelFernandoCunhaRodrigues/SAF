import axios from "axios";

const DEFAULT_API_URL = "http://localhost:3333/api";

function resolveApiBaseUrl(url = DEFAULT_API_URL) {
  const normalizedUrl = url.replace(/\/+$/, "");
  return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
}

export const http = axios.create({
  baseURL: resolveApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
});
