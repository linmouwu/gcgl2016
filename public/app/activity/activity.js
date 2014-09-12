/**
 * Created by Administrator on 2014/7/23.
 */
var app=angular.module("gcgl2016.activity",['gcgl2016.firebase','ngGrid']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('activity',{
            url:"/activity",
            templateUrl:"app/activity/activity.html",
            resolve:{
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
                tagListRef:function(TagService){
                    return TagService.getRefArray();
                },
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                activityListWithFull:function(ActivityService,activityListRef,featureListRef,tagListRef,productListRef){
                    return ActivityService.listWithFeatureAndTagAndInputsAndOutputs(activityListRef,featureListRef,tagListRef,productListRef);
                }
            },
            controller:function($scope,ActivityService,FeatureService,activityListWithFull,TagService,activityListRef,featureListRef,tagListRef,$state,$stateParams,f){
                $scope.featureList= f.copy(featureListRef);
                $scope.tagList= f.copy(tagListRef);
                $scope.activityList= activityListWithFull;
                $scope.removeActivity=function(item){
                    f.remove(activityListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.removeFeature=function(item){
                    f.remove(featureListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.removeTag=function(item){
                    f.remove(item,tagListRef).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
            },
            data: {
                displayName: 'Process Management'
            }
        })
        .state('activity.create',{
            url:"/create",
            templateUrl:"app/activity/createActivity.html",
            resolve:{},
            controller:function($scope,$state,$modal,ActivityService,activityListRef,f){
                $scope.activity={};
                $scope.create=function(){
                    $scope.activity.features= f.toIds($scope.activity.features);
                    $scope.activity.tags= f.toIds($scope.activity.tags);
                    $scope.activity.inputs= f.toIds($scope.activity.inputs);
                    $scope.activity.outputs= f.toIds($scope.activity.outputs);
                    f.add(activityListRef,$scope.activity).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
                $scope.removeFeature=function(item){
                    $scope.activity.features= _.filter($scope.activity.features,function(feature){
                        if(feature===item){
                            return false;
                        }
                        return true;
                    });
                };
                $scope.removeTag=function(item){
                    $scope.activity.tags= _.filter($scope.activity.tags,function(tag){
                        if(tag===item){
                            return false;
                        }
                        return true;
                    });
                };
                $scope.removeInput=function(item){
                    $scope.activity.inputs= _.filter($scope.activity.inputs,function(input){
                        if(input===item){
                            return false;
                        }
                        return true;
                    });
                };
                $scope.removeOutput=function(item){
                    $scope.activity.outputs= _.filter($scope.activity.outputs,function(output){
                        if(output===item){
                            return false;
                        }
                        return true;
                    });
                };
                $scope.addFeature = function () {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addFeature.tpls.html',
                        resolve: {
                            items:function(FeatureService){
                                return f.copy(FeatureService.getRefArray());
                            }
                        },
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(_.isUndefined($scope.activity.features)){
                            $scope.activity.features=[];
                        }
                        $scope.activity.features.push(selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.addTag = function () {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addTag.tpls.html',
                        resolve: {
                            items: function (TagService) {
                                return f.copy(TagService.getRefArray());
                            }
                        },
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(_.isUndefined($scope.activity.tags)){
                            $scope.activity.tags=[];
                        }
                        $scope.activity.tags.push(selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.addInput = function () {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addInput.tpls.html',
                        resolve: {
                            items: function (ProductService) {
                                return f.copy(ProductService.getRefArray());
                            }
                        },
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(_.isUndefined($scope.activity.inputs)){
                            $scope.activity.inputs=[];
                        }
                        $scope.activity.inputs.push(selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.addOutput = function () {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addOutput.tpls.html',
                        resolve: {
                            items: function (ProductService) {
                                return f.copy(ProductService.getRefArray());
                            }
                        },
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(_.isUndefined($scope.activity.outputs)){
                            $scope.activity.outputs=[];
                        }
                        $scope.activity.outputs.push(selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
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
                        };
                    }
                }
            }
        });
});

app.factory('ActivityService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref("/activity").$asArray().$loaded();
        },
        listWithFeatureAndTagAndInputsAndOutputs:function(activityListRef,featureListRef,tagListRef,productList){
            return _.map(f.copy(activityListRef),function(activity){
                activity.features= f.arrayToString(f.extend(activity.features,featureListRef),"name");
                activity.tags= f.arrayToString(f.extend(activity.tags,tagListRef),"name");
                activity.inputs= f.arrayToString(f.extend(activity.inputs,productList),"name");
                activity.outputs= f.arrayToString(f.extend(activity.outputs,productList),"name");
                return activity;
            });
        }
    };
    return service;
});
