app.service('userService', ['$location', '$http', 'myCache',
    function ($location, $http, myCache) {

        this.login = function(p_url, p_auth, p_data) {

            $http({

                url: p_url,
                data: p_data,
                method: 'POST',
                transformRequest: function(p_data) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {username: 'jonathan'}

            })
            .success(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));

                if(data.succeed === true) {
                    myCache.put('myData', p_auth);
                    $location.path( "/file" );
                }

            })
            .error(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));
            });
        }
    }
]);