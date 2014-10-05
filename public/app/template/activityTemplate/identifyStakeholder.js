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




                $scope.propertyDetail=[];
                $scope.input={};
                $scope.$watch("input",function(newVal,oldVal){
                    $scope.inputProperties
                })
                $scope.showInputProperties=function(input){
                    $scope.input=input;
                };
                $scope.showPropertyDetail=function(which,property){
                    $scope.propertyDetail=$scope[property];
                };
                $scope.importToData=function(property){
                    $scope.data=$scope.data.concat($scope.input[property]);
                };
                //var of core
                $scope.data=[];
                $scope.remove=function(index){
                    $scope.data.splice(index,1);
                };
                $scope.add=function(name){
                    $scope.data.push({stakeholderName:name});
                    name="";
                };
                //var of output

                $scope.output={};
                $scope.showOutputProperties=function(output){
                    $scope.output=output;
                };
                $scope.importToData=function(property){
                    $scope.output[property]=$scope.data;
                };
            }
        });
});