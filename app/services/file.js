app.factory('FileFactory', function($http, $q, myCache){
    var factory = {
        files : false,
        all : function() {
            var deferred = $q.defer();
            if(factory.files !== false)
                deferred.resolve(factory.files);
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
                    factory.files = data;
                    deferred.resolve(factory.files);
                })
                .error(function(data,status) {
                    if(status == 401)
                        deferred.reject('401 unauthorized');
                    else if(status == 404)
                        deferred.reject('404 not found');
                    else
                        deferred.reject('Cannot get files');
                })
            }
            return deferred.promise;
        },
    }

    return factory;
})