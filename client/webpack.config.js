module.exports = {
  // Configurare bază
  stats: {
    // Suprimă avertismentele webpack
    warningsFilter: [
      /webpack-dev-server/,
      /punycode/,
      /util\._extend/,
      /http_parser/
    ]
  },
  devServer: {
    // Configurații server de dezvoltare 
    clientLogLevel: 'silent',
    disableHostCheck: true,
    hot: true,
    stats: 'errors-only',
    overlay: true
  }
}; 