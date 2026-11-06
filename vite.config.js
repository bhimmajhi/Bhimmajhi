import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Two pages, same URLs as the old site: "/" (index.html) and "/admin.html".
// VITE_BASE is set by the GitHub Actions workflow:
//   repo "Bhimmajhi.github.io" -> "/"            (site at https://bhimmajhi.github.io/)
//   any other repo, e.g. "Bhimmajhi" -> "/Bhimmajhi/" (site at https://bhimmajhi.github.io/Bhimmajhi/)
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        admin: fileURLToPath(new URL("./admin.html", import.meta.url))
      }
    }
  }
});
