app.factory('FileFactory', function($scope, $location, $http, $q, myCache){

    $http({

        url: URL_SERVER+'file',
        method: 'GET',
        headers : {
            'Authorization':'Basic '+ myCache.get('myData'),
            'Content-Type':'application/json',
        }

    })
    .success(function(data, status, headers, config) {
        console.log(status + " : " + JSON.stringify(data));

        if(data.succeed === true) {
            
        }

    })
    .error(function(data, status, headers, config) {
        if(status == 401)
            deferred.reject('401 unauthorized');
        else if(status == 404)
            deferred.reject('404 not found');
        else
            deferred.reject('Cannot get user');
    });


})