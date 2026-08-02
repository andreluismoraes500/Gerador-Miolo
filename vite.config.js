import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Se estiver rodando via Vite diretamente (npm run dev), proxy para o backend
      proxy:
        isDev && !process.env.VERCEL
          ? {
              "/api": {
                target: "http://localhost:3000", // porta onde o backend estaria rodando
                changeOrigin: true,
              },
            }
          : undefined,
    },
  };
});