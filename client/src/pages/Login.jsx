import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, setToken } from "../api/auth";
import { loginSchema } from "../utils/schemas";
import Header from "../components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Validation error");
      return;
    }
    try {
      const res = await login({ email, password });
      if (res.token) {
        setToken(res.token);
        navigate(from, { replace: true });
      } else {
        setError("No token received");
      }
    } catch (err) {
      setError(err?.error || err?.message || "Login failed");
    }
  }

  return (
    <>
      <Header />
      <div style={{ maxWidth: 480, margin: "2rem auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div style={{ marginTop: 12 }}>
          Немає аккаута? <a href="/login">Зареєструватись</a>
        </div>
      </div>
    </>
  );
}
