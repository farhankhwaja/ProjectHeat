'use strict';

angular.module('heatApp')
  .factory('UserService', function ($firebaseObject) {
    
    function newUserRef(user) {
		var ref = new Firebase('https://heatui.firebaseio.com/users/' + user.uid);
		return $firebaseObject(ref);
    }

    function getUserData(user) {
		var ref = new Firebase('https://heatui.firebaseio.com/users/' + user);
		return $firebaseObject(ref);
    }

    function getLoggedInUser() {
		var user = localStorage.getItem('firebase:session::heatui');
		if(user){
			return JSON.parse(user);
		}
    }

    return {
		newUserRef: newUserRef,
		getUserData: getUserData,
		getLoggedInUser: getLoggedInUser
    };
  });
