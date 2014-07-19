/**
 * Created by Administrator on 2014/7/15.
 */

var app=angular.module("gcgl2016.template");
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('template', {
            url: "/template",
            views:{
                'main@':{
                    templateUrl: "template/template.html",
                    resolve:{
                    },
                    controller:function($scope){

                    }
                }
            }
        })
        .state('template.process', {
            url: "/process",
            views:{
                'main@':{
                    templateUrl: "template/processTemplate.html",
                    resolve:{
                    },
                    controller:function($scope){
                    }
                }
            }
        })
        .state('template.product', {
            url: "/template",
            views:{
                'main@':{
                    templateUrl: "template/productTemplate.html",
                    resolve:{
                        productTemplate:function(ProductTemplateService){
                            return ProductTemplateService.list();
                        }
                    },
                    controller:function($scope,$state,$stateParams,productTemplate,ProductTemplateService){
                        $scope.productTemplates=productTemplate;
                        $scope.remove=function(key){
                            ProductTemplateService.remove(key);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });

                        };
                    }
                }
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
app.factory('ProductTemplateService', function(f,$q) {
    var ref=f.ref("/productTemplate");
    var refLoad=$q.defer();
    ref.$on("loaded",function(){
        refLoad.resolve(ref);
    });
    //Public Method
    var productService = {
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
