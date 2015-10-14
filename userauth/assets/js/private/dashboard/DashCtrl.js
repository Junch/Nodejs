angular.module('DashMod').controller('DashCtrl', ['$scope', '$http', function($scope, $http){
	console.log('Dash Controller initialized...');

	$scope.getUser = function(){
		console.log('Getting User...');

		$http.get('/getuser').then(function success(user){
			$scope.user = user.data;
		}).catch(function error(err){
			console.log(err);
		});
	}
}]);