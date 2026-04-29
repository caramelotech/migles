import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the site lives at /migles/ — local dev stays at /
const base = process.env.GITHUB_PAGES === 'true' ? '/migles/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
