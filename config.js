const ciro = require('./ciro.HtmlPage.js');

module.exports = {
  tailwindcss: false,
  desktopMinWidth: 1366,
  mobileMaxWidth: 740,
  basicMobileWidth: 414,
  copyStatic: true,
  js: 'scripts/',
  css: 'assets/css/',
  imgs: 'assets/img/',
  svg: 'assets/svg/',
  fonts: 'static/fonts/',
  plugins: () => {
    const def = [];
    return def.concat(
      ciro.HtmlWebpackPlugin
    );
  }
};
