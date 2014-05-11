var app=angular.module("myApp",['ui.router','firebase','ui.bootstrap','myApp.directives']);
app.config(function($stateProvider, $urlRouterProvider){
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/dashboard");
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "app/dashboard/index.html"
        })
        .state('charts', {
            url: "/charts",
            templateUrl: "app/charts/charts.html"
        })
        .state('tables', {
            url: "/tables",
            templateUrl: "app/tables/tables.html"
        })
        .state('forms', {
            url: "/forms",
            templateUrl: "app/forms/forms.html"
        })
        .state('typography', {
            url: "/typography",
            templateUrl: "app/typography/typography.html"
        })
        .state('bootstrap-elements', {
            url: "/bootstrap-elements",
            templateUrl: "app/bootstrap-elements/bootstrap-elements.html"
        })
        .state('bootstrap-grid', {
            url: "/bootstrap-grid",
            templateUrl: "app/bootstrap-grid/bootstrap-grid.html"
        })
        .state('blank-page', {
            url: "/blank-page",
            templateUrl: "app/blank-page/blank-page.html"
        })
        .state('test', {
            url: "/test",
            templateUrl: "app/test.html",
            controller: "ProjectCreateController"
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