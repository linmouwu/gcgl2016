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
                    controller:"ProductController",
                    resolve:{
                        productList:function(ProductService){
                            return ProductService.list();
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
                    controller:"CreateProductController"
                }
            }
        })
        .state('product.edit', {
            url: "/product/edit/:id",
            views:{
                'main@':{
                    templateUrl: "app/product/editProduct.html",
                    controller:"EditProductController"
                }
            }
        });
});
app.factory('ProductService', function(firebaseService,$q) {
    var productRef = firebaseService.ref("/product");
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
            return productRefLoad.promise;
        },
        remove: function(key){
            return productRef.$remove(key);
        }
    };
    return productService;
});

app.controller("ProductController",function($scope,ProductService,productList){
    $scope.productList=productList;
    $scope.remove=function(key){
        ProductService.remove(key).then(function(){
            console.log("ProductController:Remove Successful");
        },function(){
            console.log("ProductController:Remove failed");
        })
    }

});
app.controller("CreateProductController",function($scope,$state,ProductService){
    $scope.product={};
    $scope.create=function(){
        ProductService.create($scope.product).then(function(){
            console.log("CreateProductController:Create Success");
            $state.go("^");
        },function(){
            console.log("CreateProductController:Create Failed");
        })
    }
});
app.controller("EditProductController",function($scope,$stateParams,ProductService){
    console.log($stateParams);
});