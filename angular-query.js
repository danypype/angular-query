angular.module('query', [])
.directive('query', function () {
  return {
    restrict: 'EA',
    scope: {source: '=query', queryOptions: '=options', results: '='},
    transclude: true,
    template: "<dig ng-transclude></div>",
    controller: ['$scope', function ($scope) {
      /*Gets the value of an object's property.
      Example: get({name: {first: "John", last: "Doe"}}, "name.first") returns "John"*/
      var get = function (object, stringProperty) {
        properties = stringProperty.split('.');
        value = object;
        for (var i = 0; i < properties.length; i++) {
          value = value[properties[i]]
        }
        return value;
      }

      //Query limit
      limit = $scope.queryOptions.limit;
      $scope.queryOptions.$stringify = function () {
        return JSON.stringify(this);
      }

      var filter = function (value, option) {
        if (typeof(option) != 'undefined') {
          if (typeof(option) == 'string') { //Test for matching
            if (!value) value = ""
            return (new RegExp(option.toLowerCase())).test(value.toString().toLowerCase());
          } else if (typeof(option) == 'number') { //Test for equality
            return value == option;
          } else if (typeof(option) == 'object') {
            if (option.$gt) { //Greater than
              return value > option.$gt;
            } else if (option.$gte) { //Greater than or equal
              return value >= option.$gte;
            } else if (option.$lt) { //Less than
              return value < option.$lt;
            } else if (option.$lte) { //Less than or equal
              return value <= option.$lte;
            }
          }
        }
      }

      var filterAndOrder = function () {
        if (typeof($scope.source) != 'undefined' && $scope.source.constructor === Array &&
          $scope.source.length && typeof($scope.queryOptions == 'object')) {

          //Apply filters
          var item, option, value = null;
          $scope.results.length = 0;

          for (var i = 0; i < $scope.source.length; i++) {
            item = $scope.source[i];
            include = true; //Indicates if the item must be included on the items array at the end of the filters

            for (var key in $scope.queryOptions) {
              if (key != '$order' && key != '$stringify') { //Ignore $order key
                option = get($scope.queryOptions, key);

                if (option.constructor == Array) {
                  if (key == '$or' || key == '$and') { //Disjunction and Conjunction
                    for (var j = 0; j < option.length; j++) {
                      keys = Object.keys(option[j]);
                      value = get(item, keys[0]);
                      optn = option[j][keys[0]];
                      include = filter(value, optn);
                      if (include && key == '$or') break;
                      if (!include && key == '$and') break;
                    }
                  }
                } else {
                  value = get(item, key);
                  include = filter(value, option);
                }
              }
              if (!include) break;
            }
            if (include && ($scope.results.length < limit || !limit))
              $scope.results.push(item);
          }

          if (typeof($scope.queryOptions.$order) != 'undefined' && $scope.queryOptions.$order.by) {
            //Apply order
            orderBy = $scope.queryOptions.$order.by;
            reverse = $scope.queryOptions.$order.reverse;
            $scope.results.sort(function(a, b) {
              if(get(a, orderBy) < get(b, orderBy)) {
                if (reverse) return 1;
                else return -1;
              }
              if(get(a, orderBy) > get(b, orderBy)) {
                if (reverse) return -1;
                else return 1
              }
              return 0;
            });
          }
        }
      }

      //Watch for $scope.source changes
      $scope.$watch('source', filterAndOrder, true);
      //Watch for $scope.queryOptions changes
      $scope.$watch('queryOptions.$stringify()', filterAndOrder);
    }]
  }
});