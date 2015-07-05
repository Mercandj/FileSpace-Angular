app.service('userService', ['$location', '$http', 'myCache', '$httpParamSerializer',
    function ($location, $http, myCache, $httpParamSerializer) {

        this.login = function(p_url, p_auth, p_data) {

            $http({

                url: p_url,
                data: $.param({login: "true"}),
                method: 'POST',
                headers : {
                    'Authorization':'Basic '+ p_auth,
                    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                }

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