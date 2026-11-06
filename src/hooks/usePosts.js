import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase.js";

// Real-time posts listener. `posts` is null until the first snapshot arrives.
export function usePosts() {
  const [state, setState] = useState({ posts: null, error: false });

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(
      postsQuery,
      snapshot => {
        setState({
          posts: snapshot.docs.map(d => ({ ...d.data(), id: d.id })),
          error: false
        });
      },
      error => {
        console.error("Firebase posts error:", error);
        setState(prev => ({ ...prev, error: true }));
      }
    );
  }, []);

  return state;
}
