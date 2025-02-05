const webBaseHref = process.env.WEB_BASE_HREF || "/";
module.exports = {
  publicPath: webBaseHref,
  devServer: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        pathRewrite: { "^/represent-someone-who-died": "" },
        secure: false,
        changeOrigin: true,
        headers: {
          "X-Forwarded-Host": "localhost:8080",
          Connection: "keep-alive"
        }
      }
    }
  },
  chainWebpack: config => {
    config.module.rules.delete("eslint");

    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        options.prettify = false;
        return options;
      });
      config.module.rule("ts")
      .test(/\.ts$/)
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true
      });
  },
  runtimeCompiler: true,
  parallel: false // https://stackoverflow.com/questions/59951379/vue-cli-upgrade-from-v3-to-v4-breaks-build-process-with-thread-loader-error-can
};
