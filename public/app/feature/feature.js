/**
 * Created by Administrator on 2014/8/14.
 */
var app=angular.module("gcgl2016.feature",[]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('activity.createFeature', {
            url: "/createFeature",
            views: {
                'main@': {
                    templateUrl: "app/feature/createFeature.html",
                    resolve: {
                    },
                    controller: function ($scope,$state,FeatureService) {
                        $scope.feature = {};
                        $scope.create=function(){
                            FeatureService.create($scope.feature);
                            $state.go("activity",{},{reload:true});
                        }
                    }
                }
            },
            data: {
                displayName: 'Create Feature'
            }
        });
});

app.factory('FeatureService', function(f,$q) {

    var ref = f.ref("/feature");
    var refLoad = $q.defer();
    ref.$on("loaded",function(){
        refLoad.resolve(ref);
    });
    //Public Method
    var service = {
        create: function(item) {
            return ref.$add(item);
        },
        remove: function(key){
            return ref.$remove(key);
        },
        update:function(key,value){
            var obj={};
            obj[key]=value;
            return ref.$update(obj);
        },
        find:function(key){
            var promise=refLoad.promise.then(function(){
                return f.copy(ref[key]);
            });
            return promise;
        },
        list: function(){
            return refLoad.promise.then(function(items){
                return f.copyList(items);
            });
        }
    };
    return service;
});