/**
 * Created by Administrator on 2014/8/14.
 */
var app=angular.module("gcgl2016.tag",[]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('activity.createTag', {
            url: "/createTag",
            views: {
                'main@': {
                    templateUrl: "app/tag/createTag.html",
                    resolve: {
                    },
                    controller: function ($scope,$state,TagService) {
                        $scope.tag = {};
                        $scope.create=function(){
                            TagService.create($scope.tag);
                            $state.go("activity",{},{reload:true});
                        }
                    }
                }
            },
            data: {
                displayName: 'Create Tag'
            }
        });
});

app.factory('TagService', function(f,$q) {

    var ref = f.ref("/tag");
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