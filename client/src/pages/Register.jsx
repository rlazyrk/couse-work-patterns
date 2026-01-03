import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register, setToken } from "../api/auth";
import { registerSchemaWithConfirm } from "../utils/schemas";

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
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Last name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{ padding: "6px 8px" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {!passwordValid && form.password.length > 0 && (
            <div style={{ color: "orange", fontSize: 12 }}>
              Пароль має містити щонайменше 6 символів
            </div>
          )}
        </div>
        <div>
          <label>Confirm password</label>
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={onChange}
            required
          />
          {!passwordsMatch && form.confirmPassword.length > 0 && (
            <div style={{ color: "orange", fontSize: 12 }}>
              Паролі не співпадають
            </div>
          )}
        </div>
        <div>
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div style={{ marginTop: 12 }}>
          Вже зареєстровані? <a href="/login">Увійти</a>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
