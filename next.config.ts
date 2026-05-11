import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "better-sqlite3",
    "bcryptjs",
    "@auth/prisma-adapter",
    "@prisma/adapter-better-sqlite3",
    "@prisma/client",
    "@prisma/client-runtime-utils",
  ],
};

export default nextConfig;
