import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Components from "unplugin-react-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Components({
      dts: true,
      include: [/\.tsx?$/, /\.jsx?$/],
    }),
  ],
});
