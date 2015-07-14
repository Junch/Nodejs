angular.module("winesStore")

.constant("dataUrl", "http://localhost:3000/wines")

.factory("wineFactory", function($http, dataUrl){
    
    var factory = {};
    
    factory.getWines = function(){
        return $http.get(dataUrl);
    }
    
    factory.getWine = function(id){
        return $http.get(dataUrl + "/" + id);
    }
    
    factory.addWine = function(wine){
        return $http.post(dataUrl, wine);
    }
    
    factory.deleteWine = function(id){
        return $http.delete(dataUrl + "/" + id);
    }
    
    factory.updateWine = function(wine){
        return $http.put(dataUrl + "/" + wine._id, wine);
    }
    
    return factory;
});
