const webpack = require('webpack')
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.EnvironmentPlugin(['NODE_ENV', 'CE_ENV'])
        ]
    }
}