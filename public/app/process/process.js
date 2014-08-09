var app=angular.module("gcgl2016.process",['gcgl2016.firebase']);
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('process',{
            url:"/process",
            views:{
                'main@':{
                    templateUrl:"process/process.html",
                    resolve:{
                        productList:function(ProductService){
                            return ProductService.list();
                        },
                        processList:function(ProcessService){
                            return ProcessService.list();
                        },
                        processListWithProduct:function(ProcessService,f,processList,productList){
                            var ret={};
                            _.each(processList,function(process,id){
//                                console.log("process");
//                                console.log(process);
//                                console.log("id");
//                                console.log(id);
                                ProcessService.withProduct(process,productList,processList);
                                console.log("process.input");
                                console.log(process.input);
                                process.input=f.embedId(process.input);
                                process.output=f.embedId(process.output);
                                console.log("process.input");
                                console.log(process.input);
                                ret[id]=process;
                            });
                            console.log("ret");
                            console.log(ret);
                            return ret;
                        }
                    },
                    controller:function($scope,ProcessService,processListWithProduct,$state,$stateParams){
                        $scope.processList=processListWithProduct;
                        console.log("$scope.processList");
                        console.log($scope.processList);
                        $scope.remove=function(key){
                            ProcessService.remove(key).then(function(){
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                                console.log("ProcessController:Remove Successful");
                            },function(){
                                console.log("ProcessController:Remove failed");
                            });
                        };
                    }
                }
            },
            data: {
                displayName: 'Process List'
            }
        })
        .state('process.create',{
            url:"/process/create",
            views:{
                'main@':{
                    templateUrl:"process/createProcess.html",
                    controller:function($scope,$state,$stateParams,ProcessService){
                        $scope.process={};
                        $scope.create=function(){
//                            console.log("$scope.process");
//                            console.log($scope.process);
                            $scope.process.inputType=ProcessService.types()[0];
                            $scope.process.outputType=ProcessService.types()[0];
                            ProcessService.create($scope.process).then(function(){
                                console.log("CreateProcessController:Create Success");
                                $state.go("^",{},{reload:true});
                            },function(){
                                console.log("CreateProcessController:Create Failed");
                            });
                        };
                    }
                }
            },
            data: {
                displayName: 'Create Process'
            }
        })
        .state('process.edit', {
            url: "/process/edit/:id",
            views:{
                'main@':{
                    templateUrl: "process/editProcess.html",
                    resolve:{
                        process:function(ProcessService,$stateParams){
                            return ProcessService.find($stateParams.id);
                        },
                        processes:function(ProcessService){
                            return ProcessService.list();
                        },
                        products:function(ProductService){
                            return ProductService.list();
                        }
                    },
                    controller:function($scope,$stateParams,$state,ProcessService,process,processes,products){
                        $scope.types=ProcessService.types();
                        $scope.process=process;
//                        $scope.processes=processes;
//                        $scope.products=products;
                        if($scope.process.inputType=="process"){
                            $scope.inputs=processes;
                        }
                        else if($scope.process.inputType=="product"){
                            $scope.inputs=products;
                        }
                        else{
                            $scope.inputs=[];
                        }

                        if($scope.process.outputType=="process"){
                            $scope.outputs=processes;
                        }
                        else if($scope.process.outputType=="product"){
                            $scope.outputs=products;
                        }
                        else{
                            $scope.outputs=[];
                        }

//                        console.log($scope.types);
//                        console.log($scope.process);
//                        console.log($scope.inputs);
//                        console.log($scope.outputs);
                        $scope.save=function(){
                            ProcessService.update($stateParams.id,$scope.process);
//                            console.log($scope.process);
                            $state.go("^",{},{reload:true});
                        };
                        $scope.prepareInput=function(){
                            if($scope.process.inputType=="process"){
                                $scope.inputs=processes;
                            }
                            else if($scope.process.inputType=="product"){
                                $scope.inputs=products;
                            }
                            $scope.process.input="";

                        };
                        $scope.prepareOutput=function(){
                            if($scope.process.outputType=="process"){
                                $scope.outputs=processes;
                            }
                            else if($scope.process.outputType=="product"){
                                $scope.outputs=products;
                            }
                            $scope.process.output="";

                        };
                    }
                }
            }
        });
});
app.factory('ProcessService', function(f,$q) {

    var processRef = f.ref("/process");
    var processRefLoad = $q.defer();
    processRef.$on("loaded",function(){
        processRefLoad.resolve(processRef);
    });

    var processRelationRef = f.ref("/processRelation");
    var processRelationRefLoad = $q.defer();
    processRelationRef.$on("loaded",function(){
        processRelationRefLoad.resolve(processRelationRef);
    });

    //Public Method
    var processService = {
        create: function(process) {
            return processRef.$add(process);
        },
        remove: function(key){
            return processRef.$remove(key);
        },
        update:function(key,value){
            var obj={};
            obj[key]=value;
            return processRef.$update(obj);
        },
        find:function(key){
            var promise=processRefLoad.promise.then(function(){
                return f.copy(processRef[key]);
            });
            return promise;
        },
        list: function(){
            return processRefLoad.promise.then(function(data){
                return f.copyList(data);
            });
        },
        types:function(){
            var types=["product","process"];
            return types;
        },
        //process without key, process modified no return
        withProduct:function(process,productList,processList){
//            console.log(productList);
//            console.log(processList);
            if(process.inputType=="product"){
                process.input=f.extendSingle(process.input,productList);
            }
            else{
                process.input=f.extendSingle(process.input,processList);
            }
            if(process.outputType=="product"){
                process.output=f.extendSingle(process.output,productList);
            }
            else{
                process.output=f.extendSingle(process.output,processList);
            }
        }
    };
    return processService;
});
