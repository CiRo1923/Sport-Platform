module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'register.html',
    template: '_shared/layout.ejs',
    action: '注册新用户',
    description: '',
    chunks: ['register']
  }]
};
