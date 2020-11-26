/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./controller/InventoryController.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./controller/InventoryController.js":
/*!*******************************************!*\
  !*** ./controller/InventoryController.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: C:\\dufie kids\\controller\\InventoryController.js: Invalid left-hand side in assignment expression (672:19)\n\n\u001b[0m \u001b[90m 670 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 671 | \u001b[39m           }\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 672 | \u001b[39m           \u001b[36melse\u001b[39m \u001b[36mif\u001b[39m(resolved[\u001b[35m0\u001b[39m]\u001b[33m.\u001b[39mlength \u001b[33m>\u001b[39m \u001b[35m0\u001b[39m \u001b[33m&&\u001b[39m resolved[\u001b[35m1\u001b[39m]\u001b[33m.\u001b[39mlength \u001b[33m=\u001b[39m \u001b[35m0\u001b[39m){\u001b[0m\n\u001b[0m \u001b[90m     | \u001b[39m                   \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 673 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 674 | \u001b[39m                \u001b[33mNotifications\u001b[39m\u001b[33m.\u001b[39mshowAlert(\u001b[32m\"success\"\u001b[39m\u001b[33m,\u001b[39m \u001b[32m`${resolved[0].length} items have been successfully added`\u001b[39m)\u001b[0m\n\u001b[0m \u001b[90m 675 | \u001b[39m\u001b[0m\n    at Parser._raise (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:766:17)\n    at Parser.raiseWithData (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:759:17)\n    at Parser.raise (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:753:17)\n    at Parser.checkLVal (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9468:16)\n    at Parser.parseMaybeAssign (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9642:12)\n    at Parser.parseExpressionBase (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9564:23)\n    at C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9558:39\n    at Parser.allowInAnd (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11303:12)\n    at Parser.parseExpression (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9558:17)\n    at Parser.parseHeaderExpression (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11702:22)\n    at Parser.parseIfStatement (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11784:22)\n    at Parser.parseStatementContent (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11476:21)\n    at Parser.parseStatement (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Parser.parseIfStatement (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11786:51)\n    at Parser.parseStatementContent (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11476:21)\n    at Parser.parseStatement (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Parser.parseIfStatement (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11786:51)\n    at Parser.parseStatementContent (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11476:21)\n    at Parser.parseStatement (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Parser.parseBlockOrModuleBlockBody (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:12013:25)\n    at Parser.parseBlockBody (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11999:10)\n    at Parser.parseBlock (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:11983:10)\n    at Parser.parseFunctionBody (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:10963:24)\n    at Parser.parseArrowExpression (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:10932:10)\n    at Parser.parseParenAndDistinguishExpression (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:10501:12)\n    at Parser.parseExprAtom (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:10177:21)\n    at Parser.parseExprSubscripts (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9844:23)\n    at Parser.parseUpdate (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9824:21)\n    at Parser.parseMaybeUnary (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9813:17)\n    at Parser.parseExprOps (C:\\dufie kids\\node_modules\\@babel\\parser\\lib\\index.js:9683:23)");

/***/ })

/******/ });
//# sourceMappingURL=InventoryController.js.map