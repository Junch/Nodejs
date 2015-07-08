'use strict';
// The example is from the book Pro AngularJS

angular.module("appEx2", [])
.controller("defaultCtrl", function($scope, $http){
  $http.get("productData.json").success(function(data) {
    $scope.products = data;
  });

  $scope.counter = 0;

  $scope.incrementCounter = function() {
    $scope.counter++;
  }
});
