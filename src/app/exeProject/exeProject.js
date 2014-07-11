var app=angular.module("gcgl2016.exeProject",['ui.router','gcgl2016.firebase','gcgl2016.project']);
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
                        currentProcesses:function(ExeProjectService,projects){
//                            console.log("ExeProjectService.getCurrentProjectId()");
//                            console.log(ExeProjectService.getCurrentProjectId());
                            var project=angular.copy(projects[ExeProjectService.getCurrentProjectId()]);
                            if(_.isUndefined(project)){
                                return project;
                            }
                            console.log("This project doesn't have processData with");
                            console.log(project);
                            var subProcess=project.processData;
                            subProcess=_.map(project.processData,function(process){
                                ExeProjectService.withInputOutput(process,angular.copy(project.processData),project.productData);
                                return process;
                            });
                            console.log("This project must have processData with");
                            console.log(project);
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
                            $scope.myData=f.embedIdsObj(currentProcesses);
                        }
                        $scope.mySelections=[];
                        console.log("$scope.myData");
                        console.log($scope.myData);
                        $scope.gridOptions = {
                            data: 'myData',
                            columnDefs: [{field:'name', displayName:'Name'},
                                {field:'input', displayName:'Input'},
                                {field:'output', displayName:'Output'}
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
                        process:function(ExeProjectService,$stateParams){
                            return ExeProjectService.getProcess($stateParams.pId,$stateParams.id);
                        }
                    },
                    controller:function($scope,process){
                        $scope.process=process;
                    }

                }
            }
        });
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
//                console.log("projectRef[key]");
//                console.log(f.copy(projectRef[key]));
                return f.copy(exeProjectRef[key]);
            });
            return promise;
        },
        list: function(){
            return exeProjectRefLoad.promise.then(function(data){
                console.log("data");
                console.log(data);
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
        getProcess:function(pId,id){
            return exeProjectService.find(pId).then(function(project){
                return _.filter(project.selected,function(process){
                    if(process.id==id){
                        return true;
                    }
                })[0];
            });
        },
        createProcessProjectData:function(pId){
            exeProjectService.find(pId).then(function(exeProjectContent){
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
                                    productDataRef.$update(processContent.input);
                                }
                                if(processContent.inputType=="process"){
                                    processDataRef.$update(processContent.input);
                                }
                            }

                            if(Object.keys(processContent.output).length==1){
                                if(processContent.outputType=="product"){
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
        withInputOutputAndEmbed:function(process,processList,productList){
            if(_.isUndefined(processList)|| _.isUndefined(productList)){
                console.log("process and products is undefine");
                return;
            }
//            console.log(productList);
//            console.log(processList);
            var processContent=f.getContent(process);
            if(processContent.inputType=="product"){
                processContent.input=f.embedId(f.extendSingle(processContent.input,productList));
            }
            else{
                processContent.input=f.extendSingle(processContent.input,processList);
            }
            if(processContent.outputType=="product"){
                processContent.output=f.extendSingle(processContent.output,productList);
            }
            else{
                processContent.output=f.extendSingle(processContent.output,processList);
            }
        },
        test:function(){
            return "hello world";
        }
    };
    return exeProjectService;
});
