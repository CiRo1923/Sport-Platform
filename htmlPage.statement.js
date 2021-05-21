module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'statement.html',
    template: '_shared/layout.ejs',
    action: '帐务纪录',
    description: '',
    chunks: ['statement']
  }]
};
