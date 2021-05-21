const CONFIG = require('./config.js');
const PATH = require('path');
const WEBPACKP = require('webpack');
const MINiCSSEXTRACTPLUGIN = require('mini-css-extract-plugin');
const HTMLWEBPACKPLUGIN = require('html-webpack-plugin');
const BEAUTIFYHTMLWEBPACKPLUGIN = require('beautify-html-webpack-plugin');
const TERSERPLUGIN = require('terser-webpack-plugin');
const { HtmlWebpackSkipAssetsPlugin } = require('html-webpack-skip-assets-plugin');
const IMAGEMINIMIZERPLUGIN = require('image-minimizer-webpack-plugin');
const COPYWEBPACKPLUGIN = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

require('dotenv').config({ path: PATH.join(__dirname, '.env') });

const extendPlugins = () => {
  const miniCssExtractCSS = new MINiCSSEXTRACTPLUGIN({
    filename: (CONFIG.css + (CONFIG.commonCss ? `${CONFIG.commonCss}.css?[hash:8]` : '[name].css?[hash:8]'))
  });
  const copyWebpackPlugin = CONFIG.copyStatic
    ? new COPYWEBPACKPLUGIN({
      patterns: [{
        from: 'static',
        to: 'static'
      }]
    })
    : () => {};
  const htmlWebpackPlugin = [];
  const beautifyHtmlWebpackPlugin = new BEAUTIFYHTMLWEBPACKPLUGIN();
  const webpackDefinePlugin = new WEBPACKP.DefinePlugin({
    'process.env': {
      APP_ENV: JSON.stringify((process.env.APP_ENV
        ? process.env.APP_ENV
        : process.env.NODE_ENV))
    }
  });
  const cleanWebpackPlugin = process.env.NODE_ENV === 'production'
    ? new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }) : () => {};

  for (let i = 0; i < CONFIG.plugins().length; i += 1) {
    let obj = CONFIG.plugins()[i];

    obj.inject = 'body';
    obj.cache = true;

    htmlWebpackPlugin.push(
      new HTMLWEBPACKPLUGIN(obj),
    );
  }

  return [miniCssExtractCSS].concat(
    [cleanWebpackPlugin],
    [webpackDefinePlugin],
    [copyWebpackPlugin],
    htmlWebpackPlugin,
    [beautifyHtmlWebpackPlugin],
    [new HtmlWebpackSkipAssetsPlugin()]
  );
};

const resolveModules = () => {
  const pathReturn = [PATH.resolve('src/')];

  Object.keys(CONFIG).forEach((value) => {
    if (typeof (CONFIG[value]) === 'string') {
      pathReturn.push('' + PATH.resolve('src/' + CONFIG[value] + '') + '');
    }
  });

  pathReturn.push(PATH.resolve('node_modules'));

  return pathReturn;
};

module.exports = {
  context: PATH.resolve(__dirname, 'src'),
  cache: true,
  entry() {
    const pathReturn = {};

    for (let i = 0; i < CONFIG.plugins().length; i += 1) {
      const entry = CONFIG.plugins()[i];

      if (entry.chunks) {
        for (let j = 0; j < entry.chunks.length; j += 1) {
          const chunks = entry.chunks[j];

          pathReturn[chunks] = `./${CONFIG.js + chunks}.js`;
        }
      }
    }

    return pathReturn;
  },
  output: {
    path: PATH.resolve(__dirname, 'dist'),
    filename: `${CONFIG.js}[name].js?[hash:8]`,
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.ejs$/i,
      use: [{
        loader: 'ejs-easy-loader'
      }]
    }, {
      test: /\.(tsx?|jsx?)$/,
      use: [{
        loader: 'babel-loader?cacheDirectory',
        options: {
          configFile: `${__dirname}/.babelrc`,
          presets: [
            ['@babel/preset-env', {
              targets: {
                edge: '17',
                firefox: '60',
                chrome: '67',
                safari: '11.1',
                ie: '10'
              }
            }]
          ]
        }
      }],
      include: PATH.resolve('src')
    }, {
      test: /\.s?css$/i,
      use: [
        {
          loader: MINiCSSEXTRACTPLUGIN.loader,
          options: {
            publicPath: (resourcePath, context) => {
              return (PATH.relative(PATH.dirname(resourcePath), context).replace(/\\/g, '/')) + '/../';
            }
          }
        },
        'css-loader',
        'postcss-loader'
      ]
    }, {
      test: /\.(jpe?g|png|gif|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]?[hash:8]',
            esModule: false
          }
        }, {
          loader: IMAGEMINIMIZERPLUGIN.loader,
          options: {
            minimizerOptions: {
              plugins: [
                ['gifsicle', {
                  interlaced: true,
                  optimizationLevel: 3
                }],
                ['jpegtran', {
                  progressive: true,
                  quality: 75
                }],
                ['pngquant', {
                  quality: [0.60, 0.75],
                  speed: 4
                }],
                ['svgo', {
                  plugins: [{
                    removeViewBox: false
                  }]
                }]
              ]
            }
          }
        }
      ]
    }, {
      test: /\.(jpe?g|png)$/i,
      use: [
        {
          loader: IMAGEMINIMIZERPLUGIN.loader,
          options: {
            deleteOriginalAssets: false,
            filename: '[path][name].webp',
            minimizerOptions: {
              plugins: [
                ['webp', {
                  quality: 88
                }]
              ]
            }
          }
        }
      ]
    }, {
      test: /\.svg$/,
      use: ['svg-sprite-loader', 'svgo-loader']
    }, {
      test: /\.(woff|woff2|ttf|eot)$/,
      use: 'file-loader?name=fonts/[name].[ext]!static'
    }]
  },
  optimization: {
    minimizer: [
      // new OptimizeCSSAssetsPlugin({
      //   cssProcessor: cssnano,
      //   cssProcessorPluginOptions: {
      //     preset: ['default', {
      //       discardComments: {
      //         removeAll: true,
      //       },
      //     }],
      //   },
      //   canPrint: true,
      // }),
      new TERSERPLUGIN({
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          },
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ]
  },
  plugins: extendPlugins(),
  devServer: {
    // contentBase : PATH.join(__dirname, 'dist'),
    // index            : 'index.htm',
    host: process.env.HOST,
    hot: true,
    watchContentBase: true,
    compress: true,
    port: process.env.PORT,
    https: true,
    stats: {
      assets: true,
      cached: false,
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      source: false,
      version: false,
      warnings: false,
      children: true
    },
    before(app) {
      app.post('*', (req, res) => {
        res.redirect(req.originalUrl);
      });
    }
    // proxy: {
    //     "/api": {
    //         target: 'https://192.168.1.155:'+CONFIG.port+'',
    //         bypass: function(req, res, proxyOptions) {
    //             if(req.method != 'POST') return false;
    //         }
    //     }
    // }
    // proxy: {
    //     '/VsWeb/api/*': {
    //         target       : 'https://www.vscinemas.com.tw/',
    //         changeOrigin : true,
    //     },
    // },
  },
  resolve: {
    modules: resolveModules()
  }
};
