app.controller('UserCtrl',function($scope, $http, Base64){

    $scope.user = {};

    $scope.submit = function() {

	    $http({

	        url: URL_SERVER+"user",
	        data: $scope.form,
	        method: 'GET',
	        headers : {
	        	'Authorization':'Basic '+ Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password)),
        		'Content-Type':'application/json',
	        }

	    })
	    .success(function(data, status, headers, config) {
	        console.log(status + " : " + JSON.stringify(data));
	    })
	    .error(function(data, status, headers, config) {
	    	console.log(status + " : " + JSON.stringify(data));
	    });

	}
});