const BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await res.json();
    if (!res.ok) throw body;
    return body;
  }
  if (!res.ok) throw new Error("Network error");
  return null;
}

export async function register(data) {
  return request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function login(data) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export async function getMe() {
  return request("/api/auth/me", {
    method: "GET",
    headers: {
      ...authHeaders(), // Це автоматично додасть Bearer токен
      "Content-Type": "application/json",
    },
  });
}

export default { register, login, setToken, getToken, logout, authHeaders };
