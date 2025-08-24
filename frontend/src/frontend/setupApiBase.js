import { API_BASE } from "./config";

// Prefix any relative /api call with the backend base URL at runtime.
if (API_BASE && typeof window !== "undefined" && window.fetch) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("/api")) {
      input = API_BASE + input; // -> https://your-backend/api/...
    }
    return originalFetch(input, init);
  };
}
