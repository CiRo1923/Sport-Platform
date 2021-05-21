module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'login.html',
    template: '_shared/layout.ejs',
    action: '登录',
    description: '',
    chunks: ['login']
  }]
};
