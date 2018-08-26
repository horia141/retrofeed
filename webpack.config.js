const path = require("path");

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
            include: [
                path.resolve(__dirname, "src", "client")
            ],
            loader: "ts-loader",
            options: {
                configFile: "tsconfig.client.json",
                silent: true
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css', '.less'],
        modules: [
            path.resolve(__dirname, 'src', 'client'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    devtool: process.env.ENV !== "LOCAL" ? "source-map" : "eval-cheap-module-source-map"
};
