angular.module('SimpleRESTIonic.controllers', ['ngCordova'])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin() {
            LoginService.anonymousLogin();
            onLogin('Guest');
        }

        function onLogin(username) {
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
            login.username = username || Backand.getUsername();
    }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        function socialSignIn(provider) {
            LoginService.socialSignIn(provider)
                .then(onValidLogin, onErrorInLogin);

        }

        function socialSignUp(provider) {
            LoginService.socialSignUp(provider)
                .then(onValidLogin, onErrorInLogin);

        }

        onValidLogin = function(response){
            onLogin();
			console.log("response "+response.data);
			console.log(response);
			console.log("login "+login);
			console.log(login);
            login.username = response.data || login.username;
        }

        onErrorInLogin = function(rejection){
            login.error = rejection.data;
            $rootScope.$broadcast('logout');

        }


        login.username = '';
        login.error = '';
        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
        login.socialSignup = socialSignUp;
        login.socialSignin = socialSignIn;

    })

    .controller('SignUpCtrl', function (Backand, $state, $rootScope, LoginService) {
        var vm = this;

        vm.signup = signUp;

        function signUp(){
            vm.errorMessage = '';

            LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
                .then(function (response) {
                    // success
                    onLogin();
                }, function (reason) {
                    if(reason.data.error_description !== undefined){
                        vm.errorMessage = reason.data.error_description;
                    }
                    else{
                        vm.errorMessage = reason.data;
                    }
                });
        }


        function onLogin() {
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
        }


        vm.email = '';
        vm.password ='';
        vm.again = '';
        vm.firstName = '';
        vm.lastName = '';
        vm.errorMessage = '';
    })

    .controller('DashboardCtrl', function (ItemsModel, $rootScope, $http, $cordovaLaunchNavigator, $ionicLoading, $compile) {
        var vm = this;
			
        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }
		
        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData() {
            vm.data = null;
        }
		
	/*	function getTravelStatistics(fromAddress,toAddress) {
			var URL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ fromAddress +"&destinations="+ toAddress +"&key=AIzaSyC032_L4j9ko-kro39X-1hrWHOZzh4l9is"
			$http.get(URL).then(function(resp){
				console.log('Success', resp);
				return resp;
			}, function(err){
				console.error('ERR', err);
			})
			//
		}
	*/	
		function openMaps(object) {
			launchnavigator.navigate(object.toAddress, {
				start: object.fromAddress
			});
        }
	
        function create(object) {
			var URL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ object.fromAddress +"&destinations="+ object.toAddress +"&mode="+object.method+"&key=AIzaSyC032_L4j9ko-kro39X-1hrWHOZzh4l9is"
				console.log(URL);
			
			$http.get(URL).then(function(resp){
				object.toAddress = resp.data.destination_addresses[0]
				object.fromAddress= resp.data.origin_addresses[0]
				object.distance= resp.data.rows[0].elements[0].distance.text;
				object.travelTime= resp.data.rows[0].elements[0].duration.text;
            
				console.log("travelTime "+ object.travelTime);
				console.log("distance "+ object.distance);
				console.log("travelTime "+ object.travelTime);
				console.log("method "+ object.method);
				
				ItemsModel.create(object)
				.then()
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
				
				
			}, function(err){
				console.error('ERR', err);
			})
			
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;
		vm.openMaps = openMaps;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if (!vm.isAuthorized) {
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();
		
		//For DetailsCtrl
		vm.isGetDetails = false;
        vm.getDetails = getDetails;
		vm.cancelDetails = cancelDetails;
		
		function cancelDetails() {
            vm.isGetDetails = false;
        }
		
		
		function getDetails(address) {
			vm.isGetDetails = true;
			
		}
    })
	
	.controller('WeatherCtrl', function ($state, $rootScope, $http) {
       
    })
	
	.controller('MapCtrl', function(ItemsModel, $rootScope, $state, $cordovaGeolocation) {
	  var options = {timeout: 10000, enableHighAccuracy: true};
	 
	  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
	 
		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 
		var mapOptions = {
		  center: latLng,
		  zoom: 15,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	 
		$rootScope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		google.maps.event.addListenerOnce($rootScope.map, 'idle', function(){
 
		  var marker = new google.maps.Marker({
			  map: $rootScope.map,
			  animation: google.maps.Animation.DROP,
			  position: latLng
		  });      
		 
		  var infoWindow = new google.maps.InfoWindow({
			  content: "<h4>You are here !</h4>"
		  });
		 
		  google.maps.event.addListener(marker, 'click', function () {
			  infoWindow.open($rootScope.map, marker);
		  });
		 
		var items = null;
		var markers = [];
		ItemsModel.all()
         .then(function (result) {
             items = result.data.data;
			 
			 var geocoder = new google.maps.Geocoder();
			 for (let item of items) {
			  console.log(item);
				

				geocoder.geocode({'address': item.toAddress}, function(results, status) {
				if (status === 'OK') {
				 var marker = new google.maps.Marker({
					map: $rootScope.map,
					position: results[0].geometry.location
				  });
				  var infoWindowContent = "<h4>" + item.toAddress + "</h4>";
				  addInfoWindow(marker, infoWindowContent, item);
				} else {
				  alert('Geocode was not successful for the following reason: ' + status);
				}
				});
				
				geocoder.geocode({'address': item.fromAddress}, function(results, status) {
				if (status === 'OK') {
				 var marker = new google.maps.Marker({
					map: $rootScope.map,
					position: results[0].geometry.location
				  });
				  var infoWindowContent = "<h4>" + item.fromAddress + "</h4>";
				  addInfoWindow(marker, infoWindowContent, item);
				} else {
				  alert('Geocode was not successful for the following reason: ' + status);
				}
				});
			}
			
         });
		 
	  
	 
	  return {
		getMarkers: function(){
	 
		  return $http.get("http://example.com/markers.php").then(function(response){
			  markers = response;
			  return markers;
		  });
	 
		}
	  }
		 
		});
	 
	  }, function(error){
		console.log("Could not get location");
	  });
	  

	  function addInfoWindow(marker, message, record) {
	
		var infoWindow = new google.maps.InfoWindow({
			content: message
		});
		
		google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(map, marker);
			
			latA = marker.position.lat();
			lngA = marker.position.lng();
			
		//	console.log(latA);
		//	console.log(lngB);
			
			options = {
			  timeout: 10000,
			  enableHighAccuracy: true
			};
			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
			
			//recreate due to bug	
				latB = position.coords.latitude;
				lngB = position.coords.longitude;
				
				var pointA = new google.maps.LatLng(parseFloat(latA), parseFloat(lngA));
				var pointB = new google.maps.LatLng(parseFloat(latB), parseFloat(lngB));
			  
			  // Instantiate a directions service.
			  console.log("there");
			  directionsService = new google.maps.DirectionsService,
				directionsDisplay = new google.maps.DirectionsRenderer({
				  map: $rootScope.map
				});
				directionsDisplay.setOptions( { suppressMarkers: true } );
				calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
			  
			})
			
		});
		
		}
		
		function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
          directionsService.route({
            origin: pointA,
            destination: pointB,
            avoidTolls: true,
            avoidHighways: false,
            travelMode: google.maps.TravelMode.TRANSIT
          }, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
				console.log("thereagain");
              directionsDisplay.setDirections(response);
            } else {
				console.log("thereagain2")
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
		
		return {
		init: function(){
		initMap();
		}
		}
	  
	});
	



