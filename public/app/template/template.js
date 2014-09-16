/**
 * Created by Administrator on 2014/7/15.
 */
var app=angular.module("gcgl2016.template",[
    "gcgl2016.template.activityDefault"
]);
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
                templateListRef:function(TemplateService){
                    return TemplateService.getRefArray("activity");
                },
                activityWithFeatureAndTemplate:function(activityListRef,featureListRef,templateListRef,f){
                    return _.map(f.copy(activityListRef),function(activity){
                        _.each(activity.fts,function(ft){
                            ft.feature= f.extendSingle(ft.feature,featureListRef);
                            ft.template= f.extendSingle(ft.template,templateListRef);
                        });
                        return activity;
                    });
                },
                templateWithFeature:function(TemplateService,f,templateListRef,featureListRef){
                    return _.map(f.copy(templateListRef),function(template){
                        console.log(template);
                        template.feature=f.extendSingle(template.feature,featureListRef);
                        console.log(template);
                        return template;
                    });
                }
            },
            controller:function($scope,$state,$stateParams,f,templateListRef,activityWithFeatureAndTemplate,templateWithFeature){
                $scope.activityList= activityWithFeatureAndTemplate;
                $scope.templateList=templateWithFeature;
                $scope.choose=function(activity,feature){
                    $state.go("template.activity.feature",{activityId:activity.$id,featureId:feature.$id});
                };
                $scope.remove=function(template){
                    f.remove(templateListRef,template).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    })
                }
            }
        })
        .state('template.activity.feature', {
            url: "/:activityId/:featureId",
            templateUrl: "app/template/chooseActivityTemplate.html",
            resolve:{
                activity:function($stateParams,activityListRef){
                    return activityListRef.$getRecord($stateParams.activityId);
                },
                feature:function($stateParams,featureListRef){
                    return featureListRef.$getRecord($stateParams.featureId);
                },
                templateListFiltered:function(f,feature,templateListRef){
                    return _.filter(f.copy(templateListRef),function(template){
                        if(template.feature===feature.$id){
                            return true;
                        }
                        if(!template.feature){
                            return true;
                        }
                        return false;
                    });
                }
            },
            controller:function($scope,$state,f,activityListRef,activity,feature,templateListFiltered){
                $scope.selected={};
                $scope.select=function(item){
                    $scope.selected=item;
                };
                $scope.templateList=templateListFiltered;
                $scope.choose=function(item){
                    _.each(activity.fts,function(ft){
                        if(ft.feature===feature.$id){
                            ft.template=$scope.selected.$id;
                        }
                    });
                    f.save(activityListRef,activity).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                }
            }
        })
        .state('template.activity.template', {
            url: "/create",
            templateUrl: "app/template/createActivityTemplate.html",
            resolve:{
            },
            controller:function($scope,$state,f,templateListRef,featureListRef){
                $scope.template={};
                $scope.featureList= f.copy(featureListRef);
                $scope.add=function(){
                    f.add(templateListRef,$scope.template).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                }
            }
        })
        .state('template.product', {
            url: "/template",
            templateUrl: "app/template/productTemplate.html",
            resolve:{
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                templateListRef:function(TemplateService){
                    return TemplateService.getRefArray("product");
                },
                productListWithTemplate:function(f,productListRef,templateListRef){
                    return _.map(f.copy(productListRef),function(product){
                        product.template= f.extendSingle(product.template,templateListRef);
                        return product;
                    });
                }
            },
            controller:function($scope,$state,$stateParams,f,productListRef,productListWithTemplate,templateListRef){
                $scope.productList=productListWithTemplate;
                $scope.templateList=templateListRef;
                $scope.remove=function(template){
                    f.remove(templateListRef,template).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    })
                };
                $scope.choose=function(product){
                    $state.go("template.product.feature",{productId:product.$id});
                };
            }
        })
        .state('template.product.feature', {
            url: "/:productId",
            templateUrl: "app/template/chooseProductTemplate.html",
            resolve:{
                product:function($stateParams,productListRef){
                    return productListRef.$getRecord($stateParams.productId);
                },
                templateListFiltered:function(f,product,templateListRef){
                    return _.filter(f.copy(templateListRef),function(template){
                        if(template.type===product.type){
                            return true;
                        }
                        if(!template.type){
                            return true;
                        }
                        return false;
                    });
                }
            },
            controller:function($scope,$state,f,productListRef,product,templateListFiltered){
                $scope.selected={};
                $scope.select=function(item){
                    $scope.selected=item;
                };
                $scope.templateList=templateListFiltered;
                $scope.choose=function(item){
                    product.template= $scope.selected.$id;
                    f.save(productListRef,product).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                }
            }
        })
        .state('template.product.template', {
            url: "/create",
            templateUrl: "app/template/createProductTemplate.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                }
            },
            controller:function($scope,$state,f,types,templateListRef){
                $scope.template={};
                $scope.types= types;
                $scope.add=function(){
                    f.add(templateListRef,$scope.template).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                }
            }
        });
});
app.factory('TemplateService', function(f,$q) {
    //Public Method
    var productService = {
        getRefArray:function(type){
            if(type==="activity"){
                return f.ref("/template/activity").$asArray().$loaded();
            }
            if(type==="product"){
                return f.ref("/template/product").$asArray().$loaded();
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
