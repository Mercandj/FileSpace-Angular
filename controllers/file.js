app.controller('FileCtrl',
	function($scope, $location, $http, $q, Base64, myCache, fileService) {

        $scope.leftMenu = {
           allPublic : false
         };

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
            $scope.filesOnline = $scope.filesAdapter(data,status);
            deferred.resolve($scope.filesOnline);
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
            url: URL_SERVER+'file?all-public=true',
            method: 'GET',
            headers : {
                'Authorization':'Basic '+ myCache.get('myData'),
                'Content-Type':'application/json',
            }
        })
        .success(function(data,status) {
            $scope.filesPublicOnline = $scope.filesAdapter(data,status);
            deferred.resolve($scope.filesPublicOnline);
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

        $scope.refresh = function(id_file_parent) {
            id_file_parent = typeof id_file_parent !== 'undefined' ? id_file_parent : -1;

            var fab2 = document.getElementById("fab2");
            if(id_file_parent != -1) {
                fab2.style.display = "";
                fab2.addEventListener("click", function(e) {
                    $scope.refresh(-1);
                });
            }
            else {
                fab2.style.display = "none";
            }

            var deferred = $q.defer();
            $http({
                url: URL_SERVER+'file?id_file_parent='+id_file_parent,
                method: 'GET',
                headers : {
                    'Authorization':'Basic '+ myCache.get('myData'),
                    'Content-Type':'application/json',
                }
            })
            .success(function(data,status) {
                $scope.filesOnline = $scope.filesAdapter(data,status);
                deferred.resolve($scope.filesOnline);
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
        }

        $scope.filesChanged = function(elm) {
            $scope.files = elm.files;
            $scope.$apply();
        }

        $scope.upload = function() {
            fileService.uploadFileToUrl(
                URL_SERVER+'file',
                myCache.get('myData'),
                $scope.files,
                function() {
                    $scope.refresh(-1);
                }
            );
        };

        $scope.delete = function(file) {

            var delete_tmp = function() {
                $http({
                    url: URL_SERVER+'file_delete/'+file.id,
                    method: 'POST',
                    headers : {
                        'Authorization':'Basic '+ myCache.get('myData'),
                        'Content-Type':'application/json',
                    }
                })
                .success(function(data,status) {
                    $scope.refresh(-1);
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
            };

            openDialog("Delete file", "Delete?", "", "Delete", delete_tmp, "Cancel", null);
        }

        $scope.download = function(file) {
        	
        	openDialog(file.name, "",
                '<a id="media_status"></a>',

                null,
                null,

                'CANCEL',
                null);
        	
    		var xmlhttp = new XMLHttpRequest();
    		xmlhttp.open("GET", URL_SERVER+'file/'+file.id, true);
    		xmlhttp.setRequestHeader('Authorization', 'Basic '+ myCache.get('myData'));
            xmlhttp.responseType = 'arraybuffer';

            xmlhttp.onreadystatechange = function() {
                if ((xmlhttp.readyState === 4) && 
                    (xmlhttp.status === 200) && 
                    (xmlhttp.status !== 404)
                    ) {
                    	
                    var data = xmlhttp.response,
                    	status = xmlhttp.status;
                    
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

                    // Get the filename from the x-filename header or default to "download.bin"
                    var filename = xmlhttp.getResponseHeader('x-filename') || file.name;

                    // Determine the content type from the header or default to "application/octet-stream"
                    var contentType = xmlhttp.getResponseHeader('content-type') || octetStreamMime;

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
                    
                }
            };
                
            xmlhttp.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        media_status.innerHTML = "Downloading : "+Math.round((e.loaded / e.total) * 100)+" %";
                    }
                }, false);
        
            xmlhttp.send();
        };

        $scope.edit = function(file) {

            if (file.directory) {
                $scope.refresh(file.id);
            }
            else if (file.type === 'txt') {
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
                        '</textarea>',

                        'SAVE',
                        null,

                        'CANCEL',
                        null);

                });
            }
            else if (file.type=="jarvis" || file.type=="filespace") {
                var json = JSON.parse(file.content);
                if(json.type == "article") {
                    openDialog(json.article_title_1, "",
                        '<textarea rows="5" name="text" placeholder="YOUR TXT" class="error">'+
                        json.article_content_1 +
                        '</textarea>',

                        'SAVE',
                        null,

                        'CANCEL',
                        null);
                }
            }
            else if(file.type === 'png' || file.type === 'jpg') {

                openDialog(file.name, "",

                    '<div id="popup-image"></div>'+
                    '<a id="media_status"></a>',

                    null,
                    null,

                    'CANCEL',
                    null);

                var media_status = document.getElementById("media_status");
            	
        		var xmlhttp = new XMLHttpRequest();
        		xmlhttp.open("GET", URL_SERVER+'file/'+file.id, true);
        		xmlhttp.setRequestHeader('Authorization', 'Basic '+ myCache.get('myData'));
        		
                xmlhttp.responseType = 'arraybuffer';

        		xmlhttp.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        media_status.innerHTML = "Loading : "+Math.round((e.loaded / e.total) * 100)+" %";
                    }
                }, false);
                
                xmlhttp.onreadystatechange = function() {

                    if (xmlhttp.status == 200) {
                        var uInt8Array = new Uint8Array(xmlhttp.response);
                        var i = uInt8Array.length;
                        var binaryString = new Array(i);
                        while (i--) {
                            binaryString[i] = String.fromCharCode(uInt8Array[i]);
                        }
                        var data = binaryString.join('');

                        var base64 = window.btoa(data);

                        media_status.innerHTML = "";
                        $("#popup-image").prepend ('<img id="myImage" src="">');
                        document.getElementById("myImage").src="data:image/png;base64,"+base64;
                    }
                    
                };
        
                xmlhttp.send();
            }
            else if(file.type === 'mp3') {

                openDialog(file.name, "",
                    '<a id="media_status"></a>',

                    null,
                    null,

                    'CANCEL',
                    null);

                var media_status = document.getElementById("media_status");

                if (! window.AudioContext) {
                    if (! window.webkitAudioContext) {
                        alert('no audiocontext found');
                    }
                    window.AudioContext = window.webkitAudioContext;
                }
                var context = new AudioContext();
                var gainNode1 = context.createGain();
                var analyser = context.createAnalyser();
                var audioBuffer;
                var sourceNode;

                // create a buffer source node
                sourceNode = context.createBufferSource();
                // and connect to destination
                sourceNode.connect(context.destination);
            	
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", URL_SERVER+'file/'+file.id, true);
                xmlhttp.setRequestHeader('Authorization', 'Basic '+ myCache.get('myData'));
                xmlhttp.setRequestHeader('Content-Type', 'audio/mpeg');
                xmlhttp.responseType = 'arraybuffer';

                xmlhttp.onreadystatechange = function() {
                    if ((xmlhttp.readyState === 4) && 
                        (xmlhttp.status === 200) && 
                        (xmlhttp.status !== 404)
                        ) {
                        context.decodeAudioData(xmlhttp.response, function(buffer) {
                            sourceNode.buffer = buffer;
                            sourceNode.start(0);
                        });
                    }
                };
                
                xmlhttp.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        media_status.innerHTML = "Loading : "+Math.round((e.loaded / e.total) * 100)+" %";
                    }
                }, false);
        
                xmlhttp.send();
        		
            }
            else
                openDialog(file.url, "Can't edit this type of file.", 
                    
                    null,

                    null,
                    null,

                    'CANCEL',
                    null);
                    
        };

        $scope.save = function() {
            alert("SAVE ");
        }

        $scope.filesAdapter = function(data,status) {
            if(data.succeed === true) {
                console.log("Result /file : " + JSON.stringify(data.result));
                
                var DateDiff = {
                    inMSeconds: function(d1, d2) {
                        var t2 = d2.getTime(), t1 = d1.getTime();
                        return t2-t1;
                    },
                    inSeconds: function(d1, d2) {
                        var t2 = d2.getTime(), t1 = d1.getTime();
                        return parseInt((t2-t1)/(1000));
                    },
                    inMinutes: function(d1, d2) {
                        var t2 = d2.getTime(), t1 = d1.getTime();
                        return parseInt((t2-t1)/(60*1000));
                    },
                    inHours: function(d1, d2) {
                        var t2 = d2.getTime(), t1 = d1.getTime();
                        return parseInt((t2-t1)/(3600*1000));
                    },
                    inDays: function(d1, d2) {
                        var t2 = d2.getTime(), t1 = d1.getTime();
                        return parseInt((t2-t1)/(24*3600*1000));
                    },
                    inMonths: function(d1, d2) {
                        var d1Y = d1.getFullYear(), d2Y = d2.getFullYear(), d1M = d1.getMonth(), d2M = d2.getMonth();
                        return (d2M+12*d2Y)-(d1M+12*d1Y);
                    },
                    inYears: function(d1, d2) {
                        return d2.getFullYear()-d1.getFullYear();
                    }
                };
                
                data.result.forEach(function(file) {
                    file.size = bytesToSize(file.size);
                    if(!file.directory)
                        file.name+="."+file.type;
                    if(file.type=="mp3" || file.type=="wav")
                        file.icon='file_audio.png';
                    else if(file.type=="pdf")
                        file.icon='file_pdf.png';
                    else if(file.type=="apk")
                        file.icon='file_apk.png';
                    else if(file.type=="zip" || file.type=="gzip" || file.type=="rar" || file.type=="tar" || file.type=="tar.gz" || file.type=="gz")
                        file.icon='file_archive.png';
                    else if(file.type=="jarvis" || file.type=="filespace") {
                        file.icon='file_filespace.png';
                        var json = JSON.parse(file.content);

                        if(json.type == "timer") {
                            var timerDate = new Date(json.timer_date.replace(" ", "T") + "Z"),
                                interval = setInterval(function(timerDate, id) {
                                    var ms = DateDiff.inMSeconds(new Date(), timerDate),
                                    ms_ = parseInt((ms%1000)/10),
                                    ms_txt = "";
                                    if(ms_<10) ms_txt+="0";
                                    
                                    var d = (parseInt(ms/86400000)),
                                    h = (parseInt(ms/3600000)%24),
                                    m = (parseInt(ms/60000)%60),
                                    s = (parseInt(ms/1000)%60);
                                    
                                    var current_class = null;
                                    if (document.getElementsByClassName) {
                                        current_class = document.getElementsByClassName('file-id-'+id+' file-type-jarvis');
                                        if (file.type=="filespace")
                                            current_class = document.getElementsByClassName('file-id-'+id+' file-type-filespace');
                                    }                                

                                    for(var i = 0; i < current_class.length; i++) {
                                        (current_class[i]).innerHTML = 
                                        ((d>0)?(d+"d : "):"")+
                                        ((h>0)?(h+" "):"")+
                                        ((m>0)?( ((m<10 && h>0)?("0"+m):m) +" "):"")+
                                        ((s>0)?( ((s<10 && m>0)?("0"+s):s) +" : "):"")+
                                        ms_txt+ms_;
                                    }
                                }, 10, timerDate, file.id);
                        }
                        else if(json.type == "article") {
                            var current_class_title = document.getElementsByClassName('file-id-'+file.id+' title');
                            var current_class_subtitle = document.getElementsByClassName('file-id-'+file.id+' subtitle');
                            for(var i = 0; i < current_class_title.length; i++)
                                (current_class_title[i]).innerHTML = json.article_title_1;
                            for(var i = 0; i < current_class_subtitle.length; i++)
                                (current_class_subtitle[i]).innerHTML = "FileSpace Article";
                        }
                    }
                    else if(file.directory)
                        file.icon='directory.png';
                    else
                        file.icon='file_default.png';
                });

                return data.result;
            }
        }

	}
    
);
