import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import useCart from "../store/cartStore";
import Footer from "../components/Footer";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function BouquetDetail() {
  const { id } = useParams();
  const [bouquet, setBouquet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCart((state) => state.addToCart);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/api/bouquets/${id}`);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const body = await res.json();
        if (mounted) setBouquet(body.bouquet || null);
      } catch (e) {
        if (mounted) setError(e.message || "Load error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Завантаження...</div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="card text-error" style={{ padding: "var(--spacing-xl)", textAlign: "center" }}>
            {error}
          </div>
        </div>
      </>
    );
  }
  
  if (!bouquet) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="card" style={{ padding: "var(--spacing-xl)", textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "var(--color-text-secondary)" }}>
              Букет не знайдено
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <Link to="/" style={{ color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
            ← Повернутися до каталогу
          </Link>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--spacing-xl)", alignItems: "start" }}>
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            {bouquet.imageUrl ? (
              <img
                src={bouquet.imageUrl}
                alt={bouquet.name}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "500px",
                background: "var(--color-bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)"
              }}>
                🎨 Немає зображення
              </div>
            )}
          </div>
          
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "var(--spacing-md)" }}>
              {bouquet.name}
            </h1>
            
            <div style={{ 
              fontSize: "2rem", 
              fontWeight: 700, 
              color: "var(--color-primary)",
              marginBottom: "var(--spacing-lg)"
            }}>
              {typeof bouquet.price === "number"
                ? `${bouquet.price.toFixed(2)} ₴`
                : bouquet.price || "0 ₴"}
            </div>
            
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "var(--spacing-sm)" }}>
                Опис
              </h3>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                {bouquet.description || "Опис відсутній"}
              </p>
            </div>

            {bouquet.flowers && bouquet.flowers.length > 0 && (
              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <h3 style={{ fontSize: "1.125rem", marginBottom: "var(--spacing-md)" }}>
                  Склад букета
                </h3>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "var(--spacing-sm)",
                  backgroundColor: "var(--color-bg-light)",
                  padding: "var(--spacing-md)",
                  borderRadius: "var(--radius-md)"
                }}>
                  {bouquet.flowers.map((bf, index) => (
                    <div
                      key={bf.flowerId || index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-md)",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                        transition: "background-color var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "var(--color-bg-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {bf.flower?.imageUrl ? (
                          <img
                            src={bf.flower.imageUrl}
                            alt={bf.flower.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "24px" }}>🌸</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                          {bf.flower?.name || "Невідома квітка"}
                        </div>
                        {bf.flower?.price && (
                          <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                            {typeof bf.flower.price === "number"
                              ? `${bf.flower.price.toFixed(2)} ₴ за шт.`
                              : bf.flower.price}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        fontSize: "1.125rem",
                        minWidth: "60px",
                        textAlign: "right"
                      }}>
                        × {bf.quantity || 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "var(--spacing-md)", fontSize: "18px" }}
              onClick={() => {
                if (bouquet) {
                  addToCart(bouquet);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }
              }}
            >
              {addedToCart ? "✅ Додано до кошика!" : "🛒 Додати до кошика"}
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
