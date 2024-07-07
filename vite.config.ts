import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'node:fs';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'bettersquared.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'bettersquared.crt')),
    },
    host: 'bettersquared.com',
    port: 8080,
  },
})
