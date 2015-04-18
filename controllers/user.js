app.controller('UserCtrl', 
	function($scope, $location, $http, $q, Base64, myCache, userService) {

	    $scope.user = {};
	    var deferred = $q.defer();

	    $scope.submit = function() {
	    	var now = new Date();
	    	var year = now.getUTCFullYear();
	    	var month = now.getUTCMonth()<10 ? ('0' + now.getUTCMonth()) : now.getUTCMonth();
	    	var day = now.getUTCDate()<10 ? ('0' + now.getUTCDate()) : now.getUTCDate();
	    	var hours = now.getUTCHours()<10 ? ('0' + now.getUTCHours()) : now.getUTCHours();
	    	var minutes = now.getUTCMinutes()<10 ? ('0' + now.getUTCMinutes()) : now.getUTCMinutes();
	    	var date_str = year+"-"+month+"-"+day+" "+hours+":"+minutes;
	    	userService.login(
	    		URL_SERVER+'user',
	    		Base64.encode($scope.user.username + ':' + hex_sha1( hex_sha1(hex_sha1($scope.user.password)) + date_str )),
	    		$scope.form
	    	);
	    }
	}
);