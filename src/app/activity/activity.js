/**
 * Created by Administrator on 2014/7/23.
 */
var app=angular.module("gcgl2016.activity",['gcgl2016.firebase','ngGrid']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('activity',{
            url:"/activity",
            views:{
                'main@':{
                    templateUrl:"activity/activity.html",
                    resolve:{
                        activityList:function(ActivityService){
                            return ActivityService.list();
                        }
                    },
                    controller:function($scope,ActivityService,activityList,$state,$stateParams){
                        $scope.activityList=activityList;
                        $scope.remove=function(key){
                            ActivityService.remove(key);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        };
                    }
                }
            },
            data: {
                displayName: 'Process Management'
            }
        })
        .state('activity.create',{
            url:"/create",
            views:{
                'main@':{
                    templateUrl:"activity/createActivity.html",
                    controller:function($scope,$state,ActivityService){
                        $scope.activity={};
                        $scope.create=function(){
                            ActivityService.create($scope.activity);
                            $state.go("^",{},{reload:true});
                        };
                    }
                }
            },
            data: {
                displayName: 'Create Activity'
            }
        })
        .state('activity.createPhase',{
            url:"/createPhase",
            views:{
                'main@':{
                    templateUrl:"activity/createPhase.html",
                    resolve:{
                        activityList:function(ActivityService){
                            return ActivityService.list();
                        }
                    },
                    controller:function($scope,$state,ActivityService,activityList,f){
                        $scope.phase={};
                        $scope.create=function(){
                            ActivityService.createPhase($scope.phase);
                            $state.go("^",{},{reload:true});
                        };
                        $scope.activitList= f.embedIdsObj(activityList);
                        $scope.selectedItems=[];
                        $scope.gridOptions = {
                            data: 'activitList',
                            selectedItems:$scope.selectedItems,
                            columnDefs: [{field:'name', displayName:'Name'}]
                        };
                    }
                }
            },
            data: {
                displayName: 'Create Phase'
            }
        })
        .state('activity.edit', {
            url: "/edit/:id",
            views:{
                'main@':{
                    templateUrl: "activity/editActivity.html",
                    resolve:{
                        activity:function(ActivityService,$stateParams){
                            return ActivityService.find($stateParams.id);
                        }
                    },
                    controller:function($scope,$stateParams,$state,activity,ActivityService){
                        $scope.activity=activity;
                        $scope.save=function(){
                            ActivityService.update($stateParams.id,$scope.activity);
                            $state.go("^",{},{reload:true});
                        };
                    }
                }
            }
        });
});

app.factory('ActivityService', function(f,$q) {

    var ref = f.ref("/activity");
    var refLoad = $q.defer();
    ref.$on("loaded",function(){
        refLoad.resolve(ref);
    });
    //Public Method
    var activityService = {
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
        },
        createPhase:function(item){
            return ;
        }
    };
    return activityService;
});
