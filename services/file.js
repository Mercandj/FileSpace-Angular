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
        this.uploadFileToUrl = function(p_url, p_auth, p_file) {

            console.log('fileService is ' + JSON.stringify(p_file));
            
            var fd = new FormData();
            fd.append('file', p_file);

            /*
            $http.post(p_url, fd, {
                transformRequest: angular.identity,
                headers: { 
                    'Authorization':'Basic '+ p_auth,
                    'Content-Type': undefined
                }
            })
            */
            
            $http({

                url: p_url,
                data: fd,
                method: 'POST',
                headers : {
                    'Authorization':'Basic '+ p_auth,
                    'Content-Type': undefined
                }
                //,file: p_file

            })
            
            .success(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));
                if(data.succeed === true) {
                    console.log("Result : " + JSON.stringify(data.result));

                }
            })
            .error(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));
            });
        }
    }
]);