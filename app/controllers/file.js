 app.controller('FileCtrl',function($scope, FileFactory){
    $scope.files = FileFactory.all().then(function(files){
        $scope.files = files;
    },function(msg){
        alert(msg);
    });
});