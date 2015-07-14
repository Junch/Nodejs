angular.module("winesStore", ["ngRoute"])

.controller("winesStoreCtrl", function($scope, wineFactory){
    $scope.data = {};
    
    wineFactory.getWines()
        .success(function(data){
            $scope.data.products = data;
        })
        .error(function(error, status){
            $scope.data.error = status;
        });
})

.config(function($routeProvider){
    $routeProvider
        .when("/", {
            templateUrl: "views/winesList.html"
        })
        .when("/wines/add", {
            controller: "wineController",
            templateUrl: "views/wine.html"
        })
        .when("/wines/:wineId", {
            controller: "wineController",
            templateUrl: "views/wine.html"
        })
        .otherwise( {redirectTo: '/'} );
});
