import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UpcomingEvents({ events = [] }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  return (
    <section style={{ backgroundColor: "#f4ecd8", padding: "80px 5%", fontFamily: "var(--font-body, sans-serif)", color: "#2c2a29", borderTop: "1px solid #e2d7c1" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} className="scroll-reveal">
          <h2 style={{ fontSize: "42px", fontFamily: "var(--font-serif, serif)", fontWeight: "normal", margin: 0 }}>
            Upcoming Events
          </h2>
          <button
            onClick={() => { window.scrollTo(0, 0); navigate("/events"); }}
            style={{ background: "transparent", border: "none", fontSize: "14px", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", color: "#2c2a29", display: "flex", alignItems: "center", gap: "8px" }}
          >
            VIEW ALL <span>&#8594;</span>
          </button>
        </div>

        <div ref={scrollRef} style={{ display: "flex", gap: "30px", overflowX: "auto", paddingBottom: "20px", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }} className="hide-scrollbar scroll-reveal">
          {events.map((ev) => (
            <div key={ev.id} style={{ minWidth: "340px", maxWidth: "340px", flex: "0 0 auto", scrollSnapAlign: "start", display: "flex", flexDirection: "column" }}>
              <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "12px", marginBottom: "20px" }} />
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px", color: "#2c2a29" }}>{ev.title}</h3>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#54504c", marginBottom: "25px", flex: 1 }}>{ev.desc}</p>
              <div style={{ display: "flex", gap: "20px", marginBottom: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "36px", fontFamily: "var(--font-serif, serif)" }}>{ev.day}</span>
                  <span style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{ev.month}</span>
                </div>
                <div style={{ width: "1px", height: "30px", backgroundColor: "#d4c4af" }}></div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#54504c" }}>
                  <div>&#128205; {ev.location}</div>
                  <div>&#128338; {ev.time}</div>
                </div>
              </div>
              {ev.link && (
                <a href={ev.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", fontSize: "13px", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", color: "#54504c", textDecoration: "none", marginTop: "4px", transition: "color 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#c9a84c"}
                  onMouseLeave={e => e.currentTarget.style.color = "#54504c"}
                >
                  {ev.buttonLabel || "KNOW MORE"} <span style={{ fontSize: "16px" }}>&#8595;</span>
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
      <style>{".hide-scrollbar::-webkit-scrollbar { display: none; }"}</style>
    </section>
  );
}
