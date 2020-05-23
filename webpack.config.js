const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: __dirname + "/src/app/index.js",
  output: {
    path: __dirname + '/src/build', 
    filename: 'bundle.js',
    publicPath: './'
  },
  module: {  
      rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: [
                /node_modules/
            ]
        },
        {
            test: /\.html/,
            loader: 'raw-loader'
        },
          {
            test: /\.(scss)$/,
            use: [{
              loader: 'style-loader', // inject CSS to page
            }, {
              loader: 'css-loader', // translates CSS into CommonJS modules
            }, {
              loader: 'postcss-loader', // Run post css actions
              options: {
                plugins: function () { // post css plugins, can be exported to postcss.config.js
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            }, {
              loader: 'sass-loader' // compiles SASS to CSS
            }]
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
      ]
  },
  plugins: [ 
      new HtmlWebpackPlugin({
          template: __dirname + "/src/public/index.html",
          inject: 'body'
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
  ]
};