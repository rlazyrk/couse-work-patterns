import { useEffect, useState } from "react";
import { getToken } from "../api/auth";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import BouquetCard from "../components/BouquetCard";
import Footer from "../components/Footer";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../api/notifications";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customBouquets, setCustomBouquets] = useState([]);
  const [loadingBouquets, setLoadingBouquets] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        if (!token) {
          return setLoading(false);
        }
        const res = await fetch(`${BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const body = await res.json();
          setUser(body.user);
        }
      } catch (e) {
        console.error(e);
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadCustomBouquets() {
      const token = getToken();
      if (!token || !user) return;

      try {
        setLoadingBouquets(true);
        const res = await fetch(`${BASE}/api/bouquets/my-custom`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const body = await res.json();
          setCustomBouquets(body.bouquets || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingBouquets(false);
      }
    }
    if (user) {
      loadCustomBouquets();
    }
  }, [user]);

  useEffect(() => {
    async function loadNotifications() {
      const token = getToken();
      if (!token || !user) return;

      try {
        setLoadingNotifications(true);
        const notifs = await getNotifications();
        setNotifications(notifs);
      } catch (e) {
        console.error("Failed to load notifications:", e);
      } finally {
        setLoadingNotifications(false);
      }
    }
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Failed to mark all notifications as read:", e);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Завантаження профілю...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
        <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Мій профіль</h2>

        {!user ? (
          <div
            className="card"
            style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
          >
            <p
              className="text-error"
              style={{ fontSize: "18px", marginBottom: "var(--spacing-sm)" }}
            >
              Немає даних користувача
            </p>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Можливо, ви не увійшли в систему
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(300px, 1fr) minmax(400px, 600px)",
              gap: "var(--spacing-xl)",
              alignItems: "start",
            }}
            className="profile-layout"
          >
            <div className="card" style={{ padding: "var(--spacing-xl)" }}>
              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "32px",
                    fontWeight: "bold",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  {user.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  {user.firstName} {user.lastName}
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--color-bg-light)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      marginBottom: "var(--spacing-xs)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Email
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 500 }}>
                    {user.email}
                  </div>
                </div>

                {user.phone && (
                  <div
                    style={{
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--color-bg-light)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        marginBottom: "var(--spacing-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Телефон
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 500 }}>
                      {user.phone}
                    </div>
                  </div>
                )}

                {user.clientCard && (
                  <div
                    style={{
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--color-bg-light)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        marginBottom: "var(--spacing-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Клієнтська картка
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      {user.clientCard.type === "GOLD" && "🥇 Gold"}
                      {user.clientCard.type === "BONUS" && "🎁 Бонусна"}
                      {user.clientCard.type === "SOCIAL" && "💝 Соціальна"}
                      {user.clientCard.type === "STANDARD" && "📋 Стандартна"}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      Бонусні бали:{" "}
                      <strong style={{ color: "var(--color-primary)" }}>
                        {user.clientCard.bonusPoints || 0}
                      </strong>
                    </div>
                    {user.clientCard.deliveryDiscountPercent > 0 && (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--color-text-secondary)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        Знижка на доставку:{" "}
                        <strong>
                          {user.clientCard.deliveryDiscountPercent}%
                        </strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "var(--spacing-lg)",
                  paddingTop: "var(--spacing-lg)",
                  borderTop: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-md)",
                }}
              >
                <Link
                  to="/create-bouquet"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md)",
                    textAlign: "center",
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  ✨ Створити кастомний букет
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="btn-secondary"
                    style={{
                      width: "100%",
                      padding: "var(--spacing-md)",
                      borderColor: "var(--color-warning)",
                      color: "var(--color-warning)",
                      textAlign: "center",
                      display: "block",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-warning)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--color-warning)";
                    }}
                  >
                    Адмін панель
                  </Link>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: "var(--spacing-lg)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Сповіщення</h3>
                {notifications.some((n) => !n.isRead) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      backgroundColor: "transparent",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--color-text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    Відмітити всі як прочитані
                  </button>
                )}
              </div>

              {loadingNotifications ? (
                <div className="loading">Завантаження...</div>
              ) : notifications.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-sm)",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                >
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        !notification.isRead &&
                        handleMarkAsRead(notification.id)
                      }
                      style={{
                        padding: "var(--spacing-md)",
                        backgroundColor: notification.isRead
                          ? "var(--color-bg-light)"
                          : "rgba(45, 90, 39, 0.05)",
                        borderRadius: "var(--radius-md)",
                        border: notification.isRead
                          ? "1px solid var(--color-border)"
                          : "1px solid var(--color-primary)",
                        cursor: notification.isRead ? "default" : "pointer",
                        transition: "all var(--transition-base)",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (!notification.isRead) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(45, 90, 39, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!notification.isRead) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(45, 90, 39, 0.05)";
                        }
                      }}
                    >
                      {!notification.isRead && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "var(--color-primary)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--color-text)",
                          marginBottom: "var(--spacing-xs)",
                          fontWeight: notification.isRead ? 400 : 500,
                        }}
                      >
                        {notification.message}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {new Date(notification.createdAt).toLocaleDateString(
                          "uk-UA",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "var(--spacing-lg)",
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Немає сповіщень
                </div>
              )}
            </div>
          </div>
        )}

        {user && (
          <div style={{ marginTop: "var(--spacing-xl)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <h2>Мої букети</h2>
            </div>
            {loadingBouquets ? (
              <div className="loading">Завантаження...</div>
            ) : customBouquets.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
                  gap: "var(--spacing-lg)",
                }}
              >
                {customBouquets.map((b) => (
                  <Link
                    key={b.id}
                    to={`/bouquets/${b.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <BouquetCard bouquet={b} />
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className="card"
                style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
              >
                <p style={{ color: "var(--color-text-secondary)" }}>
                  У вас поки що немає кастомних букетів
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                    marginTop: "var(--spacing-sm)",
                  }}
                >
                  Створіть свій перший кастомний букет!
                </p>
              </div>
            )}
          </div>
        )}

        {user && user.orders && user.orders.length > 0 && (
          <div style={{ marginTop: "var(--spacing-xl)" }}>
            <h2 style={{ marginBottom: "var(--spacing-lg)" }}>
              Мої замовлення
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
              }}
            >
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="card"
                  style={{ padding: "var(--spacing-lg)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "var(--spacing-md)",
                      flexWrap: "wrap",
                      gap: "var(--spacing-sm)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "var(--spacing-xs)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Замовлення #{order.id.slice(0, 8)}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          padding: "4px 12px",
                          borderRadius: "var(--radius-full)",
                          display: "inline-block",
                          fontWeight: 600,
                          backgroundColor:
                            order.status === "DELIVERED"
                              ? "rgba(76, 175, 80, 0.1)"
                              : order.status === "IN_PROGRESS"
                              ? "rgba(33, 150, 243, 0.1)"
                              : order.status === "READY"
                              ? "rgba(255, 152, 0, 0.1)"
                              : order.status === "CANCELLED"
                              ? "rgba(244, 67, 54, 0.1)"
                              : "rgba(158, 158, 158, 0.1)",
                          color:
                            order.status === "DELIVERED"
                              ? "var(--color-success)"
                              : order.status === "IN_PROGRESS"
                              ? "var(--color-info)"
                              : order.status === "READY"
                              ? "var(--color-warning)"
                              : order.status === "CANCELLED"
                              ? "var(--color-error)"
                              : "var(--color-text-secondary)",
                        }}
                      >
                        {order.status === "PENDING" && "⏳ Очікується"}
                        {order.status === "IN_PROGRESS" && "🔄 В обробці"}
                        {order.status === "READY" && "✅ Готово"}
                        {order.status === "DELIVERED" && "📦 Доставлено"}
                        {order.status === "CANCELLED" && "❌ Скасовано"}
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--color-primary)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        {order.totalPrice.toFixed(2)} ₴
                      </div>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "var(--spacing-sm)",
                          color: "var(--color-text)",
                        }}
                      >
                        Товари:
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-xs)",
                        }}
                      >
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--spacing-sm)",
                              padding: "var(--spacing-xs)",
                              borderRadius: "var(--radius-sm)",
                            }}
                          >
                            {item.bouquet?.imageUrl ? (
                              <img
                                src={item.bouquet.imageUrl}
                                alt={item.bouquet.name}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "var(--radius-sm)",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "var(--color-bg-secondary)",
                                  borderRadius: "var(--radius-sm)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              >
                                🌸
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{ fontSize: "14px", fontWeight: 500 }}
                              >
                                {item.bouquet?.name || "Букет"}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                Кількість: {item.quantity} ×{" "}
                                {item.price.toFixed(2)} ₴
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(order.delivery ||
                    order.packaging ||
                    order.deliveryAddress) && (
                    <div
                      style={{
                        padding: "var(--spacing-sm)",
                        backgroundColor: "var(--color-bg-light)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {order.delivery && (
                        <div>
                          Доставка: {order.delivery.name || order.delivery.type}
                        </div>
                      )}
                      {order.packaging && (
                        <div>
                          Упаковка:{" "}
                          {order.packaging.name || order.packaging.type}
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div>Адреса: {order.deliveryAddress}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {user && (!user.orders || user.orders.length === 0) && (
          <div style={{ marginTop: "var(--spacing-xl)" }}>
            <h2 style={{ marginBottom: "var(--spacing-lg)" }}>
              Мої замовлення
            </h2>
            <div
              className="card"
              style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
            >
              <p style={{ color: "var(--color-text-secondary)" }}>
                У вас поки що немає замовлень
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
