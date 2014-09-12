/**
 * Created by Administrator on 2014/8/14.
 */
var app=angular.module("gcgl2016.tag",[]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('activity.createTag', {
            url: "/createTag",
            templateUrl: "app/tag/createTag.html",
            resolve: {
            },
            controller: function ($scope,$state,f,TagService,tagListRef) {
                $scope.tag = {};
                $scope.create=function(){
                    f.add(tagListRef,$scope.tag).then(function(){
                        $state.go("activity",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Create Tag'
            }
        });
});

app.factory('TagService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref("/tag").$asArray().$loaded();
        }
    };
    return service;
});