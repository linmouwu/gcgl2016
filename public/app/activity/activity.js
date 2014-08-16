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
                    templateUrl:"app/activity/activity.html",
                    resolve:{
                        activityList:function(ActivityService){
                            return ActivityService.list();
                        },
                        phaseList:function(PhaseService,activityList){
                            return PhaseService.listWithActivities(activityList);
                        },
                        lifecycleList:function(LifecycleService,phaseList){
                            return LifecycleService.listWithPhases(phaseList);
                        },
                        tagList:function(TagService){
                            return TagService.list();
                        },
                        featureList:function(FeatureService){
                            return FeatureService.list();
                        }
                    },
                    controller:function($scope,ActivityService,PhaseService,LifecycleService,activityList,phaseList,lifecycleList,featureList,tagList,$state,$stateParams,f){
                        $scope.featureList=featureList;
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
                        $scope.tagList=tagList;
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
                    templateUrl:"app/activity/createActivity.html",
                    controller:function($scope,$state,$modal,ActivityService){
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

                        $scope.addFeature = function (size) {

                            var modalInstance = $modal.open({
                                templateUrl: 'app/activity/addFeature.tpls.html',
                                controller:function ($scope, $modalInstance, items) {
                                    $scope.search="",
                                    $scope.items = items;
                                    $scope.selected = {
                                        item: $scope.items[0]
                                    };

                                    $scope.ok = function () {
                                        $modalInstance.close($scope.active);
                                    };

                                    $scope.cancel = function () {
                                        $modalInstance.dismiss('cancel');
                                    };
                                    $scope.active;
                                    $scope.select=function(index){
                                        $scope.active=index;
                                    }
                                },
                                size:'lg',
                                resolve: {
                                    items: function (FeatureService) {
                                        return FeatureService.list();
                                    }
                                }
                            });

                            modalInstance.result.then(function (selectedItem) {
                                if(!angular.isDefined($scope.activity.features)){
                                    $scope.activity.features=[];
                                }
                                $scope.activity.features.push(selectedItem);
                            }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });
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
                    templateUrl: "app/activity/editActivity.html",
                    resolve:{
                        activity:function(ActivityService,$stateParams){
                            return ActivityService.find($stateParams.id);
                        }
                    },
                    controller:function($scope,$stateParams,$state,$modal,activity,ActivityService){
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
                        $scope.deleteInput=function(index){
                            $scope.activity.inputs.splice(index,1);
                        };
                        $scope.deleteOutput=function(index){
                            $scope.activity.outputs.splice(index,1);
                        };
                        $scope.addProduct=function(type){
                            var modalInstance = $modal.open({
                                templateUrl: 'app/activity/selectProduct.tpls.html',
                                controller: function ($scope, $modalInstance, productList) {
                                    $scope.productList=productList;
                                    $scope.select=function(key,pro){
                                        pro.id=key;
                                        $modalInstance.close(pro);
                                    };

                                    $scope.cancel = function () {
                                        $modalInstance.dismiss('cancel');
                                    };
                                },
                                size: 'lg',
                                resolve: {
                                    productList:function(ProductService){
                                        return ProductService.list();
                                    }
                                }
                            });

                            modalInstance.result.then(function (selectedItem) {
                                if(_.isUndefined($scope.activity[type])){
                                    $scope.activity[type]=[];
                                }
                                $scope.activity[type].push(selectedItem);
                            }, function () {
                                console.log('Modal dismissed at: ' + new Date());
                            });
                        }
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
