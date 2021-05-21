module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'withdrawal.html',
    template: '_shared/layout.ejs',
    action: '提款',
    description: '',
    chunks: ['withdrawal']
  }]
};
