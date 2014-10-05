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
        })
        .state('activity.editTag', {
            url: "/editTag/:id",
            templateUrl: "app/tag/editTag.html",
            resolve: {
                tag:function(tagListRef,$stateParams){
                    return tagListRef.$getRecord($stateParams.id);
                }
            },
            controller: function ($scope,$state,f,tag,TagService,tagListRef) {
                $scope.tag = f.copy(tag);
                $scope.save=function(item){
                    TagService.save(tagListRef,tag,item).then(function(){
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
        },
        save:function(refs,oldItem,newItem){
            if(_.isUndefined(refs)||!refs.hasOwnProperty('$save')){
                return;
            }
            var keys=[
                'name',
                'description'
            ];
            _.each(keys,function(key){
                if(_.isUndefined(newItem[key])){
                    oldItem[key]=null;
                }
                else{
                    oldItem[key]=newItem[key];
                }
            });
            return refs.$save(oldItem);
        }
    };
    return service;
});