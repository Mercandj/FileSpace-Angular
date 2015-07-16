app.service('userService', ['$location', '$http', 'myCache', '$httpParamSerializer', '$timeout', '$rootScope',
    function ($location, $http, myCache, $httpParamSerializer, $timeout, $rootScope) {

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
                else {
                    $rootScope.toast = data.toast;
                    $timeout(function() {
                        $rootScope.toast = '';
                    }, 2500);
                }

            })
            .error(function(data, status, headers, config) {
                console.log(status + " : " + JSON.stringify(data));
            });



        }
    }
]);