"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userApi, bookingsApi } from "@/lib/api";
import { User, Shield, Info, CreditCard, ChevronRight, Save, Key, AlertCircle, Package, Calendar, Loader2, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type Tab = "OVERVIEW" | "SECURITY" | "PAYMENTS" | "ACTIVITY";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "ACTIVITY") {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userApi.getProfile();
      const userData = res.data.data;
      setProfile(userData);
      setFullName(userData.fullName);
      setEmail(userData.email);
    } catch (err: any) {
      setError("Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setActivityLoading(true);
      const res = await bookingsApi.getMyBookings(0);
      setBookings(res.data.data?.content || []);
    } catch (err: any) {
      console.error("Failed to load bookings");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSavingProfile(true);

    try {
      const res = await userApi.updateProfile({ fullName, email });
      setProfile(res.data.data);
      setSuccess("Profile updated successfully");
      
      const storedUser = localStorage.getItem("driveease_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        u.fullName = fullName;
        u.email = email;
        localStorage.setItem("driveease_user", JSON.stringify(u));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: "100px 0", textAlign: "center" }}>
        <Loader2 size={40} color="black" className="animate-spin" style={{ margin: "0 auto 20px" }} />
        <p className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>Initializing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: "60px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 60, alignItems: "start" }}>
        
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ background: "black", padding: 40, borderBottom: "8px solid var(--color-primary)" }}>
            <div style={{ width: 80, height: 80, background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <User size={40} color="black" />
            </div>
            <h1 className="font-display" style={{ color: "white", fontSize: 24, fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>
              {profile?.fullName || "Member"}
            </h1>
            <p style={{ color: "#888", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              Platinum Client ID: {profile?.id}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "1.5px solid black" }}>
            <SidebarLink 
              icon={<Info size={18} />} 
              label="Overview" 
              active={activeTab === "OVERVIEW"} 
              onClick={() => setActiveTab("OVERVIEW")}
            />
            <SidebarLink 
              icon={<Shield size={18} />} 
              label="Privacy & Security" 
              active={activeTab === "SECURITY"}
              onClick={() => setActiveTab("SECURITY")}
            />
            <SidebarLink 
              icon={<CreditCard size={18} />} 
              label="Payment Methods" 
              active={activeTab === "PAYMENTS"}
              onClick={() => setActiveTab("PAYMENTS")}
            />
            <SidebarLink 
              icon={<ChevronRight size={18} />} 
              label="Booking Activity" 
              active={activeTab === "ACTIVITY"}
              onClick={() => setActiveTab("ACTIVITY")}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          
          {/* Status Messages */}
          {error && (
            <div className="animate-fade" style={{ background: "#fee2e2", border: "1.5px solid #ef4444", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, color: "#b91c1c" }}>
              <AlertCircle size={20} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>{error}</p>
            </div>
          )}
          {success && (
            <div className="animate-fade" style={{ background: "#f0fdf4", border: "1.5px solid #22c55e", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, color: "#15803d" }}>
              <Save size={20} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>{success}</p>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "OVERVIEW" && (
            <section className="animate-fade" style={{ border: "1.5px solid black", padding: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
                <div style={{ width: 12, height: 12, background: "var(--color-primary)" }}></div>
                <h2 className="font-display" style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase" }}>Personal Information</h2>
              </div>

              <form onSubmit={handleUpdateProfile} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button type="submit" disabled={savingProfile} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 32px" }}>
                    <Save size={18} />
                    {savingProfile ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "SECURITY" && (
            <section className="animate-fade" style={{ border: "1.5px solid black", padding: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
                <div style={{ width: 12, height: 12, background: "var(--color-primary)" }}></div>
                <h2 className="font-display" style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase" }}>Change Password</h2>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="form-group" style={{ position: "relative" }}>
                  <label>Current Password</label>
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    className="form-input" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{ position: "absolute", right: 12, top: 46, background: "none", border: "none", cursor: "pointer", color: "#666" }}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
                  <div className="form-group" style={{ position: "relative" }}>
                    <label>New Password</label>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      className="form-input" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ position: "absolute", right: 12, top: 46, background: "none", border: "none", cursor: "pointer", color: "#666" }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="form-group" style={{ position: "relative" }}>
                    <label>Confirm New Password</label>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      className="form-input" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: "absolute", right: 12, top: 46, background: "none", border: "none", cursor: "pointer", color: "#666" }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button type="submit" disabled={changingPassword} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 32px" }}>
                    <Key size={18} />
                    {changingPassword ? "Verifying..." : "Update Password"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "PAYMENTS" && (
            <section className="animate-fade" style={{ border: "1.5px solid black", padding: 60, textAlign: "center", background: "#fafafa" }}>
              <CreditCard size={48} style={{ margin: "0 auto 20px", color: "#ddd" }} />
              <h2 className="font-display" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, textTransform: "uppercase" }}>No Payment Methods</h2>
              <p style={{ color: "#888", marginBottom: 32 }}>Securely manage your corporate or personal cards for faster checkout.</p>
              <button disabled className="btn-secondary" style={{ opacity: 0.5 }}>ADD NEW CARD (COMING SOON)</button>
            </section>
          )}

          {activeTab === "ACTIVITY" && (
            <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 12, height: 12, background: "var(--color-primary)" }}></div>
                  <h2 className="font-display" style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase" }}>Recent Bookings</h2>
                </div>
                <Link href="/my-bookings" className="link-standard" style={{ fontSize: 12, fontWeight: 800 }}>VIEW ALL RECORDS</Link>
              </div>

              {activityLoading ? (
                <div style={{ padding: "40px 0", textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "0 auto" }} /></div>
              ) : bookings.length === 0 ? (
                <div style={{ border: "1.5px solid black", padding: 60, textAlign: "center" }}>
                  <Package size={40} style={{ margin: "0 auto 20px", color: "black" }} />
                  <p style={{ fontWeight: 700 }}>You haven't made any bookings yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} style={{ border: "1.5px solid black", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--color-muted)", marginBottom: 4 }}>ORD-#{b.id.toString().padStart(6, '0')}</div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{b.items[0]?.equipmentItemName} {b.items.length > 1 && `+ ${b.items.length - 1} more`}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666", marginTop: 4 }}>
                          <Calendar size={12} /> {b.rentalStartDate}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>${b.totalPrice.toFixed(2)}</div>
                        <div style={{ 
                          fontSize: 9, fontWeight: 900, padding: "2px 8px", background: "black", color: "white", display: "inline-block" 
                        }}>{b.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any; label: string; active?: boolean; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: "flex", alignItems: "center", gap: 15, padding: "20px 24px", 
        cursor: "pointer", borderBottom: "1.5px solid #eee",
        background: active ? "#fcfcfc" : "white",
        borderLeft: active ? "8px solid var(--color-primary)" : "none",
        transition: "all 0.2s"
      }}
    >
      <span style={{ color: active ? "var(--color-primary)" : "black" }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: active ? 900 : 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      {active && <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "var(--color-primary)" }} />}
    </div>
  );
}
