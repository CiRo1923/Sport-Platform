module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'event-live.html',
    template: '_shared/layout.ejs',
    action: '賽事',
    description: '',
    chunks: ['event-live']
  }]
};
