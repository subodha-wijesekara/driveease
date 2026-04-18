"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { Flame, Eye, EyeOff, Loader2, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authApi.register(form);
      const { data } = res.data;
      login({ ...data });
      router.push("/catalog");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "row" }}>
      {/* Left: Hero Section */}
      <div className="desktop-only" style={{ 
        flex: 1, 
        position: "relative", 
        background: "black",
        overflow: "hidden"
      }}>
        <img 
          src="/images/fleet_suv.png" 
          alt="Register Hero" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
        />
        <div style={{ 
          position: "absolute", 
          bottom: 60, 
          left: 60, 
          color: "white" 
        }}>
          <div className="divider-red" style={{ marginBottom: 20 }}></div>
          <h2 className="font-display" style={{ fontSize: 42, maxWidth: 400 }}>Built for Adventure</h2>
          <p style={{ opacity: 0.8, fontSize: 16, marginTop: 10 }}>Start your journey with the ultimate fleet.</p>
        </div>
      </div>

      {/* Right: Form Section */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "40px 24px",
        background: "white"
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div className="font-display" style={{ fontSize: 13, fontWeight: 800, color: "var(--color-primary)", letterSpacing: 2, marginBottom: 8 }}>
              MEMBERSHIP
            </div>
            <h1 className="font-display" style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Join the Fleet</h1>
            <p style={{ color: "var(--color-muted)", fontSize: 15 }}>Create an account to start booking.</p>
          </div>

          {error && (
            <div style={{
              background: "black",
              padding: "16px",
              marginBottom: 24,
              color: "white",
              fontSize: 14,
              borderLeft: "4px solid var(--color-primary)"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="font-display" style={{ display: "block", fontSize: 12, fontWeight: 800, color: "black", marginBottom: 8 }}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="JOHN DOE"
                value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="font-display" style={{ display: "block", fontSize: 12, fontWeight: 800, color: "black", marginBottom: 8 }}>
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="YOU@EXAMPLE.COM"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="font-display" style={{ display: "block", fontSize: 12, fontWeight: 800, color: "black", marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="MIN. 8 CHARACTERS"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "black", cursor: "pointer",
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button id="register-btn" type="submit" className="btn-primary" disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 14, marginTop: 10 }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> INITIALIZING...</> : "CREATE ACCOUNT"}
            </button>
          </form>

          <p style={{ marginTop: 32, fontSize: 14, color: "var(--color-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 800, textDecoration: "none", textTransform: "uppercase", fontSize: 13, letterSpacing: 1 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
