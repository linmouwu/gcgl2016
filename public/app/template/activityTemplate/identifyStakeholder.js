/**
 * Created by Administrator on 9/16/2014.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.identifyStakeholder', {
            url: "/identifyStakeholder",
            templateUrl: "app/template/activityTemplate/identifyStakeholder.html",
            controller: function ($scope,ExeProjectService,productListRef,activityWithProducts) {
                $scope.oneAtATime=true;
                $scope.activityWithProducts=activityWithProducts;
                $scope.status = {
                    isFirstOpen: true
                };

                //var of input
                $scope.jsonInputs= _.filter(activityWithProducts.inputs,function(item){
                    return item.type=='json';
                });
                $scope.fileInputs= _.filter(activityWithProducts.inputs,function(item){
                    return item.type=='file';
                });
                $scope.status.input={};
                $scope.status.inputProperty=""
                $scope.$watch('status.input',function(){
                    $scope.status.inputProperty=""
                });
                $scope.import=function(){
                    $scope.data=$scope.data.concat($scope.status.input.data[$scope.status.inputProperty]);
                };

                //var of output
                $scope.jsonOutputs= _.filter(activityWithProducts.outputs,function(item){
                    return item.type=='json';
                });
                $scope.fileOutputs= _.filter(activityWithProducts.outputs,function(item){
                    return item.type=='file';
                });
                $scope.status.output={};
                $scope.status.outputProperty=""
                $scope.$watch('status.output',function(){
                    $scope.status.outputProperty=""
                });
                $scope.export=function(){
                    $scope.status.output.data[$scope.status.outputProperty]=$scope.data;
                    ExeProjectService.saveProductData(productListRef,productListRef.$getRecord($scope.status.output.$id),$scope.status.output.data[$scope.status.outputProperty]);
                };


                //var of core
                $scope.data=[];
                $scope.remove=function(index){
                    $scope.data.splice(index,1);
                };
                $scope.add=function(){
                    $scope.data.push({stakeholderName:$scope.status.newStakeholderName});
                    $scope.status.newStakeholderName="";
                };
            }
        });
});