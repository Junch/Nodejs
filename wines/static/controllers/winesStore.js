angular.module('winesStore', ['ngRoute', 'ngResource'])

.controller('winesStoreCtrl', function ($scope, wineFactory) {
    $scope.data = {};

    var init = function () {
        wineFactory.query({},
            function success(data) {
                $scope.data.products = data;
            },
            function error(errorResponse) {
                $scope.data.error = status;
            });
    };

    init();
})

.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/readme.html'
        })
        .when('/wines', {
            templateUrl: 'views/winesList.html'
        })
        .when('/wines/add', {
            controller: 'wineController',
            templateUrl: 'views/wine.html'
        })
        .when('/wines/:wineId', {
            controller: 'wineController',
            templateUrl: 'views/wine.html'
        })
        .otherwise({redirectTo: '/'});
});
