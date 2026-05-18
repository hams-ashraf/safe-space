// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5101', 
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://doctorprofile.runasp.net',
        changeOrigin: true,
        secure: false,
      },
      '/callHub': {
        target: 'https://doctorprofile.runasp.net',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/hubs': {
        target: 'https://doctorprofile.runasp.net',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})