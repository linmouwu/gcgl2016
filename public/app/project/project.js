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
                projectListRef:function(ProjectService){
                    return ProjectService.getRefArray();
                }
            },
            controller:function($scope,$state,f,$stateParams,ProjectService,projectListRef){
                $scope.projectList= f.copy(projectListRef);
                $scope.selected={};
                $scope.select=function(item){
                    $scope.selected=item;
                };
                $scope.selectProcess=function(project){
                    if(_.isEmpty(project)){
                        return;
                    }
                    $state.go('project.selectProcess',{projectId:project.$id});
                };
                $scope.remove=function(item){
                    f.remove(projectListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.start=function(project){
                    if(_.isEmpty(project)){
                        return;
                    }
                    $state.go("project.start",{projectId:project.$id});
                };

            }
        })
        .state('project.start', {
            url: "/start/:projectId",
            templateUrl: "app/project/startProject.html",
            resolve:{
                project:function($stateParams,projectListRef){
                    return projectListRef.$getRecord($stateParams.projectId);
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                exeActivityListRef:function($stateParams,ActivityService){
                    return ActivityService.getRefArrayExe($stateParams.projectId);
                },
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                exeProductListRef:function($stateParams,ProductService){
                    return ProductService.getRefArrayExe($stateParams.projectId);
                },
                tagListRef:function(TagService){
                    return TagService.getRefArray();
                },
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
                activityTemplateListRef:function(TemplateService){
                    return TemplateService.getRefArray('activity');
                },
                productTemplateListRef:function(TemplateService){
                    return TemplateService.getRefArray('product');
                }
            },
            controller:function($scope,$state,f,ActivityService,ProductService,project,activityListRef,productListRef,featureListRef,
                                activityTemplateListRef,productTemplateListRef,projectListRef,exeActivityListRef,exeProductListRef){
                $scope.project=project;
                //products
                $scope.exeActivityListRef=exeActivityListRef;
                $scope.exeActivities={};
                $scope.exeProductListRef=exeProductListRef;
                $scope.exeProducts={};

                //activitiy extend
                $scope.exeActivities= f.extend(project.activities,activityListRef);
                //activity.templates get
                _.each($scope.exeActivities,function(activity){
                    activity.id=activity.$id;
                    activity.inputs= f.extend(activity.inputs,productListRef);
                    _.each(activity.inputs,function(item){
                        item.id=item.$id;
                        item.exeTemplate= f.extendSingle(item.template,productTemplateListRef);
                        if(!f.isNullOrUndefined(item.exeTemplate)){
                            item.exeTemplate.id=item.template;
                        }
                    });
                    activity.outputs= f.extend(activity.outputs,productListRef);
                    _.each(activity.outputs,function(item){
                        item.id=item.$id;
                        item.exeTemplate= f.extendSingle(item.template,productTemplateListRef);
                        if(!f.isNullOrUndefined(item.exeTemplate)){
                            item.exeTemplate.id=item.template;
                        }
                    });
                    activity.exeTemplates= f.extend(_.pluck(activity.fts,'template'),activityTemplateListRef);
                    _.each(activity.exeTemplates,function(item){
                        item.id=item.$id;
                    });
                });
//                //products extend
//                $scope.exeProducts= f.extend($scope.exeProducts,productListRef);
//                //product.templates get
//                _.each($scope.exeProducts,function(product){
//                    product.exeTemplate= f.extendSingle(product.template,productTemplateListRef);
//                });
                var result= f.compareArray($scope.exeActivityListRef,$scope.exeActivities,'id');
                $scope.newActivities=result.news;
                $scope.stayActivities=result.changes;
                _.each($scope.stayActivities,function(changes){
                    changes.inputChanges=getCompare(changes.oldItem,changes.newItem,"inputs")
                    changes.outputChanges=getCompare(changes.oldItem,changes.newItem,"outputs")
                    changes.templatesChanges=getCompare(changes.oldItem,changes.newItem,"exeTemplates")
                });
                $scope.delActivities=result.dels;
                $scope.relate=function(activity,property){
                    var old=$scope.exeActivityListRef.$getRecord(activity.$id);
                    if(old && old[property]===activity[property]){
                        return old[property];
                    }
                    else{
                        return null;
                    }
                };
                $scope.relateProduct=function(product,property){
                    var old=$scope.exeProductListRef.$getRecord(product.$id);
                    if(old && old[property]===product[property]){
                        return old[property];
                    }
                    else{
                        return null;
                    }
                };
                $scope.relateTemplate=function(product,property){
                    var old=$scope.exeProductListRef.$getRecord(product.$id);
                    if(old && old.exeTemplate.id===product.exeTemplate.id){
                        return old.exeTemplate.id;
                    }
                    else{
                        return null;
                    }
                };
                function getCompare(oldActivity,newActivity,property){
                    var oldProperty=oldActivity[property];
                    var newProperty=newActivity[property];
                    var result= f.compareArray(oldProperty,newProperty,'id');
                    return result;
                };

//                //products get
                var products= _.flatten(_.pluck($scope.exeActivities,"inputs").concat(_.pluck($scope.exeActivities,"outputs")));
                $scope.exeProducts= _.uniq(products,false,function(item){
                    return item.id;
                });

                var result2=f.compareArray($scope.exeProductListRef,$scope.exeProducts,'id');
                $scope.newProducts=result2.news;
                $scope.stayProducts=result2.changes;
                $scope.delProducts=result2.dels;


                $scope.start=function(){
                    //add
                    _.each($scope.newProducts,function(product){
                        f.add(exeProductListRef,product);
                    });
                    _.each($scope.newActivities,function(activity){
                        f.add(exeActivityListRef,activity);
                    });
                    //alter
                    _.each($scope.stayProducts,function(changes){
                        ProductService.save(exeProductListRef,changes.oldItem,changes.newItem);
                    });
                    _.each($scope.stayActivities,function(changes){
                        ActivityService.save(exeActivityListRef,changes.oldItem,changes.newItem);
                    });
                    //delete
                    _.each($scope.delProducts,function(product){
                        f.remove(exeProductListRef,product);
                    });
                    _.each($scope.delActivities,function(activity){
                        f.remove(exeActivityListRef,activity);
                    });

                    //activity.inputs and outputs to ids
//                    _.each(exeActivityListRef,function(activity){
//                        var inputs=[];
//                        _.each(activity.inputs,function(product){
//                            var exeProduct=ProductService.findByProperty(exeProductListRef,'id',product.id);
//                            if(!f.isNullOrUndefined(exeProduct)){
//                                inputs.push(exeProduct.$id);
//                            }
//                        });
//                        var outputs=[];
//                        _.each(activity.inputs,function(product){
//                            var exeProduct=ProductService.findByProperty(exeProductListRef,'id',product.id);
//                            if(!f.isNullOrUndefined(exeProduct)){
//                                outputs.push(exeProduct.$id);
//                            }
//                        });
//                        activity.inputs=inputs;
//                        activity.outputs=outputs;
//                        f.save(exeActivityListRef,activity);
//                    });
                    $state.go("main");
                };

            }
        })
        .state('project.create', {
            url: "/create",
            templateUrl: "app/project/createProject.html",
            controller:function($scope,$state,f,projectListRef){
                $scope.project={};
                $scope.create=function(project){
                    project.status="New";
                    f.add(projectListRef,project).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('project.selectProcess',{
            url:"/selectProcess/:projectId",
            templateUrl:"app/project/selectProcess.html",
            resolve:{
                project:function($stateParams,projectListRef){
                    return projectListRef.$getRecord($stateParams.projectId);
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                tagListRef:function(TagService){
                    return TagService.getRefArray();
                },
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                }
            },
            controller:function($scope,$state,f,project,activityListRef,tagListRef,featureListRef,projectListRef){
                $scope.project=project;
                $scope.projectList=[];
                $scope.activityList= f.copy(activityListRef);
                $scope.tagList= f.copy(tagListRef);
                $scope.featureList= f.copy(featureListRef);
                _.each($scope.activityList,function(activity){
                    if(_.contains($scope.project.activities,activity.$id)){
                        activity.select=true;
                    }
                });
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


                $scope.save=function(project){
                    var list=_.filter($scope.activityList,function(activity){
                        if(activity.select===true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    });
                    $scope.project.activities= f.toIds(list);
                    f.save(projectListRef,project).then(function(){
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
        });
//        .state('project.start', {
//            url: "/start/:id",
//            views:{
//                'main@':{
//                    templateUrl: "project/prepare.html",
//                    resolve:{
//                        project:function(ProjectService,$stateParams){
//                            return ProjectService.find($stateParams.id);
//                        },
//                        products:function(ProductService){
//                            return ProductService.list();
//                        },
//                        processes:function(ProcessService){
//                            return ProcessService.list();
//                        },
//                        subProcesses:function(ProcessService,f,ProjectService,project,processes,products){
//                            console.log(processes);
//                            console.log(project);
//                            ProjectService.withProcess(project,processes);
//                            var subProcesses=f.embedIdsArray(project.selected);
////                            //var withProcess=f.extend(project.selected,processes);
////                            console.log(project.selected);
//                            console.log("subProcesses");
//                            console.log(angular.copy(subProcesses));
//                            _.each(subProcesses,function(process){
//                                ProcessService.withProduct(process,products,processes);
//                                process.input=f.embedId(process.input);
//                                process.output=f.embedId(process.output);
//                            });
////
////                            console.log("full project");
////                            console.log(project);
//
//                            console.log("subProcesses");
//                            console.log(subProcesses);
//                            return subProcesses;
//
//                        }
//                    },
//                    controller:function($scope,$state,$stateParams,ProjectService,ProcessService,ExeProjectService,subProcesses){
//                        $scope.processes=subProcesses;
//                        $scope.start=function(){
//                            //1.update project's status to Active
//                            //2.copy project to exeProject
//                            //3.create processData field and paste all selected process to it
//                            ProjectService.find($stateParams.id).then(function(project){
//                                var projectId=$stateParams.id;
//                                project.status="Active";
//                                console.log("project");
//                                console.log(project);
//                                ProjectService.update(projectId,project).then(function(){
//                                    var exeProject={};
//                                    exeProject[projectId]=project;
//                                    console.log("exeProject");
//                                    console.log(exeProject);
//                                    ExeProjectService.create(exeProject).then(function(){
//                                        ExeProjectService.createProcessProjectData(projectId);
//                                    });
//                                    $state.go("^",{},{reload:true});
//                                });
//
//                            });
//                        };
////                        console.log(subProcesses);
//                    }
//                }
//            }
//        });
});
app.factory('ProjectService', function(f,ActivityService,ProductService) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref('/project').$asArray().$loaded();
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



