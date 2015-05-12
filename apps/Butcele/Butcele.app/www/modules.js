(function(){"use strict";

angular.module("app", ["app.core", "app.initializers", "app.layout", "app.budgets", "app.transactions", "app.tags", "app.statics", "app.auth", "app.constants"]);})();
(function(){"use strict";

angular.module("app.auth", ["app.core"]);})();
(function(){"use strict";

angular.module("app.budgets", ["app.core", "app.tags"]).run(["Budget", function (Budget) {}]);})();
(function(){"use strict";

angular.module("app.core", ["ngAnimate", "ngSanitize", "ui.router", "ionic", "angular-data.DS", "angular-data.DSCacheFactory", "highcharts-ng", "LocalStorageModule", "ngAudio", "ngCordova"]).run(["$ionicPlatform", "_", "$rootScope", "$cordovaGoogleAnalytics", "analyticsId", "Settings", function ($ionicPlatform, _, $rootScope, $cordovaGoogleAnalytics, analyticsId, Settings) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (window.cordova) {
      $cordovaGoogleAnalytics.startTrackerWithId(analyticsId);
      var user = Settings.get("user");

      if (user) {
        $cordovaGoogleAnalytics.setUserId(user.id);
      }
    }
  });

  $rootScope._ = _;
}]);})();
(function(){"use strict";

angular.module("app.initializers", ["app.core", "app.tags", "app.budgets"]).run(["tags", "budgets", "Data", function (tags, budgets, Data) {
  tags();
  budgets();
  Data.sync();
}]);})();
(function(){"use strict";

angular.module("app.layout", ["app.core", "app.transactions"]);})();
(function(){"use strict";

angular.module("app.statics", ["app.core"]);})();
(function(){"use strict";

angular.module("app.tags", ["app.core"]).run(["Tag", function (Tag) {}]);})();
(function(){"use strict";

angular.module("app.transactions", ["app.core", "app.budgets", "app.tags"]).run(["Transaction", function (Transaction) {}]);})();
//# sourceMappingURL=modules.js.map