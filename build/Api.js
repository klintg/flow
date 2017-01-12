'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _ProduceRouter = require('./routers/ProduceRouter');

var _ProduceRouter2 = _interopRequireDefault(_ProduceRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = function () {

  // create the express instance, attach app-level middleware, attach routers
  function Api() {
    _classCallCheck(this, Api);

    this.express = (0, _express2.default)(); //instantiating express.
    this.middleware();
    this.routes();
  }

  //register middlewares

  // annotate with the express $application type
  // //we create a field reference for the api.express property and tell flow that it will be an object of type express$application from express.
  // $FlowFixMe: express libdef issue


  _createClass(Api, [{
    key: 'middleware',
    value: function middleware() {
      this.express.use((0, _morgan2.default)('dev'));
      this.express.use(_bodyParser2.default.json());
      this.express.use(_bodyParser2.default.urlencoded({ extended: false }));
    }

    // connect resource routers

  }, {
    key: 'routes',
    value: function routes() {
      // create an instance of ProduceRouter
      var produceRouter = new _ProduceRouter2.default();

      this.express.use(produceRouter.path, produceRouter.router);
    }
  }]);

  return Api;
}();

exports.default = Api;
//# sourceMappingURL=Api.js.map
