(function(){"use strict";

Array.prototype.remove = function (item) {
  this.splice(this.indexOf(item), 1);
};


// clears all variables in an object and return old object
angular.reset = function (object) {
  var copy = angular.copy(object);
  angular.copy({}, object);
  return copy;
};})();
//# sourceMappingURL=lib.js.map