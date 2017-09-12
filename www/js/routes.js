angular.module('starter.routes', [])

  .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.get = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',

        resolve: {
          "check": function ($location) {
            if (localStorage.getItem('token')) {
              $location.path('/tab/people-list');
            }
            else {
              $location.path('/login');
            }
          }
        }
      })
      .state('tab.map', {
        url: '/map',
        views: {
          'map': {
            templateUrl: 'templates/map/people.html',
            controller: 'MapController',
            resolve: { "check": function ($location) { if (!localStorage.getItem('token')) { $location.path('/login'); } } }
          }
        }
      })
      .state('tab.people', {
        url: '/people',
        views: {
          'people': {
            templateUrl: 'templates/people/list.html',
            controller: 'PeopleController',
            resolve: { "check": function ($location) { if (!localStorage.getItem('token')) { $location.path('/login'); } } }
          }
        }
      })
      .state('tab.people-new', {
        url: '/people-new',
        views: {
          'people': {
            templateUrl: 'templates/people/new.html',
            controller: 'PeopleController',
            resolve: { "check": function ($location) { if (!localStorage.getItem('token')) { $location.path('/login'); } } }
          }
        }
      })
      .state('tab.people-view', {
        url: '/people-view/:id',
        views: {
          'people': {
            templateUrl: 'templates/people/view.html',
            controller: 'PeopleController',
            resolve: { "check": function ($location) { if (!localStorage.getItem('token')) { $location.path('/login'); } } }
          }
        }
      })
      .state('tab.log', {
        url: '/log',
        views: {
          'log': {
            templateUrl: 'templates/log/list.html',
            controller: 'PeopleController',
            resolve: { "check": function ($location) { if (!localStorage.getItem('token')) { $location.path('/login'); } } }
          }
        }
      })
      .state('tab.dashboard', {
        url: '/dashboard',
        views: {
          'dashboard': {
            templateUrl: 'templates/dashboard/dashboard.html',
            controller: 'DashboardController',
            resolve: { "check": function ($location) { if (!localStorage.getItem('token')) { $location.path('/login'); } } }
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
