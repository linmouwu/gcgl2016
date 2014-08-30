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