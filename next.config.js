/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TOTAL_LEADS: '402',
    SYSTEM_VERSION: '2.0.0',
  },
  // Vereinfachte Konfiguration für Stabilität
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
