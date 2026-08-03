import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Must match your GitHub repo name exactly (case-sensitive), since
  // GitHub Pages serves this site at /My-Friend/ rather than at root.
  base: '/My-Friend/',
})