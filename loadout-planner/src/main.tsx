import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

const cfToken = import.meta.env.VITE_CF_ANALYTICS_TOKEN;
if (cfToken) {
  const script = document.createElement("script");
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.defer = true;
  script.setAttribute("data-cf-beacon", JSON.stringify({ token: cfToken }));
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary appName="FPS Loadout Tracker">
      <App />
    </ErrorBoundary>
  </StrictMode>
);
