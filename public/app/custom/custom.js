/**
 * Created by Administrator on 2014/7/19.
 */

var app=angular.module("gcgl2016.custom",[]);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('custom', {
            url: "/custom"
        })
        .state('custom.productTemplate',{
            url:"/product",
            views:{
                'main@':{
                    templateUrl:"custom/product.html",
                    resolve:{
                        pid:function(ExeProjectService){
                            return ExeProjectService.getCurrentProjectId();
                        },
                        products:function(pid,ProductDataService){
                            if(pid===""){
                                return undefined;
                            }
                            ProductDataService.setProject(pid);
                            return ProductDataService.list();

                        }
                    },
                    controller:function($scope,$state,$stateParams,products,ProductDataService){
                        if(_.isUndefined(products)){
                            //need to select project
                            $state.go('main');
                        }
                        $scope.products=products;
//                        console.log('$scope.products');
//                        console.log($scope.products);
                        $scope.save=function(){
                            ProductDataService.save(products);
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
        .state('custom.processTemplate',{
            url:"/process",
            views:{
                'main@':{
                    templateUrl:"custom/process.html",
                    resolve:{
                        pid:function(ExeProjectService){
                            return ExeProjectService.getCurrentProjectId();
                        },
                        processes:function(pid,ProcessDataService){
                            if(pid===""){
                                return undefined;
                            }
                            ProcessDataService.setProject(pid);
                            return ProcessDataService.list();

                        }
                    },
                    controller:function($scope,$state,$stateParams,processes,ProcessDataService){
                        if(_.isUndefined(processes)){
                            //need to select project
                            $state.go('main');
                        }
                        $scope.processes=processes;
//                        console.log('$scope.products');
//                        console.log($scope.products);
                        $scope.save=function(){
                            ProcessDataService.save(processes);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        };

                    }
                }
            }
        });
});

app.factory('ProductDataService',function($q,f){
    var ref;
    var refLoad;

    var productDataService = {
        setProject:function(projectId){
            ref= f.ref("/exeProject/"+projectId+"/productData");
            refLoad=$q.defer();
            ref.$on("loaded",function(){
                refLoad.resolve(ref);
            });
            return;
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return ref.$update(obj);
        },
        save:function(items){
            return ref.$update(items);
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
    return productDataService;
});

app.factory('ProcessDataService',function($q,f){

    var ref;
    var refLoad;

    var processDataService = {
        setProject:function(projectId){
            ref= f.ref("/exeProject/"+projectId+"/processData");
            refLoad=$q.defer();
            ref.$on("loaded",function(){
                refLoad.resolve(ref);
            });
            return;
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return ref.$update(obj);
        },
        save:function(items){
            return ref.$update(items);
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
        },
        finish:function(processId){
            console.log('processId');
            console.log(processId);
            return processDataService.find(processId).then(function(processDataContent){
                console.log('processDataContent');
                console.log(processDataContent);


                processDataContent.status="finish";
                return processDataService.update(processId,processDataContent);
            });
        }
    };
    return processDataService;
});
