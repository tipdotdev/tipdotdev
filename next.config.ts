/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "auth.tip.dev"
            },
            {
                protocol: "https",
                hostname: "pbs.twimg.com"
            },
            {
                protocol: "https",
                hostname: "utfs.io"
            },
            {
                protocol: "https",
                hostname: "github.com"
            },
            {
                protocol: "https",
                hostname: "*.ufs.*"
            }
        ]
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            use: ["@svgr/webpack"]
        });

        return config;
    },
    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.js"
                }
            }
        }
    }
};

export default nextConfig;
