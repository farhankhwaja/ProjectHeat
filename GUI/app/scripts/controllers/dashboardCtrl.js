'use strict';

angular.module('heatApp')
  .controller('DashboardCtrl', function ($rootScope, VisitorService, ClustersService, $scope, Auth, $route, $location, $timeout) {
  	
  	$scope.couponDist = false;
  	$scope.clusters = false;
  	$scope.stackedData = [];
  	$scope.clusterData = {
		"1": [3.90,7.05,5.59,3.70,4.07,2.69,3.88,2.58,5.34,6.03,5.22,5.30,3.32,3.37,3.28,2.95,3.81,3.51,5.39,3.54],
		"2": [4.65,6.84,5.00,3.86,4.02,2.73,4.08,2.65,3.09,4.76,4.80,4.05,4.52,3.13,5.47,3.22,4.80,4.36,4.73,3.35],
		"3": [4.92,6.88,5.61,3.59,3.44,3.13,3.64,6.50,3.73,4.56,3.80,5.44,4.31,3.14,2.93,3.30,4.45,4.44,4.35,2.67],
		"4": [4.07,6.95,5.51,3.29,3.05,2.58,5.36,3.00,3.05,3.70,5.25,5.94,4.65,3.41,3.09,3.77,5.14,3.19,4.72,4.76],
		"5": [4.02,5.55,4.93,3.90,2.98,2.98,4.31,6.00,3.42,5.24,4.87,5.26,4.11,3.61,3.18,3.17,3.91,3.53,5.53,3.32],
		"6": [4.04,5.47,4.45,3.84,3.38,3.11,3.72,2.89,3.16,4.92,5.48,5.10,3.68,4.02,4.32,6.03,4.28,3.47,5.23,3.20],
		"7": [4.42,5.82,4.49,4.80,4.08,3.34,4.30,2.85,4.28,4.20,4.81,5.48,3.54,3.91,3.47,3.22,6.38,3.20,4.48,2.80],
		"8": [4.72,4.98,4.34,3.52,2.90,3.75,3.43,2.84,4.15,4.51,4.47,5.08,5.53,3.93,2.96,3.54,4.48,4.84,5.66,4.44],
		"9": [5.92,3.94,5.61,3.89,3.37,4.75,3.64,2.54,3.79,4.78,5.25,5.95,3.72,4.52,3.77,3.52,3.30,3.23,5.23,2.83],
		"10": [4.41,6.82,5.15,3.52,3.57,6.94,4.07,2.86,3.40,4.63,4.79,4.72,3.62,3.99,3.07,3.66,4.10,3.58,4.46,3.25],
		"11": [5.39,6.78,3.18,4.77,3.29,2.99,3.59,4.54,3.27,4.71,5.17,5.69,3.78,3.75,4.49,3.25,3.89,3.63,4.01,4.76],
		"12": [4.41,5.04,5.30,5.29,3.09,4.22,5.17,3.33,3.71,4.39,3.87,5.38,3.30,3.15,4.02,4.17,3.90,4.27,4.43,3.98],
		"13": [5.39,6.22,4.79,3.41,4.44,2.58,4.69,2.76,3.76,4.80,4.59,5.41,4.02,3.05,2.88,5.51,3.84,4.15,4.95,2.68],
		"14": [4.00,6.63,4.71,4.67,3.22,2.61,3.49,3.00,4.82,4.65,5.45,4.64,4.45,5.11,3.42,4.14,3.90,4.84,3.83,2.71],
		"15": [4.66,4.41,4.82,3.57,5.71,2.96,4.72,4.26,3.38,4.21,5.57,4.37,3.71,4.85,3.03,3.21,4.02,3.94,4.96,3.19]
	};

	for (var c in $scope.clusterData){
		$scope.stackedData.push({
			name: c,
			data: $scope.clusterData[c]
		});
    }

  	$scope.allShops = ["Adidas","Macy’s","Apple","Samsung","Ray Ban","Gap","GUCCI","Forever 21","Prada","American Apparel","AT & T","Nike","AMC","BOSE","Banana Republic","Chipotle","Elite Auto Spa","The Coffee Bean and Tea Leaf","Fat Burger","H&M"];
  	$scope.visitedShopValues = [];
	$scope.visitedShopNames = [];
	$scope.otherShopValues = [];
	$scope.otherShopNames = [];
	$scope.pieChartConfig = [];
  	$scope.showModal = false;	
  	$scope.newVisitor = VisitorService.newVisitor();

	var syncData = VisitorService.readData();

	syncData.$bindTo($scope, "visitorData");

	var init = function(){
		$scope.authData = Auth.$getAuth();
		
		if($scope.authData === null){
			$location.path("/login");
		}else{
			$scope.userID = $rootScope.loggedInUserData.$id;
		}
		$scope.visitorData = VisitorService.readData();
	};

	$scope.parJson = function (json) {
        return JSON.parse(json);
    };

	$scope.logout = function(){
		Auth.$unauth();
		$location.path("/login");
	};

	$scope.setVal = function(visitedShopStats, otherShopStats){
    	$scope.visitedShopValues = [];
		$scope.visitedShopNames = [];
		$scope.otherShopValues = [];
		$scope.otherShopNames = [];

    	for(var i in visitedShopStats){
			$scope.visitedShopNames.push(i);
			$scope.visitedShopValues.push(visitedShopStats[i]);
		}

		for(var j in otherShopStats){
			$scope.otherShopNames.push(j);
			$scope.otherShopValues.push(otherShopStats[j]);
		}

		$scope.otherShopCouponConfig.series[0].data = $scope.otherShopValues;
		$scope.visitedShopCouponConfig.series[0].data = $scope.visitedShopValues;
		$scope.otherShopCouponConfig.xAxis.categories = $scope.otherShopNames;
		$scope.visitedShopCouponConfig.xAxis.categories = $scope.visitedShopNames;
    };


	$scope.visitedShopCouponConfig = {
        options: {
            chart: {
                type: "column"
            },
            legend: {
                enabled: false
            },
            style: {
                width: "100%"
            },
            dataLabels: {
                enabled: false,
                formatter: function() {
                    return Highcharts.numberFormat(this.y, 1, ",");
                },
                style: {
                    color: "contrast",

                    fontWeight: "normal",
                    textShadow: "none" //"0px 0px 0px black"
                }
            }
        },
        title: {
            enabled: false,
            text: "Visited Shops Coupon Distribution"
        },
        xAxis: {
            categories: $scope.visitedShopNames,
            title: {
            	text: "Shop Names"
            }
        },
        yAxis: {
            title: {
                text: "Total Number of Coupons"
            }
        },
        series: [{
        	name: "Count",
            data: $scope.visitedShopValues
        }],
        size: {
            height: "300"
        },
        func: function(chart) {
            $timeout(function() {
                chart.reflow();
            }, 0);
        }
    };

    $scope.otherShopCouponConfig = {
        options: {
            chart: {
                type: "column"
            },
            legend: {
                enabled: false
            },
            style: {
                width: "100%"
            },
            dataLabels: {
                enabled: true,
                formatter: function() {
                    return Highcharts.numberFormat(this.y, 1, ",");
                },
                style: {
                    color: "contrast",

                    fontWeight: "normal",
                    textShadow: "none" //"0px 0px 0px black"
                }
            }
        },
        title: {
            enabled: false,
            text: "Non-Visited Shops Coupon Distribution"
        },
        xAxis: {
            categories: $scope.otherShopNames,
            title: {
            	text: "Shop Names"
            }
        },
        yAxis: {
            title: {
                text: "Total Number of Coupons"
            }
        },
        series: [{
        	name: "Count",
            data: $scope.otherShopValues
        }],
        size: {
            height: "300"
        },
        func: function(chart) {
            $timeout(function() {
                chart.reflow();
            }, 2000);
        }
    };

    $scope.openCouponDist = function(){
    	var chart1 = $("#chart1").highcharts();
    	chart1.xAxis[0].setCategories($scope.visitedShopNames);
    	var chart2 = $("#chart2").highcharts();
    	chart2.xAxis[0].setCategories($scope.otherShopNames);

  //   	$scope.otherShopCouponConfig.xAxis.categories = $scope.otherShopNames;
		// $scope.visitedShopCouponConfig.xAxis.categories = $scope.visitedShopNames;
		$scope.couponDist = true;
		$scope.clusters = false;
    };

    $scope.openClusters = function(){
		$scope.couponDist = false;
		$scope.clusters = true;
		$timeout(function() {
                $("#chart3").highcharts().reflow();
            }, 2000);
    };    

    $scope.config = {
    	options: {
            chart: {
                type: "bar"
            },
            legend: {
                enabled: true,
            },
            title: {
            	text: "Cluster Analysis"
            },
            tooltip: {
				formatter: function() {
					return 'Cluster '+ this.series.name +'<br/><b>' + this.x + '</b> is <b>' + this.y + '</b>';
				}
			},
            plotOptions: {
	            bar: {
	                stacking: "normal",
	                dataLabels: {
	                    enabled: false,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || "white",
	                    style: {
	                        textShadow: "0 0 3px black"
	                    }
	                }
	            }
	        },
        },
	    xAxis: {
            categories: $scope.allShops,
            title: {
            	text: "Shop Names"
            }
        },
        yAxis: {
            title: {
                text: "Shop Cummulative Rating"
            }
        },
        size: {
        	// width: "900",
            height: "600"
        },
        series: $scope.stackedData,
        func: function(chart) {
            $timeout(function() {
                chart.reflow();
            }, 2000);
        }
	};

	$scope.$watch("visitorData", function(newValue, oldValue){
		if(newValue !== undefined && newValue !== null){
			// console.log(newValue);
			$scope.visitedShopStats = {};
  			$scope.otherShopStats = {};
			delete newValue.$id;
			delete newValue.$priority;
			$scope.requests = newValue;
			for(var i in $scope.requests){
				if($scope.requests[i].copounsGenerated !== undefined && $scope.requests[i].copounsGenerated !== "none"){
					$scope.coupons = $scope.parJson($scope.requests[i].copounsGenerated);
					if($scope.coupons.visited !== "" || $scope.coupons.visited !== undefined || $scope.coupons.visited !== "null"){
						for(var j in $scope.coupons.visited){
							if($scope.coupons.visited[j] !== "null" && !($scope.coupons.visited[j].shop in $scope.visitedShopStats)) {
								$scope.visitedShopStats[$scope.coupons.visited[j].shop] = 1;
							}else{
								$scope.visitedShopStats[$scope.coupons.visited[j].shop] += 1;
							}
						}
					}

					if($scope.coupons.other !== "" || $scope.coupons.other !== undefined || $scope.coupons.other !== "null"){
						for(var j in $scope.coupons.other){
							if($scope.coupons.other[j] !== "null" && !($scope.coupons.other[j].shop in $scope.otherShopStats)) {
								$scope.otherShopStats[$scope.coupons.other[j].shop] = 1;
							}else{
								$scope.otherShopStats[$scope.coupons.other[j].shop] += 1;
							}
						}
					}
				}
			}
			$scope.setVal($scope.visitedShopStats, $scope.otherShopStats);
		}
	});
	
	init();
  });