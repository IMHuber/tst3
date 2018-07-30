
var app = angular.module('app', ['ngRoute','ngResource']);

app.config(function($routeProvider){
    $routeProvider
        .when('/users',{
            templateUrl: 'users',
            controller: 'usersController'
        })
        .when('/roles',{
            templateUrl: 'roles',
            controller: 'rolesController'
        })
        .otherwise(
            { redirectTo: '/'}
        );
});