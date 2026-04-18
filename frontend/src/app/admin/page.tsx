"use client";

import { useEffect, useState } from "react";
import { bookingsApi, equipmentApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, BookOpen, Users, Loader2, ChevronDown } from "lucide-react";

interface Booking {
  id: number; customerName: string; customerEmail: string;
  rentalStartDate: string; rentalEndDate: string; rentalDays: number;
  status: string; totalPrice: number; adminNotes: string;
  items: { equipmentItemName: string; quantity: number }[];
}

const STATUSES = ["PENDING","CONFIRMED","PICKED_UP","RETURNED","OVERDUE","CANCELLED"];

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, isLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    bookingsApi.getAllBookings(page).then(r => {
      setBookings(r.data.data?.content || []);
      setTotalPages(r.data.data?.totalPages || 1);
    }).finally(() => setLoading(false));
  }, [isAdmin, page]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const res = await bookingsApi.updateStatus(id, status);
      setBookings(b => b.map(x => x.id === id ? { ...x, status: res.data.data.status } : x));
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading || loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <Loader2 size={32} color="var(--color-primary)" className="animate-spin" />
    </div>
  );

  const statusCounts = STATUSES.reduce((acc, s) => ({
    ...acc, [s]: bookings.filter(b => b.status === s).length
  }), {} as Record<string, number>);

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", padding: "40px 24px" }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LayoutDashboard size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin <span className="gradient-text">Dashboard</span></h1>
            <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Manage bookings and inventory</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total", value: bookings.length, color: "#f97316" },
            { label: "Pending", value: statusCounts["PENDING"] || 0, color: "#fbbf24" },
            { label: "Active", value: (statusCounts["CONFIRMED"] || 0) + (statusCounts["PICKED_UP"] || 0), color: "#60a5fa" },
            { label: "Overdue", value: statusCounts["OVERDUE"] || 0, color: "#f87171" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>{label} Bookings</div>
            </div>
          ))}
        </div>

        {/* Links to manage inventory */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          <button onClick={() => router.push("/admin/equipment")} className="btn-primary" style={{ fontSize: 14 }}>
            <Package size={16} /> Manage Equipment
          </button>
        </div>

        {/* Bookings table */}
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>All Bookings</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["ID","Customer","Items","Dates","Days","Total","Status","Action"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--color-muted)", fontWeight: 500, fontSize: 12 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id} style={{
                    borderBottom: "1px solid var(--color-border)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                  }}>
                    <td style={{ padding: "14px 16px", color: "var(--color-muted)" }}>#{b.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{b.customerEmail}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {b.items.map((it, j) => (
                        <div key={j} style={{ fontSize: 12, color: "var(--color-muted)" }}>
                          {it.quantity}× {it.equipmentItemName}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--color-muted)" }}>
                      {b.rentalStartDate}<br/>{b.rentalEndDate}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--color-muted)" }}>{b.rentalDays}d</td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--color-primary)" }}>
                      ${Number(b.totalPrice).toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {updatingId === b.id ? (
                        <Loader2 size={16} className="animate-spin" color="var(--color-primary)" />
                      ) : (
                        <div style={{ position: "relative" }}>
                          <select defaultValue={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                            style={{
                              background: "var(--color-card)", border: "1px solid var(--color-border)",
                              color: "var(--color-text)", borderRadius: 8, padding: "6px 12px",
                              fontSize: 12, cursor: "pointer", outline: "none",
                            }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "var(--color-muted)" }}>
                <BookOpen size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                No bookings found.
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary">Previous</button>
            <span style={{ color: "var(--color-muted)", display: "flex", alignItems: "center", fontSize: 14 }}>
              {page + 1} / {totalPages}
            </span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="btn-secondary">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
