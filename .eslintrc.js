module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['airbnb-base/legacy'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: [],
  parser: 'babel-eslint',
  rules: {
    'import/no-unresolved': 0,
    'global-require': 0,
    'linebreak-style': ['error', 'windows']
  }
};
