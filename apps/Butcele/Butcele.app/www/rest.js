(function(){"use strict";

angular.module("app.auth").controller("ActivateController", ActivateController);

function ActivateController(Auth, Settings, $state, Analytics, $cordovaGoogleAnalytics, $ionicViewService, $cordovaDialogs, $rootScope) {
  var vm = this;
  vm.submit = submit;

  init();

  function init() {
    Analytics.trackView("Activation");
  }

  function submit(params) {
    authActivation(params);

    $ionicViewService.nextViewOptions({
      disableBack: true
    });
  }

  function authActivation(params) {
    Auth.activate(params.phoneNumber, params.activationCode).success(function (response) {
      Settings.set("user", response);
      if (window.cordova) $cordovaGoogleAnalytics.setUserId(response.id);
      $state.go("app.active");
    })["catch"](function (e) {
      $cordovaDialogs.confirm("Aktivasyon kodunu yanl\u0131\u015f girdiniz. L\u00fctfen tekrar deneyin.", "B\u00fct\u00e7ele", ["Tekrar g\u00f6nder", "\u0130ptal"]).then(function (buttonIndex) {
        if (buttonIndex == 1) {
          tryToActivate();
          params.activationCode = "";
        }
      });
    });
  }

  function tryToActivate() {
    Auth.login($rootScope.phoneNumber)["catch"](function (error) {
      $cordovaDialogs.confirm("Aktivasyon kodunu g\u00f6nderilemedi. L\u00fctfen tekrar deneyin.", "B\u00fct\u00e7ele", ["Tekrar g\u00f6nder", "\u0130ptal"]).then(function (buttonIndex) {
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        if (buttonIndex == 1) {
          tryToActivate();
        }
      });
    });
  }
}
ActivateController.$inject = ["Auth", "Settings", "$state", "Analytics", "$cordovaGoogleAnalytics", "$ionicViewService", "$cordovaDialogs", "$rootScope"];})();
(function(){"use strict";

angular.module("app.auth").controller("LoginController", LoginController);

function LoginController(Auth, $rootScope, $state, Analytics, $cordovaDialogs) {
  var vm = this;
  vm.submit = submit;

  init();

  function init() {
    Analytics.trackView("Login");
  }

  function submit(params) {
    Auth.login(params.phoneNumber).success(function (response) {
      $rootScope.phoneNumber = params.phoneNumber;
      $state.go("activate");
    })["catch"](function (error) {
      $cordovaDialogs.alert("Giri\u015f yap\u0131lam\u0131yor. L\u00fctfen telefon numaran\u0131z\u0131 kontrol edip tekrar deneyin.", "B\u00fct\u00e7ele", "Tamam").then(function () {});
    });
  }
}
LoginController.$inject = ["Auth", "$rootScope", "$state", "Analytics", "$cordovaDialogs"];})();
(function(){"use strict";

angular.module("app.budgets").controller("ArchiveController", ArchiveController);

function ArchiveController(Budget, budgets, Analytics) {
  var vm = this;
  vm.budgets = budgets;

  init();

  function init() {
    Analytics.trackView("Archive");
  }
}
ArchiveController.$inject = ["Budget", "budgets", "Analytics"];})();
(function(){"use strict";

angular.module("app.budgets").controller("BudgetTransactionListController", BudgetTransactionListController);

function BudgetTransactionListController(Transaction, budget, transactions, _, $rootScope, $ionicModal, $scope, TransactionForm, BudgetForm, Analytics) {
  var vm = this;
  vm.budget = budget;
  vm.transactions = transactions;

  vm.showBudgetForm = showBudgetForm;
  vm.showTransactionForm = showTransactionForm;

  $rootScope.currentBudgetId = vm.budget.id;

  init();

  function init() {
    $scope.$on("$destroy", function () {
      $rootScope.currentBudgetId = null;
    });

    $ionicModal.fromTemplateUrl("budgets/budget-update-form.template.html", function (modal) {
      vm.budgetUpdateModal = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

    vm.transactions.forEach(function (transaction) {
      return Transaction.loadRelations(transaction, ["tag"]);
    });

    vm.transactions = _.groupBy(transactions, function (transaction) {
      var date = new Date(transaction.createdAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    Analytics.trackView("Goal Transaction List");
  }

  function showBudgetForm() {
    BudgetForm.show(budget.id);
  }

  function showTransactionForm(id) {
    TransactionForm.show(id);
  }
}
BudgetTransactionListController.$inject = ["Transaction", "budget", "transactions", "_", "$rootScope", "$ionicModal", "$scope", "TransactionForm", "BudgetForm", "Analytics"];})();
(function(){"use strict";

angular.module("app.budgets").controller("BudgetController", BudgetController);

function BudgetController(Budget, Transaction, budget, relateds, transactions, _, $rootScope, $state, $ionicModal, $scope, TransactionForm, BudgetForm, Analytics, moment) {
  var vm = this;
  vm.budget = budget;
  vm.transactions = transactions;
  vm.remaining = Budget.remainingBudget(vm.budget, vm.transactions);
  vm.spent = Budget.spentBudget(vm.transactions);

  vm.transactionList = transactionList;

  vm.showBudgetForm = showBudgetForm;
  vm.showTransactionForm = showTransactionForm;
  vm.showBudgetPeriodSelector = showBudgetPeriodSelector;
  vm.closeBudgetPeriodSelector = closeBudgetPeriodSelector;
  vm.relateds = relateds;

  $rootScope.currentBudgetId = vm.budget.id;

  init();

  function init() {
    $scope.$on("$destroy", function () {
      $rootScope.currentBudgetId = null;
    });

    $ionicModal.fromTemplateUrl("budgets/budget-update-form.template.html", function (modal) {
      vm.budgetUpdateModal = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

    $ionicModal.fromTemplateUrl("budgets/budget-period-selector.template.html", function (modal) {
      vm.budgetPeriodSelector = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

    vm.transactions.forEach(function (transaction) {
      return Transaction.loadRelations(transaction, ["tag"]);
    });

    vm.transactionsOrderedByTag = [];

    _.forEach(_.groupBy(transactions, function (transaction) {
      if (transaction.tag) {
        return transaction.tag.name;
      } else {
        return "Etiketsiz";
      }
    }), function (tagTransactions, tagKey) {
      var sum = 0;
      _.forEach(tagTransactions, function (tagTransaction) {
        sum += tagTransaction.amount;
      });

      var tagObj = {};
      tagObj.name = tagKey;
      tagObj.sumAmount = sum;
      vm.transactionsOrderedByTag.push(tagObj);
    });

    vm.transactionsOrderedByTag = _.sortBy(vm.transactionsOrderedByTag, "sumAmount").reverse();

    vm.transactions = _.groupBy(transactions, function (transaction) {
      var date = new Date(transaction.createdAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    vm.daysToFinish = Budget.findDaysToFinish(vm.budget.endDate);

    // bugune kadarki toplam harcamam / bugun budgetin kacinci gundeyiz
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    today = today.getTime();
    var diff = Budget.findDaysOfDifference(vm.budget.startDate, today) + 1;

    vm.dailyAverage = vm.spent / diff;

    var aDaySummary = [];

    var aCycle = [];
    aCycle.push([vm.budget.startDate, 0]);
    aCycle.push([parseFloat(vm.budget.endDate) + 1, vm.budget.amount]);

    var sumForDay = 0;

    for (var key in vm.transactions) {
      for (var j = 0; j < vm.transactions[key].length; j++) {
        sumForDay += vm.transactions[key][j].amount;
      }
      var aDay = [];
      aDay.push(parseFloat(key), sumForDay);
      aDaySummary.push(aDay);
    }

    var today = aDaySummary.filter(function (val) {
      return moment().diff(val[0], "days") == 0;
    });

    if (aDaySummary.length >= 2 && today.length) {
      vm.todaySpendings = aDaySummary[aDaySummary.length - 1][1] - aDaySummary[aDaySummary.length - 2][1];
    } else if (aDaySummary.length == 1 && today.length) {
      vm.todaySpendings = aDaySummary[0][1];
    } else {
      vm.todaySpendings = 0;
    }

    Highcharts.setOptions({
      lang: {
        months: ["Ocak", "\u015eubat", "Mart", "Nisan", "May\u0131s", "Haziran", "Temmuz", "A\u011fustos", "Eyl\u00fcl", "Ekim", "Kas\u0131m", "Aral\u0131k"],
        shortMonths: ["Oca", "\u015eub", "Mar", "Nis", "May", "Haz", "Tem", "A\u011fu", "Eyl", "Eki", "Kas", "Ara"],
        weekdays: ["Pazar", "Pazartesi", "Sal\u0131", "\u00c7ar\u015famba", "Per\u015fembe", "Cuma", "Cumartesi"]
      }
    });

    var maxValue;
    if (vm.spent > vm.budget.amount) {
      maxValue = vm.spent;
    } else {
      maxValue = vm.budget.amount;
    }

    vm.chartConfig = {
      options: {
        chart: {
          marginTop: 30,
          zoomType: "x",
          backgroundColor: "#E0E6ED",
          height: 150
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            marker: {
              radius: 5,
              fillColor: "#56c6ba",
              lineColor: "#E0E6ED",
              lineWidth: 2
            },
            lineColor: "#56c6ba",
            lineWidth: 3,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        }
      },
      title: { text: "" },
      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: {
          month: "%e. %b",
          year: "%b"
        },
        minRange: 7 * 24 * 3600000 // En az bir haftalik goster
      },
      yAxis: {
        title: {
          text: ""
        },
        overflow: "justify",
        labels: {
          formatter: function () {
            return this.value + " TL";
          },
          x: 23,
          y: -2
        },
        style: {
          color: "#ff0000"
        },
        max: maxValue,
        min: 0
      },
      loading: false,
      series: [{
        type: "area",
        name: "G\u00fcnl\u00fck Harcama",
        data: aDaySummary,
        fillOpacity: 0.3,
        color: "#56c6ba",
        tooltip: {
          valueSuffix: " TL"
        }
      }, {
        name: "Sabit B\u00fct\u00e7e Do\u011frusu",
        data: aCycle,
        color: "#B0BEC5",
        dashStyle: "shortdash"
      }]
    };

    Analytics.trackView("Goal Details");
  }

  function showBudgetForm() {
    BudgetForm.show(budget.id);
  }
  function showTransactionForm(id) {
    TransactionForm.show(id);
  }
  function showBudgetPeriodSelector() {
    vm.budgetPeriodSelector.show();
  }
  function closeBudgetPeriodSelector() {
    vm.budgetPeriodSelector.hide();
  }

  function transactionList() {
    $state.go("app.transactions", { id: vm.budget.id });
  }
}
BudgetController.$inject = ["Budget", "Transaction", "budget", "relateds", "transactions", "_", "$rootScope", "$state", "$ionicModal", "$scope", "TransactionForm", "BudgetForm", "Analytics", "moment"];})();
(function(){"use strict";

angular.module("app.budgets").controller("BudgetsController", BudgetsController);

function BudgetsController(Budget, budgets, budget, $state, $scope, $ionicModal, Analytics) {
  var vm = this;
  vm.budgets = budgets;
  vm.budgetRemaining = budgetRemaining;
  vm.budgetPercentage = budgetPercentage;

  vm.openNewBudgetModal = openNewBudgetModal;
  vm.closeNewBudgetModal = closeNewBudgetModal;
  vm.newBudgetStep1 = true;
  vm.newBudgetStep2 = false;
  vm.newBudgetStep3 = false;
  vm.gotoStep2 = gotoStep2;
  vm.gotoStep3 = gotoStep3;
  vm.saveNewBudget = saveNewBudget;
  vm.budget = budget;
  vm.selectTimePeriod = selectTimePeriod;
  vm.budget.isMonthly = true;
  vm.budget.isRepeating = true;

  vm.makeColor = makeColor;

  vm.noBudget = false;

  init();

  function makeColor(budgetColor) {
    if (typeof (budgetColor) != "number") {
      return 1;
    } else {
      return budgetColor;
    }
  }

  function init() {
    if (vm.budgets.length == 0) {
      vm.noBudget = true;
    }

    vm.budgets.forEach(function (budget) {
      if (typeof (budget.color) != "number") {}
      Budget.loadRelations(budget, ["transaction"]);
      budget.daysOfBudget = Budget.findDaysOfDifference(budget.startDate, budget.endDate);
      budget.daysToFinish = Budget.findDaysToFinish(budget.endDate);
    });

    $ionicModal.fromTemplateUrl("budgets/new-budget-form.template.html", function (modal) {
      vm.newBudgetModal = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

    Analytics.trackView("Dashboard");
  }

  function budgetRemaining(budget) {
    return Budget.remainingTotal(budget);
  }

  function budgetPercentage(budget) {
    return parseFloat((Budget.remainingTotal(budget) / budget.amount) * 130);
  }

  // New Budget Modal Window Functions
  function openNewBudgetModal() {
    Analytics.trackView("Create Goal");
    vm.newBudgetStep1 = true;
    vm.newBudgetModal.show();
  }
  function closeNewBudgetModal() {
    vm.newBudgetModal.hide();
    vm.newBudgetStep3 = false;
    vm.newBudgetStep2 = false;
    vm.newBudgetStep1 = true;
  }
  function gotoStep2() {
    vm.newBudgetStep1 = false;
    vm.newBudgetStep2 = true;
    vm.newBudgetStep3 = false;
  }
  function gotoStep3() {
    vm.newBudgetStep1 = false;
    vm.newBudgetStep2 = false;
    vm.newBudgetStep3 = true;
  }
  function selectTimePeriod(timePeriod) {
    (timePeriod == 0) ? vm.budget.isMonthly = true : vm.budget.isMonthly = false;
  }
  function saveNewBudget(budget) {
    budget.startDate = new Date(budget.startDate).getTime();
    budget.endDate = new Date(budget.endDate).getTime();

    Budget.createOrUpdate(budget).then(function () {
      $state.reload();
      if (vm.budgets.length == 0) {
        vm.noBudget = true;
      } else {
        vm.noBudget = false;
      }

      Analytics.trackEvent("Goal", "Create");
    });
    vm.closeNewBudgetModal();
  }
}
BudgetsController.$inject = ["Budget", "budgets", "budget", "$state", "$scope", "$ionicModal", "Analytics"];})();
(function(){"use strict";

angular.module("app.budgets").controller("NewBudgetController", NewBudgetController);

function NewBudgetController($state, Budget, budget, Analytics) {
  var vm = this;
  vm.saveName = saveName;
  vm.saveLimit = saveLimit;
  vm.budget = budget;
  vm.save = save;
  vm.closeNewBudgetForm = closeNewBudgetForm;

  function saveName() {
    $state.go("single.new-part2");
  }

  function saveLimit(budget) {
    this.save(budget);
  }

  function save(budget) {
    Analytics.trackEvent("Goal", "Create");
    Budget.createOrUpdate(budget).then(function () {
      return $state.go("app.active");
    });
  }

  function closeNewBudgetForm() {
    $state.go("app.active");
  }
}
NewBudgetController.$inject = ["$state", "Budget", "budget", "Analytics"];})();
(function(){"use strict";

angular.module("app.layout").controller("MenuController", MenuController);

function MenuController($scope, Budget, TransactionForm, Settings) {
  var vm = this;
  vm.showTransactionForm = showTransactionForm;
  vm.hideOverlay = hideOverlay;

  init();

  function init() {
    if (!Settings.get("hideOverlay")) {
      vm.overlayShow = true;
      Settings.set("hideOverlay", true);
    }
  }

  function showTransactionForm() {
    TransactionForm.show();
  }

  function hideOverlay() {
    vm.overlayShow = false;
  }
}
MenuController.$inject = ["$scope", "Budget", "TransactionForm", "Settings"];})();
(function(){"use strict";

angular.module("app.statics").controller("AboutController", AboutController);

function AboutController(Analytics) {
  Analytics.trackView("About");
}
AboutController.$inject = ["Analytics"];})();
(function(){"use strict";

angular.module("app.tags").controller("TagsController", TagsController);

function TagsController(Tag, tags, $scope, $ionicModal, Analytics, $cordovaDialogs) {
  var vm = this;
  vm.tags = tags;
  vm.create = create;
  vm.destroy = destroy;
  vm.openTagModal = openTagModal;
  vm.closeTagModal = closeTagModal;

  init();

  function init() {
    $ionicModal.fromTemplateUrl("tags/tag-form.template.html", function (modal) {
      vm.modal = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

    Analytics.trackView("Tag List");
  }

  function create(params) {
    var creatingSame = false;

    for (var i = 0; i < vm.tags.length; i++) {
      if (vm.tags[i].name === params.name) {
        creatingSame = true;
        $cordovaDialogs.alert("Ayn\u0131 isimde iki etiket yaratamazs\u0131n\u0131z.", "B\u00fct\u00e7ele", "Tekrar Dene").then(function () {});
        vm.tag.name = "";
        break;
      }
    }
    if (!creatingSame) {
      Analytics.trackEvent("Tag", "Create");
      vm.modal.hide().then(function () {
        return Tag.create(angular.reset(params));
      });
    }
  }

  function destroy(tag) {
    Analytics.trackEvent("Tag", "Destroy");
    vm.modal.hide().then(function () {
      return Tag.destroy(tag.id);
    });
  }

  function openTagModal(tag) {
    if (tag) {
      Analytics.trackView("Edit Tag");
      vm.tag = angular.copy(tag);
    } else {
      Analytics.trackView("Create Tag");
      vm.tag = {};
    }

    vm.modal.show();
  }

  function closeTagModal() {
    vm.modal.hide();
  }
}
TagsController.$inject = ["Tag", "tags", "$scope", "$ionicModal", "Analytics", "$cordovaDialogs"];})();
(function(){"use strict";

angular.module("app.auth").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("login", {
    url: "/login",
    templateUrl: "auth/login.template.html",
    controller: "LoginController as vm",
    resolve: {
      loginControl: ["Settings", "$location", function (Settings, $location) {
        if (Settings.get("user")) {
          $location.path("/app/active");
        }
      }]
    }
  }).state("activate", {
    url: "/activate",
    templateUrl: "auth/activate.template.html",
    controller: "ActivateController as vm"
  });
}]);})();
(function(){"use strict";

angular.module("app.budgets").config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("app.active", {
    url: "/active",
    views: {
      menuContent: {
        templateUrl: "budgets/budgets.template.html",
        controller: "BudgetsController as vm",
        resolve: {
          budgets: ["Budget", function (Budget) {
            return Budget.findActiveBudgets();
          }],
          budget: function () {
            return ({});
          }
        }
      }
    }
  }).state("app.archive", {
    url: "/archive",
    views: {
      menuContent: {
        templateUrl: "budgets/archive.template.html",
        controller: "ArchiveController as vm",
        resolve: {
          budgets: ["Budget", function (Budget) {
            return Budget.findPassiveBudgets();
          }]
        }
      }
    }
  }).state("app.new", {
    url: "/new",
    views: {
      menuContent: {
        templateUrl: "budgets/budget-form.template.html",
        controller: "BudgetFormController as vm",
        resolve: {
          budget: function () {
            return ({});
          }
        }
      }
    }
  }).state("app.show", {
    url: "/:id",
    views: {
      menuContent: {
        templateUrl: "budgets/budget.template.html",
        controller: "BudgetController as vm",
        resolve: {
          budget: ["$stateParams", "Budget", function ($stateParams, Budget) {
            return Budget.find($stateParams.id);
          }],
          transactions: ["$stateParams", "Transaction", function ($stateParams, Transaction) {
            return Transaction.findAll({ where: { budgetId: $stateParams.id }
            });
          }],
          relateds: ["Budget", "budget", function (Budget, budget) {
            return Budget.findRelateds(budget);
          }]
        }
      }
    }
  }).state("app.transactions", {
    url: "/:id/detail",
    views: {
      menuContent: {
        templateUrl: "budgets/budget-transaction-list.template.html",
        controller: "BudgetTransactionListController as vm",
        resolve: {
          budget: ["$stateParams", "Budget", function ($stateParams, Budget) {
            return Budget.find($stateParams.id);
          }],
          transactions: ["$stateParams", "Transaction", function ($stateParams, Transaction) {
            return Transaction.findAll({ where: { budgetId: $stateParams.id }
            });
          }]
        }
      }
    }
  });
}]);})();
(function(){"use strict";

angular.module("app.budgets").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
}]);})();
(function(){"use strict";

angular.module("app.layout").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("app", {
    url: "/app",
    abstract: true,
    templateUrl: "layout/menu.template.html",
    controller: "MenuController as vm"
  });
}]);})();
(function(){"use strict";

angular.module("app.statics").config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("app.about", {
    url: "/about",
    views: {
      menuContent: {
        templateUrl: "statics/about.template.html",
        controller: "AboutController as vm"
      }
    }
  });
}]);})();
(function(){"use strict";

angular.module("app.tags").config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("app.tags", {
    url: "/tags",
    views: {
      menuContent: {
        templateUrl: "tags/tags.template.html",
        controller: "TagsController as vm",
        resolve: {
          tags: ["Tag", function (Tag) {
            return Tag.findAll();
          }]
        }
      }
    }
  });
}]);})();
(function(){"use strict";

angular.module("app.auth").factory("Auth", Auth);

function Auth($http, apiUrl) {
  return {
    login: login,
    activate: activate
  };

  function login(phoneNumber) {
    var params = { phoneNumber: phoneNumber };
    return $http.post(apiUrl + "/users", params);
  }

  function activate(phoneNumber, activationCode) {
    var params = { phoneNumber: phoneNumber, activationCode: activationCode };
    return $http.post(apiUrl + "/session", params);
  }
}
Auth.$inject = ["$http", "apiUrl"];})();
(function(){"use strict";

angular.module("app.auth").factory("HTTPInterceptor", HTTPInterceptor);

function HTTPInterceptor(Settings, $q, $injector) {
  return {
    request: function (config) {
      var user = Settings.get("user");

      if (user) {
        config.headers["X-ACCESS-TOKEN"] = user.accessToken;
      }

      return config;
    },
    responseError: function (rejection) {
      var $state = $injector.get("$state");
      if (rejection.status == 401 && $state.current.name != "login" && $state.current.name != "activate") {
        $state.go("login");
      }

      return $q.reject(rejection);
    }
  };
}
HTTPInterceptor.$inject = ["Settings", "$q", "$injector"];})();
(function(){"use strict";

angular.module("app.budgets").filter("colorFilter", function () {
  return function (budgetColor) {
    if (typeof (budgetColor) != "number") {
      return 1;
    } else {
      return budgetColor;
    }
  };
});})();
(function(){"use strict";

angular.module("app.budgets").service("BudgetForm", BudgetForm);

function BudgetForm($rootScope, $ionicModal, $state, Budget, _, Analytics) {
  var vm = this;
  var scope = $rootScope.$new(true);
  scope.vm = vm;
  vm.save = save;
  vm.show = show;
  vm.hide = hide;
  vm.deleteBudget = deleteBudget;
  vm.selectColor = selectColor;

  init();

  function init() {
    $ionicModal.fromTemplateUrl("budgets/budget-form.template.html", { scope: scope }).then(function (modal) {
      vm.modal = modal;
    });
  }

  function show(budgetId) {
    Analytics.trackView("Edit Goal");
    vm.budget = budgetId ? angular.copy(Budget.get(budgetId)) : {};

    if (typeof (vm.budget.color) != "number") {
      vm.selected = 0;
    } else {
      vm.selected = vm.budget.color;
    }

    vm.modal.show();
  }

  function hide() {
    vm.modal.hide();
  }

  function save(budget) {
    Budget.createOrUpdate(_.pick(budget, "id", "name", "amount", "color")).then(function () {
      Analytics.trackEvent("Goal", "Update");
      vm.hide();
      $state.reload();
    });
  }

  function deleteBudget(budget) {
    Analytics.trackEvent("Goal", "Destroy");
    Budget.destroy(budget.id);
    $state.go("app.active");
  }

  function selectColor(budget, idx, e) {
    e.preventDefault();
    budget.color = idx;
    vm.selected = idx;
  }
}
BudgetForm.$inject = ["$rootScope", "$ionicModal", "$state", "Budget", "_", "Analytics"];})();
(function(){"use strict";

angular.module("app.budgets").factory("Budget", Budget);

function Budget(DS, _, $q, Notification, moment) {
  var _this = this;
  var colorOptions = 5;

  var resource = DS.defineResource({
    name: "budget",
    relations: {
      hasMany: {
        transaction: {
          localField: "transactions",
          foreignKey: "budgetId"
        }
      }
    },
    beforeCreate: function (_, attrs, next) {
      if (!attrs.startDate) {
        attrs.startDate = moment().startOf("month").toDate().getTime();
        attrs.endDate = moment().endOf("month").toDate().getTime();
      }

      attrs.startDate = moment(attrs.startDate).startOf("day").toDate().getTime();
      attrs.endDate = moment(attrs.endDate).endOf("day").toDate().getTime();

      attrs.color = Math.floor(Math.random() * colorOptions) + 1;

      attrs.isActive = true;
      next(null, attrs);
    },

    afterCreate: function (_, attrs, next) {
      Notification.setAll();
      next(null, attrs);
    },

    afterUpdate: function (_, attrs, next) {
      Notification.setAll();
      next(null, attrs);
    },

    createOrUpdate: function (budget) {
      if (budget.id) return resource.update(budget.id, budget);else {
        return resource.create(budget);
      }
    },

    findActiveBudgets: function () {
      return resource.findAll({ where: { isActive: true } });
    },

    findPassiveBudgets: function () {
      var deferred = $q.defer();
      resource.findAll({ where: { isActive: false } }).then(function (budgets) {
        resource.findActiveBudgets().then(function (activeBudgets) {
          var activeBaseIds = activeBudgets.map(function (budget) {
            return budget.baseId;
          });
          var passiveBudgets = budgets.filter(function (budget) {
            return !(_.include(activeBaseIds, budget.baseId) || _.include(activeBaseIds, budget.id));
          });
          var grouped = _.groupBy(passiveBudgets, function (budget) {
            return budget.baseId || budget.id;
          });

          deferred.resolve(_.map(grouped, function (budgets) {
            return budgets[budgets.length - 1];
          }));
        });
      });
      return deferred.promise;
    },

    findRelateds: function (budget) {
      var deferred = $q.defer();
      var baseId;
      var result = [];

      if (budget.baseId) {
        baseId = budget.baseId;
      } else {
        baseId = budget.id;
      }

      resource.findAll({ where: { baseId: baseId } }).then(function (budgets) {
        resource.find(baseId).then(function (budget) {
          deferred.resolve(budgets.reverse().concat(budget));
        });
      });

      return deferred.promise;
    },

    spentBudget: function (actions) {
      var spent = 0;
      for (var i = 0; i < actions.length; i++) {
        spent += actions[i].amount;
      }
      return spent;
    },

    remainingBudget: function (budget, actions) {
      var spent = 0;
      for (var i = 0; i < actions.length; i++) {
        spent += actions[i].amount;
      }
      return budget.amount - spent;
    },

    remainingTotal: function (budget) {
      var sum = _.reduce(budget.transactions, function (sum, transaction) {
        return sum + transaction.amount;
      }, 0);
      return budget.amount - sum;
    },

    getPercentage: function (budget) {
      var remaining = _this.remainingTotal(budget);
      return Math.ceil((remaining / _this.remainingTotal(budget)) * 10) * 10;
    },

    findDaysToFinish: function (budgetEndDate) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      today = today.getTime();

      return Math.round((budgetEndDate - today) / (1000 * 60 * 60 * 24));
    },

    findDaysOfDifference: function (startDay, endDay) {
      return Math.round((endDay - startDay) / (1000 * 60 * 60 * 24));
    }

  });

  return resource;
}
Budget.$inject = ["DS", "_", "$q", "Notification", "moment"];})();
(function(){"use strict";

angular.module("app.core").factory("Analytics", Analytics);

function Analytics($ionicPlatform, $cordovaGoogleAnalytics) {
  return {
    trackView: trackView,
    trackEvent: trackEvent
  };

  function trackView(name) {
    if (!window.cordova) return;
    $ionicPlatform.ready(function () {
      $cordovaGoogleAnalytics.trackView(name);
    });
  }

  function trackEvent(category, action, label, value) {
    if (!window.cordova) return;
    $ionicPlatform.ready(function () {
      $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
    });
  }
}
Analytics.$inject = ["$ionicPlatform", "$cordovaGoogleAnalytics"];})();
(function(){"use strict";

angular.module("app.core").factory("Data", Data);

function Data(Budget, Transaction, Tag, $http, apiUrl, Settings, DeepDiff, $window, $interval) {
  var interval;

  return {
    sync: sync,
    all: all
  };

  function sync() {
    if (!interval) {
      interval = $interval(sync, 60000);
    }

    var lastSyncData = Settings.get("lastSyncData") || { budgets: [], tags: [], transactions: [] };
    var currentData = all();

    if (DeepDiff(lastSyncData, currentData)) {
      $http.put(apiUrl + "/users/data", currentData).then(function () {
        Settings.set("lastSyncData", currentData);
      });
    }
  }

  function all() {
    var result = { budgets: [], tags: [], transactions: [] };

    Object.keys($window.localStorage).forEach(function (key) {
      if (key.search(/budget|tag|transaction/) != 0) return;

      var value = JSON.parse($window.localStorage.getItem(key));

      if (key.indexOf("budget") == 0) {
        result.budgets.push(value);
      } else if (key.indexOf("tag") == 0) {
        result.tags.push(value);
      } else if (key.indexOf("transaction") == 0) {
        result.transactions.push(value);
      }
    });

    return result;
  }
}
Data.$inject = ["Budget", "Transaction", "Tag", "$http", "apiUrl", "Settings", "DeepDiff", "$window", "$interval"];})();
(function(){"use strict";

angular.module("app.core").factory("Notification", Notification);

function Notification($ionicPlatform, $cordovaLocalNotification, DS, _, Settings, $timeout) {
  return {
    add: add,
    setWeekly: setWeekly,
    setDaily: setDaily,
    skipToday: skipToday,
    setForBudgets: setForBudgets,
    setAll: setAll
  };

  function add(options) {
    if (!window.cordova) return;
    $ionicPlatform.ready(function () {
      $cordovaLocalNotification.hasPermission().then(function () {
        $cordovaLocalNotification.cancel(options.id).then(function () {
          $cordovaLocalNotification.add(options);
        });
      })["catch"](function () {
        $cordovaLocalNotification.registerPermission().then(function () {
          add(options);
        });
      });
    });
  }

  function cancelAll(id) {
    if (!window.cordova) return;
    $ionicPlatform.ready(function () {
      $cordovaLocalNotification.cancelAll(id);
    });
  }

  function setAll() {
    if (!window.cordova) return;
    $ionicPlatform.ready(function () {
      $cordovaLocalNotification.cancelAll().then(function () {
        setWeekly();
        setForBudgets();
        setDaily();
      });
    });
  }

  function setWeekly() {
    var lastWeek = moment().startOf("day").hour(-4).day(7);
    var thisWeek = moment().startOf("day").hour(-4).day(7).add(1, "w");

    if (!lastWeek.isBefore()) {
      lastWeek.add(-1, "w");
      thisWeek.add(-1, "w");
    }

    var nextWeek = moment(thisWeek);

    var query = {
      where: {
        createdAt: {
          ">": lastWeek.toDate()
        }
      }
    };

    $timeout(function () {
      DS.definitions.transaction.findAll(query).then(function (transactions) {
        var total = _.reduce(transactions, function (sum, transaction) {
          return sum + transaction.amount;
        }, 0);

        if (total > 0) {
          // timeout for preventing ios crashes
          $timeout(function () {
            add({
              id: 0,
              date: thisWeek.toDate(),
              message: "Bu hafta toplamda " + total + " TL harcad\u0131n, detaylar B\u00fct\u00e7ele'de...",
              badge: 1
            });
          }, 50);

          nextWeek.add(1, "w");
        }

        add({
          id: 1,
          date: nextWeek.toDate(),
          repeat: "weekly",
          message: "Seni \u00f6zledik, b\u00fct\u00e7elerin de \u00f6zledi, hedeflerini hat\u0131rlamaya ne dersin?",
          badge: 1
        });
      });
    }, 0);
  }

  function setForBudgets() {
    DS.definitions.budget.findActiveBudgets().then(function (budgets) {
      budgets.forEach(function (budget) {
        var notificationId = Settings.get("notification-" + budget.id);
        if (!notificationId) {
          notificationId = Math.floor(Math.random() * 100000);
          Settings.set("notification-" + budget.id, notificationId);
        }

        DS.definitions.budget.loadRelations(budget, ["transaction"]).then(function (budget) {
          var total = _.reduce(budget.transactions, function (sum, transaction) {
            return sum + transaction.amount;
          }, 0);
          var ratio = total / budget.amount;

          if (ratio >= 0.9 && ratio < 1) {
            var message = "" + budget.name + " b\u00fct\u00e7en bitmek \u00fczere. Detaylar i\u00e7in B\u00fct\u00e7ele\u2019ye g\u00f6z atabilirsin.";
            var notificationPercent = 90;
          } else if (ratio >= 0.75) {
            var message = "" + budget.name + " b\u00fct\u00e7enin %%75\u2019ini harcad\u0131n. Detaylar i\u00e7in B\u00fct\u00e7ele\u2019ye g\u00f6z atabilirsin.";
            var notificationPercent = 75;
          } else if (ratio >= 0.5) {
            var message = "" + budget.name + " b\u00fct\u00e7enin %%50\u2019sini harcad\u0131n. Detaylar i\u00e7in B\u00fct\u00e7ele\u2019ye g\u00f6z atabilirsin.";
            var notificationPercent = 50;
          } else {
            return;
          }

          var lastNotification = Settings.get("notification-" + budget.id + "-last");

          if (lastNotification && lastNotification.percent > notificationPercent) {
            return;
          }

          var date = moment().startOf("day").hour(21);

          if (date.isBefore()) {
            date.add(1, "d");
          }

          if (lastNotification && lastNotification.percent == notificationPercent && date.isAfter(lastNotification.date)) {
            return;
          } else {
            Settings.set("notification-" + budget.id + "-last", {
              date: date.toDate().getTime(),
              percent: notificationPercent
            });
          }

          add({
            id: notificationId,
            date: date.toDate(),
            message: message,
            badge: 1
          });
        });
      });
    });
  }

  function setDaily() {
    var date = moment().startOf("day").hour(20);

    if (date.isBefore() || Settings.get("notification-skipped-" + moment().startOf("day").toDate().getTime())) {
      date.add(1, "d");
    }

    add({
      id: 2,
      date: date.toDate(),
      repeat: "daily",
      message: "B\u00fct\u00e7ele'den Hat\u0131rlatma: Bug\u00fcn hi\u00e7 harcama girmedin, kaydetmeyi unuttu\u011fun harcaman olabilir mi? :)",
      badge: 1
    });
  }

  function skipToday() {
    Settings.set("notification-skipped-" + moment().startOf("day").toDate().getTime(), true);
    setDaily();
  }
}
Notification.$inject = ["$ionicPlatform", "$cordovaLocalNotification", "DS", "_", "Settings", "$timeout"];})();
(function(){"use strict";

angular.module("app.core").factory("Settings", Settings);

function Settings(localStorageService) {
  var settings = localStorageService.get("settings") || {};

  return {
    get: get,
    set: set
  };

  function get(key) {
    return settings[key];
  }

  function set(key, value) {
    settings[key] = value;
    localStorageService.set("settings", settings);
  }
}
Settings.$inject = ["localStorageService"];})();
(function(){"use strict";

angular.module("app.initializers").factory("budgets", budgets);

function budgets($q, Budget, _, Notification, $timeout) {
  return task;

  function task() {
    var deferred = $q.defer();
    var proms = [];
    var query = {
      where: {
        endDate: {
          "<": moment().startOf("day").toDate().getTime()
        },
        isActive: true
      }
    };

    $timeout(function () {
      return Notification.setAll();
    }, 0);

    Budget.findAll(query).then(function (budgets) {
      budgets.forEach(function (budget) {
        if (budget.isRepeating) {
          var newBudget = _.omit(budget, "id");
          if (!newBudget.baseId) newBudget.baseId = budget.id;

          if (newBudget.isMonthly) {
            delete (newBudget.startDate);
            delete (newBudget.endDate);
          } else {
            var diff = moment(newBudget.endDate).diff(newBudget.startDate, "d");
            newBudget.startDate = moment(newBudget.endDate).add(1, "days").startOf("day").toDate().getTime();
            newBudget.endDate = moment(newBudget.startDate).add(diff, "d").endOf("day").toDate().getTime();
          }

          proms.push(Budget.create(newBudget));
        }

        Budget.update(budget.id, { isActive: false });
      });

      $q.all(proms).then(function () {
        return deferred.resolve();
      });
    });

    return deferred.promise;
  }
}
budgets.$inject = ["$q", "Budget", "_", "Notification", "$timeout"];})();
(function(){"use strict";

angular.module("app.initializers").factory("tags", tags);

/* create default tags */
function tags($q, defaults, Tag) {
  return task;

  function task() {
    var deferred = $q.defer();
    var proms = [];

    Tag.findAll().then(function (tags) {
      if (tags.length == 0) {
        defaults.tags.forEach(function (tag) {
          proms.push(Tag.create({ name: tag, isDefault: true }));
        });
      }
    });

    $q.all(proms).then(function () {
      return deferred.resolve();
    });

    return deferred.promise;
  }
}
tags.$inject = ["$q", "defaults", "Tag"];})();
(function(){"use strict";

angular.module("app.tags").factory("Tag", Tag);

function Tag(DS) {
  var resource = DS.defineResource({
    name: "tag",
    relations: {
      hasMany: {
        transaction: {
          localField: "transactions",
          foreignKey: "tagId"
        }
      }
    }
  });

  return resource;
}
Tag.$inject = ["DS"];})();
(function(){"use strict";

angular.module("app.transactions").service("TransactionForm", TransactionForm);

function TransactionForm($rootScope, $ionicModal, $state, $stateParams, Budget, Transaction, Tag, $timeout, ngAudio, Analytics, $cordovaDialogs) {
  var vm = this;
  var scope = $rootScope.$new(true);
  scope.vm = vm;
  vm.save = save;
  vm.deleteTransaction = deleteTransaction;
  vm.show = show;
  vm.hide = hide;

  vm.showTagCreator = showTagCreator;
  vm.hideTagCreator = hideTagCreator;
  vm.createTag = false;

  vm.autoShow = false;
  vm.advancedOptions = false;
  vm.advancedOptionsTitle = "Geli\u015fmi\u015f Se\u00e7enekleri G\u00f6ster";

  var soundBig = ngAudio.load("assets/media/buyukharcama.mp3");
  var soundMid = ngAudio.load("assets/media/ortaharcama.mp3");
  var soundLow = ngAudio.load("assets/media/kucukharcama.mp3");

  init();

  function init() {
    $ionicModal.fromTemplateUrl("transactions/transaction-form.template.html", { scope: scope }).then(function (modal) {
      vm.modal = modal;

      if (vm.autoShow) {
        vm.autoShow = false;
        vm.show();
      }
    });
  }

  function show(transactionId) {
    if (!vm.modal) return vm.autoShow = true;

    vm.transactionSuccess = false;
    vm.transaction = transactionId ? angular.copy(Transaction.get(transactionId)) : {};

    Budget.findActiveBudgets().then(function (budgets) {
      vm.budgets = budgets;

      if (transactionId) return;

      if ($rootScope.currentBudgetId) {
        vm.transaction.budgetId = $rootScope.currentBudgetId;
      } else if (budgets.length) {
        vm.transaction.budgetId = budgets[0].id;
      }
    });

    Tag.findAll().then(function (tags) {
      return vm.tags = tags;
    });

    if (transactionId) {
      Analytics.trackView("Edit Transaction");
    } else {
      Analytics.trackView("Create Transaction");
    }

    vm.modal.show();
  }

  function hide() {
    vm.modal.hide();
  }

  function save(transaction) {
    $rootScope.currentBudgetId = transaction.budgetId;

    var budgetIdx;

    for (var i = 0; i < vm.budgets.length; i++) {
      if (transaction.budgetId == vm.budgets[i].id) {
        budgetIdx = i;
      }
    }
    var dailyLimitForBudget = vm.budgets[budgetIdx].amount / 30;

    if (!vm.transaction.id) {
      // Yeni bir transaction degil... guncelleme veya silme islemi. Ses cikartma
      if (transaction.amount > (dailyLimitForBudget * 0.75)) {
        soundBig.play();
      } else if (transaction.amount > (dailyLimitForBudget * 0.5) && transaction.amount <= (dailyLimitForBudget * 0.75)) {
        soundMid.play();
      } else {
        soundLow.play();
      }
    }
    // SAVE TRANSACTION TAG IF NEW EXISTS

    var creatingSame = false;

    if (transaction.tag != undefined) {
      // Tag var... tagli kaydet

      if (vm.createTag) {
        // Yeni tag var... onu kaydet

        // Ama once kontrol et... belki aynisi olabilir
        for (var i = 0; i < vm.tags.length; i++) {
          if (vm.tags[i].name === vm.transaction.tag.name) {
            creatingSame = true;
            $cordovaDialogs.alert("Ayn\u0131 isimde iki etiket yaratamazs\u0131n\u0131z.", "B\u00fct\u00e7ele", "Tamam").then(function () {});
            vm.transaction.tag.name = "";
            break;
          }
        }

        // Ayni tag yok... o zaman once tag'i sisteme kaydet sonra da transactioni
        if (!creatingSame) {
          Tag.create(transaction.tag).then(function (tag) {
            transaction.tagId = tag.id;
            // SAVE TRANSACTION
            Transaction.createOrUpdate(transaction).then(function () {
              vm.transactionSuccess = true;

              $timeout(function () {
                vm.modal.hide();
                $state.reload();
                vm.createTag = false;
                vm.transaction = "";
              }, 500);
            });
          });
        }
      } else {
        // Yeni tag yok ama tagli kayit var.
        Transaction.createOrUpdate(transaction).then(function () {
          vm.transactionSuccess = true;

          $timeout(function () {
            vm.modal.hide();
            $state.reload();
            vm.createTag = false;
            vm.transaction = "";
          }, 500);
        });
      }
    } else {
      // Tagsiz kaydet
      Transaction.createOrUpdate(transaction).then(function () {
        vm.transactionSuccess = true;

        $timeout(function () {
          vm.modal.hide();
          $state.reload();
        }, 500);
      });
    }

    if (transaction.id) {
      Analytics.trackEvent("Transaction", "Update");
    } else {
      Analytics.trackEvent("Transaction", "Create");
    }
  }

  function deleteTransaction(transaction) {
    Analytics.trackEvent("Transaction", "Destroy");
    vm.modal.hide().then(function () {
      Transaction.destroy(transaction.id).then(function () {
        $state.reload();
      });
    });
  }

  function showTagCreator($event) {
    $event.preventDefault();
    vm.createTag = true;
  }
  function hideTagCreator($event) {
    $event.preventDefault();
    vm.createTag = false;
  }
}
TransactionForm.$inject = ["$rootScope", "$ionicModal", "$state", "$stateParams", "Budget", "Transaction", "Tag", "$timeout", "ngAudio", "Analytics", "$cordovaDialogs"];})();
(function(){"use strict";

angular.module("app.transactions").factory("Transaction", Transaction);

function Transaction(DS, Notification, _) {
  var resource = DS.defineResource({
    name: "transaction",
    relations: {
      belongsTo: {
        budget: {
          localKey: "budgetId",
          localField: "budget"
        },
        tag: {
          localKey: "tagId",
          localField: "tag"
        }
      }
    },

    createOrUpdate: function (transaction) {
      transaction = _.pick(transaction, "id", "budgetId", "amount", "tagId");

      if (transaction.id) return resource.update(transaction.id, transaction);else return resource.create(transaction);
    },

    beforeCreate: function (_, attrs, next) {
      attrs.createdAt = new Date().getTime();
      next(null, attrs);
    },

    afterCreate: function (_, attrs, next) {
      Notification.setAll();
      Notification.skipToday();
      next(null, attrs);
    },

    afterUpdate: function (_, attrs, next) {
      Notification.setAll();
      next(null, attrs);
    },

    afterDestroy: function (_, attrs, next) {
      Notification.setAll();
      next(null, attrs);
    }
  });

  return resource;
}
Transaction.$inject = ["DS", "Notification", "_"];})();
(function(){"use strict";

angular.module("app.core").constant("defaults", {
  tags: ["Yemek", "\u0130\u00e7ecek", "Market Al\u0131\u015fveri\u015fi", "Giyim Al\u0131\u015fveri\u015fi", "Ula\u015f\u0131m", "Benzin"]
}).constant("_", window._).constant("DeepDiff", window.DeepDiff).constant("moment", window.moment);})();
(function(){"use strict";

angular.module("app.auth").config(["$httpProvider", function ($httpProvider) {
  $httpProvider.interceptors.push("HTTPInterceptor");
}]);})();
(function(){"use strict";

angular.module("app.core").config(["DSProvider", function (DSProvider) {
  DSProvider.defaults.defaultAdapter = "DSLocalStorageAdapter";
}]).config(["$provide", function ($provide) {
  $provide.decorator("$state", ["$delegate", "$stateParams", function ($delegate, $stateParams) {
    $delegate.reload = function () {
      return $delegate.go($delegate.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
    };
    return $delegate;
  }]);
}]);})();
//# sourceMappingURL=rest.js.map