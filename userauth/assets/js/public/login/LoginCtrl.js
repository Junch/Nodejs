angular.module('LoginMod').controller('LoginCtrl', ['$scope', '$http', function($scope, $http){
	console.log('Login Controller initialized...');

	$scope.runLogin = function(){
		console.log('Login Submitted...');
	}
}]);