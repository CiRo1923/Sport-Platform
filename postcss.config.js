const CONFIG = require('./config.js');
const FUNCTION = require('./postcss.function.js');
const purgecss = process.env.NODE_ENV === 'production' ? require('@fullhuman/postcss-purgecss') : () => {};
const tailwindcss = CONFIG.tailwindcss ? require('tailwindcss') : () => {};

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-each-variables'),
    require('postcss-each'),
    require('postcss-for'),
    require('postcss-mixins'),
    require('postcss-css-variables'),
    require('postcss-map-get'),
    require('postcss-hexrgba'),
    require('postcss-functions')({
      functions: FUNCTION.functions
    }),
    require('postcss-calc'),
    require('postcss-conditionals'),
    require('postcss-nested'),
    purgecss({
      content: [
        'src/**/*.html',
        'src/**/*.ejs',
        'src/**/*.js'
      ],
      fontFace: true,
      defaultExtractor: content => content.match(/[\w.?:?(/,)]+(?<!\()/g) || [],
      skippedContentGlobs: ['node_modules/**']
    }),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true
        }
      }]
    }),
    require('postcss-assets')({
      loadPaths: ['src/assets/img']
    }),
    tailwindcss,
    require('postcss-sort-media-queries')({
      sort: (a, b) => {
        return b.localeCompare(a);
      }
    }),
    require('autoprefixer')({
      grid: true,
      overrideBrowserslist: [
        '> 1%',
        'last 5 versions',
        'Firefox >= 45',
        'ios >= 8',
        'ie >= 10'
      ]
    })
  ]
};
