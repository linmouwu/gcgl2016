var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('process',{
            url:"/process",
            views:{
                'main@':{
                    templateUrl:"app/process/process.html",
                    resolve:{
                        processList:function(ProcessService){
                            return ProcessService.list();
                        }
                    },
                    controller:function($scope,ProcessService,processList){
                        $scope.processList=processList;
                        $scope.remove=function(key){
                            ProcessService.remove(key).then(function(){
                                console.log("ProcessController:Remove Successful");
                            },function(){
                                console.log("ProcessController:Remove failed");
                            })
                        }
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
                    templateUrl:"app/process/createProcess.html",
                    controller:function($scope,$state,ProcessService){
                        $scope.process={};
                        $scope.create=function(){
                            $scope.process.inputType=ProcessService.types()[0];
                            $scope.process.outputType=ProcessService.types()[0];
                            ProcessService.create($scope.process).then(function(){
                                console.log("CreateProcessController:Create Success");
                                $state.go("^");
                            },function(){
                                console.log("CreateProcessController:Create Failed");
                            })
                        }
                    }
                }
            },
            data: {
                displayName: 'Create Process'
            }
        })
        .state('process.relation',{
            url:"/process/relation",
            views:{
                'main@':{
                    templateUrl:"app/process/relation.html",
                    controller:"RelationProcessController",
                    resolve:{
                        relationList:function(ProcessService){
                            return ProcessService.listRelation();
                        },
                        processList:function(ProcessService){
                            return ProcessService.list();
                        }
                    }
                }
            },
            data: {
                displayName: 'Management Relationship'
            }
        })
        .state('process.edit', {
            url: "/process/edit/:id",
            views:{
                'main@':{
                    templateUrl: "app/process/editProcess.html",
                    controller:"EditProcessController",
                    resolve:{
                        process:function(ProcessService,$stateParams){
                            return ProcessService.find($stateParams.id);
                        },
                        inputs:function(process,ProcessService,ProductService){
                            if(process.inputType=="process"){
                                return ProcessService.list();
                            }
                            else if(process.inputType=="product"){
                                return ProductService.list();
                            }
                            else return [];
                        },
                        outputs:function(process,ProcessService,ProductService){
                            if(process.outputType=="process"){
                                return ProcessService.list();
                            }
                            else if(process.outputType=="product"){
                                return ProductService.list();
                            }
                            else return [];
                        },
                        processes:function(ProcessService){
                            return ProcessService.list();
                        },
                        products:function(ProductService){
                            return ProductService.list();
                        }
                    },
                    controller:function($scope,$stateParams,$state,ProcessService,process,inputs,outputs,processes,products){
                        $scope.types=ProcessService.types();
                        $scope.process=process;
                        $scope.processCopy=angular.copy(process);
//                        $scope.processes=processes;
//                        $scope.products=products;
                        if($scope.processCopy.inputType=="process"){
                            $scope.inputs=processes;
                        }
                        else if($scope.processCopy.inputType=="product"){
                            $scope.inputs=products;
                        }
                        else{
                            $scope.inputs=[];
                        }

                        if($scope.processCopy.outputType=="process"){
                            $scope.outputs=processes
                        }
                        else if($scope.processCopy.outputType=="product"){
                            $scope.outputs=products
                        }
                        else{
                            $scope.outputs=[];
                        }

//                        console.log($scope.types);
//                        console.log($scope.process);
//                        console.log($scope.inputs);
//                        console.log($scope.outputs);
                        $scope.save=function(){
                            ProcessService.save($stateParams.id,$scope.processCopy);
//                            console.log($scope.process);
                            $state.go("^");
                        };
                        $scope.prepareInput=function(){
                            if($scope.processCopy.inputType=="process"){
                                $scope.inputs=processes;
                            }
                            else if($scope.processCopy.inputType=="product"){
                                $scope.inputs=products;
                            }
                            $scope.processCopy.input="";

                        };
                        $scope.prepareOutput=function(){
                            if($scope.processCopy.outputType=="process"){
                                $scope.outputs=processes;
                            }
                            else if($scope.processCopy.outputType=="product"){
                                $scope.outputs=products;
                            }
                            $scope.processCopy.output="";

                        };
                    }
                }
            }
        });
});
app.factory('ProcessService', function(firebaseService,$q) {

    var processRef = firebaseService.ref("/process");
    var processRefLoad = $q.defer();
    processRef.$on("loaded",function(){
        processRefLoad.resolve(processRef);
    });

    var processRelationRef = firebaseService.ref("/processRelation");
    var processRelationRefLoad = $q.defer();
    processRelationRef.$on("loaded",function(){
        processRelationRefLoad.resolve(processRelationRef);
    });

    var constructRelation=function(){
        var relationList=[];
        _.each(processRef.$getIndex(),function(preId){
            _.each(processRef.$child(preId).$child("follows"),function(postId){
                if(_.contains(processRef.$getIndex(),postId)){
                    relationList.push({
                        preId:preId,
                        postId:postId,
                        pre:processRef.$child(preId),
                        post:processRef.$child(postId)
                    });
                }
            });
        });
        return relationList;
    };
    //Public Method
    var processService = {
        create: function(process) {
            return processRef.$add(process);
        },
        list: function(){
            return processRefLoad.promise;
        },
        remove: function(key){
            return processRef.$remove(key);
        },
        addRelation: function(preId,postId){
            return processRelationRef.$add({preId:preId,postId:postId});
        },
        listRelation:function(){
            var promise=$q.all([processRefLoad.promise,processRelationRefLoad.promise]).then(function(){
                return constructRelation();
            });
            return promise;
        },
        removeRelation:function(preId,postId){
            var promise;
            var follows=processRef.$child(preId).$child("follows");

            var indexs= follows.$getIndex();
            _.each(indexs,function(index){
                if(follows[index]==postId){
                    promise=follows.$remove(index);
                }
            });
            return promise;
        },
        find:function(key){
            var promise=processRefLoad.promise.then(function(){
                return processRef[key];
            });
            return promise;
        },
        addFollow:function(processKey,followKey){
            //find the process by key
            //push followKey to process.follows
            return processRef.$child(processKey).$child("follows").$add(followKey);
        },
        types:function(){
            var types=["product","process"];
            return types;
        },
        save:function(key,value){
            var obj={};
            obj[key]=value;
            return processRef.$update(obj);
        }
    };
    return processService;
});
app.controller("RelationProcessController",function($scope,$state,ProcessService,relationList,processList){
    $scope.processList=processList;
    $scope.preId={};
    $scope.postId={};
    $scope.relationList=relationList;
    $scope.processList.$on("change",function(){
        ProcessService.listRelation().then(function(data){
            $scope.relationList=data;
        });
    })
    $scope.add=function(){
        if(_.isEmpty($scope.preId)|| _.isEmpty($scope.postId)){
            console.log("fail: cannot input null");
            return;
        }
        ProcessService.addFollow($scope.preId,$scope.postId).then(function(){
            console.log("RelationProcessController:Add Success");
        },function(){
            console.log("RelationProcessController:Add Failed");
        });
        $scope.preId={};
        $scope.postId={};
        console.log("added");
    };
    $scope.remove=function(preId,postId){
        ProcessService.removeRelation(preId,postId).then(function(){
            console.log("remove success");
        },function(){
            console.log("remove failed");
        });
    };
});
