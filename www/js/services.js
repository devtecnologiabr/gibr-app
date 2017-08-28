angular.module('starter.services', [])
  .factory('Log', function ($http) {

    var data = {};

    data.all = function () {
      return $http.get('http://' + localStorage.getItem('subdomain') + '/api/log' + '?token=' + localStorage.getItem('token'));
    };

    return data;
  })

  .factory('Dashboard', function ($http) {

    var data = {};

    data.all = function () {
      return $http.get('http://' + localStorage.getItem('subdomain') + '/api/dashboard' + '?token=' + localStorage.getItem('token'));
    };

    return data;
  })

  .factory('Request', function ($http) {
    
        var data = {};
    
        data.log = function (id) {
          return $http.get('http://' + localStorage.getItem('subdomain') + '/api/request-log/' + id + '?token=' + localStorage.getItem('token'));
        };
    
        return data;
      })
  
  .factory('People', function ($http) {

    var data = {};

    data.all = function () {
      return $http.get('http://' + localStorage.getItem('subdomain') + '/api/people' + '?token=' + localStorage.getItem('token'));
    };

    data.map = function () {
      return $http.get('http://' + localStorage.getItem('subdomain') + '/api/people-map' + '?token=' + localStorage.getItem('token'));
    };

    data.find = function (id) {
      return $http.get('http://' + localStorage.getItem('subdomain') + '/api/people/' + id + '?token=' + localStorage.getItem('token'));
    };

    return data;
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