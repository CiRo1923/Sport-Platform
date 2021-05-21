module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'profile.html',
    template: '_shared/layout.ejs',
    action: '个人资料',
    description: '',
    chunks: ['profile']
  }]
};
