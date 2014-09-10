/**
 * Created by Administrator on 2014/8/14.
 */
var app=angular.module("gcgl2016.feature",[]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('activity.createFeature', {
            url: "/createFeature",
            templateUrl: "app/feature/createFeature.html",
            resolve: {
            },
            controller: function ($scope,$state,FeatureService) {
                $scope.feature = {};
                $scope.create=function(){
                    FeatureService.create($scope.feature);
                    $state.go("activity",{},{reload:true});
                }
            },
            data: {
                displayName: 'Create Feature'
            }
        });
});

app.factory('FeatureService', function(f,$q) {

    var ref = f.ref("/feature");
    var list=ref.$asArray();
    //Public Method
    var service = {
        create: function(item) {
            return list.$add(item);
        },
        remove: function(key){
            return list.$remove(key);
        },
        update:function(key,value){
            var obj={};
            obj[key]=value;
            return list.$save(obj);
        },
        find:function(key){
            return list.$loaded().then(function(){
                return f.copy(list.$getRecord(key));
            });
        },
        list: function(){
            return list.$loaded().then(function(){
                return list;
            });
        }
    };
    return service;
});