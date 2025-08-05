// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";

// export default defineConfig({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   build: {
//     outDir: "dist/spa",
//   },
//   base: "/Earth-Data-Management/",
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./client"),
//       "@shared": path.resolve(__dirname, "./shared"),
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
        host: "::",
        port: 8080,
      },
      build: {
        outDir: "dist/spa",
      },
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
