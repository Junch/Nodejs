angular.module("winesStore")

.controller("wineController", function($scope, $http, dataUrl, $routeParams){
    $scope.data={};
    var wineId = $routeParams.wineId;
    
    $http.get(dataUrl + "/" + wineId)
        .success(function (data) {
            $scope.data.wine = data;
        })
        .error(function(error, status) {
            $scope.data.error = status;
        });
    
    $scope.DeleteWine = function(wineId){
        $http.delete(dataUrl + "/" + wineId)
            .success(function(data){
                console.log("Delete wine successfully");
                $scope.data.wine = {};
            })
            .error(function(error){
                $scope.data.addError = error;
                console.log("Fail to delete wine");
            });
//            .finally(function(){
//                $location.path("/");
//            });
    };
    
    
    var AddWine = function(wine){
        $http.post(dataUrl, wine)
            .success(function(data){
                console.log("Add wine successfully");
                $scope.data.wine = {};
            })
            .error(function(error){
                $scope.data.addError = error;
                console.log("Fail to add wine");
            });
    };
    
    var UpdateWine = function(wine){
        var id = wine._id;
        wine._id = undefined;
        
        $http.put(dataUrl + "/" + id, wine)
            .success(function(data){
                console.log("Update wine successfully");
                $scope.data.wine = {};
            })
            .error(function(error){
                $scope.data.addError = error;
                console.log("Fail to add wine");
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
