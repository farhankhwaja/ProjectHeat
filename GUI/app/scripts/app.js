'use strict';

/**
 * @ngdoc overview
 * @name heatApp
 * @description
 * # heatApp
 *
 * Main module of the application.
 */
angular
  .module('heatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    // 'ngTouch',
    'firebase',
    'ngMaterial',
    'angular-md5',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'highcharts-ng'
  ])
  .config(function (highchartsNGProvider) {
    highchartsNGProvider.lazyLoad();

    highchartsNGProvider.lazyLoad([highchartsNGProvider.HIGHCHART, 'maps/modules/map.js', 'mapdata/custom/world.js']);

    highchartsNGProvider.basePath('/js/'); 

  })
  .config(function ($routeProvider) {

    $routeProvider
      .when('/login',{  
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup',{ 
        templateUrl: 'views/signup.html',
        controller: 'SignUpCtrl'
      })
      .when('/home',{ 
        templateUrl: 'views/home.html',
        controller: 'NewReq'
      })
      .when('/requests',{ 
        templateUrl: 'views/allReqs.html',
        controller: 'NewReq'
      })
      .when('/analytics',{
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .otherwise({
        redirectTo: '/login'
       });
  })
  .run(function($rootScope, $state, UserService) {
      $rootScope.$on('$routeChangeStart', function() {
        var loggedInUser = UserService.getLoggedInUser();
        if(loggedInUser) {
          $rootScope.loggedInUserData = UserService.getUserData(loggedInUser.uid);
        }
      });
    });
