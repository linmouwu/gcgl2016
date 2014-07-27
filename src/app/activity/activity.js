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
                        },
                        phaseList:function(PhaseService,activityList){
                            return PhaseService.listWithActivities(activityList);
                        },
                        lifecycleList:function(LifecycleService,phaseList){
                            return LifecycleService.listWithPhases(phaseList);
                        }
                    },
                    controller:function($scope,ActivityService,PhaseService,LifecycleService,activityList,phaseList,lifecycleList,$state,$stateParams,f){
                        $scope.activityList=activityList;
                        $scope.phaseList={};
                        _.each(phaseList,function(phaseContent,id){
                            var phaseContentCopy= f.copy(phaseContent);
                            phaseContentCopy.activities= f.arrayToString(phaseContent.activities,"name");
                            $scope.phaseList[id]=phaseContentCopy;
                        });
                        $scope.lifecycleList={};
                        _.each(lifecycleList,function(lifecycleContent,id){
                            var lifecycleContentCopy= f.copy(lifecycleContent);
                            lifecycleContentCopy.phases= f.arrayToString(lifecycleContent.phases,"name");
                            $scope.lifecycleList[id]=lifecycleContentCopy;
                        });
                        $scope.remove=function(key){
                            ActivityService.remove(key);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        };
                        $scope.removePhase=function(key){
                            PhaseService.remove(key);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        };
                        $scope.removeLifecycle=function(key){
                            LifecycleService.remove(key);
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
                        $scope.removeStep=function(){

                        };
                        $scope.addStep=function(){
                            if(_.isUndefined($scope.activity.steps)){
                                $scope.activity.steps=[{}];
                            }
                            else{
                                $scope.activity.steps.push({});
                            }
                        };
                    }
                }
            },
            data: {
                displayName: 'Create Activity'
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
                        $scope.removeStep=function(step){
                            $scope.activity.steps=_.without($scope.activity.steps,step);
                        };
                        $scope.addStep=function(){
                            if(_.isUndefined($scope.activity.steps)){
                                $scope.activity.steps=[{}];
                            }
                            else{
                                $scope.activity.steps.push({});
                            }
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
        }
    };
    return activityService;
});
