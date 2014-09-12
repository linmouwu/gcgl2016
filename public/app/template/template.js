/**
 * Created by Administrator on 2014/7/15.
 */

var app=angular.module("gcgl2016.template",[]);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('template', {
            url: "/template",
            templateUrl: "app/template/template.html",
            resolve:{
            },
            controller:function($scope){
            }
        })
        .state('template.activity', {
            url: "/activity",
            templateUrl: "app/template/activityTemplate.html",
            resolve:{
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                activityWithFeature:function(activityListRef,featureListRef,f){
                    return _.map(f.copy(activityListRef),function(activity){
                        activity.features=f.extend(activity.features,featureListRef);
                        return activity;
                    });
                }
            },
            controller:function($scope,f,activityWithFeature){
                console.log(activityWithFeature);
                $scope.activityList= activityWithFeature;
            }
        })
        .state('template.activity.template', {
            url: "/template",
            templateUrl: "app/template/activityTemplate.html",
            resolve:{
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                activityWithFeature:function(activityListRef,featureListRef,f){
                    return _.map(f.copy(activityListRef),function(activity){
                        activity.features=f.extend(activity.features,featureListRef);
                        return activity;
                    });
                }
            },
            controller:function($scope,f,activityWithFeature){
                console.log(activityWithFeature);
                $scope.activityList= activityWithFeature;
            }
        })
        .state('template.product', {
            url: "/template",
            templateUrl: "app/template/productTemplate.html",
            resolve:{
                productList:function(ProductService){
                    return ProductService.list();
                }
            },
            controller:function($scope,productList,ProductService){
                $scope.productList=productList;
                $scope.save=function(product){
                    ProductService.update(product);

                };
            }
        })
        .state('template.product.create', {
            url: "/create",
            views:{
                'main@':{
                    templateUrl: "template/createProductTemplate.html",
                    resolve:{
                    },
                    controller:function($scope,$state,f,ProductTemplateService){
                        $scope.template={};
                        $scope.types= f.getTypes();
                        console.log($scope.types);

                        $scope.save=function(){
                            ProductTemplateService.create($scope.template);
                            $state.go("^",{},{reload:'true'});
                        };
                    }
                }
            }
        });
});
app.factory('TemplateService', function(f,$q) {
    //Public Method
    var productService = {
        getRefArray:function(type){
            if(type==="activity"){
                return f.ref("/template/activity");
            }
            if(type==="product"){
                return f.ref("/template/product");
            }
        },
        create: function(product) {
            return ref.$add(product);
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
            return refLoad.promise.then(function(data){
                return f.copyList(data);
            });
        }
    };
    return productService;
});
