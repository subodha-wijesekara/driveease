"use client";

import { useEffect, useState } from "react";
import { bookingsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, Package, Loader2, X } from "lucide-react";

interface Booking {
  id: number; rentalStartDate: string; rentalEndDate: string; rentalDays: number;
  status: string; totalPrice: number; createdAt: string;
  items: { equipmentItemName: string; quantity: number; lineTotal: number }[];
}

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const apiStatus = statusFilter === "ALL" ? undefined : statusFilter;
    bookingsApi.getMyBookings(page, apiStatus).then(r => {
      setBookings(r.data.data?.content || []);
      setTotalPages(r.data.data?.totalPages || 1);
    }).finally(() => setLoading(false));
  }, [user, page, statusFilter]);

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this booking?")) return;
    await bookingsApi.cancelBooking(id);
    setBookings(b => b.map(x => x.id === id ? { ...x, status: "CANCELLED" } : x));
  };

  const statuses = ["ALL", "PENDING", "CONFIRMED", "PICKED_UP", "RETURNED", "OVERDUE", "CANCELLED"];

  if (isLoading || loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <Loader2 size={32} color="black" className="animate-spin" />
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", padding: "40px 24px", background: "white" }}>
      <div className="page-container">
        {/* Header Section */}
        <div style={{ marginBottom: 40 }}>
          <div className="font-display" style={{ fontSize: 13, fontWeight: 800, color: "var(--color-primary)", letterSpacing: 2, marginBottom: 8 }}>
            ACTIVITY
          </div>
          <h1 className="font-display" style={{ fontSize: 40, fontWeight: 900, marginBottom: 8, textTransform: "uppercase" }}>
            My Bookings
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: 16 }}>Track and manage your rental fleet orders.</p>
        </div>

        {/* Filter Bar */}
        <div style={{ 
          display: "flex", 
          gap: 12, 
          marginBottom: 40, 
          overflowX: "auto", 
          paddingBottom: 8,
          scrollbarWidth: "none"
        }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`chip ${statusFilter === s ? "active" : ""}`}
              style={{ 
                height: "44px", 
                padding: "0 24px", 
                fontSize: 12, 
                fontWeight: 800,
                letterSpacing: 1
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div style={{ 
            border: "2px solid black", 
            textAlign: "center", 
            padding: "80px 40px",
            background: "white" 
          }}>
            <Package size={48} style={{ color: "black", margin: "0 auto 24px" }} />
            <h3 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, textTransform: "uppercase" }}>
              No bookings found
            </h3>
            <p style={{ color: "var(--color-muted)", marginBottom: 32, fontSize: 16 }}>
              {statusFilter === "ALL" 
                ? "You haven't made any bookings yet." 
                : `No bookings found with status [${statusFilter}].`}
            </p>
            <button onClick={() => router.push("/catalog")} className="btn-primary">
              EXPLORE THE FLEET
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {bookings.map(b => (
              <div key={b.id} className="vehicle-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* Top Bar */}
                  <div style={{ 
                    background: "black", 
                    color: "white", 
                    padding: "12px 24px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center" 
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>
                      ORD-#{b.id.toString().padStart(6, '0')}
                    </div>
                    <div style={{ 
                      fontSize: 11, 
                      fontWeight: 900, 
                      padding: "4px 12px", 
                      background: b.status === "CANCELLED" ? "#333" : "var(--color-primary)",
                      color: "white",
                      textTransform: "uppercase"
                    }}>
                      {b.status}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "32px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
                    <div style={{ flex: 1, minWidth: 300 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
                        <Calendar size={16} color="var(--color-primary)" />
                        {b.rentalStartDate} <span style={{ color: "var(--color-muted)" }}>TO</span> {b.rentalEndDate}
                        <span style={{ marginLeft: 12, padding: "2px 8px", background: "#f0f0f0", fontSize: 11, fontWeight: 800 }}>
                          {b.rentalDays} DAYS
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {b.items.map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ 
                              width: 8, 
                              height: 8, 
                              background: "black" 
                            }}></div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>
                              {item.quantity}× {item.equipmentItemName}
                            </div>
                            <div style={{ color: "var(--color-muted)", fontSize: 14 }}>
                              ${Number(item.lineTotal).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div className="font-display" style={{ fontSize: 12, fontWeight: 800, color: "var(--color-muted)", marginBottom: 4 }}>
                        TOTAL INVESTMENT
                      </div>
                      <div className="font-display" style={{ fontSize: 36, fontWeight: 900, color: "black", lineHeight: 1 }}>
                        <span style={{ fontSize: 20, verticalAlign: "top", marginRight: 2 }}>$</span>
                        {Number(b.totalPrice).toFixed(2)}
                      </div>
                      
                      {b.status === "PENDING" && (
                        <button 
                          onClick={() => handleCancel(b.id)} 
                          className="btn-secondary"
                          style={{ marginTop: 24, padding: "8px 20px" }}
                        >
                          <X size={14} /> CANCEL ORDER
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 56 }}>
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))} 
              disabled={page === 0} 
              className="btn-secondary"
              style={{ width: 120, justifyContent: "center" }}
            >
              PREV
            </button>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              width: 60, 
              border: "1.5px solid black",
              fontWeight: 800,
              fontSize: 14
            }}>
              {page + 1}/{totalPages}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={page >= totalPages - 1} 
              className="btn-secondary"
              style={{ width: 120, justifyContent: "center" }}
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
