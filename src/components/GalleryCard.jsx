import LikeButton from "./LikeButton.jsx";

// Same card design for the 3 built-in frames and for Firebase posts.
export default function GalleryCard({ postId, media, title, meta, tag }) {
  return (
    <div className="gallery-card">
      {media}
      <div className="card-overlay">
        <h3>{title}</h3>
        <div className="card-meta">{meta}</div>
        <span className="card-tag">{tag}</span>
      </div>
      <LikeButton postId={postId} className="card-like" />
    </div>
  );
}
