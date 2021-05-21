module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'notice.html',
    template: '_shared/layout.ejs',
    action: '信息中心',
    description: '',
    chunks: ['notice']
  }]
};
