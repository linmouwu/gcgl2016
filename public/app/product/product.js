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
                        },
                        types:function(ProductService){
                            return ProductService.getTypes();
                        }
                    },
                    controller:function($scope,$stateParams,$state,ProductService,product,types){
                        $scope.types=types;
                        $scope.product=product;
                        $scope.productCopy=angular.copy(product);
                        if(_.isUndefined($scope.productCopy.fields)){
                            $scope.productCopy.fields=[];
                        }
                        $scope.newField={};
                        $scope.save=function(){
                           ProductService.save($stateParams.id,$scope.productCopy);
                            $state.go("^");

                        };
                        $scope.remove=function(field){
                            $scope.productCopy.fields= _.filter($scope.productCopy.fields,function(obj){
                                return !(field==obj);
                            });
                        };
                        $scope.addField=function(){
                            $scope.productCopy.fields.push($scope.newField);
                            $scope.newField={};
                        }
                    }
                }
            }
        });
});
app.factory('ProductService', function(firebaseService,$q) {
    var productRef=firebaseService.ref("/product")
    var productRefLoad=$q.defer();
    productRef.$on("loaded",function(){
        productRefLoad.resolve(productRef);
    });
    //Public Method
    var productService = {
        create: function(product) {
            return productRef.$add(product);
        },
        list: function(){
            return productRefLoad.promise.then(function(data){
                return firebaseService.copyList(data);
            });
        },
        remove: function(key){
            return productRef.$remove(key);
        },
        find:function(key){
            var promise=productRefLoad.promise.then(function(){
                return angular.copy(productRef[key]);
            });
            return promise;
        },
        save:function(key,value){
            var obj={};
            obj[key]=value;
            return productRef.$update(obj);
        },
        getTypes:function(){
            var types=["document"];
            return types;
        }
    };
    return productService;
});
