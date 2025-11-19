const DEFAULT_BASE_URL = "http://127.0.0.1:9000/api";

const normalizeBase = (base) => base.replace(/\/+$/, "");
const ensureLeadingSlash = (path) => (path.startsWith("/") ? path : `/${path}`);

export const API_BASE_URL = normalizeBase(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL
);

const buildUrl = (path) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${API_BASE_URL}${ensureLeadingSlash(path)}`;
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function apiRequest(path, options = {}) {
  const { auth = true, ...rest } = options;
  const headers = new Headers(rest.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const isFormData = rest.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = localStorage.getItem("sso_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers,
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.errors?.email?.[0] ||
      payload?.errors?.password?.[0] ||
      "Permintaan ke server gagal";

    const error = new Error(message);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}
