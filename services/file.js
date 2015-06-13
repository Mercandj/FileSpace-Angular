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

app.service('fileService', ['$http', 'myCache', '$q',
    function ($http, myCache, $q) {
        this.uploadFileToUrl = function(p_url, p_auth, p_filesArray, p_endListener) {

            var deferred = $q.defer();
            var getProgressListener = function(deferred) {
                return function(e) {
                    if (e.lengthComputable) {
                        var percentage = Math.round((e.loaded / e.total) * 100);
                        console.log("upload progress : "+percentage+" %");
                    }
                };
            };

            var fd = new FormData();
            angular.forEach(p_filesArray, function(file) {
                fd.append('file', file);    
            });

            $.ajax({
                type: 'POST',
                url: p_url,
                headers: { 
                    'Authorization':'Basic '+ p_auth,
                    'Content-Type': undefined
                },
                data: fd,
                cache: false,
                // Force this to be read from FormData
                contentType: false,
                processData: false,
                success: function(response, textStatus, jqXHR) {
                    console.log("success : " + textStatus + " : " + JSON.stringify(response));
                    alert('Upload succeed!');
                    p_endListener();
                    deferred.resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error : " + textStatus);
                    deferred.reject(errorThrown);
                    alert('Upload failed : '+textStatus+'!');
                },
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener(
                        'progress', getProgressListener(deferred), false);
                    } else {
                        $log.log('Upload progress is not supported.');
                    }
                    return myXhr;
                }
            });
        }
    }
]);