import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register, setToken } from "../api/auth";
import { registerSchemaWithConfirm } from "../utils/schemas";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cardType: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const passwordValid = form.password && form.password.length >= 6;
  const passwordsMatch = form.password === form.confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      registerSchemaWithConfirm.parse(form);
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Validation error");
      return;
    }
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      const res = await register(payload);
      if (res.token) {
        setToken(res.token);
        navigate(from, { replace: true });
      } else {
        setError("No token received");
      }
    } catch (err) {
      setError(err?.error || err?.message || "Registration failed");
    }
  }

  return (
    <>
      <Header />
      <div
        className="container"
        style={{
          maxWidth: "640px",
          margin: "var(--spacing-2xl) auto",
          padding: "0 var(--spacing-md)",
        }}
      >
        <div className="card" style={{ padding: "var(--spacing-xl)" }}>
          <h2
            style={{ textAlign: "center", marginBottom: "var(--spacing-lg)" }}
          >
            Реєстрація
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--spacing-md)",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="firstName">Ім'я</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="Ваше ім'я"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                    transition: "all var(--transition-base)",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="lastName">Прізвище</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Ваше прізвище"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                    transition: "all var(--transition-base)",
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone">Телефон</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="+380 XX XXX XX XX"
              />
            </div>

            <div>
              <label htmlFor="password">Пароль</label>
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  placeholder="Мінімум 6 символів"
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="btn-secondary btn-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {!passwordValid && form.password.length > 0 && (
                <div
                  style={{
                    color: "var(--color-warning)",
                    fontSize: "12px",
                    marginTop: "var(--spacing-xs)",
                  }}
                >
                  ⚠️ Пароль має містити щонайменше 6 символів
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword">Підтвердження пароля</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Повторіть пароль"
                required
              />
              {!passwordsMatch && form.confirmPassword.length > 0 && (
                <div
                  style={{
                    color: "var(--color-warning)",
                    fontSize: "12px",
                    marginTop: "var(--spacing-xs)",
                  }}
                >
                  ⚠️ Паролі не співпадають
                </div>
              )}
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
              Зареєструватись
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
              Вже маєте обліковий запис?
            </p>
            <a
              href="/login"
              style={{ color: "var(--color-primary)", fontWeight: 600 }}
            >
              Увійти
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
