//var app = angular.module('applicados.controller', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup
                                    , utilData, utilSecurity) {
    $scope.menus = utilData.getMenus();
    $scope.loginData = {};

    $scope.infoModelAlumnos = utilData.getInfo('login.alumnos');
    $scope.infoModelDocentes = utilData.getInfo('login.docentes');
    $scope.infoModelPadres = utilData.getInfo('login.padres');

    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
    
    $scope.getLogon = function(id){
        if ( id !== 'login')
            return utilSecurity.getLogon();    
        else
            return true;
    };
    
    
    // login
    $scope.infoModelAlumnos = utilData.getInfo('login.alumnos');
    $scope.infoModelDocentes = utilData.getInfo('login.docentes');
    $scope.infoModelPadres = utilData.getInfo('login.padres');

    $scope.userModel = { user :'', password : '', type : ''};
    $scope.data = {};

    $scope.signIn = function(form) {
        console.log(form);
        if(form.$valid) {
            console.log('Sign-In', form.user);
            $scope.userModel = { user : form.user.$viewValue
                                , password : form.password.$viewValue
                                , type :  (form.$name === 'loginFormAlumnos' ? 'alumnos' :
                                          (form.$name === 'loginFormPadres' ? 'padres' : 'admin')
                                         )};
            
            utilSecurity.login($scope.userModel).success(function(data){
                $scope.closeLogin();
                $state.go('app.dash');
            }).error(function(data){
               var alertPopup = $ionicPopup.alert({
                    title : 'Lofin failed!' ,
                    template :  'Please check your credentials!' 
               }); 
            });
            
            //$state.go('app.dash');
            //$location.path('/#/menu/dashboard');
        }
    };
})

app.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

app.controller('menuCtrl', function($scope, $stateParams, utilData) {
})

app.controller('dashCtrl', function($scope, $stateParams){
    
})

