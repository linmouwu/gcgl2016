/**
 * Created by Administrator on 2014/7/23.
 */
var app=angular.module("gcgl2016.activity",['gcgl2016.firebase']);

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
                    f.remove(tagListRef,item).then(function(){
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
            resolve:{
            },
            controller:function($scope,$state,$modal,featureListRef,tagListRef,productListRef,activityListRef,f){
                $scope.activity={};
                $scope.featureListRef=featureListRef;
                $scope.tagListRef=tagListRef;
                $scope.productListRef=productListRef;
                $scope.create=function(){
                    $scope.activity.features= f.toIds($scope.activity.features);
                    $scope.activity.fts= _.map($scope.activity.features,function(featureId){
                        return {feature:featureId};
                    });
                    $scope.activity.tags= f.toIds($scope.activity.tags);
                    $scope.activity.inputs= f.toIds($scope.activity.inputs);
                    $scope.activity.outputs= f.toIds($scope.activity.outputs);
                    f.add(activityListRef,$scope.activity).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
                $scope.remove=function(item,name){
                    $scope.activity[name]= _.filter($scope.activity[name],function(feature){
                        if(feature===item){
                            return false;
                        }
                        return true;
                    });
                };
                $scope.addItem = function (name,itemListRef) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addItem.tpls.html',
                        resolve: {
                        },
                        controller:function ($scope, $modalInstance) {
                            $scope.search="";
                            $scope.items = itemListRef;
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
                        if(_.isUndefined($scope.activity[name])){
                            $scope.activity[name]=[];
                        }
                        $scope.activity[name].push(selectedItem);
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
            templateUrl: "app/activity/editActivity.html",
            resolve:{
                activity:function(activityListRef,$stateParams){
                    return activityListRef.$getRecord($stateParams.id);
                }
            },
            controller:function($scope,$state,$modal,ActivityService,featureListRef,tagListRef,activityListRef,productListRef,f,activity) {
                $scope.activity = f.copy(activity);
                $scope.featureListRef=featureListRef;
                $scope.tagListRef=tagListRef;
                $scope.productListRef=productListRef;
                (function () {
                    $scope.activity.features = f.extend($scope.activity.features, featureListRef);
                    $scope.activity.tags = f.extend($scope.activity.tags, tagListRef);
                    $scope.activity.inputs = f.extend($scope.activity.inputs, productListRef);
                    $scope.activity.outputs = f.extend($scope.activity.outputs, productListRef);
                }());
                $scope.save=function(){
                    $scope.activity.features= f.toIds($scope.activity.features);
                    $scope.activity.fts= _.map($scope.activity.features,function(featureId){
                        return {feature:featureId};
                    });
                    $scope.activity.tags= f.toIds($scope.activity.tags);
                    $scope.activity.inputs= f.toIds($scope.activity.inputs);
                    $scope.activity.outputs= f.toIds($scope.activity.outputs);
                    ActivityService.save(activityListRef,activityListRef.$getRecord($scope.activity.$id),$scope.activity).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
                $scope.remove=function(item,name){
                    $scope.activity[name]= _.filter($scope.activity[name],function(feature){
                        if(feature===item){
                            return false;
                        }
                        return true;
                    });
                };
                $scope.addItem = function (name,itemListRef) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/activity/addItem.tpls.html',
                        resolve: {
                        },
                        controller:function ($scope, $modalInstance) {
                            $scope.search="";
                            $scope.items = itemListRef;
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
                        if(_.isUndefined($scope.activity[name])){
                            $scope.activity[name]=[];
                        }
                        $scope.activity[name].push(selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
            }
        });
});

app.factory('ActivityService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref("/activity").$asArray().$loaded();
        },
        getRefArrayExe:function(projectId){
            return f.ref("/project/"+projectId+"/exeActivity").$asArray().$loaded();
        },
        save:function(refs,oldItem,newItem){
            if(_.isUndefined(refs)||!refs.hasOwnProperty('$save')){
                return;
            }
            var keys=[
                'name',
                'description',
                'inputs',
                'outputs',
                'tags',
                'features',
                'fts',
                'exeTemplates'];
            _.each(keys,function(key){
                if(_.isUndefined(newItem[key])){
                    oldItem[key]=null;
                }
                else{
                    oldItem[key]=newItem[key];
                }
            });
            return refs.$save(oldItem);
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
