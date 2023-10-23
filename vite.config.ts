// import fs from 'fs';
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    solidPlugin(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
    }),
  ],
  base: process.env.GITHUB_PAGES ? "WidgetSampler" : "./",
  // server: {
  //   port: 443,
  //   https: {
  //     key: fs.readFileSync("/usr/lib/mozilla/certificates/localhost-key.pem"),
  //     cert: fs.readFileSync("/usr/lib/mozilla/certificates/localhost.pem"),
  //   },
  // },
  test: {
    deps: {
      registerNodeLoader: true,
    },
    environment: "jsdom",
    globals: true,
    transformMode: { web: [/\.[jt]sx?$/] },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
