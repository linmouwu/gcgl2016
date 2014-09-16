/**
 * Created by Administrator on 9/16/2014.
 */
var app=angular.module("gcgl2016.template.activityDefault",[]);
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.activityDefault', {
            url: "/activityDefault",
            templateUrl: "app/template/activityTemplate/activityDefault.html",
            resolve: {
            },
            controller: function ($scope) {
                $scope.message="hello world";
            }
        });
});