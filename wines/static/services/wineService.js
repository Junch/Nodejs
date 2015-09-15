angular.module('winesStore')

.constant('dataUrl', '/wines/:id')

.factory('wineFactory', function ($resource, dataUrl) {
    return $resource(dataUrl, {id: '@_id'});
});
