module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'faq.html',
    template: '_shared/layout.ejs',
    action: '帮助',
    description: '',
    chunks: ['faq']
  }]
};
