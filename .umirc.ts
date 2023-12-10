import { defineConfig } from "umi";
import { routes } from "./config/config";

export default defineConfig({
  routes: routes,
  npmClient: "yarn",
  // scripts: [{ src: "./adapter-latest.js", defer: true }],
  devtool: 'cheap-source-map'
});
