var db = null;

app.run(function($ionicPlatform, $cordovaSQLite, LoadDBA) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("appicados.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("applicados.db", "1.0", "Applicados", -1);
    }

    var updateModel = false;
      
    if (updateModel){
        $cordovaSQLite.execute(db, "drop TABLE IF EXISTS usuarios");
        $cordovaSQLite.execute(db, "drop TABLE IF EXISTS tipoUsuarios");
        $cordovaSQLite.execute(db, "drop TABLE IF EXISTS appMenus");
    }  

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS appUpdate (version varchar(20), module varchar(50), dateUpdate datetime, updates integer,  idEstado integer, primary key (version, module))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS appMenus (idMenu text primary key, menu text, descripcion text, activity text, click text, image text, idOrder integer, idEstado integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS appViews (id text primary key, title text, welcome text, buttonName text)");
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS segUsuarios (idUsuario integer primary key, idTipoUsuario integer, nombreUsuario text, email text, clave text, idEstado integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS segTipoUsuarios (idTipoUsuario integer primary key, tipoUsuario text, idEstado integer)");
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS prmTipoInstitucion (idTipoInstitucion text primary key, nombreTipoInstitucion text, idEstado text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS prmTipoIdentificacion (idTipoIdentificacion text primary key, nombreTipoIdentificacion text, idEstado text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS prmTipoPersonas (idTipoPersona text primary key, nombreTipoPersona text, idEstado text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS prmTipoPlanes (idTipoPlan text primary key, nombreTipoPlan text, valorxEstudiantes, valorMensual, valorAnual, valorVitalicio, maxDocentes intener, maxAlumnosxCurso integer, maxCursos Integer, maxMaterias, idEstado text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS prmJornadas (idJornada text primary key, nombreJornada text, horaInicial integer, horaFinal integer, idEstado text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS prmProfesiones (idProfesion text primary key, nombreProfesion text, idEstado text)");
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreInstituciones (idInstitucion integer primary key, numInstitucion text, idTipoInstitucion text, nombre text, direccion text, telefonos text, email text, localidad, text, departamento text, ciudad text, pais text, updateDB date)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS corePersonas (idPersona integer, idInstitucion integer, idResponsable integer, idTipoPersona text, idProfesion text, tipoIdPersona text, numIdPersona text, nombres text, apellidos text, direccion text, telefonos text, movil text, email text, localidad, text, departamento text, ciudad text, pais text, updateDB date, primary key (idPersona, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreDocentes (idDocente integer, idInstitucion integer, idJornada text, telefonos text, movil text, email text, certificado text, updateDB date, primary key (idDocente, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreAlumnos (idAlumno integer, idCurso text, idInstitucion integer, foto text, updateDB date, primary key (idDocente, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreAsignaturas (idAsignatura integer, idInstitucion integer, nombreAsignatura text, idEstado text, updateDB date, primary key (idAsignatura, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreCursos (idCurso integer, idInstitucion integer, nombreCurso text, idDirector integer, idEstado text, updateDB date, primary key (idCurso, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreCursosAlumnos (idCurso integer, idAlumno integer, idInstitucion integer, nombreCurso text, idDirector integer, idEstado text, updateDB date, primary key (idCurso, idAlumno, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreHorarios (idHorario integer, idInstitucion integer, idCurso integer, diaSemana integer, hora integer, idMateria integer, duracion integer, idEstado text, updateDB date, primary key (idMateria, idInstitucion))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS coreAsistencias (idAsistencia integer, idInstitucion integer, idAlumno integer, idMateria integer, idCurso integer, diaSemana integer, hora integer, asistio integer, comentario text, seInformo date, updateDB date, primary key (idAsistencia))");
  }); 
})

app.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform, $http) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }
  
  // **********************************************************************
  // LLamados ApiRest
  // **********************************************************************
  self.getApiRest = function(fields, table, where, orderby){
      var q = $q.defer();
      var url = 'http://localhost:333/AppApiRest/getEntityData?';
      var _return = { table: table, data:[]};
      
      $ionicPlatform.ready(function(){
          url = url + 'fields=' + fields + '&table=' + table + '&where=' + where + '&orderby=' + orderby;
          $http.get(url)
          .success(function(result){
              angular.forEach(result, function(child){
                _return.data.push(child);
              });
              q.resolve(_return);
          })
          .error(function(response, status){
              q.reject(status);
          });
          
      });
      
      return q.promise;
  };

  return self;
})

app.factory('LoadDBA', function($cordovaSQLite, $q, DBA) {
    var self = this;
    var _appUpdate = null;
    
    var tablesParams = [
        { id:'appmenus', fields:'', table:'appMenus', where:'', orderby:'' },
        { id:'appviews', fields:'', table:'appViews', where:'', orderby:'' },
    ];
    
    var dataMenus = [
        { idMenu : 'login', menu : 'Login', descripcion : 'Ingresa...', activity : '', click: 'login()', image : 'iconLogin.jpg', idOrder: 1, idEstado: 1 },
        { idMenu : 'main', menu : 'Inicio', descripcion : 'Inicio...', activity : 'app.dash', click: null, image : 'iconMain.jpg', idOrder: 2, idEstado: 1},
        { idMenu : 'messages', menu : 'Mensajes', descripcion : 'Mensajes, comunicados, ...', activity : 'app.messages', click: null, image : 'iconMessages.jpg', idOrder: 3, idEstado: 1},
        { idMenu : 'calendar', menu : 'Calendario', descripcion : 'Calendario de Actividades....', activity : 'app.calendar', click: null, image : 'iconCalendar.jpg', idOrder: 4, idEstado: 1},
        { idMenu : 'qualifications', menu : 'Boletin', descripcion : 'Boletin....', activity : 'app.qualifications', click: null, image : 'iconQualifications.jpg', idOrder: 5, idEstado: 1},
        { idMenu : 'points', menu : 'Puntos', descripcion : 'Puntos....', activity : 'app.points', click: null, image : 'iconPoints.jpg', idOrder: 6, idEstado: 1},
        { idMenu : 'settings', menu : 'Configuraciones', descripcion : 'Configuraciones....', activity : 'app.settings', click: null, image : 'iconSettings.jpg', idOrder: 7, idEstado: 1},
        { idMenu : 'tickets', menu : 'Tickets', descripcion : 'Tickets....', activity : 'app.tickets', click: null, image : 'iconTickets.jpg', idOrder: 8, idEstado: 1},
        { idMenu : 'help', menu : 'Ayuda', descripcion : 'Ayuda....', activity : 'app.help', click: null, image : 'iconHelp.jpg', idOrder: 9, idEstado: 1},
    ];
    
   var dataViews = [
        { id: 'login.alumnos', title :'Alumnos Conectados', welcome : 'Bienvenido', buttonName : 'Ingresar'},
        { id: 'login.padres', title :'Padres Conectados', welcome : 'Bienvenido', buttonName : 'Ingresar'},
        { id: 'login.docentes', title :'Docentes y Administradores Conectados', welcome : 'Bienvenido', buttonName : 'Ingresar'},
    ];
    
    self.appUpdate = function(){
        var q = $q.defer();
        
        DBA.query('select * from appUpdate')
        .then(function(resultLocal){
            _appUpdate = DBA.getAll(resultLocal);
            DBA.getApiRest('', 'appUpdate', 'idEstado : 1', '')
            .then(function(result){
                var isUpdate = false;
                
                for(i = 0; i < result.data.length; i++){
                    for(j = 0; j < _appUpdate.length; j++){
                        if (result.data[i].module == _appUpdate[j].module)
                            if (result.data[i].dateUpdate > _appUpdate[j].dateUpdate){
                                self.loadData(result.data[0]).then(function(result){
                                    isUpdate = true;
                                    q.resolve('success..');     
                                }, function(error){
                                    
                                });                                
                            }
                            else{
                                isUpdate = true;
                                q.resolve('success..');     
                            }
                    }
                }            
                
                if (!isUpdate){
                    self.loadData(result.data[0]).then(function(result){
                        isUpdate = true;
                        q.resolve('success..');     
                    }, function(error){

                    });                                
                }
            }, function(error){
                
            });
        }, function(error){
            
        });
        
        q.promise;
    }
    
    // inicia carga de datos
    self.loadData = function(_appUpdate) {
        var q = $q.defer();
        var parameters = null;
        for (i = 0; i < tablesParams.length; i++){
            

            DBA.getApiRest(tablesParams[i].fields, tablesParams[i].table, tablesParams[i].where, tablesParams[i].orderby)
            .then(function(result){
                DBA.query("DELETE FROM " + tablesParams[i].table, parameters);
                
                for (j = 0; j < result.data.length; j++){
                    self.addData(result.table, result.data[j]);
                }
                
                self.addData('appUpdate', _appUpdate);
                q.resolve("success");
            }, function(error){

            });   
            
            q.promise;
        }
    };
    
    self.addData = function(table, data){
        var fields = "";
        var fieldsText = "";
        var _params = [];

        for(var key in data){
            fields = fields + ", " + key;
            fieldsText = fieldsText + ", ?";
            _params.push(data[key]);
        }
        
        fields = fields.substr(2);
        fieldsText = fieldsText.substr(2);

        var _query = "insert into " + table + "(" + fields + ") values (" + fieldsText + ")";
        DBA.query(_query, _params);
    };

    return self;
})