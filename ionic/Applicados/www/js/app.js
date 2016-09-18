var app = angular.module('applicados', ['ionic'
                           , 'ionic-material'
                           , 'ionMdInput'
                           , 'ngCordova' 
                          ])

app.constant('ApiEndpoint', {
  url: 'http://localhost:333/AppApiRest'
})

/*app.all('/', function(req, res, next) 
{
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
});*/

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // general
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
    })
    .state('app.dash', {
        url: '/dash',
        views: {
            'menuContent': {
                templateUrl: 'templates/dash.html',
                controller: 'dashCtrl'
            }
        }
    })
    // core
    .state('app.calendar', {
        url: '/calendar/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/core/calendar.html',
                controller: 'calendarCtrl'
            }
        }
    })
    .state('app.messages', {
        url: '/messages/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/core/messages.html',
                controller: 'messagesCtrl'
            }
        }
    })
    .state('app.qualifications', {
        url: "/qualifications/:id",
        views: {
            'menuContent': {
                templateUrl: "templates/core/qualifications.html",
                controller: 'qualificationsCtrl'    
            }
        }
    })
    // extras
    .state('app.points', {
      url: "/points/:id",
      views: {
        'menuContent': {
            templateUrl: "templates/extras/points.html",
            controller: 'pointsCtrl'    
        }
      }
    })
    .state('app.tickets', {
      url: "/tickets/:id",
      views: {
        'menuContent': {
            templateUrl: "templates/extras/tickets.html",
            controller: 'ticketsCtrl'    
        }
      }
    })
    // help
    .state('app.help', {
      url: "/help/:idprofile",
      views: {
        'menuContent': {
            templateUrl: "templates/help/help.html",
            controller: 'helpCtrl'    
        }
      }
    })
    // settings
    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings/settings.html",
                controller: 'settingsCtrl'    
            }
        }
    })
    // users
    .state('app.profile', {
        url: '/profile/:idProfile',
        views: {
            'menuContent': {
                templateUrl: 'templates/security/profile.html',
                controller: 'profileCtrl'
            }
        }
    })
  ;

    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dash');
});
