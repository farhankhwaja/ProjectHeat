'use strict';

angular.module('heatApp')
	.factory('ClustersService', function ($firebaseArray) {
		function readClusters (){
			var ref = new Firebase('https://heatui.firebaseio.com/clusters/');
			return $firebaseArray(ref);
		}

		return {
			readClusters: readClusters
		};
  });
