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
                    controller:"ProjectController",
                    resolve:{
                        projectList:function(ProjectService){
                            return ProjectService.list();
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
                    controller:"CreateProjectController"
                }
            }
        })
        .state('project.edit', {
            url: "/project/edit/:id",
            views:{
                'main@':{
                    templateUrl: "app/project/editProject.html",
                    controller:"EditProjectController",
                    resolve:{
                        project:function(ProjectService,$stateParams){
                            return ProjectService.find($stateParams.id);
                        },
                        beforeSelect:function(ProjectService){
                            return ProjectService.beforeSelect();
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
        find:function(key){
            var promise=projectRefLoad.promise.then(function(){
                return projectRef[key];
            });
            return promise;
        },
        beforeSelect:function(){
            var promise=processRefLoad.promise.then(function(){
                var list=processRef.$getIndex();
                console.log(list);
                //filter
                //1.Is follow
                var isFollow=function(id){
                    _.each(processRef.$getIndex(),function(index){
                        if(_.contains(processRef[index].follows),id){
                            return false;
                        }
                    });
                    return true;
                }
                //2.Project has already
                //todo
                var selectId= _.filter(list,isFollow);
                console.log(selectId);
                return _.map(selectId,function(id){
                    return processRef[id];
                })

            });
            return promise;
        }
    };
    return projectService;
});

app.controller("ProjectController",function($scope,ProjectService,projectList){
    $scope.projectList=projectList;
    $scope.remove=function(key){
        ProjectService.remove(key).then(function(){
            console.log("ProjectController:Remove Successful");
        },function(){
            console.log("ProjectController:Remove failed");
        })
    }

});
app.controller("CreateProjectController",function($scope,$state,ProjectService){
    $scope.project={};
    $scope.create=function(){
        ProjectService.create($scope.project).then(function(){
            console.log("CreateProjectController:Create Success");
            $state.go("^");
        },function(){
            console.log("CreateProjectController:Create Failed");
        })
    }
});
app.controller("EditProjectController",function($scope,$state,$stateParams,ProjectService,project,beforeSelect){
    $scope.project=project;
    $scope.myData2 =beforeSelect;



    $scope.project.selected=[];
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
});