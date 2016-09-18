//var app = angular.module('applicados.services', [])

app.factory('utilData', function($window, $log, $q, $timeout
                                  , LoadDBA, DBA                                 
                                ){
    var _fact = [];
        
    var dataMenus = [
        { id : 'login', name : 'Login', description : 'Ingresa...', activity : null, click: 'login()', image : 'iconLogin.jpg'},
        { id : 'main', name : 'Inicio', description : 'Inicio...', activity : 'app.dash', click: null, image : 'iconMain.jpg'},
        { id : 'messages', name : 'Mensajes', description : 'Mensajes, comunicados, ...', activity : 'app.messages', click: null, image : 'iconMessages.jpg'},
        { id : 'calendar', name : 'Calendario', description : 'Calendario de Actividades....', activity : 'app.calendar', click: null, image : 'iconCalendar.jpg'},
        { id : 'qualifications', name : 'Boletin', description : 'Boletin....', activity : 'app.qualifications', click: null, image : 'iconQualifications.jpg'},
        { id : 'points', name : 'Puntos', description : 'Puntos....', activity : 'app.points', click: null, image : 'iconPoints.jpg'},
        { id : 'settings', name : 'Configuraciones', description : 'Configuraciones....', activity : 'app.settings', click: null, image : 'iconSettings.jpg'},
        { id : 'tickets', name : 'Tickets', description : 'Tickets....', activity : 'app.tickets', click: null, image : 'iconTickets.jpg'},
        { id : 'help', name : 'Ayuda', description : 'Ayuda....', activity : 'app.help', click: null, image : 'iconHelp.jpg'},
    ];
    
   var AppViews = [
        { id: 'login.alumnos', title :'Alumnos Conectados', welcome : 'Bienvenido', buttonName : 'Ingresar'},
        { id: 'login.padres', title :'Padres Conectados', welcome : 'Bienvenido', buttonName : 'Ingresar'},
        { id: 'login.docentes', title :'Docentes y Administradores Conectados', welcome : 'Bienvenido', buttonName : 'Ingresar'},
    ];
    
    _fact.isLoadData = true;
    
    _fact.loadData = function(){ 
        var load = true;
        var loadParams = 0;
        var countParams = 2;
        var defer = $q.defer();
        
        _fact.isLoadData = false; // se cambia porque inicie al proceso
        
        DBA.query("SELECT idMenu, menu, descripcion, activity, click, image, idEstado FROM appMenus order by idOrder")
        .then(function(result){                        
            dataMenus = DBA.getAll(result);
            loadParams += 1;
            if (loadParams === countParams){
                _fact.isLoadData = false; // se cambia para que no vuelva a actualizar
                defer.resolve("success");
            }
        }, function (error) {
            _fact.isLoadData = true;
            console.warn('I found an error');
            console.warn(error);
        });
        
        DBA.query("SELECT id, title, welcome, buttonName FROM appViews")
        .then(function(result){                        
            AppViews = DBA.getAll(result);
            loadParams += 1;
            if (loadParams === countParams){
                _fact.isLoadData = false; // se cambia para que no vuelva a actualizar
                defer.resolve("success");
            }
        }, function (error) {
            _fact.isLoadData = true;
            console.warn('I found an error');
            console.warn(error);
        });

        LoadDBA.appUpdate(); 
        
        return defer.promise;
    };        

    _fact.refreshData = function(){ 
        var defer = $q.defer();
        
        LoadDBA.loadData()
            .then(function(result){                        
                dataMenus = DBA.getAll(result);
                defer.resolve("success");
            }, function (error) {
                console.warn('I found an error');
                console.warn(error);
            });
        
        

        return defer.promise;
    };        

    
    _fact.getMenus = function(rol){
        return dataMenus;
    }
    
    _fact.getInfo = function(id){
        for (i = 0; i < AppViews.length; i++){
            if (AppViews[i].id == id){
                return AppViews[i];
            }
        }   
        return null;
    };

    
    return _fact;
})

app.factory('utilSecurity', function($q){
    var _fact = [];
    var isLogon = false;
    var dataLogin = {};
    
    _fact.getLogon = function(){
        return isLogon;
    }
    
    _fact.login = function(userModel){
        var deferred = $q.defer();
        var promise = deferred.promise;
        
        if (userModel.user == 'cpelaezp@gmail.com' && userModel.password == 'natalia1'){
            isLogon = true;
            deferred.resolve('Welcome ' + + name + '!');
        } else {
            isLogon = false;
            deferred.reject('Wrong credentials');
        }
        
        promise.success = function(fn){
            promise.then(fn);
            return promise;
        }
        
        promise.error = function(fn){
            promise.then(null, fn);
            return promise;
        }
        return promise;        
    }    
    return _fact;
})