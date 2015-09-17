angular.module('winesStore')

.controller('wineController', function ($scope, wineFactory, $routeParams, $location) {
    var wineId = $routeParams.wineId;

    getWine();

    function getWine() {
        if (!wineId){
            delete $scope.data.wine;
            return;
        }

        wineFactory.get({id:wineId},
            function success(data) {
                $scope.data.wine = data;
            },
            function error(error) {
                $scope.data.error = error;
            });
    }

    $scope.DeleteWine = function (wineId) {
        wineFactory.remove({id:wineId},
            function success(data) {
                $scope.data.products = $scope.data.products.filter(function(e){
                    return wineId != e._id;
                });

                $location.path('/wines');
            },
            function error(error) {
                $scope.data.error = error;
            });
    };

    $scope.AddOrEditWine = function (wine) {
        wineFactory.save(wine,
            function success(data) {
                if(!wine._id) {
                    $scope.data.products.push(data);
                }else{
                    for (var i = 0; i < $scope.data.products.length; ++i){
                      if ($scope.data.products[i]._id == wine._id){
                        $scope.data.products[i] = data;
                      }
                    }                   
                }

                $location.path('/wines');
            },
            function error(error) {
                $scope.data.error = error;
            });
    };
});
