/**
 * Created by dingziran on 2014/11/3.
 */
var app=angular.module("gcgl2016.tool",[]);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('tool', {
            url: "/tool",
            templateUrl: "app/tool/tool.html",
            resolve:{
            },
            controller:function($scope){
            }
        })
        .state('tool.feature', {
            url: "/feature",
            templateUrl: "app/tool/featureTool.html",
            resolve:{
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
//                activityListRef:function(ActivityService){
//                    return ActivityService.getRefArray();
//                },
                featureToolListRef:function(ToolService){
                    return ToolService.getRefArray("feature");
                }
//                activityWithFeatureAndTemplate:function(activityListRef,featureToolListRef,templateListRef,f){
//                    return _.map(f.copy(activityListRef),function(activity){
//                        _.each(activity.fts,function(ft){
//                            ft.feature= f.extendSingle(ft.feature,featureListRef);
//                            ft.template= f.extendSingle(ft.template,templateListRef);
//                        });
//                        return activity;
//                    });
//                },
//                templateWithFeature:function(TemplateService,f,templateListRef,featureListRef){
//                    return _.map(f.copy(templateListRef),function(template){
//                        console.log(template);
//                        template.feature=f.extendSingle(template.feature,featureListRef);
//                        console.log(template);
//                        return template;
//                    });
//                }
            },
            controller:function($scope,$state,$stateParams,f,featureListRef,featureToolListRef){
                $scope.featureList= f.copy(featureListRef);
                _.each($scope.featureList,function(feature){
                    feature.tool=featureToolListRef.$getRecord(feature.tool);
                });
                $scope.featureToolList=f.copy(featureToolListRef);
                _.each($scope.featureToolList,function(tool){
                    tool.feature=featureListRef.$getRecord(tool.feature);
                });
//                $scope.activityList= activityWithFeatureAndTemplate;
//                $scope.templateList=templateWithFeature;
//                $scope.choose=function(activity,feature){
//                    $state.go("template.activity.feature",{activityId:activity.$id,featureId:feature.$id});
//                };
//                $scope.remove=function(template){
//                    f.remove(templateListRef,template).then(function(){
//                        $state.transitionTo($state.current, $stateParams, {
//                            reload: true,
//                            inherit: false,
//                            notify: true
//                        });
//                    });
//                };
            }
        })
        .state('tool.feature.select', {
            url: "/:featureId",
            templateUrl: "app/tool/selectFeatureTool.html",
            resolve:{
                feature:function($stateParams,featureListRef){
                    return featureListRef.$getRecord($stateParams.featureId);
                }
            },
            controller:function($scope,$state,f,feature,featureListRef,featureToolListRef){
                $scope.featureToolList= _.filter(f.copy(featureToolListRef),function(tool){
                    return _.isEmpty(tool.feature)||tool.feature==feature.$id;
                });

                $scope.select=function(item){
                    feature.tool=item.$id;
                    f.save(featureListRef,feature).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('tool.feature.create', {
            url: "/create",
            templateUrl: "app/tool/createFeatureTool.html",
            resolve:{
            },
            controller:function($scope,$state,f,featureToolListRef,featureListRef){
                $scope.tool={};
                $scope.featureList= f.copy(featureListRef);
                $scope.add=function(item){
                    f.add(featureToolListRef,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('tool.product', {
            url: "/product",
            templateUrl: "app/tool/productTool.html",
            resolve:{
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                productToolListRef:function(ToolService){
                    return ToolService.getRefArray("product");
                }
            },
            controller:function($scope,$state,$stateParams,f,productListRef,productToolListRef){
                $scope.productList= f.copy(productListRef);
                _.each($scope.productList,function(product){
                    product.tool=productToolListRef.$getRecord(product.tool);
                });
                $scope.productToolList= f.copy(productToolListRef);
                $scope.remove=function(template){
                    f.remove(productToolListRef,template).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
            }
        })
        .state('tool.product.create', {
            url: "/create",
            templateUrl: "app/tool/createProductTool.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                }
            },
            controller:function($scope,$state,f,types,productToolListRef){
                $scope.tool={};
                $scope.types= types;
                $scope.add=function(item){
                    f.add(productToolListRef,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('tool.product.select', {
            url: "/:productId",
            templateUrl: "app/tool/selectProductTool.html",
            resolve:{
                product:function($stateParams,productListRef){
                    return productListRef.$getRecord($stateParams.productId);
                }
            },
            controller:function($scope,$state,f,productListRef,product,productToolListRef){
                $scope.productToolList= _.filter(productToolListRef,function(tool){
                    console.log(tool.type);
                    console.log(product.type);
                    return _.isEmpty(tool.type)||tool.type===product.type;
                });

                $scope.select=function(item){
                    product.tool= item.$id;
                    f.save(productListRef,product).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        });
});
app.factory('ToolService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(type){
            if(type==="feature"){
                return f.ref("/tool/feature").$asArray().$loaded();
            }
            if(type==="product"){
                return f.ref("/tool/product").$asArray().$loaded();
            }
        }
    };
    return service;
});
