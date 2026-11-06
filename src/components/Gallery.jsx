import { useRef } from "react";
import GalleryCard from "./GalleryCard.jsx";
import { usePosts } from "../hooks/usePosts.js";
import { usePhotoSchema } from "../hooks/usePhotoSchema.js";

const EMPTY = [];
const BASE = import.meta.env.BASE_URL;

// Built-in frames (previously hardcoded in index.html)
const STATIC_CARDS = [
  {
    postId: "card-rooftop",
    src: `${BASE}assets/images/photo2.jpg`,
    alt: "Bhim Majhi rooftop photo",
    title: "Rooftop View",
    meta: "Portrait · 2026",
    tag: "#sunset"
  },
  {
    postId: "card-neondusk",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
    alt: "Neon Dusk cinematic photo",
    title: "Neon Dusk",
    meta: "Night · 2026",
    tag: "#cinematic"
  },
  {
    postId: "card-earthsky",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
    alt: "Earth and Sky landscape photo",
    title: "Earth & Sky",
    meta: "Landscape · 2025",
    tag: "#minimal"
  }
];

// ── Firebase se aane wale cards ──
function FirebaseCard({ post }) {
  const title = post.title || "New Frame";
  const tag = post.tag || "#smartalone";
  const seoTitle = post.seoTitle || post.title || "Bhim Majhi Photo";
  const seoAlt = post.seoAlt || post.title || "Bhim Majhi photo";
  const isVideo = post.mediaType === "video";
  const type = isVideo ? "Video" : "Photo";
  const date = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : "2026";

  const media = isVideo ? (
    <video src={post.mediaUrl} controls playsInline preload="metadata" title={seoTitle}></video>
  ) : (
    <img src={post.mediaUrl} alt={seoAlt} title={seoTitle} loading="lazy" />
  );

  return (
    <GalleryCard
      postId={post.id}
      media={media}
      title={title}
      meta={`${type} · ${date}`}
      tag={tag}
    />
  );
}

export default function Gallery() {
  const gridRef = useRef(null);
  const { posts } = usePosts();
  const list = posts || EMPTY;

  usePhotoSchema(list);

  function seeAll() {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="gallery-section" id="portfolio">
      <div className="section-header">
        <h2 className="section-title">More <strong>Frames</strong></h2>
        <span
          className="section-sub"
          id="seeAllBtn"
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={seeAll}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              seeAll();
            }
          }}
        >
          <i className="fas fa-arrow-right"></i> See All
        </span>
      </div>

      <div className="gallery-grid" ref={gridRef}>
        {STATIC_CARDS.map(card => (
          <GalleryCard
            key={card.postId}
            postId={card.postId}
            media={<img src={card.src} alt={card.alt} title={card.alt} />}
            title={card.title}
            meta={card.meta}
            tag={card.tag}
          />
        ))}

        {/* Firebase posts are inserted here automatically. */}
        <div id="firebaseGallery" className="firebase-gallery-contents">
          {list.map(post => (
            <FirebaseCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
