import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { getBouquets, createBouquet, deleteBouquet } from "../../api/bouquets";
import Footer from "../../components/Footer";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function Bouquets() {
  const [bouquets, setBouquets] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isCustomFilter, setIsCustomFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    eventTypeId: "",
  });
  const [bouquetFlowers, setBouquetFlowers] = useState([]);

  useEffect(() => {
    loadData();
  }, [isCustomFilter]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [bouquetsData, flowersRes, eventTypesRes] = await Promise.all([
        getBouquets(isCustomFilter),
        fetch(`${BASE}/api/flowers?isActive=true`),
        fetch(`${BASE}/api/event-types`),
      ]);

      const flowersData = await flowersRes.json();
      const eventTypesData = await eventTypesRes.json();

      const bouquetsList = Array.isArray(bouquetsData.bouquets)
        ? bouquetsData.bouquets
        : [];
      setBouquets(bouquetsList);
      setFlowers(flowersData.flowers || []);
      setEventTypes(eventTypesData.eventTypes || []);
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка завантаження даних";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка завантаження даних"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      eventTypeId: "",
    });
    setBouquetFlowers([]);
    setShowModal(true);
  }

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
    return bouquetFlowers.reduce(
      (sum, bf) => sum + (bf.flower?.price || 0) * (bf.quantity || 1),
      0
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Введіть назву букета");
      return;
    }

    if (!formData.description.trim()) {
      setError("Введіть опис букета");
      return;
    }

    if (bouquetFlowers.length === 0) {
      setError("Додайте хоча б одну квітку до букета");
      return;
    }

    const finalPrice = formData.price
      ? parseFloat(formData.price)
      : calculatePrice();

    if (finalPrice <= 0) {
      setError("Ціна повинна бути більше 0");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: finalPrice,
        imageUrl: formData.imageUrl.trim() || null,
        isCustom: false,
        eventTypeId: formData.eventTypeId || null,
        flowers: bouquetFlowers.map((bf) => ({
          flowerId: bf.flowerId,
          quantity: bf.quantity,
        })),
      };

      await createBouquet(payload);
      setShowModal(false);
      loadData();
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка створення букета";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка створення букета"
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      setError(null);
      await deleteBouquet(deleteConfirm.id);
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка видалення букета";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка видалення букета"
      );
      console.error(err);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="loading">Завантаження букетів...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
        <Link
          to="/admin"
          style={{
            display: "inline-block",
            marginBottom: "var(--spacing-lg)",
            color: "var(--color-primary)",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Назад до адмін панелі
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--spacing-lg)",
            flexWrap: "wrap",
            gap: "var(--spacing-md)",
          }}
        >
          <h1 style={{ margin: 0 }}>Управління букетами</h1>
          <button
            className="btn-primary"
            onClick={handleCreate}
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
            }}
          >
            + Створити букет
          </button>
        </div>

        {/* Перемикач для кастомних/не кастомних */}
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-sm)",
            marginBottom: "var(--spacing-lg)",
            padding: "var(--spacing-sm)",
            backgroundColor: "var(--color-bg-light)",
            borderRadius: "var(--radius-md)",
            width: "fit-content",
          }}
        >
          <button
            onClick={() => setIsCustomFilter(false)}
            style={{
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: !isCustomFilter
                ? "var(--color-primary)"
                : "transparent",
              color: !isCustomFilter ? "white" : "var(--color-text)",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            Стандартні
          </button>
          <button
            onClick={() => setIsCustomFilter(true)}
            style={{
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: isCustomFilter
                ? "var(--color-primary)"
                : "transparent",
              color: isCustomFilter ? "white" : "var(--color-text)",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            Кастомні
          </button>
        </div>

        {error && (
          <div
            className="card"
            style={{
              padding: "var(--spacing-md)",
              marginBottom: "var(--spacing-lg)",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              border: "1px solid var(--color-error)",
              color: "var(--color-error)",
            }}
          >
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {bouquets.length === 0 ? (
          <div className="card" style={{ padding: "var(--spacing-xl)" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                textAlign: "center",
              }}
            >
              Букетів не знайдено
            </p>
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "var(--color-bg-light)",
                      borderBottom: "2px solid var(--color-border-light)",
                    }}
                  >
                    <th
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Букет
                    </th>
                    <th
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Опис
                    </th>
                    <th
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Категорія
                    </th>
                    <th
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Ціна
                    </th>
                    <th
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "right",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bouquets.map((bouquet) => (
                    <tr
                      key={bouquet.id}
                      style={{
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--spacing-md)",
                            alignItems: "center",
                          }}
                        >
                          {bouquet.imageUrl ? (
                            <img
                              src={bouquet.imageUrl}
                              alt={bouquet.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "var(--radius-sm)",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                background: "var(--color-bg-secondary)",
                                borderRadius: "var(--radius-sm)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                              }}
                            >
                              🌸
                            </div>
                          )}
                          <div>
                            <div
                              style={{ fontWeight: 500, marginBottom: "4px" }}
                            >
                              {String(bouquet.name || "")}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {bouquet.isCustom ? "Кастомний" : "Стандартний"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div
                          style={{
                            maxWidth: "300px",
                            fontSize: "14px",
                            color: "var(--color-text-secondary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {String(bouquet.description || "")}
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {bouquet.eventType ? (
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "var(--radius-full)",
                              fontSize: "12px",
                              fontWeight: 600,
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                              color: "var(--color-success)",
                            }}
                          >
                            {bouquet.eventType.name}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            Немає
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--color-primary)",
                          }}
                        >
                          {parseFloat(bouquet.price || 0).toFixed(2)} ₴
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() => setDeleteConfirm(bouquet)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-error)",
                            background: "transparent",
                            color: "var(--color-error)",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 500,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-error)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "var(--color-error)";
                          }}
                        >
                          Видалити
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Модальне вікно для створення */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "var(--spacing-lg)",
              overflowY: "auto",
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="card"
              style={{
                maxWidth: "900px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                margin: "var(--spacing-xl) 0",
                padding: "var(--spacing-xl)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "var(--spacing-lg)" }}>
                Створити букет
              </h2>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "var(--spacing-lg)",
                  }}
                >
                  {/* Форма букета */}
                  <div>
                    <h3 style={{ marginBottom: "var(--spacing-md)" }}>
                      Інформація про букет
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-md)",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Назва букета *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Наприклад: Весільний букет 'Ніжність'"
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border-light)",
                            fontSize: "14px",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Опис *
                        </label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Опишіть ваш букет..."
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border-light)",
                            fontSize: "14px",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Категорія
                        </label>
                        <select
                          value={formData.eventTypeId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eventTypeId: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border-light)",
                            fontSize: "14px",
                          }}
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
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Ціна (₴) *
                          {bouquetFlowers.length > 0 && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-muted)",
                                marginLeft: "var(--spacing-xs)",
                              }}
                            >
                              Розрахована: {calculatePrice().toFixed(2)} ₴
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder={
                            bouquetFlowers.length > 0
                              ? calculatePrice().toFixed(2)
                              : "0.00"
                          }
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border-light)",
                            fontSize: "14px",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          URL зображення
                        </label>
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              imageUrl: e.target.value,
                            })
                          }
                          placeholder="https://example.com/image.jpg"
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border-light)",
                            fontSize: "14px",
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
                                <span
                                  style={{
                                    color: "var(--color-text-secondary)",
                                  }}
                                >
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
                    </div>
                  </div>

                  {/* Список квітів */}
                  <div>
                    <h3 style={{ marginBottom: "var(--spacing-md)" }}>
                      Доступні квіти
                    </h3>
                    {flowers.length === 0 ? (
                      <div
                        className="card"
                        style={{
                          padding: "var(--spacing-xl)",
                          textAlign: "center",
                        }}
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
                            "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
                          gap: "var(--spacing-md)",
                          maxHeight: "500px",
                          overflowY: "auto",
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
                                padding: "var(--spacing-sm)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-xs)",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "80px",
                                  background: "var(--color-bg-secondary)",
                                  borderRadius: "var(--radius-sm)",
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
                                  <span style={{ fontSize: "24px" }}>🌸</span>
                                )}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: "var(--spacing-xs)",
                                    fontSize: "12px",
                                  }}
                                >
                                  {flower.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
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
                                    gap: "var(--spacing-xs)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "var(--spacing-xs)",
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateFlowerQuantity(
                                        flower.id,
                                        inBouquet.quantity - 1
                                      )
                                    }
                                    style={{
                                      padding: "2px 8px",
                                      minWidth: "28px",
                                      borderRadius: "var(--radius-sm)",
                                      border: "1px solid var(--color-border)",
                                      background: "transparent",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    −
                                  </button>
                                  <span
                                    style={{
                                      padding: "0 var(--spacing-xs)",
                                      minWidth: "24px",
                                      textAlign: "center",
                                      fontWeight: 600,
                                      fontSize: "12px",
                                    }}
                                  >
                                    {inBouquet.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateFlowerQuantity(
                                        flower.id,
                                        inBouquet.quantity + 1
                                      )
                                    }
                                    style={{
                                      padding: "2px 8px",
                                      minWidth: "28px",
                                      borderRadius: "var(--radius-sm)",
                                      border: "1px solid var(--color-border)",
                                      background: "transparent",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addFlowerToBouquet(flower)}
                                  style={{
                                    width: "100%",
                                    padding: "var(--spacing-xs)",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1px solid var(--color-primary)",
                                    background: "transparent",
                                    color: "var(--color-primary)",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
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

                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-md)",
                    justifyContent: "flex-end",
                    marginTop: "var(--spacing-lg)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-lg)",
                    }}
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    disabled={saving || bouquetFlowers.length === 0}
                    className="btn-primary"
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-lg)",
                    }}
                  >
                    {saving ? "⏳ Створення..." : "✨ Створити букет"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Модальне вікно підтвердження видалення */}
        {deleteConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "var(--spacing-lg)",
            }}
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="card"
              style={{
                maxWidth: "400px",
                width: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: "var(--spacing-md)" }}>
                Підтвердження видалення
              </h3>
              <p
                style={{
                  marginBottom: "var(--spacing-lg)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Ви впевнені, що хочете видалити букет{" "}
                <strong>{deleteConfirm.name}</strong>? Цю дію неможливо
                скасувати.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-md)",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary"
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                  }}
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: "var(--color-error)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
