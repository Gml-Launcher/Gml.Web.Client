import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

export default function nextConfig(phase) {
  /** @type {import('next').NextConfig} */
  const config = {
    output: 'standalone',
    reactStrictMode: false,
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Match src/Proxy/gml-routes.conf without adding another proxy in development.
    const backend = (process.env.DEV_BACKEND_URL || 'http://127.0.0.1:5002').replace(/\/+$/, '');
    const skins = (process.env.DEV_SKINS_URL || 'http://127.0.0.1:5086').replace(/\/+$/, '');

    config.skipTrailingSlashRedirect = true;
    config.rewrites = async () => ({
      beforeFiles: [
        ...['api', 'swagger', 'ws'].map((prefix) => ({
          source: `/${prefix}:path(.*)`,
          destination: `${backend}/${prefix}:path`,
        })),
        { source: '/health', destination: `${backend}/health` },
        { source: '/skins', destination: `${skins}/` },
        { source: '/skins/:path*', destination: `${skins}/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    });
  }

  return config;
}
