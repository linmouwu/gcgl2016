/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('user', {
            url: "/user",
            views:{
                'main@':{
                    templateUrl: "app/user/user.html",
                    controller:"UserController",
                    resolve:{
                        userList:function(UserService){
                            return UserService.list();
                        }
                    }
                }
            }
        })
        .state('user.create', {
            url: "/user/create",
            views:{
                'main@':{
                    templateUrl: "app/user/createUser.html",
                    controller:"CreateUserController"
                }
            }
        });
});
app.factory('UserService', function(firebaseService,$q) {
    var userRef = firebaseService.ref("/user");
    var userRefLoad=$q.defer();
    userRef.$on("loaded",function(){
        userRefLoad.resolve(userRef);
    });


    //Public Method
    var userService = {
        create: function(user) {
            return userRef.$add(user);
        },
        list: function(){
            return userRefLoad.promise;
        },
        remove: function(key){
            return userRef.$remove(key);
        }
    };
    return userService;
});

app.controller("UserController",function($scope,UserService,userList){
    $scope.userList=userList;
    $scope.remove=function(key){
        UserService.remove(key).then(function(){
            console.log("UserController:Remove Successful");
        },function(){
            console.log("UserController:Remove failed");
        })
    }

});
app.controller("CreateUserController",function($scope,$state,UserService){
    $scope.user={};
    $scope.create=function(){
        UserService.create($scope.user).then(function(){
            console.log("CreateUserController:Create Success");
            $state.go("^");
        },function(){
            console.log("CreateUserController:Create Failed");
        })
    }
});