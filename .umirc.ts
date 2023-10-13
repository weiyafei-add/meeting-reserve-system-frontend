import { defineConfig } from "umi";
import {routes} from './config/config';

export default defineConfig({
  routes: routes,
  npmClient: 'yarn',
  scripts: [
    {src: 'https://webrtc.github.io/adapter/adapter-latest.js', defer: true}
  ]
});
