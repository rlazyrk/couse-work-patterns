import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  getClientCards,
  createClientCard,
  updateClientCard,
} from "../../api/clientCards";
import { getUsers } from "../../api/users";
import Footer from "../../components/Footer";

export default function ClientCards() {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    type: "STANDARD",
    bonusPoints: 0,
    deliveryDiscountPercent: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [cardsData, usersData] = await Promise.all([
        getClientCards(),
        getUsers(),
      ]);
      const cardsList = Array.isArray(cardsData.cards) ? cardsData.cards : [];
      const usersList = Array.isArray(usersData.users) ? usersData.users : [];
      setCards(cardsList);
      setUsers(usersList);
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
    setEditingCard(null);
    setFormData({
      userId: "",
      type: "STANDARD",
      bonusPoints: 0,
      deliveryDiscountPercent: 0,
    });
    setShowModal(true);
  }

  function handleEdit(card) {
    setEditingCard(card);
    setFormData({
      userId: card.userId,
      type: card.type || "STANDARD",
      bonusPoints: card.bonusPoints || 0,
      deliveryDiscountPercent: card.deliveryDiscountPercent || 0,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      if (editingCard) {
        await updateClientCard(editingCard.id, {
          type: formData.type,
          bonusPoints: formData.bonusPoints,
          deliveryDiscountPercent: formData.deliveryDiscountPercent,
        });
      } else {
        if (!formData.userId) {
          setError("Оберіть користувача");
          return;
        }
        await createClientCard({
          userId: formData.userId,
          cardType: formData.type,
        });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка збереження картки";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка збереження картки"
      );
      console.error(err);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="loading">Завантаження карток...</div>
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
          <h1 style={{ margin: 0 }}>Управління клієнтськими картками</h1>
          <button
            className="btn-primary"
            onClick={handleCreate}
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
            }}
          >
            + Створити картку
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

        {cards.length === 0 ? (
          <div className="card" style={{ padding: "var(--spacing-xl)" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                textAlign: "center",
              }}
            >
              Карток не знайдено
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
                      Email користувача
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
                      Тип картки
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
                      Бонусні бали
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
                      Знижка на доставку
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
                  {cards.map((card) => (
                    <tr
                      key={card.id}
                      style={{
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                            {String(card.user?.email || "")}
                          </div>
                          {card.user?.firstName && card.user?.lastName && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {String(card.user.firstName)}{" "}
                              {String(card.user.lastName)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
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
                          {card.type === "GOLD" && "🥇 Gold"}
                          {card.type === "BONUS" && "🎁 Бонусна"}
                          {card.type === "SOCIAL" && "💝 Соціальна"}
                          {card.type === "STANDARD" && "📋 Стандартна"}
                        </span>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {card.bonusPoints || 0}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {card.deliveryDiscountPercent || 0}%
                      </td>
                      <td
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(card)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-primary)",
                            background: "transparent",
                            color: "var(--color-primary)",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 500,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-primary)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color =
                              "var(--color-primary)";
                          }}
                        >
                          Редагувати
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                {editingCard
                  ? "Редагувати клієнтську картку"
                  : "Створити клієнтську картку"}
              </h2>
              <form onSubmit={handleSubmit}>
                {!editingCard && (
                  <div style={{ marginBottom: "var(--spacing-md)" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--spacing-xs)",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}
                    >
                      Користувач *
                    </label>
                    <select
                      required
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border-light)",
                        fontSize: "14px",
                      }}
                    >
                      <option value="">Оберіть користувача</option>
                      {users
                        .filter((user) => !user.clientCard)
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email} ({user.firstName} {user.lastName})
                          </option>
                        ))}
                    </select>
                    {users.filter((user) => !user.clientCard).length === 0 && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        Всі користувачі вже мають картки
                      </p>
                    )}
                  </div>
                )}
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Тип картки *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border-light)",
                      fontSize: "14px",
                    }}
                  >
                    <option value="STANDARD">Стандартна</option>
                    <option value="BONUS">Бонусна</option>
                    <option value="GOLD">Gold</option>
                    <option value="SOCIAL">Соціальна</option>
                  </select>
                </div>
                {editingCard && (
                  <>
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        Бонусні бали
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.bonusPoints}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bonusPoints: parseInt(e.target.value) || 0,
                          })
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
                  </>
                )}
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
                    {editingCard ? "Зберегти" : "Створити"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
