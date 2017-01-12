'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = saveInventory;
exports.genId = genId;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// use a Flow type import to get our Produce type
function saveInventory(inventory) {
  var outpath = _path2.default.join(__dirname, '..', '..', 'data', 'produce.json');

  return new Promise(function (resolve, reject) {
    // lets not write to the file if we're running tests
    if (process.env.NODE_ENV !== 'test') {
      _fs2.default.writeFile(outpath, JSON.stringify(inventory, null, '\t'), function (err) {
        err ? reject(err) : resolve(outpath);
      });
    }
  });
}

function genId(prod, inv) {
  var maxId = inv[0].id;
  inv.slice(1).forEach(function (item) {
    if (item.id && item.id > maxId) maxId = item.id;
  });
  return maxId + 1;
}
//# sourceMappingURL=save.js.map
