/*
    bower install --save angular-chart.js

*/


var app = angular.module('greenciti', ['ionic', 'ion-floating-menu', 'leaflet-directive','ngCordova', 'chart.js'
                                       //, 'greenciti.controllers'
                                       ])

app.run(function($ionicPlatform,$window, $compile, $document, $ionicLoading, $state,$log, $rootScope) {
  $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {

            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
		 if ($window.geofence) {
                $window.geofence.initialize();
            }
    });
	 $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.log('stateChangeError ', error, toState, toParams, fromState, fromParams);
           
        });
})

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'introCtrl',
    })
    .state('info', {
        url: '/info',
        templateUrl: 'templates/info/info.html',
        controller: 'infoCtrl',
    })
    .state('retos', {
        url: '/retos',
        templateUrl: 'templates/retos/retos.html',
        controller: 'retosCtrl',
    })
    .state('retosid', {
        url: '/retos/:id',
        templateUrl: 'templates/retos/reto.html',
        controller: 'retoCtrl',
    })
    .state('temaid', {
        url: '/tema/:id',
        templateUrl: 'templates/info/tema.html',
        controller: 'temaCtrl',
    })
    .state('statistics', {
        url: '/statistics',
        templateUrl: 'templates/statistics/statistics.html',
        controller: 'statisticsCtrl',
    })
    .state('maps', {
        url: '/maps',
        templateUrl: 'templates/info/maps.html',
        controller: 'mapsCtrl',
    })
    ;
    
   $urlRouterProvider.otherwise('/intro'); 
});

/*app.config(function (ChartJsProvider) {
  ChartJsProvider.setOptions({ colours : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
}); */