const BASE = import.meta.env.VITE_API_BASE || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getNotifications() {
  const res = await fetch(`${BASE}/api/notifications`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }
  const data = await res.json();
  return data.notifications || [];
}

export async function markAsRead(notificationId) {
  const res = await fetch(`${BASE}/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to mark notification as read: ${res.status}`);
  }
  return await res.json();
}

export async function markAllAsRead() {
  const res = await fetch(`${BASE}/api/notifications/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to mark all notifications as read: ${res.status}`);
  }
  return await res.json();
}

