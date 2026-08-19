import React, { useEffect } from "react";

export default function VideosPage({ videos = [] }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: "var(--bg-dark)", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>

        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "48px", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: "15px 0", fontWeight: "normal" }}>
            Academic Classes & Seminars
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Browse our full archive of recorded classes, guest lectures, and academic seminars.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "40px" }}>
          {videos.map((vid, idx) => (
            <div key={vid.id || idx} style={{ background: "var(--bg-card)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", transition: "transform 0.3s ease" }} className="event-card-hover">
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                {vid.url.includes("youtube.com") || vid.url.includes("youtu.be") ? (
                  <iframe 
                    src={vid.url} 
                    title={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video 
                    src={vid.url} 
                    controls 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
                  ></video>
                )}
              </div>
              <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "20px", color: "var(--text-main)", marginBottom: "12px", fontWeight: 600 }}>{vid.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", flex: 1 }}>{vid.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{".event-card-hover:hover { transform: translateY(-8px); }"}</style>
    </div>
  );
}
