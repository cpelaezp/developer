//var app = angular.module('applicados.controller', [])

app.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicPopup
                                    ,$ionicLoading,$timeout
                                    , utilData, utilSecurity) {
    
    $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
              });

    $scope.isLoadData = utilData.isLoadData;
    
    if ($scope.isLoadData){
        $scope.isLoadData = false;
        utilData.loadData().then(function(resul){
            $scope.menus = utilData.getMenus(); 
            $scope.loginData = {};
            $scope.userModel = { user :'', password : '', type : ''};
            $scope.data = {};

            $scope.infoModelAlumnos = utilData.getInfo('login.alumnos');
            $scope.infoModelDocentes = utilData.getInfo('login.docentes');
            $scope.infoModelPadres = utilData.getInfo('login.padres');

            $scope.isLoadData = false;
            $ionicLoading.hide();
        }, function(error){
            $scope.isLoadData = true;
            $ionicLoading.hide();
        });
    }

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
    
    $scope.getLogon = function(id){
        if ( id === 'login')
            return ! utilSecurity.getLogon();
        else
            return utilSecurity.getLogon();    

    };
    
    $scope.goto = function(id, activity, click){
        if (activity != ''){
            $state.go(activity);
        }
        else{
            switch(id)
            {
                case 'login': $scope.login();   break; 
                default: break;   
            }
        }
    }
    
    $scope.signIn = function(form) {
        //console.log(form);
        if(form.$valid) {
            //console.log('Sign-In', form.user);
            $scope.userModel = { user : form.user.$viewValue
                                , password : form.password.$viewValue
                                , type :  (form.$name === 'loginFormAlumnos' ? 'alumnos' :
                                          (form.$name === 'loginFormPadres' ? 'padres' : 'admin')
                                         )};
            
            utilSecurity.login($scope.userModel).success(function(data){
                $scope.closeLogin();
                $state.go('app.dash');
                var alertPopup = $ionicPopup.alert({
                    title : 'Bienvenido...' ,
                    template :  'Hola ' +  $scope.userModel.user + '\n, bienvenido a Applicados...'
                }); 
            }).error(function(data){
               var alertPopup = $ionicPopup.alert({
                    title : 'Lofin failed!' ,
                    template :  'Please check your credentials!' 
               }); 
            });
        }
    };
})

app.controller('dashCtrl', function($scope, $stateParams){
    
})

app.controller('settingsCtrl', function($scope) {
})

app.controller('helpCtrl', function($scope) {
})


