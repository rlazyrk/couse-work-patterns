import useCart from "../store/cartStore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authHeaders, getToken } from "../api/auth";
import { useEffect, useState } from "react";
import { orderSchema } from "../utils/schemas";
import Header from "../components/Header";

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

  useEffect(() => {
    let mounted = true;
    async function loadOptions() {
      try {
        const dRes = await fetch(`${BASE}/api/deliveries`);
        const pRes = await fetch(`${BASE}/api/packaging`);
        if (!dRes.ok || !pRes.ok) return;
        const dBody = await dRes.json();
        const pBody = await pRes.json();
        if (mounted) {
          setDeliveries(dBody.deliveries || []);
          setPackagings(pBody.packagings || []);
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
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <Link to="/">← Повернутися</Link>
        </div>
        <h2>Корзина</h2>
        {items.length === 0 ? (
          <div>Кошик порожній.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((i) => (
              <div
                key={i.id}
                style={{
                  border: "1px solid #eee",
                  padding: 12,
                  borderRadius: 8,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ width: 80, height: 80, background: "#fafafa" }}>
                  {i.imageUrl && (
                    <img
                      src={i.imageUrl}
                      alt={i.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{i.name}</div>
                  <div style={{ color: "#666" }}>{i.description}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    gap: 6,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>
                    {typeof i.price === "number"
                      ? `${i.price.toFixed(2)} ₴`
                      : i.price}
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        updateQuantity(i.id, Math.max(1, (i.quantity || 1) - 1))
                      }
                    >
                      -
                    </button>
                    <span style={{ padding: "0 8px" }}>{i.quantity || 1}</span>
                    <button
                      onClick={() =>
                        updateQuantity(i.id, (i.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => remove(i.id)} style={{ marginTop: 6 }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ fontWeight: 800, marginTop: 12 }}>
              Total: {total().toFixed(2)} ₴
            </div>
            <hr />

            <section
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <h3>Оформлення замовлення</h3>
              {orderError && <div style={{ color: "red" }}>{orderError}</div>}
              <div style={{ display: "grid", gap: 8, maxWidth: 640 }}>
                <label>
                  Адреса доставки
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Вулиця, будинок, квартира"
                  />
                </label>

                {/* User should not pick delivery date */}

                <label>
                  Доставка
                  <select
                    value={deliveryId}
                    onChange={(e) => setDeliveryId(e.target.value)}
                  >
                    <option value="">-- обрати --</option>
                    {deliveries.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} (
                        {typeof d.price === "number" ? d.price + "₴" : d.price})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Пакування
                  <select
                    value={packagingId}
                    onChange={(e) => setPackagingId(e.target.value)}
                  >
                    <option value="">-- обрати --</option>
                    {packagings.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (
                        {typeof p.price === "number" ? p.price + "₴" : p.price})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Примітки
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>

                <div>
                  <button
                    disabled={loadingOrder}
                    onClick={async () => {
                      setOrderError(null);
                      const token = getToken();
                      if (!token) {
                        // redirect to login preserving return to cart
                        navigate("/login", { state: { from: location } });
                        return;
                      }

                      const payload = {
                        items: items.map((i) => ({
                          bouquetId: String(i.id),
                          quantity: Number(i.quantity || 1),
                        })),
                        deliveryId: deliveryId || null,
                        packagingId: packagingId || null,
                        deliveryAddress: deliveryAddress || null,
                        notes: notes || null,
                      };

                      // client-side validation
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
                        // success
                        clearCart();
                        navigate("/profile");
                      } catch (e) {
                        setOrderError(e?.message || "Order failed");
                      } finally {
                        setLoadingOrder(false);
                      }
                    }}
                  >
                    {loadingOrder ? "Sending..." : "Оформити замовлення"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
