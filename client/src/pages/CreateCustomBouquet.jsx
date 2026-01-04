import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, authHeaders } from "../api/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function CreateCustomBouquet() {
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");

  const [bouquetFlowers, setBouquetFlowers] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const [flowersRes, eventTypesRes] = await Promise.all([
          fetch(`${BASE}/api/flowers?isActive=true`),
          fetch(`${BASE}/api/event-types`),
        ]);

        if (!flowersRes.ok || !eventTypesRes.ok) {
          throw new Error("Failed to load data");
        }

        const flowersData = await flowersRes.json();
        const eventTypesData = await eventTypesRes.json();

        setFlowers(flowersData.flowers || []);
        setEventTypes(eventTypesData.eventTypes || []);
      } catch (e) {
        setError(e.message || "Помилка завантаження");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  function addFlowerToBouquet(flower) {
    const existing = bouquetFlowers.find((f) => f.flowerId === flower.id);
    if (existing) {
      setBouquetFlowers(
        bouquetFlowers.map((f) =>
          f.flowerId === flower.id ? { ...f, quantity: f.quantity + 1 } : f
        )
      );
    } else {
      setBouquetFlowers([
        ...bouquetFlowers,
        { flowerId: flower.id, flower, quantity: 1 },
      ]);
    }
  }

  function removeFlowerFromBouquet(flowerId) {
    setBouquetFlowers(bouquetFlowers.filter((f) => f.flowerId !== flowerId));
  }

  function updateFlowerQuantity(flowerId, quantity) {
    if (quantity <= 0) {
      removeFlowerFromBouquet(flowerId);
      return;
    }
    setBouquetFlowers(
      bouquetFlowers.map((f) =>
        f.flowerId === flowerId ? { ...f, quantity } : f
      )
    );
  }

  function calculatePrice() {
    const basePrice = bouquetFlowers.reduce(
      (sum, bf) => sum + (bf.flower?.price || 0) * (bf.quantity || 1),
      0
    );
    return basePrice * 1.1;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Введіть назву букета");
      return;
    }

    if (!description.trim()) {
      setError("Введіть опис букета");
      return;
    }

    if (bouquetFlowers.length === 0) {
      setError("Додайте хоча б одну квітку до букета");
      return;
    }

    const finalPrice = calculatePrice();

    if (finalPrice <= 0) {
      setError("Ціна повинна бути більше 0");
      return;
    }

    try {
      setSaving(true);
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: finalPrice,
        imageUrl: imageUrl.trim() || null,
        isCustom: true,
        eventTypeId: eventTypeId || null,
        flowers: bouquetFlowers.map((bf) => ({
          flowerId: bf.flowerId,
          quantity: bf.quantity,
        })),
      };

      const res = await fetch(`${BASE}/api/bouquets/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || `Помилка ${res.status}`);
      }

      navigate("/profile");
    } catch (e) {
      setError(e.message || "Помилка створення букета");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Завантаження...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <button
            onClick={() => navigate("/profile")}
            className="btn-secondary btn-small"
            style={{ marginBottom: "var(--spacing-md)" }}
          >
            ← Повернутися до профілю
          </button>
          <h2>Створення кастомного букета</h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Оберіть квіти та створіть свій унікальний букет
          </p>
        </div>

        {error && (
          <div
            className="text-error"
            style={{
              padding: "var(--spacing-md)",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "var(--spacing-xl)",
            alignItems: "start",
          }}
        >
          <div className="card" style={{ padding: "var(--spacing-xl)" }}>
            <h3 style={{ marginBottom: "var(--spacing-lg)" }}>
              Інформація про букет
            </h3>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
              }}
            >
              <div>
                <label htmlFor="name">Назва букета *</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Наприклад: Весільний букет 'Ніжність'"
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
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(45, 90, 39, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label htmlFor="description">Опис *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть ваш букет..."
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="eventType">Категорія</label>
                <select
                  id="eventType"
                  value={eventTypeId}
                  onChange={(e) => setEventTypeId(e.target.value)}
                >
                  <option value="">-- Оберіть категорію --</option>
                  {eventTypes.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price">
                  Ціна (₴) *
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      marginLeft: "var(--spacing-xs)",
                      fontWeight: "normal",
                    }}
                  >
                    (автоматично розраховується + 10%)
                  </span>
                </label>
                <input
                  id="price"
                  type="text"
                  readOnly
                  value={
                    bouquetFlowers.length > 0
                      ? `${calculatePrice().toFixed(2)} ₴`
                      : "0.00 ₴"
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    backgroundColor: "var(--color-bg-light)",
                    color: "var(--color-text)",
                    cursor: "not-allowed",
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label htmlFor="imageUrl">URL зображення</label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
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
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(45, 90, 39, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {bouquetFlowers.length > 0 && (
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--color-bg-light)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "var(--spacing-sm)",
                    }}
                  >
                    Склад букета:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-xs)",
                    }}
                  >
                    {bouquetFlowers.map((bf) => (
                      <div
                        key={bf.flowerId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          {bf.flower?.name} × {bf.quantity}
                        </span>
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          {(bf.flower?.price || 0) * bf.quantity} ₴
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: "var(--spacing-sm)",
                      paddingTop: "var(--spacing-sm)",
                      borderTop: "1px solid var(--color-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 600,
                    }}
                  >
                    <span>Загальна вартість:</span>
                    <span style={{ color: "var(--color-primary)" }}>
                      {calculatePrice().toFixed(2)} ₴
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving || bouquetFlowers.length === 0}
                className="btn-primary"
                style={{ width: "100%", marginTop: "var(--spacing-md)" }}
              >
                {saving ? "⏳ Створення..." : "✨ Створити букет"}
              </button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>
              Доступні квіти
            </h3>
            {flowers.length === 0 ? (
              <div
                className="card"
                style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
              >
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Немає доступних квітів
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
                  gap: "var(--spacing-md)",
                }}
              >
                {flowers.map((flower) => {
                  const inBouquet = bouquetFlowers.find(
                    (f) => f.flowerId === flower.id
                  );
                  return (
                    <div
                      key={flower.id}
                      className="card"
                      style={{
                        padding: "var(--spacing-md)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-sm)",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "120px",
                          background: "var(--color-bg-secondary)",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {flower.imageUrl ? (
                          <img
                            src={flower.imageUrl}
                            alt={flower.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "32px" }}>🌸</span>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          {flower.name}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--color-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {flower.price.toFixed(2)} ₴
                        </div>
                      </div>

                      {inBouquet ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-sm)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                            padding: "var(--spacing-xs)",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateFlowerQuantity(
                                flower.id,
                                inBouquet.quantity - 1
                              )
                            }
                            className="btn-secondary btn-small"
                            style={{ padding: "4px 12px", minWidth: "36px" }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              padding: "0 var(--spacing-sm)",
                              minWidth: "30px",
                              textAlign: "center",
                              fontWeight: 600,
                            }}
                          >
                            {inBouquet.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateFlowerQuantity(
                                flower.id,
                                inBouquet.quantity + 1
                              )
                            }
                            className="btn-secondary btn-small"
                            style={{ padding: "4px 12px", minWidth: "36px" }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addFlowerToBouquet(flower)}
                          className="btn-primary btn-small"
                          style={{ width: "100%" }}
                        >
                          ➕ Додати
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
