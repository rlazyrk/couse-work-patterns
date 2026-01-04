const BASE = import.meta.env.VITE_API_BASE || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getClientCards() {
  const res = await fetch(`${BASE}/api/client-cards`, {
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}

export async function getClientCardById(id) {
  const res = await fetch(`${BASE}/api/client-cards/${id}`, {
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}

export async function createClientCard(data) {
  const res = await fetch(`${BASE}/api/client-cards`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}

export async function updateClientCard(id, data) {
  const res = await fetch(`${BASE}/api/client-cards/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}



