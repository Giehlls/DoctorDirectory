var mainController	 = angular.module('mainController', []);
mainController.controller('homeController', , ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Home form";
}]);

mainController.controller('AddDoctorController', , ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Add Doctor form";
}]);

mainController.controller('ViewDoctorController', , ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display View Doctor form";
}]);


mainController.controller('loginController', , ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Login form";
}]);

        