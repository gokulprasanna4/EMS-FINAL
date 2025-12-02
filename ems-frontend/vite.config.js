import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // <--- Add this line

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
})