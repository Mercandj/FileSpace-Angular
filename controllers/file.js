app.controller('FileCtrl',
	function($scope, $location, $http, $q, Base64, myCache, fileService) {

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
            	console.log("Result /file : " + JSON.stringify(data.result));
                data.result.forEach(function(file) {
                    file.size = bytesToSize(file.size);
                });                
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

        $http({
            url: URL_SERVER+'information',
            method: 'GET',
            headers : {
                'Authorization':'Basic '+ myCache.get('myData'),
                'Content-Type':'application/json',
            }
        })
        .success(function(data,status) {
            if(data.succeed === true) {
                console.log("Result /information : " + JSON.stringify(data.result));
                $scope.information = data.result;
                deferred.resolve(data.result);
            }
        })
        .error(function(data,status) {
            if(status == 401)
                deferred.reject('401 unauthorized')
            else if(status == 404)
                deferred.reject('404 not found');
            else
                deferred.reject('Cannot get Informations');
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

        $scope.download = function(file) {
            $http({
                url: URL_SERVER+'file/'+file.id,
                method: 'GET',
                headers : {
                    'Authorization':'Basic '+ myCache.get('myData'),
                    'Content-Type':'application/json',
                }
            })
            .success(function(data,status) {
                var fileTMP = new Blob([ data ], {
                    type : 'application/csv'
                });
                //trick to download store a file having its URL
                var fileURL = URL.createObjectURL(fileTMP);
                var a         = document.createElement('a');
                a.href        = fileURL; 
                a.target      = '_blank';
                a.download    = file.url;
                document.body.appendChild(a);
                a.click();
            });
        };

        $scope.edit = function(file) {

            if (file.type === 'txt') {
                $http({
                    url: URL_SERVER+'file/'+file.id,
                    method: 'GET',
                    headers : {
                        'Authorization':'Basic '+ myCache.get('myData'),
                        'Content-Type':'application/json',
                    }
                })
                .success(function(data,status) {
                    openDialog(file.url, "", 
                        '<textarea rows="5" name="text" placeholder="YOUR TXT" class="error">'+
                        data +
                        '</textarea>'+

                        '<div ng-controller="FileCtrl" ng-click="save()" class="button label-blue left">'+
                        '  <div class="center" fit>SAVE</div>'+
                        '  <paper-ripple fit></paper-ripple>'+
                        '</div>'+
                        
                        '<div class="button right" onclick="LinkButtonFAB_Click(this)">'+
                        '  <div class="center" fit>CANCEL</div>'+
                        '  <paper-ripple fit></paper-ripple>'+
                        '</div>'

                    );
                });
            }
            else
                openDialog(file.url, "Can't edit this type of file.", 
                    '<div class="button right" onclick="LinkButtonFAB_Click(this)">'+
                    '  <div class="center" fit>CANCEL</div>'+
                    '  <paper-ripple fit></paper-ripple>'+
                    '</div>');
            
        };


        $scope.save = function() {
            alert("SAVE ");
        }

	}
);