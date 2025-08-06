/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in supabase functions during build
    ignoreBuildErrors: false
  },
  webpack: (config) => {
    // Ignore supabase functions directory
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/supabase/**', '**/node_modules']
    }
    return config
  }
}

module.exports = nextConfig
