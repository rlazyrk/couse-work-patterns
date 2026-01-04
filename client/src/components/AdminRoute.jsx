import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../api/auth";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function AdminRoute({ children }) {
  const token = getToken();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const body = await res.json();
          setIsAdmin(body.user?.role === "ADMIN");
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error(e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [token]);

  if (loading) {
    return (
      <div className="loading" style={{ padding: "var(--spacing-xl)" }}>
        Перевірка доступу...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
