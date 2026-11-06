import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { usePosts } from "../../hooks/usePosts.js";

function PostItem({ post }) {
  const [deleting, setDeleting] = useState(false);

  const title = post.title || "New Frame";
  const tag = post.tag || "#smartalone";
  const thumbSrc = post.mediaType === "video" ? "" : (post.mediaUrl || "");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Ye post delete karna hai? Ye action undo nahi ho sakta."
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteDoc(doc(db, "posts", post.id));
      // On success the live listener removes this row.
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Delete nahi hua: " + error.message);
      setDeleting(false);
    }
  }

  return (
    <div className="post-item">
      {thumbSrc ? (
        <img className="post-thumb" src={thumbSrc} alt={title} />
      ) : (
        <div className="post-thumb"></div>
      )}
      <div className="post-info">
        <div className="post-name">{title}</div>
        <div className="post-tag">{tag}</div>
      </div>
      <button
        className="post-delete"
        type="button"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "🗑 Delete"}
      </button>
    </div>
  );
}

export default function PostsBox() {
  const { posts, error } = usePosts();

  let content = null;
  if (error) {
    content = <p className="posts-empty">❌ Posts load nahi hue.</p>;
  } else if (posts && posts.length === 0) {
    content = <p className="posts-empty">Abhi tak koi post nahi hai.</p>;
  } else if (posts) {
    content = posts.map(post => <PostItem key={post.id} post={post} />);
  }

  return (
    <section id="postsBox">
      <h2 className="posts-title">📋 Posts</h2>

      <div id="postsList" className="posts-list">
        {content}
      </div>
    </section>
  );
}
