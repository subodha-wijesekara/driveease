"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { equipmentApi, bookingsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Package, Star, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Item {
  id: number; name: string; description: string; dailyRate: number;
  totalStock: number; itemCondition: string; imageUrl: string;
  categoryName: string; createdAt: string;
  seats: number; fuelType: string;
}

interface Availability {
  available: boolean; availableQuantity: number;
  bookedQuantity: number; totalStock: number;
}

const CAMP_IMAGES = [
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
  "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
];

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    equipmentApi.getItem(Number(id)).then(r => setItem(r.data.data));
  }, [id]);

  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    setCheckingAvail(true);
    setAvailability(null);
    try {
      const r = await equipmentApi.checkAvailability(Number(id), startDate, endDate, quantity);
      setAvailability(r.data.data);
    } finally {
      setCheckingAvail(false);
    }
  };

  const handleBook = async () => {
    if (!user) { router.push("/login"); return; }
    setBooking(true);
    setError("");
    try {
      await bookingsApi.create({
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        items: [{ equipmentItemId: Number(id), quantity }],
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const rentalDays = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1)
    : 0;

  if (!item) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <Loader2 size={32} color="var(--color-primary)" className="animate-spin" />
    </div>
  );

  if (success) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="glass-card" style={{ textAlign: "center", padding: 56, maxWidth: 420 }}>
        <CheckCircle size={56} color="#4ade80" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Booking Confirmed!</h2>
        <p style={{ color: "var(--color-muted)", marginBottom: 28 }}>
          Your booking for <strong>{item.name}</strong> has been submitted and is pending confirmation.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/my-bookings")} className="btn-primary">View My Bookings</button>
          <button onClick={() => router.push("/catalog")} className="btn-secondary">Back to Catalog</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", padding: "40px 24px" }}>
      <div className="page-container">
        <button onClick={() => router.back()} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: "var(--color-muted)", cursor: "pointer", fontSize: 14, marginBottom: 24, padding: 0,
        }}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>
          {/* Left — Item details */}
          <div>
            <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 28, height: 360 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl || CAMP_IMAGES[0]} alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.target as HTMLImageElement).src = CAMP_IMAGES[0]; }} />
            </div>

            <span style={{ fontSize: 12, color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {item.categoryName}
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 16px" }}>{item.name}</h1>

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <span className={`badge badge-${item.itemCondition?.toLowerCase()}`}>
                Condition: {item.itemCondition}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-muted)", fontSize: 14 }}>
                <Package size={15} /> {item.totalStock} units total
              </span>
            </div>

            <p style={{ color: "var(--color-muted)", lineHeight: 1.8, fontSize: 15, marginBottom: 30 }}>
              {item.description || "Premium camping equipment ready for your next adventure. All gear is carefully inspected before each rental."}
            </p>

            <div style={{ padding: 24, background: "#f8f8f8", border: "1.5px solid #eee", marginBottom: 40 }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Vehicle Specifications</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 20 }}>
                <SpecItem icon={<Star size={16} />} label="Transmission" value="Automatic" />
                <SpecItem icon={<Package size={16} />} label="Capacity" value={`${item.seats || 5} Seats`} />
                <SpecItem icon={<Star size={16} />} label="Fuel Type" value={item.fuelType || "Hybrid"} />
                <SpecItem icon={<Star size={16} />} label="Condition" value={item.itemCondition} />
              </div>
            </div>
          </div>

          {/* Right — Booking panel */}
          <div className="glass-card" style={{ padding: 28, position: "sticky", top: 90 }}>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--color-primary)" }}>
                ${Number(item.dailyRate).toFixed(2)}
              </span>
              <span style={{ color: "var(--color-muted)", fontSize: 14 }}> per day</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-muted)", marginBottom: 6 }}>
                  <Calendar size={14} style={{ display: "inline", marginRight: 4 }} /> Start Date
                </label>
                <input type="date" className="form-input" value={startDate} min={today}
                  onChange={e => { setStartDate(e.target.value); setAvailability(null); }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-muted)", marginBottom: 6 }}>
                  <Calendar size={14} style={{ display: "inline", marginRight: 4 }} /> End Date
                </label>
                <input type="date" className="form-input" value={endDate} min={startDate || today}
                  onChange={e => { setEndDate(e.target.value); setAvailability(null); }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-muted)", marginBottom: 6 }}>Quantity</label>
                <input type="number" min={1} max={item.totalStock} className="form-input" value={quantity}
                  onChange={e => { setQuantity(Number(e.target.value)); setAvailability(null); }} />
              </div>

              <button onClick={checkAvailability} disabled={!startDate || !endDate || checkingAvail}
                className="btn-secondary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {checkingAvail ? <><Loader2 size={16} className="animate-spin" /> Checking...</> : "Check Availability"}
              </button>

              {availability && (
                <div style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: availability.available ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${availability.available ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                    color: availability.available ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                    {availability.available ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {availability.available ? "Available!" : "Not available for these dates"}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--color-muted)" }}>
                    {availability.availableQuantity} of {availability.totalStock} units free
                  </p>
                </div>
              )}

              {rentalDays > 0 && (
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-muted)", fontSize: 14, marginBottom: 4 }}>
                    <span>${Number(item.dailyRate).toFixed(2)} × {quantity} × {rentalDays} days</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
                    <span>Total</span>
                    <span style={{ color: "var(--color-primary)" }}>
                      ${(Number(item.dailyRate) * quantity * rentalDays).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button id="book-btn" onClick={handleBook} className="btn-primary"
                disabled={!availability?.available || booking}
                style={{ width: "100%", justifyContent: "center", opacity: !availability?.available ? 0.5 : 1 }}>
                {booking ? <><Loader2 size={16} className="animate-spin" /> Booking...</> : user ? "Book Now" : "Sign In to Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function SpecItem({ icon, label, value }: any) {
  return (
    <div>
      <div style={{ color: "#888", fontSize: 10, fontWeight: 800, textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, textTransform: "uppercase" }}>{value}</div>
    </div>
  );
}
