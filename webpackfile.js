const path               = require("path"),
      webpack            = require("webpack"),
      CleanWebpackPlugin = require("clean-webpack-plugin"),
      HtmlWebpackPlugin  = require("html-webpack-plugin");

module.exports = {
    entry:   {
        app:     "./src/main.jsx",
        vendors: ["react", "react-dom"]
    },
    output:  {
        filename: "[chunkhash].[name].js",
        path:     path.join(__dirname, "dist")
    },
    module:  {
        rules: [
            {
                test:    /\.jsx?$/,
                use:     ["babel-loader", "eslint-loader"],
                include: /src/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendors", "manifest"]
        }),
        new CleanWebpackPlugin(["dist"], {
            root:    path.resolve(__dirname),
            verbose: true
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body",
            filename: "index.html"
        })
    ],
    devServer: {
        host: "localhost",
        port: 3000
    }
};