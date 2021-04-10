const path = require('path')
const withSourceMaps = require('@zeit/next-source-maps')
const withSass = require('@zeit/next-sass')

const nextConfig = withSourceMaps({
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    return config
  },
})

module.exports = withSass(nextConfig)
