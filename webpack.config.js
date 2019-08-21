const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => ({
  entry: {
    index: './src/index.js',
  },
  mode: env == 'production' ? 'production' : 'development',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.worker\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: { name: '[name].js' }
          },
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { url: false },
          },
          'postcss-loader',
          'sass-loader'
        ],
      },
      // {
      //   test: /\.(woff2?|ttf|otf|eot|svg|png)$/,
      //   loader: 'file-loader',
      // },
    ]
  },
  resolve: {
    alias: {
      "vue": env === "production" ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js',
      '@WORKERS': path.resolve(__dirname, 'src/workers/'),
      '@SRC': path.resolve(__dirname, 'src/'),
    }
  },
  plugins: [
    new CopyPlugin([
      { from: 'src/index.html', to: '.' },
      { from: 'static/', to: '.' },
    ]),
    new VueLoaderPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
});