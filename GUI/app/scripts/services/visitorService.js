'use strict';

angular.module('heatApp')
	.factory('VisitorService', function ($firebaseArray, $firebaseObject) {
		function newVisitor (){
			var ref = new Firebase('https://heatui.firebaseio.com/newreq/');
			return $firebaseArray(ref);
		}

		function readData (){
			var ref = new Firebase('https://heatui.firebaseio.com/newreq/');
			return $firebaseObject(ref);
		}

		return {
			newVisitor: newVisitor,
			readData: readData
		}
  });
