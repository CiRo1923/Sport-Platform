module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'password-change.html',
    template: '_shared/layout.ejs',
    action: '密码',
    description: '',
    chunks: ['password-change']
  }, {
    filename: 'password-forgot.html',
    template: '_shared/layout.ejs',
    action: '忘记密码',
    description: '',
    chunks: ['password-forgot']
  }, {
    filename: 'password-reset.html',
    template: '_shared/layout.ejs',
    action: '重新设定密码',
    description: '',
    chunks: ['password-reset']
  }]
};
