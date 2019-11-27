const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/_imports.scss";
        `
      }
    }
  },

  configureWebpack: {
    plugins: [
      new CopyPlugin([
        { from: './data', to: './data' },
      ]),
    ]
  },

  chainWebpack: config => {
    config.resolve.symlinks(false);

    config.module.rule('eslint').use('eslint-loader')
      .tap(opts => ({ ...opts, emitWarning: true }));
    // config.module
    //   .rule("vue")
    //   .use("vue-svg-inline-loader")
    //   .loader("vue-svg-inline-loader")
    //   .options({});
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
};
