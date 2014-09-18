/**
 * Created by Administrator on 9/16/2014.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.activityDefault', {
            url: "/activityDefault",
            templateUrl: "app/template/activityTemplate/activityDefault.html",
            controller: function ($scope,$stateParams) {
                console.log($stateParams);
                $scope.message="hello world";
            }
        })
        .state('main.project.activity.activityDefault2', {
            url: "/activityDefault2",
            templateUrl: "app/template/activityTemplate/activityDefault.html",
            resolve: {
            },
            controller: function ($scope) {
                $scope.message="hello world";
            }
        });
});