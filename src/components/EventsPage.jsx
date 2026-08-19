import React, { useEffect } from "react";

export default function EventsPage({ events = [] }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: "var(--bg-dark)", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>

        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "48px", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: "15px 0" }}>
            All Upcoming Events
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Browse our full schedule of upcoming seminars, networking events, and academic symposiums.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "40px" }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background: "var(--bg-card)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", transition: "transform 0.3s ease" }} className="event-card-hover">
              <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "220px", objectFit: "contain" }} />
              <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "20px", color: "var(--text-main)", marginBottom: "12px", fontWeight: 600 }}>{ev.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", flex: 1, marginBottom: "24px" }}>{ev.desc}</p>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border-gold)", marginBottom: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
                    <span style={{ fontSize: "28px", fontFamily: "var(--font-serif)", color: "var(--text-main)", lineHeight: 1 }}>{ev.day}</span>
                    <span style={{ fontSize: "12px", color: "var(--gold-primary)", fontWeight: "bold", textTransform: "uppercase" }}>{ev.month}</span>
                  </div>
                  <div style={{ width: "1px", height: "30px", backgroundColor: "var(--border-gold)" }}></div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span>&#128205; {ev.location}</span>
                    <span>&#128338; {ev.time} {ev.timezone || ''}</span>
                  </div>
                </div>
                {ev.link && (
                  <a href={ev.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", fontSize: "13px", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", color: "var(--text-muted)", textDecoration: "none", marginTop: "4px", transition: "color 0.2s ease" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--gold-primary)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    {ev.buttonLabel || "KNOW MORE"} <span style={{ fontSize: "16px" }}>&#8595;</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{".event-card-hover:hover { transform: translateY(-8px); }"}</style>
    </div>
  );
}
