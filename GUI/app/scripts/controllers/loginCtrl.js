'use strict';

/**
 * @ngdoc function
 * @name heatApp.controller:authController
 * @description
 * # authController
 * Auth Controller of the heatApp
 */
angular.module('heatApp')
  .controller('LoginCtrl', function (Auth, UserService, $location, $scope, $rootScope, $timeout) {
    $scope.email = '';
    $scope.password = '';
    $scope.message = null;
    $scope.showError = false;

	$scope.logout = function(){
		Auth.$unauth();
		$location.path('/login');
	};

	$scope.login =  function() {
		Auth.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		}).then(function(data) {
			$scope.email = null;
			$scope.password = null;
			$location.path('/home');
		}).catch(function(error) {
			$scope.showError = true;
			$scope.message = error;
			$timeout(function () {
				$scope.showError = false;
            	$scope.message = null;
          	}, 3000);
		});
	};
  });
