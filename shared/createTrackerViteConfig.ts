import { defineConfig, type UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export function createTrackerViteConfig(basePath: string, port: number): UserConfigExport {
  return defineConfig(({ command }) => ({
    base: command === "serve" ? "/" : basePath,
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
            /\s*<meta\s+http-equiv=["']Content-Security-Policy["'][\s\S]*?\/?>/i,
            "",
          );
        },
      },
    ],
    server: { port },
  }));
}
