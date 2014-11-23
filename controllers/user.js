app.controller('UserCtrl', 
	function($scope, $location, $http, $q, Base64, myCache, userService) {

	    $scope.user = {};
	    var deferred = $q.defer();

	    $scope.submit = function() {
	    	userService.login(
	    		URL_SERVER+'user',
	    		Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password)),
	    		$scope.form
	    	);
	    }
	}
);