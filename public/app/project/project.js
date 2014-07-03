/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('project', {
            url: "/project",
            views:{
                'main@':{
                    templateUrl: "app/project/project.html",
                    resolve:{
                        projectList:function(ProjectService){
                            return ProjectService.list();
                        }
                    },
                    controller:function($scope,$state,ProjectService,projectList){
                        $scope.projectList=projectList;
                        $scope.remove=function(key){
                            ProjectService.remove(key).then(function(){
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                                console.log("ProjectController:Remove Successful");
                            },function(){
                                console.log("ProjectController:Remove failed");
                            })
                        }

                    }
                }
            }
        })
        .state('project.create', {
            url: "/create",
            views:{
                'main@':{
                    templateUrl: "app/project/createProject.html",
                    controller:function($scope,$state,ProjectService){
                        $scope.project={};
                        $scope.create=function(){
                            $scope.project.status="New";
                            ProjectService.create($scope.project).then(function(){
                                console.log("CreateProjectController:Create Success");
                                $state.go("^",{},{reload:true});
                            },function(){
                                console.log("CreateProjectController:Create Failed");
                            })
                        }
                    }
                }
            }
        })
        .state('project.edit', {
            url: "/edit/:id",
            views:{
                'main@':{
                    templateUrl: "app/project/editProject.html",
                    resolve:{
                        project:function(ProjectService,$stateParams){
                            return ProjectService.find($stateParams.id);
                        },
                        processes:function(ProcessService){
                            return ProcessService.list();
                        },
                        toSelectIds:function(ProjectService,ProcessService,project,processes){
//                            console.log("project");
//                            console.log(project);
                            var processIds=Object.keys(processes);
                            var has=function(id){
                                if(_.contains(project.selected,id)){
                                    return false;
                                }
                                return true;
                            };
                            var listAfterHas= _.filter(processIds,has);
                            //var selectId=_.filter(listAfterHas,isFollow);
                            console.log(listAfterHas);
                            return listAfterHas;
                        },
                        selectIds:function(project){
//                            console.log("project.selected");
//                            console.log(project.selected);
//                            console.log(project);
                            return angular.copy(project.selected);
                        }
                    },
                    controller:function($scope,$state,$stateParams,ProjectService,project,selectIds,toSelectIds,processes,$stateParams,firebaseService){
                        $scope.project=project;
//                        console.log("0:new projectCopy");
//                        console.log($scope.projectCopy);
                        $scope.myData2 =angular.copy(firebaseService.extend(toSelectIds,processes));
                        $scope.myData = angular.copy(firebaseService.extend(selectIds,processes));

//                        console.log($scope.myData2);
//                        console.log($scope.myData);

                        $scope.leftItems=[];
                        $scope.rightItems=[];
                        $scope.gridOptions = {
                            data: 'myData',
                            selectedItems:$scope.leftItems,
                            columnDefs: [{ field: 'name', displayName: 'Process Name'}]
                        };
                        $scope.gridOptions2 = {
                            data: 'myData2',
                            selectedItems:$scope.rightItems,
                            columnDefs: [{ field: 'name', displayName: 'Process Name'}]
                        };
                        $scope.select=function(){
                            console.log($scope.rightItems)
                            $scope.myData2= _.difference($scope.myData2,$scope.rightItems)
                            $scope.myData=$scope.myData.concat($scope.rightItems);
                            $scope.gridOptions2.selectAll(false);
                        };
                        $scope.unselect=function(){
                            console.log($scope.leftItems)
                            $scope.myData= _.difference($scope.myData,$scope.leftItems)
                            $scope.myData2=$scope.myData2.concat($scope.leftItems);
                            $scope.gridOptions.selectAll(false);
                        };
                        $scope.save=function(){
//                            console.log("demo whether has ids");
//                            console.log(processes);
//                            console.log("1:projectCopy");
//                            console.log($scope.projectCopy);
                            $scope.project.selected=firebaseService.toIds($scope.myData);
//                            console.log("2:projectCopy with new selected");
//                            console.log($scope.projectCopy);
                            console.log($scope.project);
                            ProjectService.update($stateParams.id,$scope.project);
                            $state.go("^",{},{reload:true});
                        };
                    }
                }
            }
        })
        .state('project.start', {
            url: "/start/:id",
            views:{
                'main@':{
                    templateUrl: "app/project/prepare.html",
                    resolve:{
                        project:function(ProjectService,$stateParams){
                            return ProjectService.find($stateParams.id);
                        },
                        products:function(ProductService){
                            return ProductService.list();
                        },
                        processes:function(ProcessService){
                            return ProcessService.list();
                        },
                        subProcesses:function(ProcessService,firebaseService,ProjectService,project,processes,products){
                            console.log(processes);
                            console.log(project);
                            ProjectService.withProcess(project,processes);
//                            //var withProcess=firebaseService.extend(project.selected,processes);
//                            console.log(project.selected);
                            _.each(project.selected,function(process){
                                ProcessService.withProduct(process,products,processes);
                            });
//
//                            console.log("full project");
//                            console.log(project);

                            return project.selected;

                        }
                    },
                    controller:function($scope,$state,ProjectService,subProcesses){
                        $scope.processes=subProcesses;
                        console.log(subProcesses);
                    }
                }
            }
        });
});
app.factory('ProjectService', function(firebaseService,$q) {
    var projectRef = firebaseService.ref("/project");
    var projectRefLoad=$q.defer();
    projectRef.$on("loaded",function(){
        projectRefLoad.resolve(projectRef);
    });
    var processRef = firebaseService.ref("/process");
    var processRefLoad=$q.defer();
    processRef.$on("loaded",function(){
        processRefLoad.resolve(projectRef);
    });


    //Public Method
    var projectService = {
        create: function(project) {
            return projectRef.$add(project);
        },
        remove: function(key){
            return projectRef.$remove(key);
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return projectRef.$update(obj);
        },
        find:function(key){
            var promise=projectRefLoad.promise.then(function(){
//                console.log("projectRef[key]");
//                console.log(firebaseService.copy(projectRef[key]));
                return firebaseService.copy(projectRef[key]);
            });
            return promise;
        },
        list: function(){
            return projectRefLoad.promise.then(function(data){
                return firebaseService.copyList(data);
            });
        },
        //project without key, project modified , no return
        withProcess:function(project,processList){
//            console.log(productList);
//            console.log(processList);
            project.selected=firebaseService.extend(project.selected,processList);
        }
    };
    return projectService;
});



