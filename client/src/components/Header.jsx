import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getToken, logout } from "../api/auth";
import useCart from "../store/cartStore";

export default function Header() {
  const token = getToken();
  const navigate = useNavigate();
  const cartCount = useCart((state) => state.items.length);
  const clearCart = useCart((state) => state.clearCart);

  const handleLogout = () => {
    try {
      clearCart();
    } catch (e) {
      // ignore
    }
    logout();
    navigate("/login");
    window.location.reload();
  };

  const colors = {
    primary: "#2D5A27",
    accent: "#E91E63",
    light: "#F8F9FA",
    text: "#333",
    border: "#E0E0E0",
  };

  const styles = {
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: "70px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: "'Segoe UI', Roboto, sans-serif",
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      textDecoration: "none",
      color: colors.text,
    },
    logo: {
      width: 42,
      height: 42,
      borderRadius: "12px",
      background: `linear-gradient(135deg, ${colors.primary}, #4CAF50)`,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "bold",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    logoText: {
      fontSize: "22px",
      fontWeight: 800,
      letterSpacing: "-0.5px",
      color: colors.primary,
    },
    center: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      padding: "0 20px",
    },
    searchWrapper: { position: "relative", width: "100%", maxWidth: "500px" },
    search: {
      width: "100%",
      padding: "10px 15px",
      paddingLeft: "40px",
      borderRadius: "20px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.light,
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
    },
    right: { display: "flex", alignItems: "center", gap: 15 },
    cartBtn: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      position: "relative",
      transition: "transform 0.2s",
    },
    btn: {
      padding: "8px 20px",
      borderRadius: "20px",
      border: `1px solid ${colors.primary}`,
      background: "transparent",
      color: colors.primary,
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
      fontSize: "14px",
    },
    btnPrimary: {
      padding: "8px 20px",
      borderRadius: "20px",
      border: "none",
      background: colors.primary,
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 10px rgba(45, 90, 39, 0.2)",
    },
  };

  const [searchTerm, setSearchTerm] = useState("");

  function doSearch() {
    const q = (searchTerm || "").trim();
    if (q) navigate(`/?q=${encodeURIComponent(q)}`);
    else navigate(`/`);
  }

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.left}>
        <div style={styles.logo}>F</div>
        <div style={styles.logoText}>Flowerly</div>
      </Link>

      <div style={styles.center}>
        <div style={styles.searchWrapper}>
          <span
            style={{ position: "absolute", left: 15, top: 10, color: "#888" }}
          >
            🔍
          </span>
          <input
            placeholder="Знайти ідеальний букет..."
            style={styles.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") doSearch();
            }}
            onFocus={(e) => {
              e.target.style.border = `1px solid ${colors.primary}`;
              e.target.style.backgroundColor = "#fff";
              e.target.style.boxShadow = "0 0 0 4px rgba(76, 175, 80, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.border = `1px solid ${colors.border}`;
              e.target.style.backgroundColor = colors.light;
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            onClick={doSearch}
            style={{
              position: "absolute",
              right: 6,
              top: 6,
              padding: "6px 10px",
              borderRadius: 12,
              border: "none",
              background: colors.primary,
              color: "#fff",
              cursor: "pointer",
            }}
            aria-label="Search"
          >
            Знайти
          </button>
        </div>
      </div>

      <div style={styles.right}>
        <Link to="/cart" style={{ textDecoration: "none" }}>
          <button
            style={styles.cartBtn}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🛒
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                background: colors.accent,
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
              }}
            >
              {cartCount || 0}
            </span>
          </button>
        </Link>

        {!token ? (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={styles.btn}>Увійти</button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button style={styles.btnPrimary}>Реєстрація</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <button style={styles.btn}>Профіль</button>
            </Link>
            <button
              style={{
                ...styles.btn,
                borderColor: "#ff4d4d",
                color: "#ff4d4d",
              }}
              onClick={handleLogout}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#ff4d4d";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#ff4d4d";
              }}
            >
              Вийти
            </button>
          </>
        )}
      </div>
    </header>
  );
}
