import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Spotify-Matcher/', // Replace 'my-repo' with your actual repository name
  plugins: [react()],
})
