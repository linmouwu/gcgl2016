/**
 * Created by Administrator on 14-3-17.
 */
var app=angular.module("gcgl2016");
app.controller('ListController',function($scope,$firebase){
    var usersRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/people");
    $scope.users = $firebase(usersRef);
});
app.controller('CreateController',function($scope,$firebase){
    var usersRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/people");
    $scope.users = $firebase(usersRef);
    $scope.user={};
    $scope.create = function() {
        // AngularFire $add method
        $scope.users.$add({"user":$scope.user});
        $scope.user = {};
        $scope.message="create success!";
    };
});

app.controller('LoginController',function($scope){
    $scope.fields = [
        {placeholder: 'Username', isRequired: true},
        {placeholder: 'Password', isRequired: true},
        {placeholder: 'Email (optional)', isRequired: false}
    ];

    $scope.submitForm = function(){
        alert("it works!");
    };
});
app.controller('ProcessController',function($scope,$firebase,$modal,$log){
    var processesRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/process");
    $scope.processes = $firebase(processesRef);
    $scope.process={fathers:[],previous:[]};
    $scope.remove = function(key){
        $scope.processes.$remove(key);
    };
    $scope.create = function(){
        $scope.processes.$add($scope.process).then(function(){
            $scope.process={};
        });

    };
    $scope.newFather = {key:null};
    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'processModalContent.html',
            controller: 'ProcessModalController',
            scope:$scope
        });

        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.addFather=function(){
        $log.info("new father is "+$scope.newFather.key);
        $scope.process.fathers.push($scope.newFather.key);
        $scope.newFather={};
    };
});
app.controller('ProcessModalController',function ($scope, $modalInstance) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('ProductController',function($scope,$firebase,$modal,$log){
    var productsRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/product");
    $scope.products = $firebase(productsRef);
    $scope.product={items:[]};
    $scope.newItem={};
    $scope.remove = function(key){
        $scope.products.$remove(key);
    };
    $scope.create = function(){
        $scope.products.$add($scope.product).then(function(){
            $scope.product={};
        });
    };
    $scope.addItem=function(){
        $scope.product.items.push($scope.newItem);
        $scope.newItem={};
    };
    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'productModalContent.html',
            controller: 'ProductModalController',
            scope:$scope
        });

        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});
app.controller('ProductModalController',function ($scope, $modalInstance) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});