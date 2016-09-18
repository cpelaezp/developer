app.factory('geofenceService', function ($rootScope, $window, $q, $log, $ionicLoading) {

    var geofenceService = {
        _geofences: [],
        _geofencesPromise: null,
        createdGeofenceDraft: null,
        loadFromLocalStorage: function () {
            var result = localStorage['geofences'];
            var geofences = [];
            if (result) {
                try {
                    geofences = angular.fromJson(result);
                } catch (ex) {

                }
            }
            this._geofences = geofences;
            return $q.when(this._geofences);
        },

        loadFromDevice: function () {
            var self = this;
            if ($window.geofence && $window.geofence.getWatched) {
                return $window.geofence.getWatched().then(function (geofencesJson) {
                    self._geofences = angular.fromJson(geofencesJson);
                    return self._geofences;
                });
            }
            return this.loadFromLocalStorage();
        },
        getAll: function () {
            var self = this;
            if (!self._geofencesPromise) {
                self._geofencesPromise = $q.defer();
                self.loadFromDevice().then(function (geofences) {
                    self._geofences = geofences;
                    self._geofencesPromise.resolve(geofences);
                }, function (reason) {
                    $log.log("Error fetching geofences", reason);
                    self._geofencesPromise.reject(reason);
                });
            }
            return self._geofencesPromise.promise;
        },

        getNextNotificationId: function () {
            var max = 0;
            this._geofences.forEach(function (gf) {
                if (gf.notification && gf.notification.id) {
                    if (gf.notification.id > max) {
                        max = gf.notification.id;
                    }
                }
            });
            return max + 1;
        }
    };

    return geofenceService;
})

app.factory('geolocationService', function ($q, $timeout) {
    var currentPositionCache;
    return {
        getCurrentPosition: function () {
            if (!currentPositionCache) {
                var deffered = $q.defer();
                navigator.geolocation.getCurrentPosition(function (position) {
                    deffered.resolve(currentPositionCache = position);
                    $timeout(function () {
                        currentPositionCache = undefined;
                    }, 10000);
                }, function () {
                    deffered.reject();
                });
                return deffered.promise;
            }
            return $q.when(currentPositionCache);
        }
    };
});


app.factory('appData', function(){
    var _fact = [];
    
    _fact.retos = [
        { idreto: 1, image: 'retoarbol.jpg', reto: 'Siembre un Arbol', fecact:'2015-07-01', idEstado : 1, iconOn:'ion-leaf', iconOff:'ion-leaf'
         , summary:'Cuidalo y registra su evolución...'
         , descripcion: 'Solo cuando se haya cortado el último árbol, solo cuando el ultimo río se haya muerto envenenado, solo cuando se haya pescado el último pez solo entonces verás, que el dinero no se puede comer.'},
        { idreto: 2, image: 'retoreciclaje.jpg', reto: 'Recicla - Colegios', fecact:'2015-07-01', idEstado : 1, iconOn:'ion-waterdrop', iconOff:'ion-waterdrop'
         , summary:'El que mas recolecte gana...'
         , descripcion: 'El reciclaje es un proceso fisicoquímico o mecánico que consiste en someter a una materia o un producto ya utilizado a un ciclo de tratamiento total o parcial para obtener una materia prima o un nuevo producto. También se podría definir como la obtención de materias primas a partir de desechos, introduciéndolos de nuevo en el ciclo de vida y se produce ante la perspectiva del agotamiento de recursos naturales, macro económico y para eliminar de forma eficaz los desechos.'},
        { idreto: 3, image: 'retoagua.jpg', reto: 'Ahorra Agua', fecact:'2015-07-01', idEstado : 1, iconOn:'ion-lightbulb', iconOff:'ion-lightbulb'
         , summary:'Ahorra y gana....'
         , descripcion: 'El agotamiento de los recursos naturales hace necesario que entre todos intentemos salvar el planeta en el que vivimos. Ya sea en mayor o menor medida podemos colaborar y una de las cosas que más podemos hacer es ahorrar en electricidad y también en agua. A continuación nos concentramos en daros algunos consejos de cómo ahorrar agua en el hogar.'},
    ];
    
    _fact.retoPersons = [
        { id: 1, name: 'Carlos Campos', avatar: 'person-1.jpg'
         , comment:'El próximo año será muy movido para el sector agropecuario.'},
        { id: 2, name: 'Mateo Villalba', avatar: 'person-2.jpg'
         , comment:'El próximo año será muy movido para el sector agropecuario.'},
        { id: 3, name: 'Cristina Cardenas', avatar: 'person-3.jpg'
         , comment:'El próximo año será muy movido para el sector agropecuario.'},
        { id: 4, name: 'Ramon Peñaranda', avatar: 'person-4.jpg'
         , comment:'El próximo año será muy movido para el sector agropecuario.'},
        { id: 5, name: 'Rocio de los Reyes', avatar: 'person-5.jpg'
         , comment:'El próximo año será muy movido para el sector agropecuario.'},
    ];

    _fact.temas = [
        { id: 1, name: 'El “resurgimiento” del campo', image: 'tema-1.jpg', fecact:'2015-07-01'
         , summary:'El próximo año será muy movido para el sector agropecuario.'
         , descripcion: 'El próximo año será muy movido para el sector agropecuario. Entre las novedades más importantes están la liquidación del Incoder y la creación de dos nuevas instituciones rurales, así como la inminente puesta en marcha del Fondo de Tierras que surgirá de los acuerdos de la Habana y la legalización de las controvertidas Zonas de Interés de Desarrollo Rural, Económico y Social (Zidres). Y si a eso se le suma la continuidad de la política de restitución de tierras y el plan Colombia Siembra del Ministerio de Agricultura, que pretende aumentar en un millón las hectáreas cultivadas con alimentos, no quedan dudas de que el campo colombiano será protagonista en el 2016. Por supuesto, cada una de estas transformaciones abre interrogantes ambientales, sobre todo cuando la Misión Rural acaba de publicar su informe en el que recomienda cerrar definitivamente la frontera agrícola y el país se enfrenta al reto de adaptar su territorio a los efectos del cambio climático.'},
        { id: 2, name: 'La deforestación', image: 'tema-2.jpg', fecact:'2015-07-01'
         , summary:'Es uno de los problemas que más ha atacado el sistema ecológico'
         , descripcion: 'Es uno de los problemas que más ha atacado el sistema ecológico y aunque uno de los primeros actores que se dieron a conocer la responsabilidad de mantener un planeta sano al día de hoy continúa siendo un gran dolor de cabeza para el caso sesiones mundiales por su difícil control acción.'},
        { id: 3, name: 'La delimitación de los páramos', image: 'tema-3.jpg', fecact:'2015-07-01'
         , summary:'A pesar de que el Ministro de Ambiente, Gabriel Vallejo, anunció con bombos y platillos'
         , descripcion: 'A pesar de que el Ministro de Ambiente, Gabriel Vallejo, anunció con bombos y platillos que este año estarían delimitados los páramos del país, a estas alturas está claro que el cumplimiento de esa promesa se pospondrá, al menos, para 2016. La importancia de esta definición radica, por un lado, en su relevancia para el ordenamiento territorial y para la sostenibilidad ambiental del país, ya que estos ecosistemas proveen el agua que consume el 70 por ciento de los colombianos. Por el otro, para zanjar definitivamente los múltiples conflictos que han surgido por la explotación minera y agropecuaria en estas zonas.'},
        { id: 4, name: 'El Niño seguirá causando estragos', image: 'tema-4.jpg', fecact:'2015-07-01'
         , summary:'Este 2015, Colombia experimentó una de las sequías más extremas de su historia.'
         , descripcion: 'Este 2015, Colombia experimentó una de las sequías más extremas de su historia. El Fenómeno de El Niño no solo causó más de 3.000 incendios forestales, sino que prendió las alarmas de un racionamiento debido a que las represas llegaron a niveles del 63 por ciento. Pero todavía no ha pasado lo peor. De acuerdo con el Ideam, El Niño estará en su máxima intensidad entre diciembre de este año y marzo de 2016, después de lo cual entrará en una fase de debilitamiento que se extenderá hasta el mes de junio. De ahí que es probable que continúen los incendios y que la sequía siga debilitando el suministro de agua para el sistema hidroeléctrico y afectando a los cultivos agrícolas y a las actividades ganaderas. '},
        { id: 5, name: 'Impacto petrolero', image: 'tema-5.jpg', fecact:'2015-07-01'
         , summary:'El petróleo puede provocar la muerte de muchas especies en el caso que hubiese un derrame'
         , descripcion: 'Aunque el petróleo es una fuente de energía que ayuda al planeta enormemente o más bien a lucero es manos también es que causa un gran impacto ambiental a nivel de océanos ya que el petróleo puede provocar la muerte de muchas especies en el caso que hubiese un derrame como ya ha sucedido anteriormente.'},
        { id: 6, name: 'Contaminación de los mares', image: 'tema-6.jpg', fecact:'2015-07-01'
         , summary:'La contaminación de los mares es un problema que no se ha podido solucionar'
         , descripcion: 'La contaminación de los mares es un problema que no se ha podido solucionar desde hace más de 100 años la contaminación debido a la exportación de productos o bien alas contaminación indiscriminada por parte de las personas. '},
        { id: 7, name: 'Mal procesamiento de los desechos', image: 'tema-7.jpg', fecact:'2015-07-01'
         , summary:'El mal procesamiento de los desechos químicos y alimenticios que provocan una contaminación'
         , descripcion: 'El mal procesamiento de los desechos químicos y alimenticios que provocan una contaminación y nevada en nuestro planeta procese este tipo de residuos de una manera adecuada siendo así en su mayoría reciclados para un uso en otras áreas evitando así el consumo cursos.'},
        { id: 8, name: 'Químicos como amoniaco', image: 'tema-8.jpg', fecact:'2015-07-01'
         , summary:'Lo  químicos y la energía química provoca un gran impacto negativo en la capa de ozono'
         , descripcion: 'Lo  químicos y la energía química provoca un gran impacto negativo en la capa de ozono y en los animales y plantas que los rodean es importante qué tipo de químicos como el amoniaco se procesan de una manera in adecuada de vertiéndose en la tierra o bien en nuestros mares. Ver contaminación fotoquímica.'},
        { id: 9, name: 'Destrucción del hábitat', image: 'tema-9.jpg', fecact:'2015-07-01'
         , summary:'La destrucción de los hábitats es uno de los problemas más evidentes en el sistema ambiental'
         , descripcion: 'La destrucción de los hábitats es uno de los problemas más evidentes en el sistema ambiental ya que muchos de sus hábitats ayudan a mejorar y nieve nivelar los excesos de contaminación uno de estos hábitats que ayuda a eliminar la contaminación son las aves de rapiña grande comer los cuerpos de los animales que han fallecido evitando así la próxima placa'},
        { id: 10, name: 'Uso descuidado de los recursos naturales', image: 'tema-10.jpg', fecact:'2015-07-01'
         , summary:'Es el más grande que tengas planeta tierra en este momento es el uso inadecuado de los recursos'
         , descripcion: 'Es el más grande que tengas planeta tierra en este momento es el uso inadecuado de los recursos que es importante que las personas se responsabilicen antes de utilizar recursos del planeta quizás para muchos esto no sea importante ya que piensan que los recursos son inagotables, algo que es erróneo.'},
    ];
    
    // 1. Google Map // 
    _fact.sitesMaps = [
        { idreto : 1, site : 'Location reto 1', desc : 'Test', lat : 2.94935, long : -75.290594 },
        { idreto : 1, site : 'Location reto 1', desc : 'Test', lat : 2.944481, long : -75.306001 },
        { idreto : 1, site : 'Location reto 1', desc : 'Test', lat : 2.933852, long : -75.296903 },
        { idreto : 1, site : 'Location reto 1', desc : 'Test', lat : 2.926934, long : -75.277897 },
        { idreto : 1, site : 'Location reto 1', desc : 'Test', lat : 2.948035, long : -75.250769 },
        { idreto : 2, site : 'Location reto 2', desc : 'Test', lat : 2.93935, long : -75.390594 },
        { idreto : 2, site : 'Location reto 2', desc : 'Test', lat : 2.934481, long : -75.406001 },
        { idreto : 2, site : 'Location reto 2', desc : 'Test', lat : 2.923852, long : -75.396903 },
        { idreto : 2, site : 'Location reto 2', desc : 'Test', lat : 2.916934, long : -75.377897 },
        { idreto : 2, site : 'Location reto 2', desc : 'Test', lat : 2.928035, long : -75.350769 },
        { idreto : 3, site : 'Location reto 3', desc : 'Test', lat : 2.95935, long : -75.190594 },
        { idreto : 3, site : 'Location reto 3', desc : 'Test', lat : 2.954481, long : -75.206001 },
        { idreto : 3, site : 'Location reto 3', desc : 'Test', lat : 2.943852, long : -75.196903 },
        { idreto : 3, site : 'Location reto 3', desc : 'Test', lat : 2.936934, long : -75.177897 },
        { idreto : 3, site : 'Location reto 3', desc : 'Test', lat : 2.948035, long : -75.150769 },
    ];

    
    _fact.getRetoButtonMaps = function(){
        var _return = [];
        for(var i=0; i < _fact.retos.length; i++){
            if (_fact.retos[i].idEstado === 1)  
                _return.push({ idreto: _fact.retos[i].idreto
                              , reto: _fact.retos[i].reto
                              , summary: _fact.retos[i].summary
                              , iconOn: _fact.retos[i].iconOn
                              , iconOff: _fact.retos[i].iconOff
                              , checked: false})                
        } 
        
        return _return;
    }

    _fact.getReto = function(id){
        for(var i=0; i < _fact.retos.length; i++){
            if (_fact.retos[i].idreto.toString() === id.toString())  
                return _fact.retos[i];
        } 
    }

    _fact.getRetoSites = function(id){
        var lstresult = [];
        for(var i=0; i < _fact.sitesMaps.length; i++){
            if (_fact.sitesMaps[i].idreto.toString() === id.toString())  
                lstresult.push(_fact.sitesMaps[i]);
        } 
        
        return lstresult;
    }

    _fact.getTema = function(id){
        for(var i=0; i < _fact.temas.length; i++){
            if (_fact.temas[i].id.toString() === id.toString())  
                return _fact.temas[i];
        } 
    }

    
    return _fact;
})


app.factory('appMaps', function(){
    
})