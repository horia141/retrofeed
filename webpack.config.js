const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
    mode: process.env.ENV === "LOCAL" ? "development" : "production",
    target: "web",
    entry: {
        app: "./src/client/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "build/client"),
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
                        plugins: () => [
                            require("autoprefixer")(),
                            require("stylelint")({ configFile: "./lint.style.json" }),
                        ]
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
        // As we add more languages, we'll select more locales here.
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ro/),
        new webpack.NormalModuleReplacementPlugin(
            /cls-hooked/,
            "./cls-hooked-mock.ts" // Just a random file, no dependencies
        )
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
    performance: process.env.ENV !== "LOCAL" ? {
        hints: "warning", // "error" or false are valid too
        maxEntrypointSize: 128 * 1024, // in bytes, default 250k
        maxAssetSize: 512 * 1024, // in bytes
    } : {},
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".css", ".less"],
        modules: [
            path.resolve(__dirname, "src", "client"),
            path.resolve(__dirname, "node_modules")
        ]
    },
    devtool: process.env.ENV !== "LOCAL" ? "source-map" : "eval-cheap-module-source-map"
};
