angular.module('SignupMod').controller('SignupCtrl', ['$scope', '$http', function($scope, $http){
	console.log('Signup Controller initialized...');
	
    $scope.runSignup = function() {
    	console.log('Signing up ' + $scope.name);

    	$http.post('/signup', {
    		name: $scope.name,
    		email: $scope.email,
    		password: $scope.password
    	}).then(function success(res){
    		window.location = '/user';
    	}).catch(function error(err){
    		console.log('Error' + err);
    	});
    }
}]);