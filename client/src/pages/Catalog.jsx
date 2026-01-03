import Header from "../components/Header";
import BouquetCard from "../components/BouquetCard";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function Catalog() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);

  // filters
  const [search, setSearch] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/api/bouquets`);
        console.log(res);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const body = await res.json();
        if (mounted) setBouquets(body.bouquets || []);
      } catch (e) {
        if (mounted) setError(e.message || "Load error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // load event types for filter
  useEffect(() => {
    let mounted = true;
    async function loadTypes() {
      try {
        const res = await fetch(`${BASE}/api/event-types`);
        if (!res.ok) return;
        const body = await res.json();

        if (mounted) setEventTypes(body.eventTypes || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadTypes();
    return () => (mounted = false);
  }, []);

  // update price range when bouquets change
  useEffect(() => {
    if (!bouquets || bouquets.length === 0) return;
    const prices = bouquets.map((b) => Number(b.price || 0));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceMin(min);
    setPriceMax(max);
  }, [bouquets]);

  // update search from URL query param `q`
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setSearch(q);
  }, [location.search]);

  function toggleEventType(id) {
    setSelectedEventTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function resetFilters() {
    setSearch("");
    setSelectedEventTypes([]);
    const prices = bouquets.map((b) => Number(b.price || 0));
    setPriceMin(prices.length ? Math.min(...prices) : 0);
    setPriceMax(prices.length ? Math.max(...prices) : 0);
  }

  const filteredBouquets = bouquets.filter((b) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.description && b.description.toLowerCase().includes(q));
    const matchesEvent =
      selectedEventTypes.length === 0 ||
      selectedEventTypes.includes(b.eventTypeId);
    const price = Number(b.price || 0);
    const matchesPrice = price >= (priceMin || 0) && price <= (priceMax || 0);
    return matchesSearch && matchesEvent && matchesPrice;
  });

  return (
    <div>
      <Header />

      <main style={{ padding: 24 }}>
        <h2>Каталог</h2>
        <p>Нижче відображається список букетй з ціною та описом.</p>

        {loading && <div>Loading bouquets...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        <section style={{ marginTop: 24, display: "flex", gap: 16 }}>
          <aside style={{ width: 280, padding: 12, border: "1px solid #eee" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Типи івентів
              </div>
              {eventTypes.length === 0 && (
                <div style={{ color: "#666" }}>Немає типів</div>
              )}
              {eventTypes.map((et) => (
                <label
                  key={et.id}
                  style={{ display: "block", marginBottom: 6 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedEventTypes.includes(et.id)}
                    onChange={() => toggleEventType(et.id)}
                    style={{ marginRight: 8 }}
                  />
                  {et.name}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Типи івентів
              </div>
              {eventTypes.length === 0 && (
                <div style={{ color: "#666" }}>Немає типів</div>
              )}
              {eventTypes.map((et) => (
                <label
                  key={et.id}
                  style={{ display: "block", marginBottom: 6 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedEventTypes.includes(et.id)}
                    onChange={() => toggleEventType(et.id)}
                    style={{ marginRight: 8 }}
                  />
                  {et.name}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Фільтр за ціною
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                  style={{ width: "50%", padding: 6 }}
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value || 0))}
                  style={{ width: "50%", padding: 6 }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                Від {priceMin} до {priceMax}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={resetFilters}
                style={{ padding: "8px 12px" }}
              >
                Скинути фільтри
              </button>
            </div>
          </aside>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 12,
              }}
            >
              {!loading && filteredBouquets.length === 0 && (
                <div style={{ gridColumn: "1/-1", color: "#666" }}>
                  Поки що немає товарів за вашим запитом.
                </div>
              )}

              {filteredBouquets.map((b) => (
                <Link
                  key={b.id}
                  to={`/bouquets/${b.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <BouquetCard bouquet={b} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
