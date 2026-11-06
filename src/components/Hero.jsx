import LikeButton from "./LikeButton.jsx";

const BASE = import.meta.env.BASE_URL;

export default function Hero() {
  return (
    <section className="hero-banner" id="editorial">
      <img
        src={`${BASE}assets/images/photo1.jpg`}
        alt="Bhim Majhi portrait photo"
        title="Bhim Majhi portrait photo"
      />
      <div className="banner-overlay">
        <div className="banner-text">
          <h2><strong>Bhim</strong> Majhi</h2>
          <div className="meta">
            <span><i className="fas fa-circle" style={{ fontSize: "0.4rem", color: "#38bdf8" }}></i> Portrait · 2026</span>
            <span><i className="fas fa-tag"></i> #smartalone</span>
            <span><i className="fas fa-camera"></i> 50mm · f/2.8</span>
          </div>
        </div>
        <div className="banner-tag">
          <i className="fas fa-arrow-right"></i> featured editorial
        </div>
      </div>
      <LikeButton postId="hero-main" className="hero-like" />
    </section>
  );
}
