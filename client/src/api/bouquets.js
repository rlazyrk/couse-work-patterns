const BASE = import.meta.env.VITE_API_BASE || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getBouquets(isCustom = null) {
  const params = new URLSearchParams();
  if (isCustom !== null) {
    params.append("isCustom", isCustom.toString());
  }
  const queryString = params.toString();
  const url = `${BASE}/api/bouquets${queryString ? `?${queryString}` : ""}`;
  
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

export async function getBouquetById(id) {
  const res = await fetch(`${BASE}/api/bouquets/${id}`, {
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

export async function createBouquet(data) {
  const res = await fetch(`${BASE}/api/bouquets`, {
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

export async function deleteBouquet(id) {
  const res = await fetch(`${BASE}/api/bouquets/${id}`, {
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

