'use strict';

var myController = angular.module('myApp.controllers', []);

myController.controller('AppController', function($scope, $state) {
    $state.transitionTo("apps.test");
});

myController.controller('AppsController', function($scope, $state, $location){
    $scope.currentState = null;
    $scope.links = [
        {"name":"Run Tests","link":"app/test", "state":"apps.test"}
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

myController.controller('TestController', ['$scope', '$state', '$http', '$window', 'socket',
    function($scope, $state, $http, $window, socket) {
        $scope.title = $state.current.name;
        var environments = [
            {name: "Production", env: "prod", active: ""},
            {name: "Test", env: "test", active: ""}
        ];
        socket.emit('fetchTests');
        socket.emit('fetchEnv', environments);
        socket.on('returnTests', function(data){
            $scope.tests = data;
        });
        socket.on('returnEnv', function (data) {
            $scope.environments = data;
        });
        $scope.startTest = function(tag){
            $scope.tests[tag].running = true;
            socket.emit('runTest', tag);
        }
        $scope.viewTest = function(name){
            $window.location.href = ('/results/'+name+'.html');
        }
        $scope.switchEnv = function(env){
            socket.emit('switchEnv', {new:env, envs:$scope.environments});
        }
    }
]);
