var mainApp = angular.module("mainApp", ['ngRoute','ngGrid','mainController']);

/*mainApp.run(function($timeout){
    $timeout(function() {
        $(document).foundation();
    }, 500);
});
*/


/*mainApp.directive('notification', ['$timeout', function ($timeout) {
return {
  restrict: 'E',
  transclude: true,
  scope: {
    name: '@',
    header:'@',
    show: '=',
    timeout: '@?'
  },
  link: function(scope, element, attrs, controller, transclude) {
    transclude(scope, function(clone){
      scope.notification = clone.text();
    });
    scope.$watch('show', function (show) {
      if (show) {
        var reveal = angular.element('#' + scope.name);
        reveal.foundation();
        reveal.foundation('reveal', 'open');
        if (scope.timeout) {
          $timeout(function () {
            reveal.foundation('reveal', 'close');
          }, scope.timeout);
        }
        scope.show = false;
      }
    });
  },
  templateUrl: 'includes/notification.html'
};
}]);*/

mainApp.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
 
   when('/addDoctor', {
      templateUrl: 'templates/addDoctor.html', controller: 'AddDoctorController'
   }).
   
   when('/viewDoctor', {
      templateUrl: 'templates/viewDoctor.html', controller: 'ViewDoctorController'
   }).
   when('/login', {
      templateUrl: 'templates/login.html', controller: 'loginController'
   }).

   when('/home', {
      templateUrl: 'templates/indexTemplate.html', controller: 'homeController'
   }).

   when('/slider', {
      templateUrl: 'templates/Slider.html', controller: 'sliderController'
   }).

when('/accordion', {
      templateUrl: 'templates/quickaccordion.html', controller: 'accordionController'
   }).

when('/accordion/#panel1a', {
      templateUrl: 'templates/accordion1.html', controller: 'accordionController'
   }).


when('/accordion/#panel2a', {
      templateUrl: 'templates/accordion2.html', controller: 'accordionController'
   }).

when('/accordion/#panel2a', {
      templateUrl: 'templates/accordion3.html', controller: 'accordionController'
   }).

when('/register', {
      templateUrl: 'templates/Update.html', controller: 'registerController'
   }).

when('/modal', {
      templateUrl: 'templates/domodal.html', controller: 'domodalController'
   }).

when('/menu', {
      templateUrl: 'templates/menu.html', controller: 'menuController'
   }).

when('/topbar', {
      templateUrl: 'templates/topbar.html', controller: 'topbarController'
   }).

when('/keys', {
      templateUrl: 'templates/keys.html', controller: 'keycontroller'
   }).

when('/grid', {
      templateUrl: 'templates/grid.html', controller: 'nGcontroller'
   }).


when('/alerts', {
      templateUrl: 'templates/alerts.html', controller: 'alertcontroller'
   }).


when('/profile', {
      templateUrl: 'templates/profile.html', controller: 'profilecontroller'
   }).



   otherwise({
      redirectTo: 'templates/login.html'
   });
	
}]);  