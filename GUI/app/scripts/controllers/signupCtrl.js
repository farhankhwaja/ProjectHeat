'use strict';

/**
 * @ngdoc function
 * @name heatApp.controller:authController
 * @description
 * # authController
 * Auth Controller of the heatApp
 */
angular.module('heatApp')
  .controller('SignUpCtrl', function ($rootScope, Auth, UserService, $state, $scope) {
    $scope.email = '';
    $scope.password = '';
    $scope.message;

    $scope.createUser = function() {

		// If there is already a user logged in,
		// log them out before proceeding
		Auth.$unauth();

		Auth.$createUser({
			email: $scope.email,
			password: $scope.password
		}).then(function(userData) {
			$scope.saveUser(userData);
			$scope.login();
		}).catch(function(error) {
			$scope.error = error;
		});
	};

	$scope.saveUser = function (userData) {

		var user = UserService.newUserRef(userData);
		user.username = $scope.username;
		user.email = $scope.email;

		user.$save().then(function(success) {
			$scope.username = null;
			$scope.email = null;
			$scope.password = null;

			$state.go('home');
		}, function(error) {
			$scope.message = 'there was an error! ' + error;
		});
	};
  });
