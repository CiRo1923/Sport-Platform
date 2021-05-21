module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'promotion.html',
    template: '_shared/layout.ejs',
    action: '我的晋升',
    description: '',
    chunks: ['promotion']
  }]
};
