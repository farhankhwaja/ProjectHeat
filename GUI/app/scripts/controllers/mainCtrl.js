'use strict';

angular.module('heatApp')
  .controller('MainCtrl', function (Auth, $scope, $rootScope, $state) {
	$scope.init = function(){
		$scope.authData = Auth.$getAuth();
	};

	$scope.email = '';
    $scope.password = '';
    $scope.message = null;


	$scope.login =  function() {
		Auth.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		}).then(function(data) {
			$scope.email = null;
			$scope.password = null;
			$state.go('home', {}, {reload: true});
		}).catch(function(error) {
			$scope.message = 'there was an error! ' + error;
		});
	};

	$scope.logout = function(){
		Auth.$unauth();
		$state.go('main', {}, {reload: true});
	};
	$scope.init();
  });