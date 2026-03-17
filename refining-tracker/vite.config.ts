import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/refining-tracker/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "strip-csp-meta-in-dev",
      transformIndexHtml(html) {
        if (command !== "serve") {
          return html;
        }

        return html.replace(
          /\s*<meta http-equiv="Content-Security-Policy" content="[^"]*"\s*\/?>/,
          "",
        );
      },
    },
  ],
  server: { port: 3000 },
}));
