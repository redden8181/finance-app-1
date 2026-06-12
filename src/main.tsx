import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const swUrl = new URL('./sw.js', window.location.href).href;

      const registration = await navigator.serviceWorker.register(swUrl, {
        updateViaCache: 'none',
      });

      console.log('[App] ServiceWorker registered:', registration.scope);

      // Force periodic update checks
      registration.update();
      setInterval(() => registration.update(), 5 * 60 * 1000);

      // If a new SW is waiting, activate it immediately
      if (registration.waiting) {
        registration.waiting.postMessage('skipWaiting');
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage('skipWaiting');
          }
        });
      });

      // Reload once when the new SW takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    } catch (error) {
      console.log('[App] ServiceWorker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
