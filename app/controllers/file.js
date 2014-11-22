app.controller('FileCtrl',
	function($scope, $location, $http, $q, Base64, myCache, myFileUpload) {
	/*
    $scope.file = FileFactory.all().then(function(file) {
        $scope.file = file;
    },function(msg){
        alert(msg);
    });
	*/
        $scope.selectedFile = [];

		var deferred = $q.defer();
		$http({

            url: URL_SERVER+'file',
            method: 'GET',
            headers : {
                'Authorization':'Basic '+ myCache.get('myData'),
                'Content-Type':'application/json',
            }

        })
        .success(function(data,status) {
            console.log(status + " : " + JSON.stringify(data));

            if(data.succeed === true) {
            	console.log("Result : " + JSON.stringify(data.result));
            	$scope.files = data.result;
            	deferred.resolve(data.result);
            }
        })
        .error(function(data,status) {
            if(status == 401)
                deferred.reject('401 unauthorized')
            else if(status == 404)
                deferred.reject('404 not found');
            else
                deferred.reject('Cannot get files');
        });

        $scope.uploadFile = function() {
            var file = $scope.selectedFile[0];
            console.log('file is ' + JSON.stringify(file));
            myFileUpload.uploadFileToUrl(
                URL_SERVER+'file'
                myCache.get('myData'),
                file
            );
        };

        $scope.onFileSelect = function ($files) {
            $scope.uploadProgress = 0;
            $scope.selectedFile = $files;
        };

	}
);