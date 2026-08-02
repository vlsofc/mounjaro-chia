/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images are served locally from /public. No remote patterns needed.
    formats: ['image/webp'],
  },
};

export default nextConfig;
