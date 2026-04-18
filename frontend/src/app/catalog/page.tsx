"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { equipmentApi } from "@/lib/api";
import {
  Search, ChevronLeft, ChevronRight, Loader2,
  Car, Star, Users, Fuel, Settings2, SlidersHorizontal, X, Plus, ArrowRight
} from "lucide-react";

interface Category { id: number; name: string; }
interface Item {
  id: number; name: string; description: string; dailyRate: number;
  totalStock: number; itemCondition: string; imageUrl: string; categoryName: string;
  seats: number; fuelType: string;
}

const VEHICLE_IMAGES: Record<number, string> = {
  0: "/images/fleet_sedan.png",
  1: "/images/fleet_suv.png",
  2: "/images/fleet_sports.png",
};

export default function CatalogPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    equipmentApi.getCategories().then(r => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = selectedCategory
      ? equipmentApi.getItemsByCategory(selectedCategory)
      : equipmentApi.getItems(page, 12);

    fetch.then(r => {
      if (selectedCategory) {
        setItems(r.data.data || []);
        setTotalPages(1);
      } else {
        setItems(r.data.data?.content || []);
        setTotalPages(r.data.data?.totalPages || 1);
      }
    }).finally(() => setLoading(false));
  }, [selectedCategory, page]);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* ─── Page Header ─── */}
      <div style={{ borderBottom: "1.5px solid black", background: "#fcfcfc" }}>
        <div className="page-container" style={{ padding: "40px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
            <div>
              <div className="divider-red" style={{ marginBottom: 15 }} />
              <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "black", margin: 0 }}>
                THE <span className="text-toyota-red">FLEET</span>
              </h1>
              <p style={{ color: "#666", fontWeight: 600, marginTop: 10, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Engineered for Reliability. Driven by Passion.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
               <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Outfit'", lineHeight: 1 }}>{filtered.length}</div>
               <div style={{ fontSize: 10, fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Models Available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ padding: "40px 20px 80px" }}>
        {/* ─── Controls ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
          {/* Search Bar */}
          <div style={{ display: "flex", border: "1.5px solid black", background: "white" }}>
            <div style={{ padding: "0 20px", display: "flex", alignItems: "center" }}>
              <Search size={18} color="black" />
            </div>
            <input
              className="form-input"
              placeholder="SEARCH BY MODEL NAME..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: "none", padding: "16px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ border: "none", background: "none", padding: "0 20px", cursor: "pointer" }}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category Filter Scrollable */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 5, scrollbarWidth: "none" }}>
             <button
               onClick={() => { setSelectedCategory(null); setPage(0); }}
               className={`chip ${!selectedCategory ? "active" : ""}`}
             >
               ALL VEHICLES
             </button>
             {categories.map(c => (
               <button
                 key={c.id}
                 onClick={() => { setSelectedCategory(c.id); setPage(0); }}
                 className={`chip ${selectedCategory === c.id ? "active" : ""}`}
               >
                 {c.name}
               </button>
             ))}
          </div>
        </div>

        {/* ─── Fleet Grid ─── */}
        {loading ? (
          <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
              <p style={{ marginTop: 10, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>Loading Inventory...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", border: "2px dashed #f0f0f0" }}>
            <Car size={48} color="#ddd" style={{ marginBottom: 16 }} />
            <h2 className="font-display" style={{ fontSize: 24, color: "#aaa" }}>No Vehicles Match Your Search</h2>
            <p style={{ color: "#ccc", fontSize: 13, marginTop: 8 }}>Try adjusting your filters or search keywords.</p>
            <button onClick={() => { setSearch(""); setSelectedCategory(null); }} className="btn-secondary" style={{ marginTop: 24 }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 }}>
            {filtered.map((item, idx) => (
              <VehicleCard key={item.id} item={item} idx={idx} />
            ))}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {!selectedCategory && totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
            <div style={{ display: "flex", border: "1.5px solid black" }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{ padding: "12px 20px", border: "none", background: "white", fontWeight: 900, cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.2 : 1 }}
              >
                <ChevronLeft size={18} />
              </button>
              <div style={{ padding: "0 25px", display: "flex", alignItems: "center", borderLeft: "1.5px solid black", borderRight: "1.5px solid black", fontWeight: 900, fontSize: 14 }}>
                 {page + 1} / {totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{ padding: "12px 20px", border: "none", background: "black", color: "white", fontWeight: 900, cursor: page >= totalPages - 1 ? "default" : "pointer", opacity: page >= totalPages - 1 ? 0.2 : 1 }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleCard({ item, idx }: any) {
  return (
    <Link href={`/catalog/${item.id}`} style={{ textDecoration: "none", color: "black", display: "block" }}>
      <div className="vehicle-card" style={{ height: "100%", background: "white" }}>
        <div style={{ background: "#fdfdfd", padding: "30px", borderBottom: "1.5px solid black", position: "relative", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <Image
             src={item.imageUrl || VEHICLE_IMAGES[idx % 3]}
             alt={item.name}
             width={300}
             height={200}
             style={{ width: "90%", height: "auto", objectFit: "contain" }}
             onError={(e) => { (e.target as HTMLImageElement).src = VEHICLE_IMAGES[idx % 3]; }}
           />
           <div style={{ position: "absolute", top: 0, left: 0, background: "black", color: "white", padding: "6px 12px", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>
             {item.categoryName || "Premium"}
           </div>
           <div style={{ position: "absolute", bottom: -1, right: 15, background: "var(--color-primary)", color: "white", padding: "8px 15px", fontSize: 12, fontWeight: 900 }}>
             ${Number(item.dailyRate).toFixed(0)} / DAY
           </div>
        </div>
        <div style={{ padding: "20px" }}>
           <h3 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.5px" }}>{item.name}</h3>
           
           <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 15, marginBottom: 20 }}>
              <div style={specStyle}><Users size={12} /> {item.seats || 5} SEATS</div>
              <div style={specStyle}><Fuel size={12} /> {item.fuelType?.toUpperCase() || "HYBRID"}</div>
              <div style={specStyle}><Settings2 size={12} /> AUTO</div>
           </div>

           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase" }}>
                VIEW SPECS
              </div>
              <div style={{ border: "1.5px solid black", padding: "8px 16px", fontWeight: 900, fontSize: 11, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
                Book <ArrowRight size={14} />
              </div>
           </div>
        </div>
      </div>
    </Link>
  );
}

const specStyle = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  fontSize: 10,
  fontWeight: 800,
  color: "#888",
  background: "#f8f8f8",
  padding: "4px 8px"
};
