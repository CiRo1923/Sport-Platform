module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'history.html',
    template: '_shared/layout.ejs',
    action: '交易历史纪录',
    description: '',
    chunks: ['history']
  }]
};
