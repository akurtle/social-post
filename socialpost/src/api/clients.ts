import Constants from "expo-constants";
import { getToken } from "../state/authStore";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_URL ||
  "http://localhost:4000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any)
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseURL}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.error || `HTTP_${res.status}`;
    throw new Error(msg);
  }
  return data;
}
