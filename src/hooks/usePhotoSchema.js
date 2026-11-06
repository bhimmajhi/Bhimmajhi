import { useEffect } from "react";

// ── Photo-wise SEO (JSON-LD ImageObject for every Firebase post) ──
function buildImageObject(post) {
  const seoTitle = String(post.seoTitle || post.title || "Bhim Majhi Photo").trim();
  const seoDescription = String(post.seoDescription || `${seoTitle} - Bhim Majhi photo`).trim();
  const keywords = String(post.seoKeywords || "Bhim Majhi, photo").trim();
  const url = `${location.origin}${location.pathname}?photo=${encodeURIComponent(post.id)}`;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${url}#image`,
    name: seoTitle,
    description: seoDescription,
    keywords,
    caption: seoTitle,
    contentUrl: post.mediaUrl,
    url,
    author: { "@type": "Person", name: "Bhim Majhi" },
    inLanguage: "hi"
  };
}

export function usePhotoSchema(posts) {
  useEffect(() => {
    let schema = document.getElementById("photoSeoSchema");

    if (!posts.length) {
      if (schema) schema.remove();
      return;
    }

    if (!schema) {
      schema = document.createElement("script");
      schema.id = "photoSeoSchema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(posts.map(buildImageObject));
  }, [posts]);
}
