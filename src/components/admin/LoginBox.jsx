import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/auth.js";

export default function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMsg("Email aur password bharo.");
      return;
    }

    setMsg("Login ho raha hai...");

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      setMsg("");
    } catch (error) {
      console.error(error);
      setMsg("Login failed: " + error.message);
    }
  }

  return (
    <section id="loginBox">
      <input
        id="email"
        type="email"
        placeholder="Admin email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button id="loginBtn" onClick={handleLogin}>
        Login
      </button>

      <p id="loginMsg" className="msg">{msg}</p>
    </section>
  );
}
