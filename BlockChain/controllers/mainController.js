var mainController	 = angular.module('mainController', []);
mainController.controller('homeController', ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Home form";
}]);

mainController.controller('AddDoctorController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Add Doctor form";
}]);

mainController.controller('ViewDoctorController' , ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display View Doctor form";
}]);


mainController.controller('loginController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Login form";
}]);


mainController.controller('sliderController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Slider form";
}]);


mainController.controller('menuController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display menu form";
}]);

mainController.controller('domodalController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Modal";
}]);

mainController.controller('topbarController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Topbar";
}]);

mainController.controller('keycontroller',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to key registry";
}]);

mainController.controller('alertcontroller',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to key registry";
}]);

mainController.controller('nGcontroller',  ['$scope', function($scope, $http) {
 $scope.myData = [{name: "Moroni", age: 50},
                     {name: "Tiancum", age: 43},
                     {name: "Jacob", age: 27},
                     {name: "Nephi", age: 29},
                     {name: "Enos", age: 34}];
    $scope.gridOptions = { data: 'myData' };
}]);

mainController.controller('profilecontroller',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to key registry";
}]);



mainController.controller('registerController',  ['$scope', function($scope, $http) {
  $scope.message = "Register to the Blockchain Ledger";
  var data={ 
   "provider":{  
      "firstname":"bruce",
      "lastname":"wayne",
      "email":"bruce@wayne.com",
      "provId":"999999999",
      "PrimSpeciality":"Anesthesiology",
      "SecSpeciality":"Internal medicine",
      "TerSpeciality":"Pulmonary Disease",
      "phone":"8602222222",
      "address":"900 Cottage Groove Rd"
   },
   "network":[],  
      /*{"name":"Cigna","payerID":"999999999","pubKey":"111111111111111111"}],*/
      
   "edu":{
      "degree":"B.Tech",
      "Institution":"Geore Town",
      "pubKey":"111111111111111111111111"
   },
   "affilliation":{  
      "payerID":"11111111111111111111111",
      "type":"Hospital",
      "TIN":"99999999",
      "pubKey":"111111111111111111111111"}
   };
   var jsonString=JSON.stringify(data);
   //alert(jsonString);
   var obj=JSON.parse(jsonString);
   //var obj1=JSON.parse(obj);
   //alert(obj.provider.firstname);
      var result;
  $scope.register = function()
	{

		obj.provider.firstname=$scope.user.firstname;
    obj.provider.lastname=$scope.user.lastname;
    obj.provider.email=$scope.user.email;
    obj.provider.provId=$scope.user.provId;
    obj.provider.PrimSpeciality=$scope.user.Speciality;
    obj.provider.SecSpeciality=$scope.user.SecSpeciality;
    obj.provider.TerSpeciality=$scope.user.TerSpeciality;
    obj.provider.phone=$scope.user.tel;
    obj.provider.address=$scope.user.address;
    //alert($scope.provider.network.length);
    for (x=0; x < $scope.provider.network.length; x++)
    {
      alert(x);
      obj.network.push(
        {"name":$scope.provider.network[x],
        "payerID":$scope.provider.payerID[x],
        "pubKey":$scope.provider.pubKey[x]
    });
    }
    obj.edu.degree=$scope.user.degree;
    obj.edu.Institution=$scope.user.univ;
    obj.edu.pubkey=$scope.user.univPubkey;
    obj.affilliation.payerID=$scope.user.type;
    obj.affilliation.type=$scope.user.org;
    obj.affilliation.TIN=$scope.user.afftin;
    obj.affilliation.pubKEy=$scope.user.affPubKey;
    $scope.result= JSON.stringify(obj);
    //alert($scope.result);
  		//alert($scope.email.$invalid);
	};
}]);


/*mainController.controller('domodalController', ['$scope', 'close', function($scope, close) {

  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);
*/


/*mainController.controller('SampleController', ["$scope", "ModalService", function($scope, ModalService,close) {

  $scope.showAModal = function() {

    // Just provide a template url, a controller and call 'showModal'.
    ModalService.showModal({
      templateUrl: "templates/viewmodal.html",
      controller: "YesNoController"
    }).then(function(modal) {
      // The modal object has the element built, if this is a bootstrap modal
      // you can call 'modal' to show it, if it's a custom modal just show or hide
      // it as you need to.
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.message = result ? "You said Yes" : "You said No";
      });
    });

  };

}]);*/



/*
mainController.controller('accordionController',  ['$scope', function($scope, $http) {
  $scope.message = "This page will be used to display Accordion form";
}]);*/
        
mainController.controller('accordionController',  ['$scope', function($scope, $http) {
	        var accordion = {};
	        $scope.toggleAccordion = function(section) {
    		$scope.accordion[section] = !$scope.accordion[section];
}

  //$scope.message = "This page will be used to display Accordion form";
}]);


        