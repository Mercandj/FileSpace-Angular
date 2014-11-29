app.factory('FileFactory',
    function($scope, $location, $http, $q, myCache) {
        
        var factory = {
            file : false,
            all : function() {
                
                var deferred = $q.defer();
                
                if(factory.file !== false) {
                    console.log('file.js : factory.file !== false');
                    deferred.resolve(factory.file);
                }
                else {
                    $http({

                        url: URL_SERVER+'file',
                        method: 'GET',
                        headers : {
                            'Authorization':'Basic '+ myCache.get('myData'),
                            'Content-Type':'application/json',
                        }

                    })
                    .success(function(data,status) {
                        factory.file = data;
                        deferred.resolve(factory.file);
                    })
                    .error(function(data,status) {
                        if(status == 401)
                            deferred.reject('401 unauthorized')
                        else if(status == 404)
                            deferred.reject('404 not found');
                        else
                            deferred.reject('Cannot get files');
                    });
                }
                
                return deferred.promise;
            },
        }

        return factory;        
    }
);

app.service('fileService', ['$http', 'myCache',
    function ($http, myCache) {
        this.uploadFileToUrl = function(p_url, p_auth, p_filesArray) {
            var fd = new FormData();
            angular.forEach(p_filesArray, function(file) {
                fd.append('file', file);    
            })            
            $http.post(p_url, fd, {
                transformRequest: angular.identity,
                headers: { 
                    'Authorization':'Basic '+ p_auth,
                    'Content-Type': undefined
                }
            })
            .success(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));
                if(data.succeed === true)
                    alert('Upload succeed! '+data.toast);
                else
                    alert('Upload failed : Status=200 : '+data.toast);
            })
            .error(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));
                alert('Upload failed : '+status+'!');
            });

        }
    }
]);