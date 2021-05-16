module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.html',
      './src/**/*.ejs',
      './src/**/*.js'
    ],
    options: {
      extractors: [
        {
          extractor: content => content.match(/[\w-:/]+(?<!:)/g) || [],
          extensions: ['ejs']
        }
      ]
    }
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
