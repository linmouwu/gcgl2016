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
                    templateUrl: "app/product/product.html",
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
                    templateUrl: "app/product/createProduct.html",
                    resolve:{
                        types:function(EnumService){
                            return EnumService.getProductTypes();
                        }
                    },
                    controller:function($scope,$state,ProductService,types){
                        $scope.types=types;
                        $scope.product={type:"simple"};
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
                    templateUrl: "app/product/editProduct.html",
                    resolve:{
                        product:function(ProductService,$stateParams){
                            return ProductService.find($stateParams.id);
                        },
                        types:function(EnumService){
                            return EnumService.getProductTypes();
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
    var ref = f.ref("/product");
    var list=ref.$asArray();
    //Public Method
    var service = {
        create: function(item) {
            return list.$add(item);
        },
        remove: function(key){
            return list.$remove(key);
        },
        update:function(item){
            return list.$save(item);
        },
        find:function(key){
            return list.$loaded().then(function(){
                return f.copy(list.$getRecord(key));
            });
        },
        list: function(){
            return list.$loaded().then(function(){
                return list;
            });
        },
        listWithFeatureAndTag:function(featureList,tagList){
            return list.$loaded().then(function(){
                return _.map(f.copy(list),function(activity){
                    activity.features= f.arrayToString(f.extend(activity.features,featureList),"name");
                    activity.tags= f.arrayToString(f.extend(activity.tags,tagList),"name");
                    return activity;
                });
            });
        }
    };
    return service;
});
app.directive('zrDocument',function(){
    return {
        templateUrl: 'app/product/document.tpls.html',
        scope:{
            data:'='
        },
        controller: function ($scope) {


            $scope.remove = function(scope) {
                scope.remove();
            };

            $scope.toggle = function(scope) {
                scope.toggle();
            };
            $scope.editNode = function(node) {
                node.editing = true;
            };
            $scope.saveNode = function(node) {
                node.editing = false;
            };
            $scope.moveLastToTheBegginig = function () {
                var a = $scope.data.pop();
                $scope.data.splice(0,0, a);
            };

            $scope.newSubItem = function(scope) {
                var nodeData = scope.$modelValue;
                nodeData.nodes.push({
                    id: nodeData.id * 10 + nodeData.nodes.length,
                    title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                    nodes: []
                });
            };
            $scope.addNode = function(){
                $scope.data.push({
                    id:$scope.data.length+1,
                    title:'node'+($scope.data.length+1),
                    nodes:[]
                });
            };

            var getRootNodesScope = function() {
                return angular.element(document.getElementById("tree-root")).scope();
            };

            $scope.collapseAll = function() {
                var scope = getRootNodesScope();
                scope.collapseAll();
            };

            $scope.expandAll = function() {
                var scope = getRootNodesScope();
                scope.expandAll();
            };
            if(!$scope.data){
                $scope.data = [
                    {
                        "id": 1,
                        "title": "node1",
                        "nodes": [
                            {
                                "id": 11,
                                "title": "node1.1",
                                "nodes": [
                                    {
                                        "id": 111,
                                        "title": "node1.1.1",
                                        "nodes": []
                                    }
                                ]
                            },
                            {
                                "id": 12,
                                "title": "node1.2",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "node2",
                        "nodes": [
                            {
                                "id": 21,
                                "title": "node2.1",
                                "nodes": []
                            },
                            {
                                "id": 22,
                                "title": "node2.2",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "node3",
                        "nodes": [
                            {
                                "id": 31,
                                "title": "node3.1",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "title": "node4",
                        "nodes": [
                            {
                                "id": 41,
                                "title": "node4.1",
                                "nodes": []
                            }
                        ]
                    }
                ];
            }
        }
    };
});