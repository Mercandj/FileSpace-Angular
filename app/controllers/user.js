app.controller('UserCtrl', 
	function($scope, $http, Base64, myCache) {

	    $scope.user = {};

	    $scope.submit = function() {

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

		        myCache.put('myData', Base64.encode($scope.user.username + ':' + hex_sha1($scope.user.password)));
		        console.log("CACHE : " + myCache.get("myData"));

		        if(data.succeed === true)
		        	console.log("succeed = true");
		        else
		        	console.log("succeed = false");

		    })
		    .error(function(data, status, headers, config) {
		    	console.log(status + " : " + JSON.stringify(data));
		    });

		}
	}
);