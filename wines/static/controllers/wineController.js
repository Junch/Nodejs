angular.module('winesStore')

.controller('wineController', function ($scope, wineFactory, $routeParams, $location) {
    $scope.data = {};
    var wineId = $routeParams.wineId;

    getWine();

    function getWine() {
        if (!wineId){
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

    var refresh = function () {
        $scope.data.wine = {};
        $scope.$emit('change', {});
        $location.path('/wines');
    };

    $scope.DeleteWine = function (wineId) {
        wineFactory.remove({id:wineId},
            function success(data) {
                refresh();
            },
            function error(error) {
                $scope.data.error = error;
            });
    };

    $scope.AddOrEditWine = function (wine) {
        wineFactory.save(wine,
            function success(data) {
                refresh();
            },
            function error(error) {
                $scope.data.error = error;
            });
    };
});
