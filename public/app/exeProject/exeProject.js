var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('main',{
            url:"/main",
            views:{
                'main@':{
                    templateUrl:"app/exeProject/processList.html",
                    resolve:{
                        projects:function(ExeProjectService){
                            return ExeProjectService.list();
                        },
                        currentProject:function(ExeProjectService,projects){
//                            console.log("ExeProjectService.getCurrentProjectId()");
//                            console.log(ExeProjectService.getCurrentProjectId());
                            return angular.copy(projects[ExeProjectService.getCurrentProjectId()]);
                        }
                    },
                    controller:function($scope,$stateParams,$state,firebaseService,ExeProjectService,projects,currentProject){
                        $scope.projects=projects;
                        console.log("projects");
                        console.log(projects);
                        $scope.selectId=ExeProjectService.getCurrentProjectId();
                        $scope.myData = [];
                        if(!_.isUndefined(currentProject)){
                            $scope.myData=firebaseService.embedIds(currentProject.processData);
                        };
                        $scope.mySelections=[];
                        $scope.gridOptions = {
                            data: 'myData',
                            columnDefs: [{field:'name', displayName:'Name'},
                                {field:'input.name', displayName:'Input'},
                                {field:'output.name', displayName:'Output'}
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
                        }
                        $scope.remove=function(){
                            ExeProjectService.remove($scope.selectId);
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });

                        }
                        $scope.enterProcess=function(){
                            if($scope.mySelections.length==0){
                                return;
                            }
                            $state.go("main.process",{id:$scope.mySelections[0].id,pId:$scope.selectId});
                        }
                    }
                }
            }
        })
        .state('main.process',{
            url:"/process/:pId/:id",
            views:{
                'main@':{
                    templateUrl:"app/exeProject/processExe.html",
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
        })
});

app.factory('ExeProjectService', function(firebaseService,$q) {
    var exeProjectRef = firebaseService.ref("/exeProject");
    var exeProjectRefLoad=$q.defer();
    exeProjectRef.$on("loaded",function(){
        exeProjectRefLoad.resolve(exeProjectRef);
    });
    var currentProjectId="";


    //Public Method
    var exeProjectService = {
        create: function(project) {
            return exeProjectRef.$add(project);
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
//                console.log(firebaseService.copy(projectRef[key]));
                return firebaseService.copy(exeProjectRef[key]);
            });
            return promise;
        },
        list: function(){
            return exeProjectRefLoad.promise.then(function(data){
                console.log("data");
                console.log(data);
                return firebaseService.copyList(data);
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
            })
        },
        addProcessData:function(pId,processData){
            var promise=exeProjectRefLoad.promise.then(function(){
                var processDataRef=exeProjectRef.$child(pId).$child("processData");
                return processDataRef.$add(processData);
            });
            return promise;
        }
    };
    return exeProjectService;
});
