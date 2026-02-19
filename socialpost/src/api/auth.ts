import { apiFetch } from "./clients";

export async function register(email: string, password: string) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }) as Promise<{ token: string }>;
}

export async function login(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }) as Promise<{ token: string }>;
}
