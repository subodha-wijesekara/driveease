"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Globe, ArrowRight, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={{ background: "white" }}>
      {/* ═══ HEADER SECTION ═══ */}
      <section style={{ padding: "80px 0", borderBottom: "1.5px solid black" }}>
        <div className="page-container">
          <div className="divider-red" style={{ marginBottom: 24 }} />
          <h1 className="font-display" style={{ fontSize: 48, fontWeight: 900 }}>COMMAND <span className="text-toyota-red">CENTER</span></h1>
          <p style={{ fontSize: 18, color: "var(--color-muted)", fontWeight: 500 }}>Global support for the DriveEase fleet.</p>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section style={{ padding: "100px 0" }}>
        <div className="page-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 80 }}>
          
          {/* Contact Details */}
          <div>
            <h2 className="font-display" style={{ fontSize: 32, marginBottom: 40 }}>Direct <span className="text-toyota-red">Intelligence</span></h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <ContactInfo 
                icon={<Phone size={24} />} 
                title="Support Line" 
                value="+1 (800) 555-0199" 
                sub="Available 24/7 for Platinum Members" 
              />
              <ContactInfo 
                icon={<Mail size={24} />} 
                title="Electronic Correspondence" 
                value="support@driveease.com" 
                sub="Response within 2 hours" 
              />
              <ContactInfo 
                icon={<MapPin size={24} />} 
                title="Headquarters" 
                value="12/A, Industrial Park, Colombo 07" 
                sub="Global Operations Center" 
              />
            </div>

            <div style={{ marginTop: 60, padding: 30, background: "black", color: "white" }}>
              <h4 className="font-display" style={{ fontSize: 18, marginBottom: 12 }}>Emergency Response</h4>
              <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Roadside assistance is available for all active rentals regardless of tier. Contact our tactical support line for immediate dispatch.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ border: "2px solid black", padding: 40 }}>
            {submitted ? (
              <div className="animate-fade" style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 60, height: 60, background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <ArrowRight size={32} />
                </div>
                <h3 className="font-display" style={{ fontSize: 24, marginBottom: 12 }}>MESSAGE RECEIVED</h3>
                <p style={{ color: "var(--color-muted)" }}>Our logistics team has been notified. We will contact you shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display" style={{ fontSize: 24, marginBottom: 30 }}>Secure Inquiry</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div className="form-group">
                    <label className="font-display" style={{ fontSize: 11, fontWeight: 800, color: "black", marginBottom: 8, display: "block" }}>Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="font-display" style={{ fontSize: 11, fontWeight: 800, color: "black", marginBottom: 8, display: "block" }}>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      required 
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="font-display" style={{ fontSize: 11, fontWeight: 800, color: "black", marginBottom: 8, display: "block" }}>Subject</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={form.subject}
                      onChange={e => setForm({...form, subject: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="font-display" style={{ fontSize: 11, fontWeight: 800, color: "black", marginBottom: 8, display: "block" }}>Message Details</label>
                    <textarea 
                      className="form-input" 
                      rows={5} 
                      required 
                      style={{ resize: "none" }}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px" }}>
                    TRANSMIT INQUIRY
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ WORLDWIDE BRANCHES ═══ */}
      <section style={{ padding: "80px 0", background: "#f8f8f8", borderTop: "1.5px solid black" }}>
        <div className="page-container">
          <h2 className="font-display" style={{ fontSize: 24, marginBottom: 40 }}>Global <span className="text-toyota-red">Hubs</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30 }}>
            <BranchCard city="COLOMBO" address="12/A, Industrial Park, Colombo 07" />
            <BranchCard city="NEGOMBO" address="No 45, Airport Road, Negombo" />
            <BranchCard city="KANDY" address="88, Hill Crest Drive, Kandy" />
            <BranchCard city="GALLE" address="03, Fort View Road, Galle" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfo({ icon, title, value, sub }: { icon: any; title: string; value: string; sub: string }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ color: "var(--color-primary)", flexShrink: 0 }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{title}</h4>
        <p style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{value}</p>
        <p style={{ fontSize: 12, color: "#888" }}>{sub}</p>
      </div>
    </div>
  );
}

function BranchCard({ city, address }: { city: string; address: string }) {
  return (
    <div style={{ background: "white", border: "1.5px solid black", padding: 24 }}>
      <h4 className="font-display" style={{ fontSize: 18, marginBottom: 8 }}>{city}</h4>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>{address}</p>
      <div style={{ marginTop: 20, fontSize: 11, fontWeight: 800, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: 8 }}>
        DIAGNOSTICS CENTER ACTIVE <Clock size={12} />
      </div>
    </div>
  );
}
