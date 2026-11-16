import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Edge가 `/lingo/` 접두를 제거하므로 두 호스트에서 같은 상대 자산 번들을 쓴다.
  base: './',
  server: {
    port: 47080,
    strictPort: true,
  },
  preview: {
    port: 47080,
    strictPort: true,
  },
})
