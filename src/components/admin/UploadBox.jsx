import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "../../lib/auth.js";
import { db } from "../../lib/firebase.js";
import { cloudinaryConfig } from "../../config/cloudinaryConfig.js";

const EMPTY_FORM = {
  title: "",
  tag: "",
  seoTitle: "",
  seoAlt: "",
  seoKeywords: "",
  seoDescription: ""
};

export default function UploadBox({ user }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [progress, setProgressValue] = useState(0);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const widgetRef = useRef(null);
  const savingRef = useRef(false);
  // The Cloudinary widget callback is created once, so it reads the latest form from here.
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const setField = name => e => setForm(prev => ({ ...prev, [name]: e.target.value }));

  // ── Progress ──
  function setProgress(percent) {
    setProgressValue(Math.max(0, Math.min(100, Math.round(percent))));
  }

  // ── Save post ──
  async function savePostToFirestore(info) {
    savingRef.current = true;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User login nahi hai.");

      const f = formRef.current;
      const title = f.title.trim() || "New Frame";
      const tag = f.tag.trim() || "#smartalone";

      // Photo-wise SEO fields. If left empty, safe values are generated from the title.
      const seoTitle = f.seoTitle.trim() || title;
      const seoAlt = f.seoAlt.trim() || `${title} - Bhim Majhi`;
      const seoKeywords =
        f.seoKeywords.trim() ||
        [title, tag.replace(/^#/, ""), "Bhim Majhi", "photo"].filter(Boolean).join(", ");
      const seoDescription = f.seoDescription.trim() || `${title} - Bhim Majhi photo`;

      const resourceType = info.resource_type || "image";
      const mediaType = resourceType === "video" ? "video" : "image";
      const mediaUrl = info.secure_url;

      if (!mediaUrl) throw new Error("Cloudinary URL nahi mila.");

      setStatus("Post database me save ho raha hai...");

      await addDoc(collection(db, "posts"), {
        title,
        tag,
        // Photo-wise SEO metadata
        seoTitle,
        seoAlt,
        seoKeywords,
        seoDescription,
        mediaUrl,
        mediaType,
        cloudinaryPublicId: info.public_id || "",
        cloudinaryResourceType: resourceType,
        format: info.format || "",
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid
      });

      setProgress(100);
      setStatus("✅ Post live ho gaya!");
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("Firestore error:", error);
      setStatus("❌ Post save nahi hua: " + error.message);
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  }

  // ── Cloudinary widget ──
  function createUploadWidget() {
    if (!window.cloudinary) {
      setStatus("❌ Cloudinary Widget load nahi hua.");
      return null;
    }

    return window.cloudinary.createUploadWidget(
      {
        cloudName: cloudinaryConfig.cloudName,
        uploadPreset: cloudinaryConfig.uploadPreset,
        sources: ["local"],
        multiple: false,
        resourceType: "auto",
        clientAllowedFormats: [
          "jpg", "jpeg", "png", "webp", "gif",
          "mp4", "webm", "mov", "avi", "mkv"
        ],
        maxFileSize: 100 * 1024 * 1024,
        showAdvancedOptions: false,
        cropping: false,
        showSkipCropButton: false,
        folder: "smartalone/posts",
        styles: {
          palette: {
            window: "#ffffff",
            windowBorder: "#dddddd",
            tabIcon: "#111111",
            menuIcons: "#555555",
            textDark: "#111111",
            textLight: "#ffffff",
            link: "#111111",
            action: "#111111",
            inactiveTabIcon: "#999999",
            error: "#d32f2f",
            inProgress: "#555555",
            complete: "#222222",
            sourceBg: "#f5f5f5"
          }
        }
      },
      (error, result) => {
        // ERROR
        if (error) {
          console.error("Cloudinary error:", error);
          setStatus("❌ Upload error: " + (error.message || "Unknown error"));
          setProgress(0);
          setBusy(false);
          return;
        }

        if (!result) return;

        // UPLOAD START
        if (result.event === "queues-start") {
          setProgress(1);
          setStatus("Upload start ho gaya...");
          return;
        }

        // UPLOAD END
        if (result.event === "queues-end") {
          setProgress(100);
          setStatus("Upload complete!");
          return;
        }

        // SUCCESS
        if (result.event === "success") {
          console.log("Cloudinary uploaded:", result.info);
          savePostToFirestore(result.info);
          return;
        }

        // Widget closed without uploading — don't leave the button stuck.
        if (result.event === "close" && !savingRef.current) {
          setBusy(false);
        }
      }
    );
  }

  // ── Upload button ──
  function handleUploadClick() {
    if (!auth.currentUser) {
      setStatus("❌ Pehle login karo.");
      return;
    }

    setProgress(0);
    setStatus("Cloudinary upload window khul raha hai...");
    setBusy(true);

    if (!widgetRef.current) {
      widgetRef.current = createUploadWidget();
    }

    if (!widgetRef.current) {
      setBusy(false);
      return;
    }

    widgetRef.current.open();
  }

  return (
    <section id="uploadBox">
      <div className="logged">
        Logged in:{" "}
        <span id="userEmail">{user.email || user.uid}</span>
      </div>

      <input
        id="title"
        type="text"
        maxLength={80}
        placeholder="Title (e.g. Rooftop View)"
        value={form.title}
        onChange={setField("title")}
      />

      <input
        id="tag"
        type="text"
        maxLength={30}
        placeholder="Tag (e.g. #sunset)"
        value={form.tag}
        onChange={setField("tag")}
      />

      {/* Photo-wise SEO (design/layout unchanged) */}
      <input
        id="seoTitle"
        type="text"
        maxLength={120}
        placeholder="SEO Title (photo ka search title)"
        value={form.seoTitle}
        onChange={setField("seoTitle")}
      />

      <input
        id="seoAlt"
        type="text"
        maxLength={160}
        placeholder="SEO ALT (photo ka exact description)"
        value={form.seoAlt}
        onChange={setField("seoAlt")}
      />

      <input
        id="seoKeywords"
        type="text"
        maxLength={300}
        placeholder="SEO Keywords (comma se alag)"
        value={form.seoKeywords}
        onChange={setField("seoKeywords")}
      />

      <textarea
        id="seoDescription"
        maxLength={320}
        placeholder="SEO Description (photo ke baare mein)"
        value={form.seoDescription}
        onChange={setField("seoDescription")}
      ></textarea>

      {/* Cloudinary upload button */}
      <button id="uploadBtn" onClick={handleUploadClick} disabled={busy}>
        📤 Photo / Video Upload
      </button>

      <button id="logoutBtn" className="secondary" onClick={() => signOut(auth)}>
        Logout
      </button>

      {/* Progress */}
      <div className="progress-wrap">
        <div id="progressBar" style={{ width: `${progress}%` }}></div>
      </div>

      <p id="progressPercent" className="progress-percent">{progress}%</p>

      <p id="status" className="msg">{status}</p>

      <a className="back" href="index.html">
        ← Website dekho
      </a>
    </section>
  );
}
