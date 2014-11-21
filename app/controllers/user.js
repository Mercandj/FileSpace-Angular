app.controller('UserCtrl',function($scope, $http, Base64){

    $scope.user = {};

    $scope.submit = function() {

	    $http({

	        url: "http://mercandalli.com/Jarvis-API/",
	        data: $scope.form,
	        method: 'GET',
	        headers : {
	        	'Authorization':'Basic '+ Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password))
	        }

	    })
	    .success(function(data, status, headers, config) {

	        console.log("OK "+status);
	        console.log("data "+data);

	    })
	    .error(function(data, status, headers, config) {

	    	console.log("ERROR "+status);
	    	console.log("data "+data);

	    });

	}
});