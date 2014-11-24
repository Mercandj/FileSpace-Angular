app.controller('FileCtrl',
	function($scope, $location, $http, $q, Base64, myCache, fileService) {
	   /*
        $scope.file = FileFactory.all().then(function(file) {
            $scope.file = file;
        },function(msg){
            alert(msg);
        });
	    */

        //an array of files selected
        $scope.files = [];

        //listen for the file selected event
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {            
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });

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
            $location.path( "/" );
        });

        $scope.uploadFile = function() {
            var file = $scope.uploadFile;//$scope.files[0];
            console.log('file is ' + JSON.stringify(file));
            
            fileService.uploadFileToUrl(
                URL_SERVER+'file',
                myCache.get('myData'),
                file
            );
        };
	}
);