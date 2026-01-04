import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/users";
import Footer from "../../components/Footer";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "CLIENT",
    cardType: "STANDARD",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      const usersList = Array.isArray(data.users) ? data.users : [];
      setUsers(usersList);
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Помилка завантаження користувачів";
      setError(typeof errorMessage === "string" ? errorMessage : "Помилка завантаження користувачів");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingUser(null);
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "CLIENT",
      cardType: "STANDARD",
    });
    setShowModal(true);
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      role: user.role || "CLIENT",
      cardType: user.clientCard?.type || "STANDARD",
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      if (editingUser) {
        await updateUser(editingUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      } else {
        await createUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          cardType: formData.cardType,
        });
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Помилка збереження користувача";
      setError(typeof errorMessage === "string" ? errorMessage : "Помилка збереження користувача");
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      setError(null);
      await deleteUser(deleteConfirm.id);
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Помилка видалення користувача";
      setError(typeof errorMessage === "string" ? errorMessage : "Помилка видалення користувача");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="loading">Завантаження користувачів...</div>
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
          <h1 style={{ margin: 0 }}>Управління користувачами</h1>
          <button
            className="btn-primary"
            onClick={handleCreate}
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
            }}
          >
            + Створити користувача
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

        {users.length === 0 ? (
          <div className="card" style={{ padding: "var(--spacing-xl)" }}>
            <p style={{ color: "var(--color-text-secondary)", textAlign: "center" }}>
              Користувачів не знайдено
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
                      Користувач
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
                      Email
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
                      Роль
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
                      Картка
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
                      Замовлення
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
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                            {String(user.firstName || "")} {String(user.lastName || "")}
                          </div>
                          {user.phone && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {String(user.phone)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {String(user.email || "")}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "12px",
                            fontWeight: 600,
                            backgroundColor:
                              user.role === "ADMIN"
                                ? "rgba(255, 152, 0, 0.1)"
                                : "rgba(76, 175, 80, 0.1)",
                            color:
                              user.role === "ADMIN"
                                ? "var(--color-warning)"
                                : "var(--color-success)",
                          }}
                        >
                          {user.role === "ADMIN" ? "Адмін" : "Клієнт"}
                        </span>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {user.clientCard ? (
                          <div>
                            <div style={{ fontSize: "12px", marginBottom: "4px" }}>
                              {user.clientCard.type === "GOLD" && "🥇 Gold"}
                              {user.clientCard.type === "BONUS" && "🎁 Бонусна"}
                              {user.clientCard.type === "SOCIAL" && "💝 Соціальна"}
                              {user.clientCard.type === "STANDARD" && "📋 Стандартна"}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {user.clientCard.bonusPoints || 0} балів
                            </div>
                          </div>
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
                        {typeof user._count === "object" && user._count !== null
                          ? user._count.orders || 0
                          : 0}
                      </td>
                      <td
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--spacing-sm)",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() => handleEdit(user)}
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
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "var(--color-primary)";
                            }}
                          >
                            Редагувати
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
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
                        </div>
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
                {editingUser ? "Редагувати користувача" : "Створити користувача"}
              </h2>
              <form onSubmit={handleSubmit}>
                {!editingUser && (
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
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
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
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        Пароль *
                      </label>
                      <input
                        type="password"
                        required={!editingUser}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
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
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        Тип картки
                      </label>
                      <select
                        value={formData.cardType}
                        onChange={(e) =>
                          setFormData({ ...formData, cardType: e.target.value })
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
                  </>
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
                    Ім'я *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
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
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Прізвище *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
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
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
                    {editingUser ? "Зберегти" : "Створити"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
              <p style={{ marginBottom: "var(--spacing-lg)", color: "var(--color-text-secondary)" }}>
                Ви впевнені, що хочете видалити користувача{" "}
                <strong>
                  {deleteConfirm.firstName} {deleteConfirm.lastName}
                </strong>
                ? Цю дію неможливо скасувати.
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
