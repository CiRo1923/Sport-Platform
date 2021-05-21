module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'deposit.html',
    template: '_shared/layout.ejs',
    action: '储值',
    description: '',
    chunks: ['deposit']
  }]
};
