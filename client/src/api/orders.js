const BASE = import.meta.env.VITE_API_BASE || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getOrders(status = null) {
  const params = new URLSearchParams();
  if (status) {
    params.append("status", status);
  }
  const queryString = params.toString();
  const url = `${BASE}/api/orders${queryString ? `?${queryString}` : ""}`;
  
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

export async function getOrderById(id) {
  const res = await fetch(`${BASE}/api/orders/${id}`, {
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

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${BASE}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}

