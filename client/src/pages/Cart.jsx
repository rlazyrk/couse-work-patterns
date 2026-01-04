import useCart from "../store/cartStore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authHeaders, getToken } from "../api/auth";
import { useEffect, useState } from "react";
import { orderSchema } from "../utils/schemas";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE = import.meta.env.VITE_API_BASE || "";

export default function Cart() {
  const items = useCart((state) => state.items);
  const remove = useCart((state) => state.removeFromCart);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const total = useCart((state) => state.total);
  const clearCart = useCart((state) => state.clearCart);
  const navigate = useNavigate();
  const location = useLocation();

  const [deliveries, setDeliveries] = useState([]);
  const [packagings, setPackagings] = useState([]);
  const [deliveryId, setDeliveryId] = useState("");
  const [packagingId, setPackagingId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [userCard, setUserCard] = useState(null);
  const [bonusPointsToUse, setBonusPointsToUse] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadOptions() {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const dRes = await fetch(`${BASE}/api/deliveries`, { headers });
        const pRes = await fetch(`${BASE}/api/packaging?isActive=true`);
        if (!dRes.ok || !pRes.ok) return;
        const dBody = await dRes.json();
        const pBody = await pRes.json();
        if (mounted) {
          setDeliveries(dBody.deliveries || []);
          const packagingList = Array.isArray(pBody.packaging)
            ? pBody.packaging.filter((p) => p.isActive !== false)
            : [];
          setPackagings(packagingList);
        }

        if (token) {
          try {
            const userRes = await fetch(`${BASE}/api/auth/me`, { headers });
            if (userRes.ok) {
              const userBody = await userRes.json();
              if (mounted && userBody.user?.clientCard) {
                setUserCard(userBody.user.clientCard);
              }
            }
          } catch (e) {
            console.error("Error loading user card:", e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadOptions();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <Header />
      <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <Link
            to="/"
            style={{
              color: "var(--color-primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
            }}
          >
            ← Повернутися до каталогу
          </Link>
        </div>

        <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Кошик</h2>

        {items.length === 0 ? (
          <div
            className="card"
            style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "var(--color-text-secondary)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              🛒 Ваш кошик порожній
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{
                display: "inline-block",
                padding: "var(--spacing-md) var(--spacing-xl)",
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "var(--radius-md)",
                transition: "all 0.3s ease",
              }}
            >
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
              }}
            >
              {items.map((i) => (
                <div
                  key={i.id}
                  className="card"
                  style={{
                    padding: "var(--spacing-md)",
                    display: "flex",
                    gap: "var(--spacing-md)",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "var(--color-bg-secondary)",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {i.imageUrl ? (
                      <img
                        src={i.imageUrl}
                        alt={i.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        🎨
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      {i.name}
                    </h3>
                    <p
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "14px",
                        marginBottom: "var(--spacing-sm)",
                      }}
                    >
                      {i.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-md)",
                        flexWrap: "wrap",
                      }}
                    >
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
                            updateQuantity(
                              i.id,
                              Math.max(1, (i.quantity || 1) - 1)
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
                          {i.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(i.id, (i.quantity || 1) + 1)
                          }
                          className="btn-secondary btn-small"
                          style={{ padding: "4px 12px", minWidth: "36px" }}
                        >
                          +
                        </button>
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1.125rem",
                          color: "var(--color-primary)",
                        }}
                      >
                        {typeof i.price === "number"
                          ? `${(i.price * (i.quantity || 1)).toFixed(2)} ₴`
                          : i.price}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(i.id)}
                    className="btn-danger btn-small"
                    style={{ alignSelf: "flex-start" }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {(() => {
              const cartTotal = total();
              const selectedDelivery = deliveries.find(
                (d) => d.id === deliveryId
              );
              const selectedPackaging = packagings.find(
                (p) => p.id === packagingId
              );

              const deliveryPrice = selectedDelivery
                ? selectedDelivery.price || 0
                : 0;
              const packagingPrice = selectedPackaging
                ? selectedPackaging.price || 0
                : 0;

              const maxBonusPoints = Math.floor(cartTotal * 0.5);
              const availableBonusPoints = userCard?.bonusPoints || 0;
              const actualBonusToUse = Math.min(
                bonusPointsToUse,
                maxBonusPoints,
                availableBonusPoints
              );

              const subtotal = cartTotal + packagingPrice + deliveryPrice;
              const finalTotal = Math.max(0, subtotal - actualBonusToUse);

              return (
                <div
                  className="card"
                  style={{
                    padding: "var(--spacing-lg)",
                    backgroundColor: "var(--color-bg-light)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Розрахунок замовлення
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <span>Товари:</span>
                      <span>{cartTotal.toFixed(2)} ₴</span>
                    </div>

                    {selectedPackaging && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        <span>Упаковка:</span>
                        <span>{packagingPrice.toFixed(2)} ₴</span>
                      </div>
                    )}

                    {selectedDelivery && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        <span>Доставка:</span>
                        <span>
                          {selectedDelivery.discountApplied &&
                          selectedDelivery.originalPrice ? (
                            <>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  marginRight: "var(--spacing-xs)",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {selectedDelivery.originalPrice.toFixed(2)} ₴
                              </span>
                              <span style={{ color: "var(--color-success)" }}>
                                {deliveryPrice.toFixed(2)} ₴
                              </span>
                            </>
                          ) : (
                            `${deliveryPrice.toFixed(2)} ₴`
                          )}
                        </span>
                      </div>
                    )}

                    {actualBonusToUse > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          color: "var(--color-success)",
                        }}
                      >
                        <span>Використано бонусів:</span>
                        <span>-{actualBonusToUse.toFixed(2)} ₴</span>
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "var(--spacing-sm)",
                        paddingTop: "var(--spacing-sm)",
                        borderTop: "1px solid var(--color-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                        До сплати:
                      </span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "var(--color-primary)",
                        }}
                      >
                        {finalTotal.toFixed(2)} ₴
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <section className="card" style={{ padding: "var(--spacing-xl)" }}>
              <h3 style={{ marginBottom: "var(--spacing-lg)" }}>
                Оформлення замовлення
              </h3>

              {orderError && (
                <div
                  className="text-error"
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--spacing-md)",
                    fontSize: "14px",
                  }}
                >
                  {orderError}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gap: "var(--spacing-md)",
                  maxWidth: "640px",
                }}
              >
                <div>
                  <label htmlFor="deliveryAddress">Адреса доставки</label>
                  <input
                    id="deliveryAddress"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Вулиця, будинок, квартира"
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
                  <label htmlFor="delivery">Спосіб доставки</label>
                  <select
                    id="delivery"
                    value={deliveryId}
                    onChange={(e) => setDeliveryId(e.target.value)}
                  >
                    <option value="">-- Оберіть спосіб доставки --</option>
                    {deliveries.map((d) => {
                      const deliveryName =
                        d.type === "COURIER"
                          ? "Кур'єрська доставка"
                          : "Самовивіз";
                      const displayPrice =
                        typeof d.price === "number"
                          ? d.price.toFixed(2)
                          : d.price;
                      const originalPrice =
                        d.originalPrice !== undefined
                          ? d.originalPrice.toFixed(2)
                          : null;

                      return (
                        <option key={d.id} value={d.id}>
                          {deliveryName} - {displayPrice} ₴
                          {d.discountApplied &&
                            originalPrice &&
                            ` (знижка з ${originalPrice} ₴)`}
                        </option>
                      );
                    })}
                  </select>
                  {deliveryId &&
                    (() => {
                      const selectedDelivery = deliveries.find(
                        (d) => d.id === deliveryId
                      );
                      if (selectedDelivery?.discountApplied) {
                        return (
                          <div
                            style={{
                              marginTop: "var(--spacing-xs)",
                              fontSize: "12px",
                              color: "var(--color-success)",
                              padding: "var(--spacing-xs)",
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                              borderRadius: "var(--radius-sm)",
                            }}
                          >
                            ✅ Застосовано знижку{" "}
                            {selectedDelivery.discountPercent}% на доставку!
                            {selectedDelivery.originalPrice && (
                              <span
                                style={{ display: "block", marginTop: "2px" }}
                              >
                                Було:{" "}
                                <span
                                  style={{ textDecoration: "line-through" }}
                                >
                                  {selectedDelivery.originalPrice.toFixed(2)} ₴
                                </span>{" "}
                                → Стало:{" "}
                                <strong>
                                  {selectedDelivery.price.toFixed(2)} ₴
                                </strong>
                              </span>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}
                </div>

                <div>
                  <label htmlFor="packaging">Упаковка</label>
                  <select
                    id="packaging"
                    value={packagingId}
                    onChange={(e) => setPackagingId(e.target.value)}
                    required
                  >
                    <option value="">-- Оберіть упаковку --</option>
                    {packagings.map((p) => {
                      const typeNames = {
                        STANDARD: "Стандартна",
                        PREMIUM: "Преміум",
                        ECO: "Еко",
                      };
                      const typeName = typeNames[p.type] || p.type;
                      return (
                        <option key={p.id} value={p.id}>
                          {typeName} -{" "}
                          {typeof p.price === "number"
                            ? p.price.toFixed(2) + " ₴"
                            : p.price}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {userCard &&
                  userCard.bonusPoints > 0 &&
                  (() => {
                    const cartTotal = total();
                    const maxBonusPoints = Math.floor(cartTotal * 0.5);
                    const availableBonusPoints = userCard.bonusPoints;
                    const maxToUse = Math.min(
                      maxBonusPoints,
                      availableBonusPoints
                    );

                    return (
                      <div>
                        <label htmlFor="bonusPoints">
                          Використати бонусні бали
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                              marginLeft: "var(--spacing-xs)",
                            }}
                          >
                            (Доступно: {availableBonusPoints}, максимум:{" "}
                            {maxToUse})
                          </span>
                        </label>
                        <input
                          id="bonusPoints"
                          type="number"
                          min="0"
                          max={maxToUse}
                          value={bonusPointsToUse}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(maxToUse, parseInt(e.target.value) || 0)
                            );
                            setBonusPointsToUse(value);
                          }}
                          placeholder="0"
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            marginTop: "var(--spacing-xs)",
                          }}
                        >
                          Можна використати максимум 50% від суми товарів (
                          {maxBonusPoints} бонусів)
                        </div>
                      </div>
                    );
                  })()}

                <div>
                  <label htmlFor="notes">Примітки до замовлення</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Додаткові побажання..."
                    rows={4}
                  />
                </div>

                <div>
                  <button
                    disabled={loadingOrder}
                    onClick={async () => {
                      setOrderError(null);
                      const token = getToken();
                      if (!token) {
                        navigate("/login", { state: { from: location } });
                        return;
                      }

                      const cartTotal = total();
                      const maxBonusPoints = Math.floor(cartTotal * 0.5);
                      const availableBonusPoints = userCard?.bonusPoints || 0;
                      const actualBonusToUse = Math.min(
                        bonusPointsToUse,
                        maxBonusPoints,
                        availableBonusPoints
                      );

                      const payload = {
                        items: items.map((i) => ({
                          bouquetId: String(i.id),
                          quantity: Number(i.quantity || 1),
                        })),
                        deliveryId: deliveryId || null,
                        packagingId: packagingId || null,
                        deliveryAddress: deliveryAddress || null,
                        notes: notes || null,
                        bonusPointsToUse:
                          actualBonusToUse > 0 ? actualBonusToUse : null,
                      };

                      try {
                        orderSchema.parse(payload);
                      } catch (err) {
                        setOrderError(
                          err?.errors?.[0]?.message || "Validation failed"
                        );
                        return;
                      }

                      try {
                        setLoadingOrder(true);
                        const res = await fetch(`${BASE}/api/orders`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            ...authHeaders(),
                          },
                          body: JSON.stringify(payload),
                        });
                        const body = (await (
                          res.headers.get("content-type") || ""
                        ).includes("application/json"))
                          ? await res.json()
                          : null;
                        if (!res.ok) {
                          setOrderError(
                            body?.error || body || `Error ${res.status}`
                          );
                          return;
                        }
                        clearCart();
                        navigate("/profile");
                      } catch (e) {
                        setOrderError(e?.message || "Order failed");
                      } finally {
                        setLoadingOrder(false);
                      }
                    }}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "var(--spacing-md)",
                      fontSize: "18px",
                      marginTop: "var(--spacing-sm)",
                    }}
                  >
                    {loadingOrder
                      ? "⏳ Відправка..."
                      : "✅ Оформити замовлення"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
