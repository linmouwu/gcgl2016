/**
 * Created by Administrator on 2014/7/23.
 */
var app=angular.module("gcgl2016.lifecycle",['gcgl2016.firebase','ngGrid']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('activity.createLifecycle',{
            url:"/createLifecycle",
            views:{
                'main@':{
                    templateUrl:"lifecycle/createLifecycle.html",
                    resolve:{
                        phaseList:function(PhaseService){
                            return PhaseService.list();
                        }
                    },
                    controller:function($scope,$state,LifecycleService,phaseList,f){
                        $scope.lifecycle={};
                        $scope.phaseList= f.embedIdsObj(phaseList);
                        $scope.selectedItems=[];
                        $scope.gridOptions = {
                            data: 'phaseList',
                            selectedItems:$scope.selectedItems,
                            columnDefs: [{field:'name', displayName:'Name'}]
                        };
                        $scope.create=function(){
                            $scope.lifecycle.phases=f.toIds($scope.selectedItems);
                            LifecycleService.create($scope.lifecycle);
                            $state.go("activity",{},{reload:true});
                        };
                    }
                }
            },
            data: {
                displayName: 'Create Lifecycle'
            }
        })
        .state('activity.editLifecycle',{
            url:"/editLifecycle/:id",
            views:{
                'main@':{
                    templateUrl:"lifecycle/editLifecycle.html",
                    resolve:{
                        phaseList:function(PhaseService){
                            return PhaseService.list();
                        },
                        lifecycle:function(LifecycleService,$stateParams){
                            return LifecycleService.find($stateParams.id);
                        }
                    },
                    controller:function($scope,$state,$stateParams,LifecycleService,phaseList,lifecycle,f){
                        $scope.lifecycle=lifecycle;
                        $scope.phaseList= f.embedIdsObj(phaseList);
                        $scope.selectedItems=[];
                        $scope.gridOptions = {
                            data: 'phaseList',
                            selectedItems:$scope.selectedItems,
                            columnDefs: [{field:'name', displayName:'Name'}]
                        };
                        $scope.$on('ngGridEventData', function(){
                            _.each($scope.phaseList,function(phaseContent,index){
                                if(_.contains($scope.lifecycle.phases,phaseContent.id)){
                                    $scope.gridOptions.selectItem(index, true);
                                }
                            });
                        });
                        $scope.save=function(){
                            $scope.lifecycle.phases=f.toIds($scope.selectedItems);
                            LifecycleService.update($stateParams.id,$scope.lifecycle);
                            $state.go("activity",{},{reload:true});
                        };
                    }
                }
            },
            data: {
                displayName: 'Edit Lifecycle'
            }
        });
});

app.factory('LifecycleService', function(f,$q) {

    var ref = f.ref("/lifecycle");
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
        },
        listWithPhases:function(phaseList){
            return refLoad.promise.then(function(items){
                var lifecycles=f.copyList(items);
                _.each(lifecycles,function(content,id){
                    content.phases= f.extend(content.phases,phaseList);
                });
                return lifecycles;
            });


        }
    };
    return service;
});
