app.controller('FileCtrl',
	function($scope, $location, $http, $q, Base64, myCache, fileService) {

		var deferred = $q.defer();
		$http({
            url: URL_SERVER+'file',
            method: 'GET',
            headers : {
                'Authorization':'Basic '+ myCache.get('myData'),
                'Content-Type':'application/json',
            }
        })
        .success(function(data,status) {
            if(data.succeed === true) {
            	console.log("Result /file : " + JSON.stringify(data.result));
                data.result.forEach(function(file) {
                    file.size = bytesToSize(file.size);
                    if(!file.directory)
                        file.name+="."+file.type;
                });                
                $scope.filesOnline = data.result;
            	deferred.resolve(data.result);
            }
        })
        .error(function(data,status) {
            if(status == 401)
                deferred.reject('401 unauthorized')
            else if(status == 404)
                deferred.reject('404 not found');
            else
                deferred.reject('Cannot get files');
            $location.path( "/" );
        });

        $http({
            url: URL_SERVER+'information',
            method: 'GET',
            headers : {
                'Authorization':'Basic '+ myCache.get('myData'),
                'Content-Type':'application/json',
            }
        })
        .success(function(data,status) {
            if(data.succeed === true) {
                console.log("Result /information : " + JSON.stringify(data.result));
                $scope.information = data.result;
                deferred.resolve(data.result);
            }
        })
        .error(function(data,status) {
            if(status == 401)
                deferred.reject('401 unauthorized')
            else if(status == 404)
                deferred.reject('404 not found');
            else
                deferred.reject('Cannot get Informations');
            $location.path( "/" );
        });



        $scope.filesChanged = function(elm) {
            $scope.files = elm.files;
            $scope.$apply();
        }

        $scope.upload = function() {
            fileService.uploadFileToUrl(
                URL_SERVER+'file',
                myCache.get('myData'),
                $scope.files
            );
        };

        $scope.download = function(file) {
            $http({
                url: URL_SERVER+'file/'+file.id,
                method: 'GET',
                responseType:'arraybuffer',
                headers : {
                    'Authorization':'Basic '+ myCache.get('myData')
                }
            })
            .success(function(data,status,headers) {
                
                var octetStreamMime = "application/octet-stream";
                switch(file.type) {
                    case 'pdf':     octetStreamMime = 'application/pdf';      break;
                    case 'zip':     octetStreamMime = 'application/zip';      break;
                    case 'jpeg':    octetStreamMime = 'image/jpg';            break;
                    case 'jpg':     octetStreamMime = 'image/jpg';            break;
                    case 'png':     octetStreamMime = 'image/png';            break;
                    case 'gif':     octetStreamMime = 'image/gif';            break;
                    case 'html':    octetStreamMime = 'image/html';           break;
                    case 'doc':     octetStreamMime = 'image/msword';         break;
                    case 'mp3':     octetStreamMime = 'audio/mpeg';           break;
                    case 'apk':     octetStreamMime = 'application/vnd.android.package-archive'; break;
                }
                
                var success = false;

                // Get the headers
                headers = headers();

                // Get the filename from the x-filename header or default to "download.bin"
                var filename = headers['x-filename'] || file.name;

                // Determine the content type from the header or default to "application/octet-stream"
                var contentType = headers['content-type'] || octetStreamMime;

                try
                {
                    // Try using msSaveBlob if supported
                    console.log("Trying saveBlob method ...");
                    var blob = new Blob([data], { type: contentType });
                    if(navigator.msSaveBlob)
                        navigator.msSaveBlob(blob, filename);
                    else {
                        // Try using other saveBlob implementations, if available
                        var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                        if(saveBlob === undefined) throw "Not supported";
                        saveBlob(blob, filename);
                    }
                    console.log("saveBlob succeeded");
                    success = true;
                } catch(ex)
                {
                    console.log("saveBlob method failed with the following exception:");
                    console.log(ex);
                }

                if(!success)
                {
                    // Get the blob url creator
                    var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    if(urlCreator)
                    {
                        // Try to use a download link
                        var link = document.createElement('a');
                        if('download' in link)
                        {
                            // Try to simulate a click
                            try
                            {
                                // Prepare a blob URL
                                console.log("Trying download link method with simulated click ...");
                                var blob = new Blob([data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);
                                link.setAttribute('href', url);

                                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                link.setAttribute("download", filename);

                                // Simulate clicking the download link
                                var event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                link.dispatchEvent(event);
                                console.log("Download link method with simulated click succeeded");
                                success = true;

                            } catch(ex) {
                                console.log("Download link method with simulated click failed with the following exception:");
                                console.log(ex);
                            }
                        }

                        if(!success)
                        {
                            // Fallback to window.location method
                            try
                            {
                                // Prepare a blob URL
                                // Use application/octet-stream when using window.location to force download
                                console.log("Trying download link method with window.location ...");
                                var blob = new Blob([data], { type: octetStreamMime });
                                var url = urlCreator.createObjectURL(blob);
                                window.location = url;
                                console.log("Download link method with window.location succeeded");
                                success = true;
                            } catch(ex) {
                                console.log("Download link method with window.location failed with the following exception:");
                                console.log(ex);
                            }
                        }

                    }
                }

                if(!success)
                {
                    // Fallback to window.open method
                    console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                    window.open(httpPath, '_blank', '');
                }
                

            });

        };

        $scope.edit = function(file) {

            if (file.type === 'txt') {
                $http({
                    url: URL_SERVER+'file/'+file.id,
                    method: 'GET',
                    headers : {
                        'Authorization':'Basic '+ myCache.get('myData'),
                        'Content-Type':'application/json',
                    }
                })
                .success(function(data,status) {
                    openDialog(file.name, "", 
                        '<textarea rows="5" name="text" placeholder="YOUR TXT" class="error">'+
                        data +
                        '</textarea>'+

                        '<div ng-controller="FileCtrl" ng-click="save()" class="button label-blue left">'+
                        '  <div class="center" fit>SAVE</div>'+
                        '  <paper-ripple fit></paper-ripple>'+
                        '</div>'+
                        
                        '<div class="button right" onclick="LinkButtonFAB_Click(this)">'+
                        '  <div class="center" fit>CANCEL</div>'+
                        '  <paper-ripple fit></paper-ripple>'+
                        '</div>'

                    );
                });
            }
            else if(file.type === 'mp3') {

                if (! window.AudioContext) {
                    if (! window.webkitAudioContext) {
                        alert('no audiocontext found');
                    }
                    window.AudioContext = window.webkitAudioContext;
                }
                var context = new AudioContext();
                var audioBuffer;
                var sourceNode;

                // create a buffer source node
                sourceNode = context.createBufferSource();
                // and connect to destination
                sourceNode.connect(context.destination);


            	openDialog(file.name, "", 
    			'<audio id="media">'+
    			'</audio>');
        		var mediaElem = document.getElementById("media");
        		
        		var xmlhttp = new XMLHttpRequest();
        		xmlhttp.open("GET", URL_SERVER+'file/'+file.id, true);
        		xmlhttp.setRequestHeader('Authorization', 'Basic '+ myCache.get('myData'));
        		xmlhttp.setRequestHeader('Content-Type', 'audio/mpeg');
                xmlhttp.responseType = "ms-stream";
                
                xmlhttp.responseType = 'arraybuffer';

                var start = false;

                /*
                // When loaded decode the data
                xmlhttp.onload = function() {
         
                    // decode the data
                    context.decodeAudioData(xmlhttp.response, function(buffer) {
                        // when the audio is decoded play the sound
                        sourceNode.buffer = buffer;
                        sourceNode.start(0);
                    }, function(e) {
                        console.log(e);
                    });
                }
                */

                xmlhttp.onreadystatechange = function() {
                    /*if (
                        (xmlhttp.readyState === 4) && 
                        (xmlhttp.status === 200) && 
                        (xmlhttp.status !== 404)
                        ) {*/
                        context.decodeAudioData(xmlhttp.response, function(buffer) {
                            sourceNode.buffer = buffer;
                            if(!start) {
                                sourceNode.start(0);
                                start = true;
                            }
                            
                        });
                    //} 
                };
                
        		xmlhttp.addEventListener("progress", function(e) {
                            if (e.lengthComputable) {
                                var percentage = Math.round((e.loaded / e.total) * 100);
                                console.log("download progress : "+percentage+" %");


                            }
                        }, false);
        		/*xmlhttp.onreadystatechange = function()
        		{
        			//DONE readystate
        			if(xmlhttp.readyState==4 && xmlhttp.status==200)
        			{
        				mediaElem.src = "data:audio/mpeg;base64," + window.btoa(xmlhttp.responseText);   
        			}
        		}*/
        		xmlhttp.send();
        		
            }
            else
                openDialog(file.url, "Can't edit this type of file.", 
                    '<div class="button right" onclick="LinkButtonFAB_Click(this)">'+
                    '  <div class="center" fit>CANCEL</div>'+
                    '  <paper-ripple fit></paper-ripple>'+
                    '</div>');
                    
        };


        $scope.save = function() {
            alert("SAVE ");
        }

	}
    
);
