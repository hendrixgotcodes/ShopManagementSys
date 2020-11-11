const path =  require("path");

const electron ={
    target: 'electron-renderer',
    entry:{
        InventoryController: './controller/InventoryController.js',
        GeneralController : './controller/GeneralController.js',
        toolTips: './controller/utilities/ToolTipController.js',
        settingsController: './controller/modals/settingsController.js',
        StoreController: './controller/StoreController.js',
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

// const regular = {
//     entry: {
//         utilTooltip: './views/js/ToolTip.js',
//     },
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         filename: ['name'].js,
//     },
//     module: {
//         rules:[
//             {test: /\.js?$/, use: 'babel-loader'},
//             {test: /\.css?$/, use: 'css-loader'}
//         ]
//     },    
//     mode: 'development'
// }

module.exports = electron;