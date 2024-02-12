const path = require("path");
const merge = require("deepmerge");
const { isPlainObject } = require("is-plain-object");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = (env, argv) => {
  const mode = {
    dev: "development",
    prod: "production",
    current: argv.mode ?? this.dev,
  };
  const isDev = mode.current === mode.dev;
  const isProd = mode.current === mode.prod;

  const rootPath = path.join(__dirname);
  const outputPath = path.join(rootPath, "dist", mode.current);

  /** @type {import('webpack').Configuration} */
  const generalConfig = {
    mode: mode.current,
    output: {
      path: outputPath,
      clean: true,
    },
    resolve: {
      alias: {
        "@root": rootPath,
        "@media": path.join(rootPath, "src/media"),
        "@fonts": path.join(rootPath, "src/fonts"),
        "@scss": path.join(rootPath, "src/scss"),
        "@js": path.join(rootPath, "src/js"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ico|png|svg|jpg|jpeg|webp)$/,
          type: "asset/resource",
          generator: {
            filename: "img/[name].[hash:8][ext][query]",
          },
        },
        {
          test: /\.(woff|woff2|ttf)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name].[hash:8][ext][query]",
          },
        },
        {
          test: /\.(css|sass|scss)$/,
          use: ["css-loader", "postcss-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlBundlerPlugin({
        preprocessor: "handlebars",
        preprocessorOptions: {
          root: "src/views",
          partials: ["src/views/components"],
          helpers: ["src/js/hbs/helpers"],
        },
        entry: "src/views/pages",
        filename: ({ filename, chunk: { name } }) => {
          if (name === "home") {
            return "index.html";
          }

          return "[name].html";
        },
        js: {
          filename: "js/[name].[contenthash:8].js",
        },
        css: {
          filename: "css/[name].[contenthash:8].css",
        },
        minify: isProd,
        integrity: isProd,
        hotUpdate: isDev,
        verbose: isDev,
      }),
    ],
  };

  const envConfig = {
    /** @type {import('webpack').Configuration} */
    development: {
      devServer: {
        static: outputPath,
        watchFiles: {
          paths: ["src/**/*.*"],
          options: {
            usePolling: true,
          },
        },
        hot: true,
      },
    },
    /** @type {import('webpack').Configuration} */
    production: {
      output: {
        crossOriginLoading: "anonymous",
      },
    },
  };

  return merge(generalConfig, envConfig[mode.current], {
    isMergeableObject: isPlainObject,
  });
};
