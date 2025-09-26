import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'adararelief.com', pathname: '/**' },
      { protocol: 'https', hostname: 'asset.kompas.com', pathname: '/**' },
      { protocol: 'https', hostname: 'harfiyahalquran.wordpress.com', pathname: '/**' },
      { protocol: 'https', hostname: 'w2.chabad.org', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pinimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.conformingtojesus.com', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'i0.wp.com', pathname: '/**' },
      { protocol: 'https', hostname: 'nrs.hvrd.art', pathname: '/**' },
      { protocol: 'https', hostname: 'static.republika.co.id', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.grid.id', pathname: '/**' },
      { protocol: 'https', hostname: 'www.worldhistory.org', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.britannica.com', pathname: '/**' },
      { protocol: 'https', hostname: 'eliasbejjaninews.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.panjimas.com', pathname: '/**' },
      { protocol: 'https', hostname: 'assets.kompasiana.com', pathname: '/**' },
      { protocol: 'https', hostname: 'klikmu.co', pathname: '/**' },
      { protocol: 'https', hostname: 'b3390993.smushcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'kabarika.id', pathname: '/**' },
      { protocol: 'https', hostname: 'sejarahmiliter.com', pathname: '/**' },
      { protocol: 'https', hostname: 'asset.kompas.com', pathname: '/**' },
      { protocol: 'https', hostname: 'spiritofaqsa.or.id', pathname: '/**' },
      { protocol: 'https', hostname: 'kisahikmah.com', pathname: '/**' },
      { protocol: 'https', hostname: 'static.promediateknologi.id', pathname: '/**' },
      { protocol: 'https', hostname: 'theintercept.com', pathname: '/**' },
      { protocol: 'https', hostname: 'image.idntimes.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn1-production-images-kly.akamaized.net', pathname: '/**' },
      { protocol: 'https', hostname: 'www.historicalmaterialism.org', pathname: '/**' },
      { protocol: 'https', hostname: 'dims.apnews.com', pathname: '/**' },
      { protocol: 'https', hostname: 'e3.365dm.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
