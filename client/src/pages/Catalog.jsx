import Header from "../components/Header";
import BouquetCard from "../components/BouquetCard";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function Catalog() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const location = useLocation();


  useEffect(() => {
    let mounted = true;
    async function loadInitial() {
      try {
        const res = await fetch(
          `${BASE}/api/bouquets?isActive=true&isCustom=false`
        );
        if (!res.ok) return;
        const body = await res.json();
        if (mounted && body.bouquets && body.bouquets.length > 0) {
          const prices = body.bouquets.map((b) => Number(b.price || 0));
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          if (priceMin === 0 && priceMax === 0) {
            setPriceMin(min);
            setPriceMax(max);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadInitial();
    return () => (mounted = false);
  }, []);


  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (selectedEventTypes.length > 0) {
          params.append("eventTypeIds", selectedEventTypes.join(","));
        }
        if (search.trim()) {
          params.append("search", search.trim());
        }
        if (priceMin > 0) {
          params.append("priceMin", priceMin.toString());
        }
        if (priceMax > 0 && priceMax !== priceMin) {
          params.append("priceMax", priceMax.toString());
        }
        params.append("isActive", "true");
        params.append("isCustom", "false");

        const queryString = params.toString();
        const url = `${BASE}/api/bouquets${
          queryString ? `?${queryString}` : ""
        }`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const body = await res.json();
        if (mounted) {
          setBouquets(body.bouquets || []);
        }
      } catch (e) {
        if (mounted) setError(e.message || "Load error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [search, selectedEventTypes, priceMin, priceMax]);

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
    setPriceMin(0);
    setPriceMax(0);
  }

  return (
    <>
      <div>
        <Header />

        <main className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h2>Каталог букетів</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Знайдіть ідеальний букет для будь-якої події
            </p>
          </div>

          {loading && <div className="loading">Завантаження букетів...</div>}
          {error && (
            <div
              className="text-error"
              style={{
                padding: "var(--spacing-md)",
                backgroundColor: "var(--color-bg)",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              {error}
            </div>
          )}

          <section
            style={{
              display: "flex",
              gap: "var(--spacing-lg)",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <aside
              className="card"
              style={{
                width: "280px",
                padding: "var(--spacing-lg)",
                position: "sticky",
                top: "90px",
                flex: "0 0 280px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Фільтри
              </h3>

              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <label
                  style={{
                    marginBottom: "var(--spacing-sm)",
                    display: "block",
                  }}
                >
                  Типи подій
                </label>
                {eventTypes.length === 0 && (
                  <div className="text-muted" style={{ fontSize: "14px" }}>
                    Немає доступних типів
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-sm)",
                  }}
                >
                  {eventTypes.map((et) => (
                    <label
                      key={et.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                        transition: "background-color var(--transition-fast)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-bg-light)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedEventTypes.includes(et.id)}
                        onChange={() => toggleEventType(et.id)}
                      />
                      <span>{et.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <label
                  style={{
                    marginBottom: "var(--spacing-sm)",
                    display: "block",
                  }}
                >
                  Діапазон ціни (₴)
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-sm)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                    placeholder="Від"
                    min="0"
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value || 0))}
                    placeholder="До"
                    min="0"
                  />
                </div>
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  Від {priceMin} ₴ до {priceMax} ₴
                </div>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="btn-secondary btn-small"
                style={{ width: "100%" }}
              >
                Скинути фільтри
              </button>
            </aside>

            <div style={{ flex: 1, minWidth: "280px" }}>
              {!loading && bouquets.length === 0 && (
                <div
                  className="card"
                  style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}
                >
                  <p className="text-muted" style={{ fontSize: "18px" }}>
                    Поки що немає товарів за вашим запитом.
                  </p>
                  <p
                    style={{
                      marginTop: "var(--spacing-sm)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Спробуйте змінити параметри фільтрів
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
                  gap: "var(--spacing-lg)",
                }}
              >
                {bouquets.map((b) => (
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
      <Footer />
    </>
  );
}
