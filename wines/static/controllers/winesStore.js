angular.module("winesStore", ["ngRoute"])

.constant("dataUrl", "http://localhost:3000/wines")

.controller("winesStoreCtrl", function($scope, $http, dataUrl){
    $scope.data = {};
    
    $http.get(dataUrl)
        .success(function (data) {
            $scope.data.products = data;
        })
        .error(function(error, status) {
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
