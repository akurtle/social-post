import { Platform } from "react-native";

// Minimal token persistence without extra deps.
// In production, use expo-secure-store.

let memoryToken: string | null = null;

export async function setToken(token: string | null) {
  memoryToken = token;
}

export async function getToken() {
  return memoryToken;
}
