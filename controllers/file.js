app.controller('FileCtrl',
	function($scope, $location, $http, $q, Base64, myCache, fileService) {
	    /*
        $scope.file = FileFactory.all().then(function(file) {
            $scope.file = file;
        },function(msg){
            alert(msg);
        });
	    */

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
            if(data.succeed === true) {
            	console.log("Result : " + JSON.stringify(data.result));
            	//$scope.files = data.result;
                $scope.filesOnline = data.result;
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
            $location.path( "/" );
        });

        $scope.filesChanged = function(elm) {
            $scope.files = elm.files;
            $scope.$apply();
        }

        $scope.upload = function() {
            fileService.uploadFileToUrl(
                URL_SERVER+'file',
                myCache.get('myData'),
                $scope.files
            );
        };

        $scope.download = function(url) {
            $http({

                url: url,
                method: 'GET',
                headers : {
                    'Authorization':'Basic '+ myCache.get('myData'),
                    'Content-Type':'application/json',
                }

            });
        };
	}
);