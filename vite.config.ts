import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//import fs from 'node:fs';
//import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'bettersquared.com', // Example: 'myapp.example.com'
    port: 8080, // Example: 8080
  },
  //server: {
  //  https: {
  //    key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
  //    cert: fs.readFileSync(path.resolve(__dirname, 'tls.crt'))
      //key: fs.readFileSync('./tls.key'),
      //cert: fs.readFileSync('./tls.cert')
  //  }
  //}
})
