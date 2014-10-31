/**
 * Created by Administrator on 2014/8/14.
 */
var app=angular.module("gcgl2016.feature",[]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('feature',{
            url:"/feature",
            templateUrl:"app/feature/feature.html",
            resolve:{
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                }
            },
            controller:function($scope,$state,$stateParams,f,featureListRef){
                $scope.featureList=featureListRef;
                $scope.remove=function(item){
                    f.remove(featureListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };

            }
        })
        .state('feature.create', {
            url: "/create",
            templateUrl: "app/feature/createFeature.html",
            resolve: {
            },
            controller: function ($scope,$state,f,FeatureService,featureListRef) {
                $scope.feature = {};
                $scope.create=function(){
                    f.add(featureListRef,$scope.feature).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Create Feature'
            }
        })
        .state('feature.edit', {
            url: "/edit/:id",
            templateUrl: "app/feature/editFeature.html",
            resolve: {
                feature:function(featureListRef,$stateParams){
                    return featureListRef.$getRecord($stateParams.id);
                }
            },
            controller: function ($scope,$state,f,feature,FeatureService,featureListRef) {
                $scope.feature = f.copy(feature);
                $scope.save=function(item){
                    FeatureService.save(featureListRef,feature,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Edit Feature'
            }
        });
});

app.factory('FeatureService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref("/feature").$asArray().$loaded();
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