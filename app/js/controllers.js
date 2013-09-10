'use strict';

var myController = angular.module('myApp.controllers', []);

myController.controller('AppController', function($scope, $state) {
    $state.transitionTo("apps.test");
});

myController.controller('AppsController', function($scope, $state, $location){
    $scope.currentState = null;
    $scope.links = [
        {"name":"Run Tests","link":"app/test", "state":"apps.test"},
    ];
    $scope.goTo = function(state){
        $state.go(state);
    }
    $scope.isActive = function(route){
        return route === $location.path();
    }
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            $scope.currentState = toState;
        }
    );
});

myController.controller('TestController', ['$scope', '$state', '$http', '$window', 'socket', '$location',
    function($scope, $state, $http, $window, socket, $location) {
        $scope.title = $state.current.name;
        $scope.tests = [
            {"name": "EME-bagof", "tag": "EME-BAG", "class": "btn-default"},
            {"name": "EME-entitlement", "tag": "EME-ENT", "class": "btn-default"},
            {"name": "EME-item", "tag": "EME-ITEM", "class": "btn-default"},
            {"name": "ESP-basic", "tag": "ESP", "class": "btn-default"},
            {"name": "ESP-facet", "tag": "ESP-FACET", "class": "btn-default"},
            {"name": "ESP-login", "tag": "ESP-LOGIN", "class": "btn-default"},
            {"name": "Infrastructure-Services-Content_ID", "tag": "INF-SRV-ID", "class": "btn-default"},
            {"name": "Infrastructure-Services-User_Session", "tag": "INF-SRV-SES", "class": "btn-default"},
            {"name": "Metadata-System-Admin-Cache", "tag": "MDS-CACHE", "class": "btn-default"},
            {"name": "Metadata-System-Admin-Distributions", "tag": "MDS-DIST", "class": "btn-default"},
            {"name": "Metadata-System-Admin-Recipient", "tag": "MDS-REC", "class": "btn-default"},
            {"name": "Metadata-System-Admin-Sender", "tag": "MDS-SEND", "class": "btn-default"},
            {"name": "Metadata-System-Admin-Title", "tag": "MDS-TITLE", "class": "btn-default"},
            {"name": "Metadata-System-Delivery-Service", "tag": "MDS-DEL", "class": "btn-default"},
            {"name": "Metadata-System-Mediator-Service", "tag": "MDS-MED", "class": "btn-default"},
            {"name": "Search", "tag": "SRC", "class": "btn-default"},
            {"name": "Watchable-Endpoint", "tag": "WATCHABLE", "class": "btn-default"}
        ];
        var environments = [
            {name: "Production", env: "prod", active: ""},
            {name: "Test", env: "test", active: ""}
        ];
        socket.emit('fetchCompleted');
        socket.emit('fetchEnv', environments);
        socket.on('finishedTest', function(data){
            for(var i = 0; i<$scope.tests.length; i++){
                if(data.test.indexOf($scope.tests[i].tag) > -1){
                    $scope.tests[i].class = "btn-default";
                }
            }
            socket.emit('fetchCompleted');
        });
        socket.on('returnTests', function (data) {
            $scope.completed = data;
        });
        socket.on('returnEnv', function (data) {
            $scope.environments = data;
        });
        $scope.go = function(path){
            $location.path(path);
        }
        $scope.startTest = function(tag, name){
            var cmd = tag+" "+name;
            for(var i = 0; i<$scope.tests.length; i++){
                if($scope.tests[i].name == name){
                    $scope.tests[i].class = "btn-info";
                }
            }
            socket.emit('runTest', cmd);
        }
        $scope.viewTest = function(name){
            $window.location.href = ('/results/'+name);
        }
        $scope.switchEnv = function(env){
            socket.emit('switchEnv', {new:env, envs:$scope.environments});
        }
    }
]);
