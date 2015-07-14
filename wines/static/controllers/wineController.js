angular.module("winesStore")

.controller("wineController", function($scope, wineFactory, $routeParams){
    $scope.data={};
    var wineId = $routeParams.wineId;
    
    getWine();
    
    function getWine(){
        wineFactory.getWine(wineId)
            .success(function(data){
                $scope.data.wine = data;
            })
            .error(function(error){
                $scope.data.error = error;
            });
    }
    
    $scope.DeleteWine = function(wineId){
        wineFactory.deleteWine(wineId)
            .success(function(data){
                console.log("Delete wine successfully");
                $scope.data.wine = {};
            })
            .error(function(error){
                $scope.data.error = error;
            });
    };
    
    var AddWine = function(wine){
        wineFactory.addWine(wine)
            .success(function(data){
                $scope.data.wine = {};
            })
            .error(function(error){
                $scope.data.error = error;
            });
    };
    
    var UpdateWine = function(wine){    
        wineFactory.updateWine(wine)
            .success(function(data){
                $scope.data.wine = {};
            })
            .error(function(error){
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
