const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['vagrancy-fretful-cultivate.ngrok-free.app', 'vagrancy-fretful-cultivate.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  },
  turbopack: {
    root: path.resolve(__dirname)
  }
};

module.exports = nextConfig;
