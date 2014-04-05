/**
 * Created by Administrator on 14-3-17.
 */
var app=angular.module("myApp");
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