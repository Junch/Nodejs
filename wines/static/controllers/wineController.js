angular.module("winesStore")

.controller("wineController", function($scope, wineFactory, $routeParams){
    $scope.data={};
    var wineId = $routeParams.wineId;
    
    getWine();
    
    function getWine(){
        wineFactory.get({id:wineId},
            function success(data){
                $scope.data.wine = data;
            },
            function error(error){
                $scope.data.error = error;
            });
    }
    
    $scope.DeleteWine = function(wineId){
        wineFactory.remove({id:wineId},
            function success(data){
                console.log("Delete wine successfully");
                $scope.data.wine = {};
            },
            function error(error){
                $scope.data.error = error;
            });
    };
    
    var AddWine = function(wine){
        wineFactory.save(wine,
            function success(data){
                $scope.data.wine = {};
            },
            function error(error){
                $scope.data.error = error;
            });
    };
    
    var UpdateWine = function(wine){    
        wineFactory.update({id: wine._id}, wine,
            function success(data){
                $scope.data.wine = {};
            },
            function(error){
                $scope.data.error = error;
            });
    };
    
    $scope.AddOrEditWine = function(wine){
        if (wine._id){
            UpdateWine(wine);
        }else{
            AddWine(wine);   
        }
    };    
});
