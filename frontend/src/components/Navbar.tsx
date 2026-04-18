"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Car, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: "white", borderBottom: "1.5px solid black", sticky: "top", top: 0, zIndex: 1000 }}>
      {/* Top Banner (Optional for higher-end feel) */}
      <div style={{ background: "black", color: "white", fontSize: 10, textAlign: "center", padding: "4px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        Join DriveEase Platinum for Exclusive Rates & Priority Booking
      </div>
      
      <nav className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <div style={{ background: "var(--color-primary)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={24} color="white" />
          </div>
          <div style={{ background: "black", padding: "8px 16px", display: "flex", alignItems: "center" }}>
            <span className="font-display" style={{ fontWeight: 900, fontSize: 18, color: "white", letterSpacing: 1 }}>
              DriveEase
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <NavLink href="/catalog">The Fleet</NavLink>
          <NavLink href="/#services">Services</NavLink>
          <NavLink href="/#membership">Membership</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <NavLink href="/my-bookings">Activity</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              <button onClick={logout} className="btn-secondary" style={{ padding: "8px 16px" }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Link href="/login" style={{ fontSize: 12, fontWeight: 800, color: "black", textDecoration: "none", textTransform: "uppercase" }}>Login</Link>
              <Link href="/register" className="btn-primary">Become a Member</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-only" 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "black" }}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-only animate-fade" style={{ 
          position: "fixed", top: 104, left: 0, width: "100%", height: "calc(100vh - 104px)", 
          background: "white", zIndex: 999, padding: 30, display: "flex", flexDirection: "column", gap: 40 
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Link href="/catalog" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>The Fleet</Link>
            <Link href="/#services" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Services</Link>
            <Link href="/#membership" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Membership</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>About Us</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Contact</Link>
          </div>
          
          <div style={{ marginTop: "auto", borderTop: "1px solid #eee", paddingTop: 30 }}>
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Link href="/my-bookings" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>My Activity</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>My Profile</Link>
                <button onClick={logout} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Become a Member</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: "black", textDecoration: "none", fontSize: 12, fontWeight: 800, 
      textTransform: "uppercase", letterSpacing: 0.5, transition: "color 0.2s"
    }}
    onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
    onMouseLeave={(e) => e.currentTarget.style.color = "black"}
    >
      {children}
    </Link>
  );
}

const mobileLinkStyle = {
  fontSize: 24,
  fontWeight: 900,
  textTransform: "uppercase" as const,
  color: "black",
  textDecoration: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};
