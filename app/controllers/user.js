app.controller('UserCtrl', 
	function($scope, $location, $http, $q, Base64, myCache, userService) {

	    $scope.user = {};
	    var deferred = $q.defer();

	    $scope.submit = function() {
	    	if( userService.login(
	    		URL_SERVER+'user',
	    		Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password)),
	    		$scope.form
	    	) === true)
	    		$location.path( "/file" );
	    }


	    /*function() {

		    $http({

		        url: URL_SERVER+'user',
		        data: $scope.form,
		        method: 'GET',
		        headers : {
		        	'Authorization':'Basic '+ Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password)),
	        		'Content-Type':'application/json',
		        }

		    })
		    .success(function(data, status, headers, config) {
		        console.log(status + " : " + JSON.stringify(data));

		        if(data.succeed === true) {
		        	myCache.put('myData', Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password)));
		        	$location.path( "/file" );
		        }

		    })
		    .error(function(data, status, headers, config) {
		    	if(status == 401)
                    deferred.reject('401 unauthorized');
                else if(status == 404)
                    deferred.reject('404 not found');
                else
                    deferred.reject('Cannot get user');
		    });

		}*/
	}
);