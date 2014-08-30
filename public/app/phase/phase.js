/**
 * Created by Administrator on 2014/7/23.
 */
var app=angular.module("gcgl2016.phase",['gcgl2016.firebase','ngGrid']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('activity.createPhase',{
            url:"/createPhase",
            views:{
                'main@':{
                    templateUrl:"app/phase/createPhase.html",
                    resolve:{
                        activityList:function(ActivityService){
                            return ActivityService.list();
                        }
                    },
                    controller:function($scope,$state,PhaseService,activityList,f){
                        $scope.phase={};
                        $scope.activityList= f.embedIdsObj(activityList);
                        $scope.selectedItems=[];
                        $scope.gridOptions = {
                            data: 'activityList',
                            selectedItems:$scope.selectedItems,
                            columnDefs: [{field:'name', displayName:'Name'}]
                        };
                        $scope.create=function(){
                            $scope.phase.activities=f.toIds($scope.selectedItems);
                            console.log($scope.phase);
                            PhaseService.create($scope.phase);
                            $state.go("activity",{},{reload:true});
                        };
                    }
                }
            },
            data: {
                displayName: 'Create Phase'
            }
        })
        .state('activity.editPhase',{
            url:"/editPhase/:id",
            views:{
                'main@':{
                    templateUrl:"app/phase/editPhase.html",
                    resolve:{
                        activityList:function(ActivityService){
                            return ActivityService.list();
                        },
                        phase:function(PhaseService,$stateParams){
                            return PhaseService.find($stateParams.id);
                        }
                    },
                    controller:function($scope,$state,$stateParams,PhaseService,activityList,phase,f){
                        $scope.phase=phase;
                        $scope.activityList= f.embedIdsObj(activityList);
                        $scope.selectedItems=[];
                        $scope.gridOptions = {
                            data: 'activityList',
                            selectedItems:$scope.selectedItems,
                            columnDefs: [{field:'name', displayName:'Name'}]
                        };
                        $scope.$on('ngGridEventData', function(){
                            _.each($scope.activityList,function(activityContent,index){
                                if(_.contains($scope.phase.activities,activityContent.id)){
                                    $scope.gridOptions.selectItem(index, true);
                                }
                            });
                        });
                        $scope.save=function(){
                            $scope.phase.activities=f.toIds($scope.selectedItems);
                            PhaseService.update($stateParams.id,$scope.phase);
                            $state.go("activity",{},{reload:true});
                        };
                    }
                }
            },
            data: {
                displayName: 'Edit Phase'
            }
        });
});

app.factory('PhaseService', function(f,$q) {

    var ref = f.ref("/phase");
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
        },
        listWithActivities:function(activityList){
            return list.$loaded().then(function(items){
                var phases=f.copyList(items);
                _.each(phases,function(content,id){
                    content.activities= f.extend(content.activities,activityList);
                });
                return phases;
            });
        }
    };
    return service;
});
