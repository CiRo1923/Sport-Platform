const profile = require('./htmlPage.profile.js');
const deposit = require('./htmlPage.deposit.js');
const withdrawal = require('./htmlPage.withdrawal.js');
const balance = require('./htmlPage.balance.js');
const history = require('./htmlPage.history.js');
const notice = require('./htmlPage.notice.js');
const password = require('./htmlPage.password.js');
const login = require('./htmlPage.login.js');
const register = require('./htmlPage.register.js');
const preferences = require('./htmlPage.preferences.js');
const faq = require('./htmlPage.faq.js');
const statement = require('./htmlPage.statement.js');
const promotion = require('./htmlPage.promotion.js');
const account = require('./htmlPage.account.js');

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
    let publish = def.concat(
      account.HtmlWebpackPlugin
    );

    if (process.env.NODE_ENV === 'production') {
      publish = def.concat(
        profile.HtmlWebpackPlugin,
        deposit.HtmlWebpackPlugin,
        withdrawal.HtmlWebpackPlugin,
        balance.HtmlWebpackPlugin,
        history.HtmlWebpackPlugin,
        notice.HtmlWebpackPlugin,
        password.HtmlWebpackPlugin,
        login.HtmlWebpackPlugin,
        register.HtmlWebpackPlugin,
        preferences.HtmlWebpackPlugin,
        faq.HtmlWebpackPlugin,
        statement.HtmlWebpackPlugin,
        promotion.HtmlWebpackPlugin,
        account.HtmlWebpackPlugin,
      );
    }
    return publish;
  }
};
