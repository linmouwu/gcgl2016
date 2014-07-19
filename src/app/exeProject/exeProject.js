var app=angular.module("gcgl2016.exeProject",['ui.router','gcgl2016.firebase','gcgl2016.project','ui.bootstrap']);
app.config(function($stateProvider){
    $stateProvider
        .state('main',{
            url:"/main",
            views:{
                'main@':{
                    templateUrl:"exeProject/processList.html",
                    resolve:{
                        projects:function(ExeProjectService){
                            return ExeProjectService.list();
                        },
                        currentProcesses:function(ExeProjectService,f,projects){
//                            console.log("ExeProjectService.getCurrentProjectId()");
//                            console.log(ExeProjectService.getCurrentProjectId());
                            var project=angular.copy(projects[ExeProjectService.getCurrentProjectId()]);
                            if(_.isUndefined(project)){
                                return project;
                            }
//                            console.log('0.9');
//                            console.log(project.selected);
//                            console.log(project.processData);
                            var subProcess= f.extend(project.selected,project.processData);
//                            console.log("1.Sub Process");
//                            console.log(subProcess);
                            subProcess=_.map(project.processData,function(processContent,id){
                                processContent.id=id;
                                console.log('processContent');
                                console.log(processContent);
                                return ExeProjectService.withInputOutputAndEmbed(processContent,project.productData,project.processData);
                            });
                            console.log("This processes must have list inside.");
                            console.log(subProcess);
                            return subProcess;
                        }
                    },
                    controller:function($scope,$stateParams,$state,f,ExeProjectService,projects,currentProcesses){
                        $scope.projects=projects;
                        console.log("projects");
                        console.log(projects);
                        $scope.selectId=ExeProjectService.getCurrentProjectId();
                        $scope.myData = [];
                        if(!_.isUndefined(currentProcesses)){
                            $scope.myData=currentProcesses;
                        }
                        $scope.mySelections=[];
                        console.log("$scope.myData");
                        console.log($scope.myData);
                        $scope.gridOptions = {
                            data: 'myData',
                            columnDefs: [{field:'name', displayName:'Name'},
                                {field:'input.name', displayName:'Input'},
                                {field:'input.status',displayName:'Input Status'},
                                {field:'output.name', displayName:'Output'},
                                {field:'output.status', displayName:'Output Status'},
                                {field:'status', displayName:'Process Status'}
                            ],
                            selectedItems: $scope.mySelections,
                            multiSelect: false
                        };
                        $scope.select=function(){
                            console.log("$scope.selectId");
                            console.log($scope.selectId);
                            ExeProjectService.setCurrentProjectId($scope.selectId);

                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        };
                        $scope.remove=function(){
                            ExeProjectService.remove($scope.selectId);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });

                        };
                        $scope.enterProcess=function(){
                            if($scope.mySelections.length===0){
                                return;
                            }
                            if($scope.mySelections[0].status==="finish"){
                                return;
                            }
                            console.log('$scope.mySelections');
                            console.log($scope.mySelections);
                            $state.go("main.process",{id:$scope.mySelections[0].id,pId:$scope.selectId});
                        };
                    }
                }
            }
        })
        .state('main.process',{
            url:"/process/:pId/:id",
            views:{
                'main@':{
                    templateUrl:"exeProject/processExe.html",
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
app.factory('ExeProjectService', function(f,ProjectService,ProcessService,ProductService,$q) {
    var exeProjectRef = f.ref("/exeProject");
    var exeProjectRefLoad=$q.defer();
    exeProjectRef.$on("loaded",function(){
        exeProjectRefLoad.resolve(exeProjectRef);
    });
    var currentProjectId="";


    //Public Method
    var exeProjectService = {
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
            return exeProjectRefLoad.promise.then(function(data){
//                console.log("data");
//                console.log(data);
                return f.copyList(data);
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
        },
        updateFields:function(productId,fields){
            exeProjectService.find(pId).then(function(exeProjectContent){
                var productDataRef=exeProjectRef.$child(pId).$child("productData".$child(productId));
            });
            console.log('updateFields');
            console.log(productId);
            console.log(fields);
            return productService.find(productId).then(function(productContent){
                productContent.fields=fields;
                console.log('productContent');
                console.log(productContent);
                return productService.update(productId,productContent);
            });
        }
    };
    return exeProjectService;
});
app.factory('ProductDataService',function($q,f){
    var productDataRef;
    var productDataRefLoad;

    var productDataService = {
        setProject:function(projectId){
            productDataRef= f.ref("/exeProject/"+projectId+"/productData");
            productDataRefLoad=$q.defer();
            productDataRef.$on("loaded",function(){
                productDataRefLoad.resolve(productDataRef);
            });
            return;
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return productDataRef.$update(obj);
        },
        find:function(key){
            var promise=productDataRefLoad.promise.then(function(){
                return f.copy(productDataRef[key]);
            });
            return promise;
        }
    };
    return productDataService;
});

app.factory('ProcessDataService',function($q,f){

    var processDataRef;
    var processDataRefLoad;

    var processDataService = {
        setProject:function(projectId){
            processDataRef= f.ref("/exeProject/"+projectId+"/processData");
            processDataRefLoad=$q.defer();
            processDataRef.$on("loaded",function(){
                processDataRefLoad.resolve(processDataRef);
            });
            return;
        },
        find:function(key){
            var promise=processDataRefLoad.promise.then(function(){
                return f.copy(processDataRef[key]);
            });
            return promise;
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return processDataRef.$update(obj);
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