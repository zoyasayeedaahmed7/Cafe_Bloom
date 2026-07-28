import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Vite was binding to IPv6 [::1] only, so anything that resolved
    // "localhost" to IPv4 127.0.0.1 got ECONNREFUSED and the page simply never
    // loaded. `host: true` listens on both families.
    // Note: this also exposes the dev server on your local network — swap it
    // for '127.0.0.1' if you'd rather keep it strictly to this machine.
    host: true,
    port: 5173,
  },
})
