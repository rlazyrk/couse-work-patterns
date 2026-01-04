const BASE = import.meta.env.VITE_API_BASE || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFlowers(isActive = null) {
  const params = new URLSearchParams();
  if (isActive !== null) {
    params.append("isActive", isActive.toString());
  }
  const queryString = params.toString();
  const url = `${BASE}/api/flowers${queryString ? `?${queryString}` : ""}`;
  
  const res = await fetch(url, {
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

export async function getFlowerById(id) {
  const res = await fetch(`${BASE}/api/flowers/${id}`, {
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

export async function createFlower(data) {
  const res = await fetch(`${BASE}/api/flowers`, {
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

export async function updateFlower(id, data) {
  const res = await fetch(`${BASE}/api/flowers/${id}`, {
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

export async function deleteFlower(id) {
  const res = await fetch(`${BASE}/api/flowers/${id}`, {
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

