import { apiRequest } from "./api";

const TOKEN_KEY = "sso_token";
const USER_KEY = "sso_user";

export async function login(email, password) {
  const data = await apiRequest("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
  });

  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export async function fetchProfile() {
  const profile = await apiRequest("/v1/auth/me");
  if (profile) {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  }
  return profile;
}

export async function logout() {
  try {
    await apiRequest("/v1/auth/logout", { method: "POST" });
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }
  } finally {
    clearSession();
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
