// webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',  // Add source maps for debugging
  entry: {
    panel: path.join(__dirname, 'src/panel/index.tsx'),
    background: path.join(__dirname, 'src/background/background.ts'),
    content: path.join(__dirname, 'src/content/content.ts')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    clean: true  // Clean the dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript',
              ['@babel/preset-env', { targets: { chrome: '88' } }]
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'manifest.json',
          transform(content) {
            return Buffer.from(JSON.stringify({
              ...JSON.parse(content.toString()),
              content_security_policy: {
                extension_pages: "script-src 'self'; object-src 'self'"
              }
            }, null, 2))
          }
        },
        { from: 'public/panel.html', to: 'panel.html' }
      ]
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  optimization: {
    minimize: false  // Disable minification for better debugging
  }
};