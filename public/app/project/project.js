/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("gcgl2016.project",['gcgl2016.process','gcgl2016.product','gcgl2016.activity']);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('project', {
            url: "/project",
            templateUrl: "app/project/project.html",
            resolve:{
                projectList:function(ProjectService){
                    return ProjectService.list();
                }
            },
            controller:function($scope,$state,$stateParams,ProjectService,projectList){
                $scope.projectList=projectList;
                $scope.remove=function(key){
                    ProjectService.remove(key).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.start=function(project){
                    ProjectService.start(project).then(function(){
                        $state.go("main");
                    });
                }

            }
        })
        .state('project.create', {
            url: "/create",
            templateUrl: "app/project/createProject.html",
            controller:function($scope,$state,ProjectService){
                $scope.project={};
                $scope.create=function(){
                    $scope.project.status="New";
                    ProjectService.create($scope.project).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('project.selectProcess',{
            url:"/selectProcess",
            templateUrl:"app/project/selectProcess.html",
            resolve:{
                projectList:function(ProjectService){
                    return ProjectService.list();
                },
                activityList:function(ActivityService){
                    return ActivityService.list();
                },
                tagList:function(TagService){
                    return TagService.list();
                },
                featureList:function(FeatureService){
                    return FeatureService.list();
                }
            },
            controller:function($scope,$state,f,ProjectService,projectList,activityList,tagList,featureList){
                $scope.cProject={};
                $scope.projectList=projectList;
                $scope.$watch('cProject.project',function(){
                    $scope.init();
                });
                $scope.init= function(){
                    $scope.activityList= f.copy(activityList);
                    $scope.tagList= f.copy(tagList);
                    $scope.featureList= f.copy(featureList);
                    if(!_.isUndefined($scope.cProject.project)){
                        _.each($scope.activityList,function(activity){
                            if(_.contains($scope.cProject.project.activities,activity.$id)){
                                activity.select=true;
                            }
                        });
                    }
                };
                $scope.selectTag=function(item){
                    item.select=true;
                    var tagId=item.$id;
                    _.each($scope.activityList,function(activity){
                        if(_.contains(activity.tags,tagId)){
                            activity.select=true;
                        }
                    });
                };
                $scope.unselectTag=function(item){
                    item.select=false;
                    var tagId=item.$id;
                    _.each($scope.activityList,function(activity){
                        if(_.contains(activity.tags,tagId)){
                            activity.select=false;
                        }
                    });
                };
                $scope.selectFeature=function(item){
                    item.select=true;
                    var featureId=item.$id;
                    _.each($scope.activityList,function(activity){
                        if(_.contains(activity.features,featureId)){
                            activity.select=true;
                        }
                    });
                };
                $scope.unselectFeature=function(item){
                    item.select=false;
                    var featureId=item.$id;
                    _.each($scope.activityList,function(activity){
                        if(_.contains(activity.features,featureId)){
                            activity.select=false;
                        }
                    });
                };
                $scope.selectActivity=function(item){
                    item.select=true;
                };
                $scope.unselectActivity=function(item){
                    item.select=false;
                };


                $scope.save=function(){
                    if(_.isUndefined($scope.cProject.project.$id)){
                        return;
                    }
                    var list=_.filter($scope.activityList,function(activity){
                        if(activity.select===true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    });
                    $scope.cProject.project.activities= f.toIds(list);
                    ProjectService.update($scope.cProject.project).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('project.edit', {
            url: "/edit/:id",
            views:{
                'main@':{
                    templateUrl: "project/editProject.html",
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
                    controller:function($scope,$state,$stateParams,ProjectService,project,selectIds,toSelectIds,processes,f){
                        $scope.project=project;
//                        console.log("0:new projectCopy");
//                        console.log($scope.projectCopy);
                        $scope.myData2 =f.embedIdsArray(f.extend(toSelectIds,processes));
                        $scope.myData = f.embedIdsArray(f.extend(selectIds,processes));

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
                            console.log($scope.rightItems);
                            $scope.myData2= _.difference($scope.myData2,$scope.rightItems);
                            $scope.myData=$scope.myData.concat($scope.rightItems);
                            $scope.gridOptions2.selectAll(false);
                        };
                        $scope.unselect=function(){
                            console.log($scope.leftItems);
                            $scope.myData= _.difference($scope.myData,$scope.leftItems);
                            $scope.myData2=$scope.myData2.concat($scope.leftItems);
                            $scope.gridOptions.selectAll(false);
                        };
                        $scope.save=function(){
//                            console.log("demo whether has ids");
//                            console.log(processes);
//                            console.log("1:projectCopy");
//                            console.log($scope.projectCopy);
                            $scope.project.selected=f.toIds($scope.myData);
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
                    templateUrl: "project/prepare.html",
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
                        subProcesses:function(ProcessService,f,ProjectService,project,processes,products){
                            console.log(processes);
                            console.log(project);
                            ProjectService.withProcess(project,processes);
                            var subProcesses=f.embedIdsArray(project.selected);
//                            //var withProcess=f.extend(project.selected,processes);
//                            console.log(project.selected);
                            console.log("subProcesses");
                            console.log(angular.copy(subProcesses));
                            _.each(subProcesses,function(process){
                                ProcessService.withProduct(process,products,processes);
                                process.input=f.embedId(process.input);
                                process.output=f.embedId(process.output);
                            });
//
//                            console.log("full project");
//                            console.log(project);

                            console.log("subProcesses");
                            console.log(subProcesses);
                            return subProcesses;

                        }
                    },
                    controller:function($scope,$state,$stateParams,ProjectService,ProcessService,ExeProjectService,subProcesses){
                        $scope.processes=subProcesses;
                        $scope.start=function(){
                            //1.update project's status to Active
                            //2.copy project to exeProject
                            //3.create processData field and paste all selected process to it
                            ProjectService.find($stateParams.id).then(function(project){
                                var projectId=$stateParams.id;
                                project.status="Active";
                                console.log("project");
                                console.log(project);
                                ProjectService.update(projectId,project).then(function(){
                                    var exeProject={};
                                    exeProject[projectId]=project;
                                    console.log("exeProject");
                                    console.log(exeProject);
                                    ExeProjectService.create(exeProject).then(function(){
                                        ExeProjectService.createProcessProjectData(projectId);
                                    });
                                    $state.go("^",{},{reload:true});
                                });

                            });
                        };
//                        console.log(subProcesses);
                    }
                }
            }
        });
});
app.factory('ProjectService', function(f,ActivityService,ProductService) {

    var ref = f.ref("/project");
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
        start: function(project){
            project.status="Active";
            return ActivityService.list().then(function(activityList){
                project.exeActivities={};
                _.each(activityList,function(activity){
                    if(_.contains(project.activities,activity.$id)){
                        project.exeActivities[activity.$id]=activity;
                    }
                });
                ProductService.list().then(function(productList){
                    project.exeProducts={};
                    _.each(productList,function(product){
                        _.each(project.activities,function(activityId){
                            if(_.contains(project.exeActivities[activityId].inputs,product.$id)){
                                project.exeProducts[product.$id]=product;
                            }
                            if(_.contains(project.exeActivities[activityId].outputs,product.$id)){
                                project.exeProducts[product.$id]=product;
                            }
                        });
                    });
                    return list.$save(project);
                });
            });
        }
    };
    return service;
//
//    var projectRef = f.ref("/project");
//    var projectRefLoad=$q.defer();
//    projectRef.$on("loaded",function(){
//        projectRefLoad.resolve(projectRef);
//    });
//    var processRef = f.ref("/process");
//    var processRefLoad=$q.defer();
//    processRef.$on("loaded",function(){
//        processRefLoad.resolve(projectRef);
//    });
//
//
//    //Public Method
//    var projectService = {
//        create: function(project) {
//            return projectRef.$add(project);
//        },
//        remove: function(key){
//            return projectRef.$remove(key);
//        },
//        update: function(key,value){
//            var obj={};
//            obj[key]=value;
//            return projectRef.$update(obj);
//        },
//        find:function(key){
//            var promise=projectRefLoad.promise.then(function(){
////                console.log("projectRef[key]");
////                console.log(f.copy(projectRef[key]));
//                return f.copy(projectRef[key]);
//            });
//            return promise;
//        },
//        list: function(){
//            return projectRefLoad.promise.then(function(data){
//                return f.copyList(data);
//            });
//        },
//        //project without key, project modified , no return
//        withProcess:function(project,processList){
////            console.log(productList);
////            console.log(processList);
//            project.selected=f.extend(project.selected,processList);
//        }
//    };
//    return projectService;
});



