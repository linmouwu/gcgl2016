/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("gcgl2016.product",[]);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('product', {
            url: "/product",
            views:{
                'main@':{
                    templateUrl: "product/product.html",
                    resolve:{
                        productList:function(ProductService){
                            return ProductService.list();
                        }
                    },
                    controller:function($scope,$state,$stateParams,ProductService,productList){
                        $scope.productList=productList;
                        $scope.remove=function(key){
                            ProductService.remove(key);
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
        .state('product.create', {
            url: "/product/create",
            views:{
                'main@':{
                    templateUrl: "product/createProduct.html",
                    resolve:{
                        types:function(ProductService){
                            return ProductService.getTypes();
                        }
                    },
                    controller:function($scope,$state,ProductService,types){
                        $scope.types=types;
                        $scope.product={};
                        $scope.create=function(){
                            ProductService.create($scope.product).then(function(){
                                console.log("CreateProductController:Create Success");
                                $state.go("^",{},{reload:true});
                            },function(){
                                console.log("CreateProductController:Create Failed");
                            });
                        };
                    }
                }
            }
        })
        .state('product.edit', {
            url: "/product/edit/:id",
            views:{
                'main@':{
                    templateUrl: "product/editProduct.html",
                    resolve:{
                        product:function(ProductService,$stateParams){
                            return ProductService.find($stateParams.id);
                        },
                        types:function(ProductService){
                            return ProductService.getTypes();
                        }
                    },
                    controller:function($scope,$stateParams,$state,ProductService,product,types){
                        $scope.types=types;
                        $scope.product=product;
                        $scope.newField={};
                        $scope.save=function(){
                           ProductService.update($stateParams.id,$scope.product);
                            $state.go("^",{},{reload:true});

                        };
                        $scope.remove=function(field){
                            $scope.product.fields= _.filter($scope.product.fields,function(obj){
                                return field!=obj;
                            });
                        };
                        $scope.addField=function(){
                            if(_.isUndefined($scope.product.fields)){
                                $scope.product.fields=[];
                            }
                            $scope.product.fields.push($scope.newField);
                            $scope.newField={};
                        };
                    }
                }
            }
        });
});
app.factory('ProductService', function(f,$q) {
    var productRef=f.ref("/product");
    var productRefLoad=$q.defer();
    productRef.$on("loaded",function(){
        productRefLoad.resolve(productRef);
    });
    //Public Method
    var productService = {
        create: function(product) {
            return productRef.$add(product);
        },
        remove: function(key){
            return productRef.$remove(key);
        },
        update:function(key,value){
            var obj={};
            obj[key]=value;
            return productRef.$update(obj);
        },
        find:function(key){
            var promise=productRefLoad.promise.then(function(){
                return f.copy(productRef[key]);
            });
            return promise;
        },
        list: function(){
            return productRefLoad.promise.then(function(data){
                return f.copyList(data);
            });
        },
        getTypes:function(){
            var types=["document"];
            return types;
        }
    };
    return productService;
});
