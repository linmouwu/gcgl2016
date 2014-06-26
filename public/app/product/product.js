/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('product', {
            url: "/product",
            views:{
                'main@':{
                    templateUrl: "app/product/product.html",
                    resolve:{
                        productList:function(ProductService){
                            return ProductService.list();
                        }
                    },
                    controller:function($scope,$state,ProductService,productList){
                        $scope.productList=productList;
                        console.log("$scope.productList");
                        console.log(productList);
                        $scope.remove=function(key){
                            ProductService.remove(key).then(function(){
                                console.log("ProductController:Remove Successful");
                            },function(){
                                console.log("ProductController:Remove failed");
                            })
                        }

                    }
                }
            }
        })
        .state('product.create', {
            url: "/product/create",
            views:{
                'main@':{
                    templateUrl: "app/product/createProduct.html",
                    controller:function($scope,$state,ProductService){
                        $scope.product={};
                        $scope.create=function(){
                            ProductService.create($scope.product).then(function(){
                                console.log("CreateProductController:Create Success");
                                $state.go("^");
                            },function(){
                                console.log("CreateProductController:Create Failed");
                            })
                        }
                    }
                }
            }
        })
        .state('product.edit', {
            url: "/product/edit/:id",
            views:{
                'main@':{
                    templateUrl: "app/product/editProduct.html",
                    resolve:{
                        product:function(ProductService,$stateParams){
                            return ProductService.find($stateParams.id);
                        }
                    },
                    controller:function($scope,$stateParams,$state,ProductService,product){
                        $scope.product=product;
                        $scope.save=function(){
                            //ProductService.save($stateParams.id);
                            ProductService.refresh();
                            //$state.reload();
                            $state.go("^",{},{reload:true});

                        }
                    }
                }
            }
        });
});
app.factory('ProductService', function(firebaseService,$q) {
    var productRef;
    var productRefLoad;
    var refresh=function(){
        console.log("refresh");
        productRef=firebaseService.ref("/product");
        productRefLoad=$q.defer();
        productRef.$on("loaded",function(){
            productRefLoad.resolve(productRef);
        });
    };
    refresh();
    //Public Method
    var productService = {
        refresh:function(){
            refresh();
        },
        create: function(product) {
            return productRef.$add(product);
        },
        list: function(){
            console.log("product service list");
            console.log(productRef);
            return productRefLoad.promise;
        },
        remove: function(key){
            return productRef.$remove(key);
        },
        find:function(key){
            var promise=productRefLoad.promise.then(function(){
                return productRef[key];
            });
            return promise;
        },
        save:function(key){
            console.log(productRef[key]);
            return productRef.$save(key);
        }
    };
    return productService;
});
