angular.module('SignupMod').controller('SignupCtrl', ['$scope', function($scope){
	console.log('Signup Controller initialized...');
	
    $scope.runSignup = function() {
    	console.log('Signing up ' + $scope.name);
    }
}]);