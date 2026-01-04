import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, setToken } from "../api/auth";
import { loginSchema } from "../utils/schemas";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <div
        className="container"
        style={{
          maxWidth: "480px",
          margin: "var(--spacing-2xl) auto",
          padding: "0 var(--spacing-md)",
        }}
      >
        <div className="card" style={{ padding: "var(--spacing-xl)" }}>
          <h2
            style={{ textAlign: "center", marginBottom: "var(--spacing-lg)" }}
          >
            Вхід до системи
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div
                className="text-error"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", marginTop: "var(--spacing-sm)" }}
            >
              Увійти
            </button>
          </form>

          <div
            style={{
              marginTop: "var(--spacing-lg)",
              textAlign: "center",
              paddingTop: "var(--spacing-lg)",
              borderTop: "1px solid var(--color-border-light)",
            }}
          >
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              Немає облікового запису?
            </p>
            <a
              href="/register"
              style={{ color: "var(--color-primary)", fontWeight: 600 }}
            >
              Зареєструватись
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
