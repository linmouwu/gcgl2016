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
                    tagList:function(TagService){
                        return TagService.list();
                    },
                    featureList:function(FeatureService){
                        return FeatureService.list();
                    },
                    productList:function(ProductService){
                        return ProductService.list();
                    },
                    activityList:function(ActivityService,featureList,tagList,productList){
                        return ActivityService.listWithFeatureAndTagAndInputsAndOutputs(featureList,tagList,productList);
                    }
            },
            controller:function($scope,ActivityService,FeatureService,activityList,TagService,featureList,tagList,$state,$stateParams,f){
                $scope.featureList=featureList;
                $scope.tagList=tagList;
                $scope.activityList=activityList;
//                        //
//                        angular.forEach($scope.activityList,function(activity){
//                            activity.features= f.arrayToString(f.extend(activity.features,featureList),"name");
//                            activity.tags= f.arrayToString(f.extend(activity.tags,tagList),"name");
//                        });
                $scope.removeActivity=function(key){
                    ActivityService.remove(key).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.removeFeature=function(key){
                    FeatureService.remove(key).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.removeTag=function(key){
                    TagService.remove(key).then(function(){
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
            controller:function($scope,$state,$modal,ActivityService,f){
                $scope.activity={};
                $scope.create=function(){
                    $scope.activity.features= f.toIds($scope.activity.features);
                    $scope.activity.tags= f.toIds($scope.activity.tags);
                    $scope.activity.inputs= f.toIds($scope.activity.inputs);
                    $scope.activity.outputs= f.toIds($scope.activity.outputs);
                    ActivityService.create($scope.activity).then(function(){
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
                $scope.addStep=function(){
                    if(_.isUndefined($scope.activity.steps)){
                        $scope.activity.steps=[{}];
                    }
                    else{
                        $scope.activity.steps.push({});
                    }
                };

                $scope.addFeature = function () {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addFeature.tpls.html',
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
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
                            $scope.active={};
                            $scope.select=function(item){
                                $scope.active=item;
                            };
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
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.addTag = function () {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addTag.tpls.html',
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.active={};
                            $scope.selected = {
                                item: $scope.items[0]
                            };

                            $scope.ok = function () {
                                $modalInstance.close($scope.active);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.active=item;
                            };
                        },
                        size:'lg',
                        resolve: {
                            items: function (TagService) {
                                return TagService.list();
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(!angular.isDefined($scope.activity.tags)){
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
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.active={};
                            $scope.selected = {
                                item: $scope.items[0]
                            };

                            $scope.ok = function () {
                                $modalInstance.close($scope.active);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.active=item;
                            };
                        },
                        size:'lg',
                        resolve: {
                            items: function (ProductService) {
                                return ProductService.list();
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(!angular.isDefined($scope.activity.inputs)){
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
                        controller:function ($scope, $modalInstance, items) {
                            $scope.search="";
                            $scope.items = items;
                            $scope.active={};
                            $scope.selected = {
                                item: $scope.items[0]
                            };

                            $scope.ok = function () {
                                $modalInstance.close($scope.active);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.active=item;
                            };
                        },
                        size:'lg',
                        resolve: {
                            items: function (ProductService) {
                                return ProductService.list();
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        if(!angular.isDefined($scope.activity.outputs)){
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

    var ref = f.ref("/activity");
    var list=ref.$asArray();
    //Public Method
    var service = {
        create: function(item) {
            return list.$add(item);
        },
        remove: function(key){
            return list.$remove(key);
        },
        update:function(item){
            return list.$save(item);
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
        listWithFeatureAndTagAndInputsAndOutputs:function(featureList,tagList,productList){
            return list.$loaded().then(function(){
                return _.map(f.copy(list),function(activity){
                    activity.features= f.arrayToString(f.extend(activity.features,featureList),"name");
                    activity.tags= f.arrayToString(f.extend(activity.tags,tagList),"name");
                    activity.inputs= f.arrayToString(f.extend(activity.inputs,productList),"name");
                    activity.outputs= f.arrayToString(f.extend(activity.outputs,productList),"name");
                    return activity;
                });
            });
        }
    };
    return service;
});
