module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_IMAGE_DOMAIN ?? '',
        port: ''
      },
    ],
  },
}