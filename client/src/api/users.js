const BASE = import.meta.env.VITE_API_BASE || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUsers() {
  const res = await fetch(`${BASE}/api/users`, {
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

export async function getUserById(id) {
  const res = await fetch(`${BASE}/api/users/${id}`, {
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

export async function updateUser(id, data) {
  const res = await fetch(`${BASE}/api/users/${id}`, {
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

export async function deleteUser(id) {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    method: "DELETE",
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

export async function createUser(data) {
  const res = await fetch(`${BASE}/api/auth/register`, {
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
