import useCart from "../store/cartStore";

export default function BouquetCard({ bouquet }) {
  const { name, description, price, imageUrl } = bouquet || {};
  const addToCart = useCart((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(bouquet);
  };

  return (
    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: "var(--color-bg-secondary)",
          height: "240px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform var(--transition-slow)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        ) : (
          <div className="text-muted" style={{ fontSize: "14px" }}>
            🎨 Немає зображення
          </div>
        )}
      </div>

      <div style={{ padding: "var(--spacing-md)", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "1.125rem", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {name || "Без назви"}
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "14px",
            marginBottom: "var(--spacing-md)",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "Опис відсутній"}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "var(--spacing-md)",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--color-primary)" }}>
            {typeof price === "number" ? `${price.toFixed(2)} ₴` : price || "0 ₴"}
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-primary btn-small"
            style={{ fontSize: "14px" }}
          >
            🛒 Додати
          </button>
        </div>
      </div>
    </div>
  );
}
