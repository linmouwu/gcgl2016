var app=angular.module("gcgl2016.exeProject",['ui.router','gcgl2016.firebase','gcgl2016.project','ui.bootstrap']);
app.config(function($stateProvider){
    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "app/exeProject/selectProject.html",
            resolve: {
                projectList: function (ProjectService, $state) {
                    return ProjectService.list();
                }
            },
            controller: function ($scope,projectList) {
                $scope.projectList=projectList;
            }
        })
        .state('main.project',{
            url:"/project/:projectId",
            templateUrl:"app/exeProject/activityList.html",
            resolve:{
                url:function(ExeProjectService,$stateParams){
                    var baseUrl=ExeProjectService.getBaseUrl();
                    return baseUrl+"/"+$stateParams.projectId;
                },
                activityList:function(f,url){
                    return f.ref(url+'/exeActivities').$asArray().$loaded();
                }
            },
            controller:function($scope,$state,$stateParams,f,url,activityList){
                $scope.activityList= f.copy(activityList);
                $scope.selected={};
                $scope.select= function(item){
                    $scope.selected=item;
                };
                $scope.enterProcess=function(){
                    if(_.isEmpty($scope.selected)){
                        return;
                    }
                    $state.go("main.project.activity",{projectId:$stateParams.projectId,activityId:$scope.selected.$id});
                };
                $scope.showInput=function(){
                    if(_.isEmpty($scope.selected)){
                        return;
                    }
                    $state.go("main.project.activity",{projectId:$stateParams.projectId,activityId:$scope.selected.$id});
                };
                $scope.showOutput=function(){
                    if(_.isEmpty($scope.selected)){
                        return;
                    }
                    $state.go("main.project.activity",{projectId:$stateParams.projectId,activityId:$scope.selected.$id});
                };
            }
        })
        .state('main.project.activity',{
            url:"/:activityId",
            templateUrl:function(activity){
                if(_.isUndefined(activity.url)){
                    return "app/template/activityTemplate/activityTemplate.html";
                }
                return activity.url;
            },
            resolve:{
                activity:function($stateParams,activityList){
                    return activityList.$getRecord($stateParams.activityId);
                }
            },
            controller:function($scope,activity){
                $scope.activity=activity;
            }
        })
        .state('main.project.input',{
            url:"/:productId",
            templateUrl:function(product){
                if(_.isUndefined(product.url)){
                    return "app/template/activityTemplate/activityTemplate.html";
                }
                return product.url;
            },
            resolve:{
                product:function($stateParams,activityList){
                    return activityList.$getRecord($stateParams.activityId);
                }
            },
            controller:function($scope,activity){
                $scope.activity=activity;
            }
        })
//                        currentProcesses:function(ExeProjectService,f,projects){
////                            console.log("ExeProjectService.getCurrentProjectId()");
////                            console.log(ExeProjectService.getCurrentProjectId());
//                            var project=angular.copy(projects[ExeProjectService.getCurrentProjectId()]);
//                            if(_.isUndefined(project)){
//                                return project;
//                            }
////                            console.log('0.9');
////                            console.log(project.selected);
////                            console.log(project.processData);
//                            var subProcess= f.extend(project.selected,project.processData);
////                            console.log("1.Sub Process");
////                            console.log(subProcess);
//                            subProcess=_.map(project.processData,function(processContent,id){
//                                processContent.id=id;
//                                console.log('processContent');
//                                console.log(processContent);
//                                return ExeProjectService.withInputOutputAndEmbed(processContent,project.productData,project.processData);
//                            });
//                            console.log("This processes must have list inside.");
//                            console.log(subProcess);
//                            return subProcess;
//                        }
//                    },
//                    controller:function($scope,$stateParams,$state,f,ExeProjectService,projects,currentProcesses){
//                        $scope.projects=projects;
//                        console.log("projects");
//                        console.log(projects);
//                        $scope.selectId=ExeProjectService.getCurrentProjectId();
//                        $scope.myData = [];
//                        if(!_.isUndefined(currentProcesses)){
//                            $scope.myData=currentProcesses;
//                        }
//                        $scope.mySelections=[];
//                        console.log("$scope.myData");
//                        console.log($scope.myData);
//                        $scope.gridOptions = {
//                            data: 'myData',
//                            columnDefs: [{field:'name', displayName:'Name'},
//                                {field:'input.name', displayName:'Input'},
//                                {field:'input.status',displayName:'Input Status'},
//                                {field:'output.name', displayName:'Output'},
//                                {field:'output.status', displayName:'Output Status'},
//                                {field:'status', displayName:'Process Status'}
//                            ],
//                            selectedItems: $scope.mySelections,
//                            multiSelect: false
//                        };
//                        $scope.select=function(){
//                            console.log("$scope.selectId");
//                            console.log($scope.selectId);
//                            ExeProjectService.setCurrentProjectId($scope.selectId);
//
//                            $state.transitionTo($state.current, $stateParams, {
//                                reload: true,
//                                inherit: false,
//                                notify: true
//                            });
//                        };
//                        $scope.remove=function(){
//                            ExeProjectService.remove($scope.selectId);
//                            $state.transitionTo($state.current, $stateParams, {
//                                reload: true,
//                                inherit: false,
//                                notify: true
//                            });
//
//                        };
//                        $scope.enterProcess=function(){
//                            if($scope.mySelections.length===0){
//                                return;
//                            }
//                            if($scope.mySelections[0].status==="finish"){
//                                return;
//                            }
//                            console.log('$scope.mySelections');
//                            console.log($scope.mySelections);
//                            $state.go("main.process",{id:$scope.mySelections[0].id,pId:$scope.selectId});
//                        };
//                    }
//                }
//            }
//        })
        .state('main.process',{
            url:"/process/:pId/:id",
            views:{
                'main@':{
                    templateUrl:"app/exeProject/processExe.html",
                    resolve:{
                        project:function(ExeProjectService,ProductDataService,ProcessDataService,$stateParams){
                            ProductDataService.setProject($stateParams.pId);
                            ProcessDataService.setProject($stateParams.pId);
                            return ExeProjectService.find($stateParams.pId);
                        },
                        process:function(ExeProjectService,$stateParams){
                            return ExeProjectService.getProcessData($stateParams.pId,$stateParams.id);
                        },
                        input:function(process,project,f){
                            return f.embedId(f.extendSingle(process.input,project.productData));
                        },
                        output:function(process,project,f){
//                            console.log('output:function(process,project){');
//                            console.log(process.output);
//                            console.log(project.productData);
                            return f.embedId(f.extendSingle(process.output,project.productData));
                        }
                    },
                    controller:function($stateParams,$state,$modal,$scope,process,input,output,ProductDataService,ProcessDataService){
                        console.log("input");
                        console.log(input);
                        console.log("output");
                        console.log(output);
                        $scope.process=process;
//                        $scope.process.path="template/processTemplate/description/description.html";
                        $scope.input=input;
                        $scope.output=output;
                        $scope.saveOutput=function(){
                            ProductDataService.find($scope.output.id).then(function(productDataContent){
                                productDataContent.fields=$scope.output.fields;
                                ProductDataService.update($scope.output.id,productDataContent).then(function(){

                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                });
                            });
                        };
                        $scope.saveInput=function(){
                            ProductDataService.find($scope.input.id).then(function(productDataContent){
                                productDataContent.fields=$scope.input.fields;
                                ProductDataService.update($scope.input.id,productDataContent).then(function(){

                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                });
                            });
                        };
                        $scope.finish=function(){
                            ProcessDataService.finish($stateParams.id);
                            $state.go('^',{},{reload:"true"});
                        };
                        $scope.showInput=function(){
                            //$scope.input.path='template/productTemplate/document.html';
                            var modalInstance = $modal.open({
                                templateUrl:  $scope.input.path,
                                controller: 'ModalInputCtrl',
                                size: 'lg',
                                resolve: {
                                    input: function () {
                                        return $scope.input;
                                    }
                                }
                            });

                            modalInstance.result.then(function (output) {
                                $scope.output=input;
                                $scope.saveOutput();
                            }, function () {
                                console.log('Modal dismissed at: ' + new Date());
                            });
                        };
                        $scope.showOutput=function(){
                            var modalInstance = $modal.open({
                                templateUrl: $scope.output.path,
                                controller: 'ModalOutputCtrl',
                                size: 'lg',
                                resolve: {
                                    output: function () {
                                        return $scope.output;
                                    }
                                }
                            });

                            modalInstance.result.then(function (output) {
                                $scope.output=output;
                                $scope.saveOutput();
                            }, function () {
                                console.log('Modal dismissed at: ' + new Date());
                            });
                        };
                    }

                }
            }
        });
});
app.controller('ModalInputCtrl',function ($scope, $modalInstance, input) {
//    console.log("ModalInputCtrl input");
//    console.log(input);
    $scope.input = input;
    $scope.readonly=true;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('ModalOutputCtrl',function ($scope, $modalInstance, output) {
//    console.log("ModalOutputCtrl output");
//    console.log(output);
    $scope.input = output;
    $scope.readonly=undefined;

    $scope.ok = function () {
        $modalInstance.close($scope.input);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.factory('ExeProjectService', function(f) {
    var baseUrl = "/project";
    var projectRef = f.ref(baseUrl);
    var list=projectRef.$asArray();
    var currentProjectId={};


    //Public Method
    var exeProjectService = {
        getBaseUrl:function(){
            return baseUrl;
        },
        create: function(project) {
            //This is an usual situation
            return exeProjectRef.$update(project);
        },
        remove: function(key){
            return exeProjectRef.$remove(key);
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return exeProjectRef.$update(obj);
        },
        find:function(key){
            var promise=exeProjectRefLoad.promise.then(function(){
//                console.log("exeProjectRef[key]");
//                console.log(f.copy(exeProjectRef[key]));
                return f.copy(exeProjectRef[key]);
            });
            return promise;
        },
        list: function(){
            return list.$loaded().then(function(){
                return list;
            });
        },
        getCurrentProjectId:function(){
            return currentProjectId;
        },
        setCurrentProjectId:function(id){
            console.log("id");
            console.log(id);
            currentProjectId=id;
        },
        getProcessData:function(pId,id){
            return exeProjectService.find(pId).then(function(project){
                var processData=project.processData;
                return processData[id];
            });
        },
        createProcessProjectData:function(pId){
            exeProjectService.find(pId).then(function(exeProjectContent){
//                console.log('############');
//                console.log(pId);
//                console.log(exeProjectContent);
                var processDataRef=exeProjectRef.$child(pId).$child("processData");
                var productDataRef=exeProjectRef.$child(pId).$child("productData");
                ProcessService.list().then(function(processes){
                    var selectProcesses=f.extend(exeProjectContent.selected,processes);
                    _.each(selectProcesses,function(process){
                        process[Object.keys(process)[0]].path='template/processTemplate/description/description.html';
                        processDataRef.$update(process);
                        var processContent=process[Object.keys(process)[0]];
                        ProductService.list().then(function(products){
                            ProcessService.withProduct(processContent,products,processes);
                            if(Object.keys(processContent.input).length==1){
                                if(processContent.inputType=="product"){
                                    processContent.input[Object.keys(processContent.input)[0]].path='template/productTemplate/document.html';
                                    productDataRef.$update(processContent.input);
                                }
                                if(processContent.inputType=="process"){
                                    processDataRef.$update(processContent.input);
                                }
                            }

                            if(Object.keys(processContent.output).length==1){
                                if(processContent.outputType=="product"){
                                    processContent.output[Object.keys(processContent.output)[0]].path='template/productTemplate/document.html';
                                    productDataRef.$update(processContent.output);
                                }
                                if(processContent.outputType=="process"){
                                    processDataRef.$update(processContent.output);
                                }
                            }
                        });
                    });
                });
            });

//            var promise=exeProjectRefLoad.promise.then(function(){
//                var processDataRef=exeProjectRef.$child(pId).$child("processData");
//                var productDataRef=exeProjectRef.$child(pId).$child("productData");
//                _.each(processIds,function(processId){
//                    ProcessService.find(processId).then(function(processContent){
//                        var process={};
//                        process[processId]=processContent;
//                        processDataRef.$update(process);
//                        if(!_.isUndefined(processContent.input)&&!(processContent.input=="")){
//                            if(processContent.inputType=="document"){}
//                        }
//                    })
//                })
//            });
//            return promise;
        },
        /**
         *
         * @param process
         * @param processList
         * @param productList
         */
        withInputOutputAndEmbed:function(processContent,productList,processList){
            if(_.isUndefined(processList)|| _.isUndefined(productList)){
                console.log("processes and products is undefine");
                return processContent;
            }
//            console.log(productList);
//            console.log(processList);
//            console.log('processContent ');
            processContent=angular.copy(processContent);
            if(processContent.inputType=="product"){
                processContent.input=f.embedId(f.extendSingle(processContent.input,productList));
            }
            else{
                processContent.input= f.embedId(f.extendSingle(processContent.input,processList));
            }
//            console.log('after input');
            if(processContent.outputType=="product"){
                processContent.output= f.embedId(f.extendSingle(processContent.output,productList));
            }
            else{
                processContent.output= f.embedId(f.extendSingle(processContent.output,processList));
            }
            return processContent;
        },
        test:function(){
            return "hello world";
        }
    };
    return exeProjectService;
});