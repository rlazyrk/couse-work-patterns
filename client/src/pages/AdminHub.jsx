import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminHub() {
  const entities = [
    { name: "Користувачі", path: "/admin/users", icon: "👥" },
    { name: "Клієнтські картки", path: "/admin/client-cards", icon: "💳" },
    { name: "Букети", path: "/admin/bouquets", icon: "🌸" },
    { name: "Квіти", path: "/admin/flowers", icon: "🌺" },
    { name: "Замовлення", path: "/admin/orders", icon: "📦" },
  ];

  return (
    <>
      <Header />
      <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
        <div
          style={{
            marginBottom: "var(--spacing-xl)",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "var(--spacing-sm)" }}>Адмін панель</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "16px",
            }}
          >
            Оберіть сутність для управління
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "var(--spacing-lg)",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {entities.map((entity) => (
            <Link
              key={entity.path}
              to={entity.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div
                className="card"
                style={{
                  padding: "var(--spacing-xl)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid var(--color-border-light)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "var(--spacing-md)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-light)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  {entity.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  {entity.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

