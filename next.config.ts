import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["import"],
  },
  async rewrites() {
    return [
      {
        source: "/api/audio/:bitrate/:reciter/:ayah.mp3",
        destination: "https://cdn.islamic.network/quran/audio/:bitrate/:reciter/:ayah.mp3",
      },
    ];
  },
};

export default nextConfig;
