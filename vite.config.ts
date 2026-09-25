import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vitest/config"
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    nitro()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server": path.resolve(__dirname, "./server")
    },
  },
  test: {
	coverage: {
		reporter: ["json-summary"],
	}
  }
})
