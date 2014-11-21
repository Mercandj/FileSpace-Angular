app.controller('UserCtrl',function($scope, $http){

    $scope.user = {};

    $scope.submit = function() {
    	console.log($scope.user.username);
    	console.log(hex_sha1("a"));

	    $http({

	        url: "http://mercandalli.com/Jarvis-API/",
	        data: $scope.form,
	        method: 'GET',
	        headers : {'Authorization-Type':'Basic bashe64usename:password'}

	    }).success(function(data){

	        console.log("OK", data)

	    }).error(function(err){"ERR", console.log(err)})
		
	}

});