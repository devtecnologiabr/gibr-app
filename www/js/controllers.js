angular.module('starter.controllers', ['ngCordova'])
  .filter('jsonDate', ['$filter', function ($filter) {
    return function (input, format) {
      if (input != '0000-00-00 00:00:00') {
        input = new Date(input);
        return (input) ? $filter('date')(input, format) : '';
      } else {
        return '';
      }
    };
  }])
  .controller('MapController', function ($scope, $cordovaGeolocation, People) {

    var options = { timeout: 10000, enableHighAccuracy: true };

    $scope.init = function () {

      People.map().success(function (data) {
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var mapOptions = {
            center: latLng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

          for (var x in data) {
            var content = "";
            var street = "";
            var peoples = "";
            var latlng = "";
            if (x != "") {
              for (var y in data[x]) {
                if (x != '') {
                  latlng = new google.maps.LatLng(data[x][y]['lat'], data[x][y]['lng']);
                  street = data[x][y]['address'] + ', ' + data[x][y]['number'];
                  peoples = peoples.concat('<a href="#/tab/people-view/' + data[x][y]['id'] + '">' + data[x][y]['name'] + '</a>' + ' ' + data[x][y]['phone_1'] + ' | A ' + data[x][y]['requestopen'] + ' | F ' + data[x][y]['requestclose'] + '<br>');
                  content = '<div class="iw_title"><b>' + street + '</b></div>' + '<div id="iw_container">' + peoples + '</div>';
                }
              }

              var marker = new google.maps.Marker({
                position: latlng,
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                //icon: '../img/marker.png',
                title: content
              });

              var infoWindowContent =  content;

              addInfoWindow(marker, infoWindowContent);
            }

          }

        }, function (error) {
          console.log("Could not get location");
        });
      });
    };

    function addInfoWindow(marker, message) {

      var infoWindow = new google.maps.InfoWindow({
        content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });

    }

  })

  .controller('PeopleController', function ($scope, $stateParams, $timeout, $ionicPopup, $filter, People, Request) {

    $scope.doRefresh = function () {
      $timeout(function () {
        $scope.listPeople();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

    $scope.showRequest = function (req) {
      Request.log(req.id).success(function (data) {
        var logs = '';
        for(var i in data){
          logs += '<b>' + data[i]['description'] + '</b><br>' + data[i]['user_id'] + ' ' + $filter('jsonDate')(data[i]['creation_date'], 'dd/MM/yyyy HH:mm') + '<br><br>';
        }
        $ionicPopup.alert({
          title: 'Informações da Demanda',
          template: '<b>Código:</b> ' + req.id + '<br>' +
          '<b>Aberto:</b> ' + $filter('jsonDate')(req.creation_date, 'dd/MM/yyyy HH:mm') + '<br>' +
          '<b>Categoria:</b> ' + req.typef + '<br>' +
          '<b>Subcategoria:</b> ' + req.type + '<br><br>' +
          '<b>Descrição:</b> ' + req.description + '<br><br>' +
          '<b>Solução:</b> ' + req.solution + '<br><br>' +
          '<b>Fechado:</b> ' + $filter('jsonDate')(req.solution_date, 'dd/MM/yyyy HH:mm') + '<br>' +
          '<b>Autor:</b> ' + req.creation_user_id + '<br><br>'+
          '<b>Logs</b> <br><br>' + logs
        });
      });
    };

    $scope.findPeople = function () {
      People.find($stateParams.id).success(function (data) {
        $scope.data = data;
      });
    };

    $scope.listPeople = function () {
      People.all().success(function (data) {
        $scope.peoples = data;
      });
    };
  })

  .controller('LogController', function ($scope, $stateParams, $timeout, Log) {

    $scope.doRefresh = function () {
      $timeout(function () {
        $scope.listLog();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

    $scope.listLog = function () {
      Log.all().success(function (data) {
        $scope.logs = data;
      });
    };
  })

  .controller('DashboardController', function ($scope, $stateParams, $timeout, Dashboard) {

    $scope.doRefresh = function () {
      $timeout(function () {
        $scope.dashboardApp();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

    $scope.dashboardApp = function () {
      Dashboard.all().success(function (data) {
        $scope.dashboard = data;
      });
    };
  })

  .controller('loginCtrl', function ($scope, $http, $ionicPopup, $state) {
    $scope.user = {};

    $scope.login = function () {
      var url = 'http://' + $scope.user.subdominio + '.gibr.com.br/api';
      var data = serializeData($scope.user);
      $http.post(url, data)
        .success(function (data) {
          console.log(data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', data.user);
          localStorage.setItem('subdomain', $scope.user.subdominio + '.gibr.com.br');

          $state.go('tab.dashboard', {}, { location: "replace", reload: true });
        }).error(function () {
          var alertPopup = $ionicPopup.alert({
            title: 'Falha no Login',
            template: 'Verifique seus dados'
          });
        });
    };

    $scope.logout = function () {
      $window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('login', {}, { location: "replace", reload: true });
    };

  });

function serializeData(data) {
  if (!angular.isObject(data)) {
    return ((data == null) ? "" : data.toString());
  }
  var buffer = [];
  for (var name in data) {
    if (!data.hasOwnProperty(name)) {
      continue;
    }
    var value = data[name];
    buffer.push(
      encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
    );
  }
  var source = buffer.join("&").replace(/%20/g, "+");
  return (source);
}