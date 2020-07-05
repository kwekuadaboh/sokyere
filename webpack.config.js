const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
var webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const fse = require("fs-extra");
const WebpackConfigDumpPlugin = require("webpack-config-dump-plugin");

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("./src/assests/img/", "./dist/assests/img");
    });
  }
}

////////////////COMMON CONFIG???????//////////////////////////////////////////////////////////////////////////////////////////////////

let sassConfig = {
  test: /\.(sc|c)ss$/,
  use: [
    {
      loader: "css-loader",
      options: { sourceMap: true },
    },
    {
      loader: `postcss-loader`,
      options: {
        sourceMap: true,
        config: {
          path: "postcss.config.js",
        },
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true,
      },
    },
  ],
};

let config = {
  entry: {
    main: "./src/assests/scripts/index.js",
  },

  optimization: {
    splitChunks: { chunks: "all" },
  },
  module: {
    rules: [
      sassConfig,
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "./assests/img",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new HtmlWebpackPlugin({
      template: "./src/main.html",
      // minify: false
    }),
    new WebpackConfigDumpPlugin({
      //
      depth: 10,
    }),
  ],
};

/////////////DEVELOPMENT CONFIG//////////////////////////////////////////////////////////////////////////////////////////////////////
if (currentTask == "dev") {
  config.mode = "development";
  sassConfig.use.unshift("style-loader");
  config.output = {
    filename: "[name].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  };
  config.devtool = "eval-source-map";
  config.devServer = {
    before: function (src, server) {
      server._watch("./src/**/*.html");
    },
    contentBase: path.join(__dirname, "src"),
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  };
}

/////////////////////// PRODUCTION MODE //////////////////////////////////////////////////////////////////////////////////////////////
if (currentTask == "build") {
  config.mode = "production";
  sassConfig.use.unshift(MiniCssExtractPlugin.loader);

  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  };
  config.optimization = {
    // deletes .map files
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/main.html",
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
  };
  config.devtool = "source-map";
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].styles.[chunkhash].css",
      path: path.resolve(__dirname, "./dist"),
    }),
    new RunAfterCompile()
  );
  config.plugins.shift(); // removes HTML webpack from common config --- re-added at optimization
}

module.exports = () => {
  return config;

  // console.log(config.[0].plugins)
};

// module.exports = {

//   // module: {
//   //   rules: [
//   //     {
//   //       test: /\.html$/,
//   //       use: ['html-loader']
//   //     },
//   //     {
//   //       test: /\.js$/,
//   //       exclude: /(node_modules)/,
//   //       include: path.resolve(__dirname, 'src'),
//   //       use: {
//   //         loader: 'babel-loader',
//   //         options: {
//   //           presets: ['@babel/preset-env']
//   //         }
//   //       }
//   //     }

//   //   ]
//   // },

// }

// output: {
//   filename: '[name].bundled.[contentHash].js',
//   path: path.resolve(__dirname, 'dist')
// },

// const fse = require('fs-extra')
// new RunAfterCompile(),
// class RunAfterCompile {
//         apply(compiler) {
//           compiler.hooks.done.tap('Copy images', function () {
//             fse.copySync('./src/assests/img/', './dist/assests/img')
//           })
//         }
//       }

// {
//   test: /\.(sc|c)ss$/,
//   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader', options: { config: { path: 'postcss.config.js' } } }, { loader: 'sass-loader' }]
// },

// { loader: MiniCssExtractPlugin.loader },

// {
//   test: /\.css$/,
//   use: [
//     { loader: 'style-loader' },
//     { loader: 'css-loader' },
//   ]
// }

// devtool: 'source-map',  ----> production

// chunkFilename: '[name].[chunkhash].js',
// include: path.resolve(__dirname, 'src'), ---> this applies the loader modules that actually need to be transformed by it.This might be the same as using exclude: node_modules
