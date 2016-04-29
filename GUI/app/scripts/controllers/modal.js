'use strict';

angular.module('heatApp').directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog container">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        // console.log(attrs.title);
        scope.title = attrs.title;

        scope.$watchGroup([attrs.visible, attrs.title], function(values){
          if(values[0] === true){
            $(element).modal('show');
          }
          else{
            $(element).modal('hide');
          }

          if(values[1]){
            scope.title = 'Coupon Details for Visitor ' + values[1].visitorID;
          }
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });