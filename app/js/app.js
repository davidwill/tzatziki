'use strict';

var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives',
        'myApp.controllers', 'ui.state', 'ui.bootstrap', 'ui.router'])

    .config(function($stateProvider){
        var apps = {
            name: 'apps',
            url: "/app",
            abstract: true,
            templateUrl: "templates/apps.html",
            controller: "AppsController"
        };

        var test = {
            name: "apps.test",
            parent: apps,
            url: "/test",
            templateUrl: "templates/test.html",
            controller: "TestController"
        };

        $stateProvider
            .state(apps)
            .state(test);
    }
);
