import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function BouquetDetail() {
  const { id } = useParams();
  const [bouquet, setBouquet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
  if (!bouquet) return <div style={{ padding: 24 }}>Bouquet not found</div>;

  return (
    <>
      <Header />
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <Link to="/">← Повернутися</Link>
        </div>
        <h2>{bouquet.name}</h2>
        <div style={{ maxWidth: 800 }}>
          {bouquet.imageUrl && (
            <img
              src={bouquet.imageUrl}
              alt={bouquet.name}
              style={{
                width: "100%",
                height: 360,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
          <p style={{ marginTop: 12 }}>{bouquet.description}</p>
          <div style={{ fontWeight: 700, marginTop: 8 }}>
            {typeof bouquet.price === "number"
              ? `${bouquet.price.toFixed(2)} ₴`
              : bouquet.price}
          </div>
        </div>
      </div>
    </>
  );
}
