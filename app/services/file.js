app.factory('FileFactory', ['$scope', '$location', '$http', '$q', 'myCache',
    function($scope, $location, $http, $q, myCache) {

        
        var factory = {
            file : false,
            all : function() {
                
                var deferred = $q.defer();
                /*
                if(factory.file !== false) {
                    console.log('file.js : factory.file !== false');
                    deferred.resolve(factory.fil);
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
                */
                return deferred.promise;
            },
        }

        return factory;
        
    }
]);