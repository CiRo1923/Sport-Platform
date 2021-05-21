module.exports = {
  HtmlWebpackPlugin: [{
    filename: 'balance.html',
    template: '_shared/layout.ejs',
    action: '余额',
    description: '',
    chunks: ['balance']
  }]
};
