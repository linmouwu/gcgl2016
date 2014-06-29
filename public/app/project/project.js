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
                    controller:function($scope,ProjectService,projectList){
                        $scope.projectList=projectList;
                        $scope.remove=function(key){
                            ProjectService.remove(key).then(function(){
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
            url: "/project/create",
            views:{
                'main@':{
                    templateUrl: "app/project/createProject.html",
                    controller:function($scope,$state,ProjectService){
                        $scope.project={};
                        $scope.create=function(){
                            ProjectService.create($scope.project).then(function(){
                                console.log("CreateProjectController:Create Success");
                                $state.go("^");
                            },function(){
                                console.log("CreateProjectController:Create Failed");
                            })
                        }
                    }
                }
            }
        })
        .state('project.edit', {
            url: "/project/edit/:id",
            views:{
                'main@':{
                    templateUrl: "app/project/editProject.html",
                    resolve:{
                        beforeSelectIds:function(ProjectService,ProcessService,$stateParams,project){
                            var processIds=ProcessService.list().$getIndex();
                            var has=function(id){
                                if(_.contains(project.selected,id)){
                                    return false;
                                }
                                return true;
                            };
                            var listAfterHas= _.filter(processIds,has);
                            //var selectId=_.filter(listAfterHas,isFollow);
                            return listAfterHas;
                        },
                        project:function(ProjectService,$stateParams){
                            return ProjectService.find($stateParams.id);
                        }
                    },
                    controller:function($scope,$state,$stateParams,ProjectService,project,beforeSelect,$stateParams,firebaseService){
                        $scope.project=project;
                        $scope.myData2 =beforeSelect;
//    console.log($scope.myData2);
//    console.log($scope.project);

                        if(_.isUndefined($scope.project.selected)){
//        console.log("undefine");
                            $scope.project.selected=[];
                        }
                        $scope.myData = $scope.project.selected;
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
                        }
                        $scope.unselect=function(){
                            console.log($scope.leftItems)
                            $scope.myData= _.difference($scope.myData,$scope.leftItems)
                            $scope.myData2=$scope.myData2.concat($scope.leftItems);
                            $scope.gridOptions.selectAll(false);
                        }
                        $scope.save=function(){
                            $scope.project.selected=firebaseService.toIds($scope.myData);
                            ProjectService.update($stateParams.id);
                        }
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
        list: function(){
            return projectRefLoad.promise;
        },
        remove: function(key){
            return projectRef.$remove(key);
        },
        update: function(key){
            return projectRef.$save(key);
        },
        beforeSelect:function(key){
            var promise=$q.all([processRefLoad.promise,projectRefLoad.promise]).then(function(){
                var list=processRef.$getIndex();
                //filter
                //1.Is follow
//                var isFollow=function(id){
//                    _.each(processRef.$getIndex(),function(index){
//                        if(_.contains(processRef[index].follows),id){
//                            return false;
//                        }
//                    });
//                    return true;
//                }
                //2.Project has already
                var has=function(id){
                    if(_.contains(projectRef[key].selected,id)){
                        return false;
                    }
                    return true;
                };

                var listAfterHas= _.filter(list,has);
                //var selectId=_.filter(listAfterHas,isFollow);
                return firebaseService.extend(listAfterHas,processRef);

            });
        return promise;
        },
        find:function(key){
//            console.log("find");
            var promise=$q.all([processRefLoad.promise,projectRefLoad.promise]).then(function(){
                var ret=projectRef[key];
//                console.log(ret);
                ret.selected=firebaseService.extend(ret.selected,processRef);
//                console.log(ret);
                return ret;
            });
            return promise;
        }
    };
    return projectService;
});



