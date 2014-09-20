/**
 * Created by Administrator on 2014/9/20.
 */

var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.productDefault', {
            url: "/productDefault/:productId",
            templateUrl: "app/template/productTemplate/productDefault.html",
            resolve:{
                product:function($stateParams,productListRef){
                    return productListRef.$getRecord($stateParam.productId);
                }
            },
            controller: function ($scope,$stateParams) {
                $scope.message="hello world";
            }
        });
});