import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  getFlowers,
  createFlower,
  deleteFlower,
} from "../../api/flowers";
import Footer from "../../components/Footer";

export default function Flowers() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadFlowers();
  }, []);

  async function loadFlowers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlowers();
      const flowersList = Array.isArray(data.flowers) ? data.flowers : [];
      setFlowers(flowersList);
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка завантаження квітів";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка завантаження квітів"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setFormData({
      name: "",
      price: "",
      imageUrl: "",
      isActive: true,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      await createFlower({
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl.trim() || null,
      });
      setShowModal(false);
      loadFlowers();
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка створення квітки";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка створення квітки"
      );
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      setError(null);
      await deleteFlower(deleteConfirm.id);
      setDeleteConfirm(null);
      loadFlowers();
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка видалення квітки";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка видалення квітки"
      );
      console.error(err);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="loading">Завантаження квітів...</div>
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
          <h1 style={{ margin: 0 }}>Управління квітами</h1>
          <button
            className="btn-primary"
            onClick={handleCreate}
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
            }}
          >
            + Створити квітку
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

        {flowers.length === 0 ? (
          <div className="card" style={{ padding: "var(--spacing-xl)" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                textAlign: "center",
              }}
            >
              Квітів не знайдено
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
                      Квітка
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
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Статус
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
                  {flowers.map((flower) => (
                    <tr
                      key={flower.id}
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
                          {flower.imageUrl ? (
                            <img
                              src={flower.imageUrl}
                              alt={flower.name}
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
                            <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                              {String(flower.name || "")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--color-primary)",
                          }}
                        >
                          {parseFloat(flower.price || 0).toFixed(2)} ₴
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "12px",
                            fontWeight: 600,
                            backgroundColor: flower.isActive
                              ? "rgba(76, 175, 80, 0.1)"
                              : "rgba(158, 158, 158, 0.1)",
                            color: flower.isActive
                              ? "var(--color-success)"
                              : "var(--color-text-muted)",
                          }}
                        >
                          {flower.isActive ? "Активна" : "Неактивна"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() => setDeleteConfirm(flower)}
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
                            e.currentTarget.style.backgroundColor = "transparent";
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
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="card"
              style={{
                maxWidth: "500px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "var(--spacing-xl)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "var(--spacing-lg)" }}>
                Створити квітку
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Назва квітки *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Наприклад: Троянда"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border-light)",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Ціна (₴) *
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
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border-light)",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
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
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border-light)",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-md)",
                    justifyContent: "flex-end",
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
                    className="btn-primary"
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-lg)",
                    }}
                  >
                    Створити
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
                Ви впевнені, що хочете видалити квітку{" "}
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
      <Footer/>
    </>
  );
}
