/// <reference types="vite/client" />

// Loaded from Cloudflare's CDN only when a Turnstile site key is configured (see src/content.ts).
declare global {
  interface Window {
    turnstile?: { reset: (widget?: HTMLElement) => void }
  }
}

export {}
