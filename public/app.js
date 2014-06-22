var app=angular.module("myApp",['ui.router','firebase','ui.bootstrap','myApp.directives','myApp.directives.uiBreadcrumbs','myApp.firebase','ngGrid','myApp.util']);
app.config(function($stateProvider, $urlRouterProvider){
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/dashboard");
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            views:{
                'main@':{
                    templateUrl: "app/dashboard/index.html"
                }
            }
        })
        .state('flot', {
            url: "/flot",
            views:{
                'main@':{
                    templateUrl: "app/charts/flot.html"
                }
            }
        })
        .state('morris', {
            url: "/morris",
            views:{
                'main@':{
                    templateUrl: "app/charts/morris.html"
                }
            }
        })
        .state('tables', {
            url: "/tables",
            views:{
                'main@':{
                    templateUrl: "app/tables/tables.html"
                }
            }
        })
        .state('forms', {
            url: "/forms",
            views:{
                'main@':{
                    templateUrl: "app/forms/forms.html"
                }
            }
        })
        .state('panels-wells', {
            url: "/panels-wells",
            views:{
                'main@':{
                    templateUrl: "app/ui-elements/panels-wells.html"
                }
            }
        })
        .state('buttons', {
            url: "/buttons",
            views:{
                'main@':{
                    templateUrl: "app/ui-elements/buttons.html"
                }
            }
        })
        .state('notifications', {
            url: "/notifications",
            views:{
                'main@':{
                    templateUrl: "app/ui-elements/notifications.html"
                }
            }
        })
        .state('typography', {
            url: "/typography",
            views:{
                'main@':{
                    templateUrl: "app/ui-elements/typography.html"
                }
            }
        })
        .state('grid', {
            url: "/grid",
            views:{
                'main@':{
                    templateUrl: "app/ui-elements/grid.html"
                }
            }
        })
        .state('blank', {
            url: "/blank",
            views:{
                'main@':{
                    templateUrl: "app/blank/blank.html",
                    controller: "BlankController"
                }
            }
        })
        .state('d3-bar-chart', {
            url: "/d3-bar-chart",
            views:{
                'main@':{
                    templateUrl: "app/charts/bar-chart.html",
                    controller: "BurnDownController"
                }
            }
        })
        .state('test', {
            url: "/test",
            views:{
                'main@':{
                    templateUrl: "app/test.html",
                    controller: "ProjectCreateController"
                }
            }
        });
});
app.controller('HomeController',function($scope,$location){
});










//below is legacy code and don't pay any attention to them
app.controller('MyController',function($scope,$http,$parse,$interpolate){
    $scope.counter=0;
    $scope.name="World";
    $http.get('http://localhost:3000/db/collection/').success(function(users) {
        $scope.name=users[0];
    }).error(function() {
        console.log("error");
    });
    $scope.add=function(amount){$scope.counter+=amount;};
    $scope.subtract=function(amount){$scope.counter-=amount;};

    $scope.$watch('expr',function(newVal,oldVal,scope){
        if(newVal!==oldVal){
            var parseFun=$parse(newVal);
            $scope.parsedValue=parseFun(scope);
        }
    });
    $scope.to="dinziranrr@163.com";
    $scope.$watch('emailBody',function(body){
        if(body){
            var template = $interpolate(body);
            $scope.previewText=template({to: $scope.to});
        }
    });
});
app.directive('myDirective',function(){
    return {
        scope:{
            myUrl: '@',
            myLinkText: '@'
        },
        restrict: 'A',
        replace:true,
        template: '<a href="{{myUrl}}">'+'{{myLinkText}}</a>'
    }
});

app.controller('ProjectCreateController',function($scope,$firebase,$location){
    $scope.message="hello worldss";
    var projectsRef = new Firebase("https://incandescent-fire-923.firebaseio.com/project");
    var usersRef = new Firebase("https://incandescent-fire-923.firebaseio.com/people");
    $scope.projects = $firebase(projectsRef);
    $scope.peoples = $firebase(usersRef);
    $scope.project={user:"-JMR7djz8I-5Bsc-gtpA"};
    $scope.findUser=function(id){
        var i=0;
        for(i=0;i<$scope.peoples.size();i++){
            if($scope.peoples[i]==id){
                return $scope.people[i];
            }
        }
    }
    $scope.projectCreate = function() {
        // AngularFire $add method
        $scope.projects.$add($scope.project);
        $location.path("projectList");
    };
    $scope.projectReturn = function() {
        $location.path("projectList")
    };
});
app.controller('BurnDownController',function($scope,$firebase){
    var testRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/test");
    $scope.test=$firebase(testRef);
    $scope.burnData=[];
    var array=[];
    array.push({x:new Date(2013,1,1),y:1});
    array.push({x:new Date(2013,1,2),y:2});
    array.push({x:new Date(2013,1,3),y:3});
    array.push({x:new Date(2013,1,4),y:4});
    $scope.test.$set(array);
    $scope.test.$on("loaded",function(){
        console.log("A remote change was applied locally!");
        var keys =$scope.test.$getIndex();
        $scope.burnData=[];
        keys.forEach(function(key, i) {
            //array.push({x:series[key].x,y:series[key].y}); // Prints items in order they appear in Firebase.
            $scope.burnData.push({x:new Date($scope.test[key].x),y:$scope.test[key].y}); // Prints items in order they appear in Firebase.

        });
        console.log($scope.burnData);
    });

});
app.controller('BlankController',function($scope,$firebase){
    var userRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/users");
    $scope.users=$firebase(userRef);
    var array=[];
    array.push({a:1,b:2});
    array.push({a:2,b:3});
    array.push({a:3,b:4});
    array.push({a:4,b:5});
    $scope.users.$set(array);
    $scope.array2=[];
    console.log($scope.users);
    var keys = $scope.users.$getIndex();
    keys.forEach(function(key, i) {
        $scope.array2.push({x:$scope.users[key].a,y:$scope.users[key].b}); // Prints items in order they appear in Firebase.
    });
    console.log($scope.array2);
});