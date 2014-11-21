app.controller('UserCtrl',function($scope, $http){

    $scope.user = {};

    $scope.submit = function() {

	    $http({

	        url: "http://mercandalli.com/Jarvis-API/",
	        data: $scope.form,
	        method: 'GET',
	        headers : {'Authorization-Type':'Basic '+$scope.user.username+':password'+hex_sha1($scope.user.password)}

	    })
	    .success(function(data, status){

	        console.log("OK "+status, data);
	        console.log("TEST "+status);

	    })
	    .error(function(err){"ERR", console.log(err)});

	}

});