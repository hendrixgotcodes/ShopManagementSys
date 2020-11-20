const path =  require("path");

const electron ={
    target: 'electron-renderer',
    entry:{
        InventoryController: './controller/InventoryController.js',
        GeneralController : './controller/GeneralController.js',
        toolTips: './controller/utilities/ToolTipController.js',
        settingsController: './controller/modals/settingsController.js',
        StoreController: './controller/StoreController.js',
        LoginController: './controller/LoginController.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: ['name'].js,
    },
    module: {
        rules:[
            {test: /\.js?$/, use: 'babel-loader'},
            {test: /\.css?$/, use: 'css-loader'}
        ]
    }, 
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        minimize: false
    }
}

const regular = {
    entry: {
        MainGraph: './controller/MainGraph.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: ['name'].js,
    },
    module: {
        rules:[
            {test: /\.js?$/, use: 'babel-loader'},
            {test: /\.css?$/, use: 'css-loader'}
        ]
    },    
    externals: {
        moment: 'moment'
    },
    mode: 'development'
}

module.exports = [electron,regular];