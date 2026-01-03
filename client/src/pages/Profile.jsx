import { useEffect, useState } from "react";
import { getToken } from "../api/auth";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        console.log(token);
        if (!token) {
          return setLoading(false);
        }
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        if (res.ok) {
          const body = await res.json();
          console.log(body);
          setUser(body.user);
        }
      } catch (e) {
        console.error(e);
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <>
      <Header />
      <div style={{ padding: 24 }}>
        <h2>Profile</h2>
        {!user ? (
          <div>No user data. Maybe you are not logged in.</div>
        ) : (
          <div>
            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
            </div>
            <div>{user.email}</div>
            <div>Role: {user.role}</div>
          </div>
        )}
      </div>
    </>
  );
}
