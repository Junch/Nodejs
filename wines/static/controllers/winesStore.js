angular.module("winesStore", [])

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
});