import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/auth.js";
import LoginBox from "./components/admin/LoginBox.jsx";
import UploadBox from "./components/admin/UploadBox.jsx";
import PostsBox from "./components/admin/PostsBox.jsx";

export default function AdminApp() {
  const [user, setUser] = useState(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return (
    <main className="admin-card">
      <div className="brand">
        Smart<span>Alone</span>
      </div>

      <h1>Photo / Video Upload</h1>

      <p className="muted">
        Photo ya video upload karke post publish karo.
      </p>

      {user ? (
        <>
          <UploadBox user={user} />
          <PostsBox />
        </>
      ) : (
        <LoginBox />
      )}
    </main>
  );
}
