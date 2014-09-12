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
            controller: function ($scope,$state,f,FeatureService,featureListRef) {
                $scope.feature = {};
                $scope.create=function(){
                    f.add(featureListRef,$scope.feature).then(function(){
                        $state.go("activity",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Create Feature'
            }
        });
});

app.factory('FeatureService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref("/feature").$asArray().$loaded();
        }
    };
    return service;
});