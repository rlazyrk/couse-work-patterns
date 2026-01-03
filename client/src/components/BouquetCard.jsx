import useCart from "../store/cartStore";

export default function BouquetCard({ bouquet }) {
  const { name, description, price, imageUrl } = bouquet || {};
  const addToCart = useCart((state) => state.addToCart);

  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
      <div
        style={{
          background: "#fafafa",
          height: 120,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <div style={{ color: "#999" }}>No image</div>
        )}
      </div>

      <div style={{ fontWeight: 700 }}>{name}</div>
      <div style={{ color: "#666", margin: "6px 0" }}>{description}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <div style={{ fontWeight: 700 }}>
          {typeof price === "number" ? `${price.toFixed(2)} ₴` : price}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(bouquet);
          }}
          style={{ padding: "6px 8px", borderRadius: 6, cursor: "pointer" }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
