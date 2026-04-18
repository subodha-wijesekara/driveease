"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  Car, ArrowRight, Shield, Clock, Star, Zap,
  Settings2, ChevronRight, Plus, 
} from "lucide-react";

const FEATURED_VEHICLES = [
  {
    id: "1",
    name: "COROLLA HYBRID",
    category: "Modern Sedan",
    img: "/images/fleet_sedan.png",
    price: 65,
    rating: 4.9,
    seats: 5,
    fuel: "Hybrid",
    transmission: "Auto",
  },
  {
    id: "2",
    name: "LAND CRUISER 300",
    category: "Flagship SUV",
    img: "/images/fleet_suv.png",
    price: 180,
    rating: 4.8,
    seats: 7,
    fuel: "Diesel",
    transmission: "Auto",
  },
  {
    id: "3",
    name: "GR SUPRA",
    category: "Performance",
    img: "/images/fleet_sports.png",
    price: 250,
    rating: 5.0,
    seats: 2,
    fuel: "Petrol",
    transmission: "Auto",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{ background: "white" }}>
      {/* ═══ HERO SECTION ═══ */}
      <section style={{ padding: "40px 0", borderBottom: "1.5px solid #eee" }}>
        <div className="page-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>
          <div className="animate-fade">
            <div className="divider-red" style={{ marginBottom: 20 }} />
            <h1 className="font-display" style={{ 
              fontSize: "clamp(42px, 8vw, 84px)", 
              lineHeight: 0.9, 
              fontWeight: 900, 
              marginBottom: 32,
              color: "black" 
            }}>
              QUALITY.<br />
              DURABILITY.<br />
              <span className="text-toyota-red">RELIABILITY.</span>
            </h1>
            
            <p style={{ fontSize: "clamp(16px, 2vw, 18px)", color: "#444", lineHeight: 1.6, marginBottom: 40, maxWidth: 500, fontWeight: 500 }}>
              At DriveEase, we provide a premium fleet of vehicles meticulously maintained to ensure your journey is as smooth as the engineering behind them.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
              <Link href="/catalog" className="btn-primary" style={{ padding: "16px 32px" }}>
                Browse Fleet <ArrowRight size={18} />
              </Link>
              {!user && (
                <Link href="/register" className="btn-secondary" style={{ padding: "16px 32px" }}>
                  Join Membership
                </Link>
              )}
            </div>

            <div style={{ marginTop: 60, display: "flex", gap: 40 }}>
              <div style={statBoxStyle}>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Outfit'" }}>500+</div>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#888", letterSpacing: 1 }}>Fleet Size</div>
              </div>
              <div style={statBoxStyle}>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Outfit'" }}>24/7</div>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#888", letterSpacing: 1 }}>Support</div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }} className="animate-fade">
            <div style={{ background: "#fcfcfc", border: "1.5px solid #eee", padding: 20 }}>
              <Image src="/car_sedan.png" alt="Featured Car" width={800} height={500} style={{ width: "100%", height: "auto", objectFit: "contain" }} priority />
            </div>
            <div style={{ 
              position: "absolute", bottom: -15, left: -15, width: 80, height: 80, 
              borderLeft: "6px solid var(--color-primary)", borderBottom: "6px solid var(--color-primary)",
              zIndex: -1
            }} />
          </div>
        </div>
      </section>

      {/* ═══ FEATURED FLEET ═══ */}
      <section style={{ padding: "80px 0" }}>
        <div className="page-container">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 50, gap: 20 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: clampSize(28, 42), color: "black", marginBottom: 12 }}>
                PROVEN <span className="text-toyota-red">FLEET</span>
              </h2>
              <p style={{ color: "#666", fontWeight: 600, fontSize: 14 }}>Our most reserved precision-engineered vehicles.</p>
            </div>
            <Link href="/catalog" style={{ color: "black", fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase", fontSize: 12 }}>
              View Complete Fleet <Plus size={16} color="var(--color-primary)" />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
            {FEATURED_VEHICLES.map((v) => (
              <FeaturedCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUE PROPOSITION ═══ */}
      <section id="services" style={{ background: "black", color: "white", padding: "100px 0" }}>
        <div className="page-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 80, alignItems: "center" }}>
          <div>
            <h2 className="font-display" style={{ fontSize: clampSize(36, 56), lineHeight: 1, marginBottom: 40 }}>
              BEYOND the<br /><span className="text-toyota-red">STANDARD.</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {[
                { icon: <Shield size={24} />, title: "TOTAL PEACE OF MIND", desc: "Every rental includes premium protection and roadside assistance." },
                { icon: <Settings2 size={24} />, title: "QUALITY ASSURANCE", desc: "Vehicles undergo a rigorous 150-point inspection by certified technicians." },
                { icon: <Clock size={24} />, title: "SEAMLESS LOGISTICS", desc: "Contactless pickup and drop-off at over 50 convenient locations." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 24 }}>
                  <div style={{ color: "var(--color-primary)", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <h4 style={{ fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{title}</h4>
                    <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: "1.5px solid #333", padding: 20 }}>
            <Image src="/car_suv.png" alt="Toyota SUV" width={600} height={400} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section id="membership" style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="page-container">
          <div style={{ maxWidth: 800, margin: "0 auto", border: "4px solid #f8f8f8", padding: "60px 20px" }}>
            <h2 className="font-display" style={{ fontSize: clampSize(28, 48), marginBottom: 20 }}>READY FOR THE ROAD?</h2>
            <p style={{ fontSize: 16, color: "#666", marginBottom: 40, fontWeight: 500 }}>
              Join the DriveEase community today and experience a higher standard of vehicle rental.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 15, justifyContent: "center" }}>
              <Link href="/register" className="btn-primary" style={{ padding: "16px 40px" }}>
                Start Membership
              </Link>
              <Link href="/catalog" className="btn-secondary" style={{ padding: "16px 40px" }}>
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ vehicle }: any) {
  return (
    <Link href={`/catalog/${vehicle.id}`} style={{ textDecoration: "none", color: "black" }}>
      <div className="vehicle-card" style={{ background: "white", padding: 0 }}>
        <div style={{ background: "#fdfdfd", padding: 30, textAlign: "center", borderBottom: "1.5px solid #eee", position: "relative" }}>
          <Image src={vehicle.img} alt={vehicle.name} width={400} height={250} style={{ width: "90%", height: "auto", objectFit: "contain" }} />
          <div style={{ position: "absolute", top: 0, left: 0, background: "black", color: "white", padding: "6px 12px", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>
            {vehicle.category}
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px" }}>{vehicle.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={14} fill="var(--color-primary)" stroke="var(--color-primary)" />
              <span style={{ fontWeight: 800 }}>{vehicle.rating}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1.5px solid black" }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>${vehicle.price}<span style={{ fontSize: 12, color: "#888" }}>/DAY</span></div>
            <div style={{ background: "black", color: "white", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const statBoxStyle = {
  borderLeft: "4px solid var(--color-primary)",
  paddingLeft: 20
};

const clampSize = (min: number, max: number) => `clamp(${min}px, 5vw, ${max}px)`;
