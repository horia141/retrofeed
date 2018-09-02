const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: process.env.ENV === "LOCAL" ? "development" : "production",
    target: "web",
    entry: {
        app: "./src/client/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, ".build/client"),
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        publicPath: "/real/client"
    },
    module: {
        rules: [{
            test: /\.(tsx?)$/,
            include: [path.resolve(__dirname, "src", "client")],
            loader: "ts-loader",
            options: {
                configFile: "tsconfig.client.json",
                silent: true
            }
        }, {
            test: /\.(less|css)$/,
            include: [path.resolve(__dirname, "src", "client")],
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                "css-loader",
                "less-loader",
                {
                    loader: "postcss-loader",
                    options: {
                        plugins: () => [require("autoprefixer")()]
                    }
                }
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name].chunk.css"
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    name: "vendors",
                    enforce: true,
                    chunks: "all",
                    priority: 10
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        }
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".css", ".less"],
        modules: [
            path.resolve(__dirname, "src", "client"),
            path.resolve(__dirname, "node_modules")
        ]
    },
    devtool: process.env.ENV !== "LOCAL" ? "source-map" : "eval-cheap-module-source-map"
};