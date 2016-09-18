//var app = angular.module('greenciti.controllers', [])

app.controller('appCtrl', function($scope, $state, $ionicModal){
    $scope.hasLogin = false;
    
    $ionicModal.fromTemplateUrl('templates/security/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.menuLogin = function(){
        $scope.hasLogin = ! $scope.hasLogin;
        $scope.modal.show();
    }
    
    $scope.cancelLogin = function(){
        $scope.modal.hide();
    }
    
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
    
    $scope.menuHome = function(){
        $state.go('intro');
    }

    $scope.menuMaps = function(){
        $state.go('maps', { hasLogin : $scope.hasLogin});
    }
    
    $scope.menuEstadisticas = function(){
        $state.go('statistics', { hasLogin : $scope.hasLogin});
    }
    
    $scope.menuGoals = function(){
        $state.go('retos', { hasLogin : $scope.hasLogin});
    }
    
    $scope.menuInfo = function(){
        $state.go('info');
    }
    
});

app.controller('introCtrl', function($scope, $ionicSlideBoxDelegate, appData){
    $scope.retos = appData.retos;
    $scope.temas = appData.temas;
    
    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    };
    
    $scope.goLink = function(prmId){
        $scope.go('retos', { id : prmId });
    };
});

app.controller('loginCtrl', function($scope){
    $scope.user = {};
});

app.controller('infoCtrl', function($scope, appData){
    $scope.temas = appData.temas;

});

app.controller('temaCtrl', function($scope, $state, appData){
    $scope.id = $state.params.id;
    $scope.tema = appData.getTema($scope.id);
});

app.controller('retosCtrl', function($scope, $stateParams, appData){
    $scope.retos = appData.retos;
});

app.controller('retoCtrl', function($scope, $state, appData){
    $scope.id = $state.params.id;
    $scope.reto = appData.getReto($scope.id);
    
    $scope.retoPersons = appData.retoPersons;

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['1', '2'];
    $scope.data = [ [65, 59, 80, 81, 56, 55, 40], [28, 48, 40, 19, 86, 27, 90] ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});

app.controller('statisticsCtrl', function($scope, appData){
    $scope.labels1 = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data1 = [300, 500, 100]; 
    
    $scope.labels2 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.data2 = [300, 500, 100, 40, 120];
    
    $scope.labels3 = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series3 = ['Series A', 'Series B'];

    $scope.data3 = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
});

app.controller('mapsCtrl', function($scope, $ionicModal,$ionicActionSheet, $timeout, $http, $log,$state, $location, $ionicPopup, $compile, $ionicLoading
                                     ,geolocationService,geofenceService,appData) {
    $scope.geofences = [];
	$scope.latLang={
		lat:'',
		lang:'',
		location:''
	};

    $scope.ListButton = appData.getRetoButtonMaps();

    google.maps.event.addDomListener(window, 'load', initialize);
    
    $scope.setButton = function(idButton){
        for (i = 0; i < $scope.ListButton.length; i++){
            if ($scope.ListButton[i].idreto === idButton){
                $scope.ListButton[i].checked = true;
                $scope.setPoints(idButton);
            }                
            else
                $scope.ListButton[i].checked = false;
        }
    };
    
    $scope.setPoints = function(idreto){
        var myLatlng = new google.maps.LatLng(2.9273000, -75.2818800);

        var mapOptions = {
          center: myLatlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
        $scope.setMarkers(idreto); 
    }

    $scope.setMarkers = function(idreto){
        var sites = [];
        sites = appData.getRetoSites(idreto);
        var infoWindow = new google.maps.InfoWindow();
        
        for (i = 0; i < sites.length; i++){
            // Additional Markers //
            if (i === 0)
            {
                $scope.map.setCenter(new google.maps.LatLng(sites[0].lat, sites[0].long));
                
                // Add circle overlay to map
                $scope.circle = new google.maps.Circle({
                  map: $scope.map,
                  center: new google.maps.LatLng(sites[0].lat, sites[0].long),
                  radius: 6000,  //5km away
                  strokeColor:"#0000FF",
                  strokeOpacity:0.4,
                  strokeWeight:2,
                  fillColor:"#0000FF",
                  fillOpacity:0.1
                });
            }
            $scope.createMarker(sites[i], 'retoagua.jpg');
        }       
        
    }

    $scope.createMarker = function (info, image){
        var image = {
            url: 'img/' + image,
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
          };
          // Shapes define the clickable region of the icon. The type defines an HTML
          // <area> element 'poly' which traces out a polygon as a series of X,Y points.
          // The final coordinate closes the poly by connecting to the first coordinate.
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(info.lat, info.long),
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            title: info.city,
            icon: image,
            shape: shape,
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        //$scope.markers.push(marker);
    }  

    
	//Funciones generales///
	//***************Start********************************//
    function initialize() {
        
    };
    
    $ionicLoading.show({
        template: 'Getting geofences from device...',
        duration: 5000
    });


    geofenceService.getAll().then(function (geofences) {
        $ionicLoading.hide();
        $scope.geofences = geofences;
    }, function (reason) {
        $ionicLoading.hide();
        $log.log('An Error has occured', reason);
    });
		
		
    $scope.GetGeoLocation = function () {

        $log.log('Tracing current location...');
        $ionicLoading.show({
            template: 'Tracing current location...'
        });
        geolocationService.getCurrentPosition()
            .then(function (position) {
                $log.log('Current location found');
                $log.log('Current location Latitude'+position.coords.latitude);
                $log.log('Current location Longitude'+position.coords.longitude);

                $ionicLoading.hide();
                $scope.latLang.lat=parseFloat(position.coords.latitude);
                $scope.latLang.lang=parseFloat(position.coords.longitude);
                var lat =$scope.latLang.lat;
                var lang =$scope.latLang.lang; 
                //You can hit request upto 2500 per day on free of cost. 
                var mrgdata='http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lang//+'&sensor=true'
                $http.get(mrgdata)
                        .success(function (response) { 
                        /* console.log(response.results[0].formatted_address); */
                        $scope.latLang.location=response.results[0].formatted_address;
                        console.log("Your Current Location is : " +$scope.latLang.location)

                        var myLatlng = new google.maps.LatLng(lat,lang);

                    var mapOptions = {
                      center: myLatlng,
                      zoom: 16,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("map"),
                        mapOptions);


                     var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
                    var compiled = $compile(contentString)($scope);

                    var infowindow = new google.maps.InfoWindow({

                    });
                    infowindow.setContent($scope.latLang.location);
                    infowindow.open(map, marker);

                    var marker = new google.maps.Marker({
                      position: myLatlng,
                      map: map,
                      title: 'Current Location'
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map,marker);

                    });

                    $scope.map = map;


            }).error(function (data, status, headers, config) {
                console.log("error");

                 if (status == 0)
                    showalert("Error", "Errro Occured from Server site!");
                else
                    showalert("Error", data); 

            });

		}, function (reason) {
			$log.log('Cannot obtain current location', reason);
		   
			$ionicLoading.show({
				template: 'Cannot obtain current location',
				duration: 1500
			});
		});
     };
    
    $scope.setPosition = function(prm_Latlng){
		var myLatlng = new google.maps.LatLng(prm_Latlng.lat ,prm_Latlng.lang);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);


        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({

        });
        infowindow.setContent($scope.latLang.location);
        infowindow.open(map, marker);

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: myLatlng.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);

        });

        $scope.map = map;
        
     }
	 //***************End********************************//
	 
	 //This is default set location before fetching current location///
	 //***************Start********************************//
	 if($scope.latLang.lat==''){
        var _latLang={lat:'2.9273000', lang:'-75.2818800', location:'Neiva'};
        $scope.setPosition(_latLang); 
	 }
	 //***********************End**********************************///
});
