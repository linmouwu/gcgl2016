/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("gcgl2016.product",[]);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('product', {
            url: "/product",
            templateUrl: "app/product/product.html",
            resolve:{
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                }
            },
            controller:function($scope,$state,$stateParams,f,ProductService,productListRef){
                $scope.productList= f.copy(productListRef);
                $scope.remove=function(item){
                    f.remove(productListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });

                    });
                };

            }
        })
        .state('product.create', {
            url: "/create",
            templateUrl: "app/product/createProduct.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                }
            },
            controller:function($scope,$state,f,ProductService,types,productListRef){
                $scope.types=types;
                $scope.product={type:"simple"};
                $scope.$watch('product.type',
                    function(newVal, oldVal) {
                        $scope.product.data=null;
                    });
                $scope.create=function(){
                    if($scope.product.type==='json'){
                        $scope.product.data=JSON.parse($scope.product.data);
                    }
                    f.add(productListRef,$scope.product).then(function() {
                        $state.go("^", {}, {reload: true});
                    });
                };
            }
        })
        .state('product.edit', {
            url: "/product/edit/:id",
            templateUrl: "app/product/editProduct.html",
            resolve:{
                product:function(productListRef,$stateParams){
                    return productListRef.$getRecord($stateParams.id);
                },
                types:function(EnumService){
                    return EnumService.getProductTypes();
                }
            },
            controller:function($scope,$stateParams,f,$state,ProductService,productListRef,product,types){
                function init(){
                    $scope.product= f.copy(product);
                    if($scope.product.type==='json'){
                        $scope.product.data=JSON.stringify($scope.product.data);
                    }
                };
                init();
                $scope.types=types;
                $scope.$watch('product.type',
                    function(newVal, oldVal) {
                        if(newVal===oldVal){
                            return;
                        }
                        $scope.product.data=null;
                    });
                $scope.reset= function(){
                    init();
                };
                $scope.save= function(item){
                    if($scope.product.type==='json'){
                        $scope.product.data=JSON.parse($scope.product.data);
                    }
                    ProductService.save(productListRef,product,item).then(function(){

                        $state.go("^", {}, {reload: true});
                    });
                }
            }
        });
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
app.directive('zrList',function(){
    return {
        templateUrl: 'app/product/list.tpls.html',
        scope:{
            data:'='
        },
        controller: function ($scope) {
            $scope.add = function(){
                if($scope.data){
                    $scope.data.push({});
                }
                else{
                    $scope.data=[{}];
                }
            };
            $scope.remove = function() {
                $scope.data.pop();
            };
        }
    };
});
app.directive('zrFile',function(){
    return {
        templateUrl: 'app/product/file.tpls.html',
        scope:{
            data:'='
        },
        controller: function ($scope,FileUploader) {
            if(!$scope.data){
                $scope.data=[];
            }
            $scope.uploader=new FileUploader({
                url: 'upload'
            });
            $scope.oldData=[];
            $scope.$watch('data',
                function(newVal, oldVal) {
                    $scope.oldData= _.filter($scope.data,function(d){
                        return !_.contains(_.pluck($scope.uploader.queue,'path'), d.path);
                    });
                });
            $scope.remove=function(item){
                $scope.data=_.filter($scope.data,function(d){
                    if(d.path===item.path){
                        return false;
                    }
                    return true;
                });
                if(item.remove){
                    item.remove();
                }
            };
            $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
//                console.info('onCompleteItem', fileItem, response, status, headers);
                if(response&&response[0]){
                    fileItem.originalFilename=response[0].originalFilename;
                    fileItem.path=response[0].path.replace("public\\","");
                }
                $scope.data.push({path:fileItem.path,name:fileItem.originalFilename});
            };
        }
    };
});
app.factory('ProductService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref('/product').$asArray().$loaded();
        },
        getRefArrayExe:function(projectId){
            return f.ref('/project/'+projectId+'/exeProduct').$asArray().$loaded();
        },
        getProductDataRef:function(projectId){
            return f.ref('/project/'+projectId+'/productData').$asArray().$loaded();
        },
        getNewProduct:function(oldProducts,newProducts,property){
            var oldIds= _.pluck(oldProducts,property);
            return _.filter(newProducts,function(product){
                return !_.contains(oldIds,product[property]);
            });
        },
        getDelProduct:function(oldProducts,newProducts,property){
            var newIds= _.pluck(newProducts,property);
            return _.filter(oldProducts,function(product){
                return !_.contains(newIds,product[property]);
            });
        },
        getStayProduct:function(oldProducts,newProducts,property){
            var oldIds= _.pluck(oldProducts,property);
            return _.filter(newProducts,function(product){
                return _.contains(oldIds,product[property]);
            });
        },
        save:function(refs,oldItem,newItem){
            if(_.isUndefined(refs)||!refs.hasOwnProperty('$save')){
                return;
            }
            var keys=[
                'name',
                'description',
                'type',
                'exeTemplate',
                'data'];
            _.each(keys,function(key){
                if(_.isUndefined(newItem[key])){
                    oldItem[key]=null;
                }
                else{
                    oldItem[key]=newItem[key];
                }
            });
            return refs.$save(oldItem);
        },
        findByProperty:function(refs,property,value){
            _.each(refs,function(product){
                if(product[property]===value){
                    return angular.copy(product);
                }
            });
            return null;
        }
    };
    return service;
});