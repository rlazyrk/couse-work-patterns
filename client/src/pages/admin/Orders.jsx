import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { getOrders, updateOrderStatus } from "../../api/orders";
import Footer from "../../components/Footer";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(statusFilter || null);
      const ordersList = Array.isArray(data.orders) ? data.orders : [];
      setOrders(ordersList);
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка завантаження замовлень";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка завантаження замовлень"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      setError(null);
      await updateOrderStatus(orderId, newStatus);
      setEditingStatus(null);
      loadOrders();
    } catch (err) {
      const errorMessage =
        err?.error || err?.message || "Помилка оновлення статусу";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Помилка оновлення статусу"
      );
      console.error(err);
    }
  }

  function getStatusColor(status) {
    const colors = {
      PENDING: { bg: "rgba(158, 158, 158, 0.1)", color: "var(--color-text-secondary)" },
      IN_PROGRESS: { bg: "rgba(33, 150, 243, 0.1)", color: "var(--color-info)" },
      READY: { bg: "rgba(255, 152, 0, 0.1)", color: "var(--color-warning)" },
      DELIVERED: { bg: "rgba(76, 175, 80, 0.1)", color: "var(--color-success)" },
      CANCELLED: { bg: "rgba(244, 67, 54, 0.1)", color: "var(--color-error)" },
    };
    return colors[status] || colors.PENDING;
  }

  function getStatusLabel(status) {
    const labels = {
      PENDING: "⏳ Очікується",
      IN_PROGRESS: "🔄 В обробці",
      READY: "✅ Готово",
      DELIVERED: "📦 Доставлено",
      CANCELLED: "❌ Скасовано",
    };
    return labels[status] || status;
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
          <div className="loading">Завантаження замовлень...</div>
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

        <h1 style={{ marginBottom: "var(--spacing-lg)" }}>
          Управління замовленнями
        </h1>

        {/* Фільтр за статусом */}
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-sm)",
            marginBottom: "var(--spacing-lg)",
            padding: "var(--spacing-sm)",
            backgroundColor: "var(--color-bg-light)",
            borderRadius: "var(--radius-md)",
            width: "fit-content",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setStatusFilter("")}
            style={{
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: !statusFilter ? "var(--color-primary)" : "transparent",
              color: !statusFilter ? "white" : "var(--color-text)",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            Всі
          </button>
          {["PENDING", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background:
                    statusFilter === status
                      ? "var(--color-primary)"
                      : "transparent",
                  color:
                    statusFilter === status ? "white" : "var(--color-text)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                {getStatusLabel(status)}
              </button>
            )
          )}
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

        {orders.length === 0 ? (
          <div className="card" style={{ padding: "var(--spacing-xl)" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                textAlign: "center",
              }}
            >
              Замовлень не знайдено
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
                      Замовлення
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
                      Сума
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
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Дата
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
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                            #{String(order.id || "").slice(0, 8)}
                          </div>
                          {order.items && order.items.length > 0 && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {order.items.length} товар(ів)
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                            {String(order.user?.email || "")}
                          </div>
                          {order.user?.firstName && order.user?.lastName && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {String(order.user.firstName)}{" "}
                              {String(order.user.lastName)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--color-primary)",
                          }}
                        >
                          {parseFloat(order.totalPrice || 0).toFixed(2)} ₴
                        </div>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "12px",
                            fontWeight: 600,
                            ...getStatusColor(order.status),
                          }}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString(
                            "uk-UA",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "right",
                        }}
                      >
                        {editingStatus === order.id ? (
                          <select
                            value={order.status}
                            onChange={(e) => {
                              handleStatusChange(order.id, e.target.value);
                            }}
                            onBlur={() => setEditingStatus(null)}
                            autoFocus
                            style={{
                              padding: "6px 12px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--color-primary)",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              backgroundColor: "var(--color-bg)",
                            }}
                          >
                            <option value="PENDING">⏳ Очікується</option>
                            <option value="IN_PROGRESS">🔄 В обробці</option>
                            <option value="READY">✅ Готово</option>
                            <option value="DELIVERED">📦 Доставлено</option>
                            <option value="CANCELLED">❌ Скасовано</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingStatus(order.id)}
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
                            Змінити статус
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
