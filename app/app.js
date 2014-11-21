var app = angular.module('Jarvis', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/', {templateUrl: 'views/index.html', controller:'UserCtrl'})
		.when('/file', {templateUrl: 'views/file.html',controller: 'FilesCtrl'})
		.otherwise({redirectTo : '/'});
});