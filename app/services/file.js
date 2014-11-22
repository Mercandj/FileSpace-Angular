app.factory('FileFactory', function($http, $q){
    var factory = {
        files : false,
        all : function() {
            var deferred = $q.defer();
            if(factory.files !== false)
                deferred.resolve(factory.files);
            else {

                console.log(""+myCache.get('myData'));

                $http.get(URL_SERVER+'file')
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