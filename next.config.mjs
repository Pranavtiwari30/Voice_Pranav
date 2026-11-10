/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./personality.md', './info.md', './about.md'],
  },
};

export default nextConfig;
