import { useEffect, useRef, useState } from "react";
import { doc, getDoc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { getUserId } from "../lib/userId.js";

// One like button for any post (hero, static cards and Firebase cards).
export default function LikeButton({ postId, className = "" }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pop, setPop] = useState(false);
  const popTimer = useRef(null);

  // Initial like state + live like count
  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    const userId = getUserId();

    getDoc(doc(db, "likes", `${postId}_${userId}`))
      .then(snap => {
        if (!cancelled) setLiked(snap.exists() && snap.data().liked === true);
      })
      .catch(error => console.warn("Could not read like state:", error));

    const unsubscribe = onSnapshot(
      doc(db, "likes_count", postId),
      snap => {
        const value = snap.exists() ? Number(snap.data().count || 0) : 0;
        setCount(Math.max(0, value));
      },
      error => console.warn("Could not read like count:", error)
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => () => clearTimeout(popTimer.current), []);

  // Like toggle — Firestore mein save hoga
  async function toggleLike() {
    if (!postId || loading) return;

    const userId = getUserId();
    const alreadyLiked = liked;
    const oldCount = Math.max(0, count);
    const newLiked = !alreadyLiked;

    // UI turant update (optimistic)
    setLoading(true);
    setLiked(newLiked);
    setCount(Math.max(0, oldCount + (newLiked ? 1 : -1)));

    try {
      await setDoc(
        doc(db, "likes", `${postId}_${userId}`),
        { liked: newLiked, userId, postId },
        { merge: true }
      );

      // setDoc + merge + increment works even when the count document does not exist.
      await setDoc(
        doc(db, "likes_count", postId),
        { count: increment(newLiked ? 1 : -1) },
        { merge: true }
      );

      if (newLiked) {
        setPop(true);
        clearTimeout(popTimer.current);
        popTimer.current = setTimeout(() => setPop(false), 220);
      }
    } catch (error) {
      console.error("Like update failed:", error);
      // Roll back UI if Firebase rejects the write.
      setLiked(alreadyLiked);
      setCount(oldCount);
    } finally {
      setLoading(false);
    }
  }

  const classes = [
    "like-btn",
    className,
    liked && "liked",
    loading && "is-loading",
    pop && "like-pop"
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={toggleLike}
      disabled={loading}
      aria-label="Like"
    >
      <i className="fas fa-heart"></i>
      <span className="like-count">{count}</span>
    </button>
  );
}
