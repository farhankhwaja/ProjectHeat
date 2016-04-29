'use strict';

angular.module('heatApp')
	.factory('Auth', function ($firebaseAuth) {
		var ref = new Firebase('https://heatui.firebaseio.com/');
		return $firebaseAuth(ref);
  });
