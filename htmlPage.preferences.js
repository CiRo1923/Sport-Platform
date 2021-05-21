module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'preferences.html',
    template: '_shared/layout.ejs',
    action: '偏好设定',
    description: '',
    chunks: ['preferences']
  }]
};
