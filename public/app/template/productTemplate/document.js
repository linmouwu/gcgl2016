/**
 * Created by Administrator on 2014/9/27.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.document', {
            url: "/document/:productId",
            templateUrl: "app/template/productTemplate/document.html",
            resolve:{
                product:function($stateParams,productListRef){
                    return productListRef.$getRecord($stateParams.productId);
                }
            },
            controller: function ($scope,product) {
                $scope.product=product;
            }
        });
});