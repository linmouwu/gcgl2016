var app=angular.module("gcgl2016",[
    'ui.router',
    'ui.bootstrap',
    'ui.tree',
    'ngGrid',
    'firebase',
    'gcgl2016.directives',
    "gcgl2016.filters",
    'gcgl2016.directives.uiBreadcrumbs',
    'gcgl2016.firebase',
    'gcgl2016.util',
    'gcgl2016.exeProject',
    'gcgl2016.process',
    'gcgl2016.product',
    'gcgl2016.project',
    'gcgl2016.user',
    'gcgl2016.template',
    'gcgl2016.custom',
    'gcgl2016.activity',
    'gcgl2016.phase',
    'gcgl2016.lifecycle',
    'gcgl2016.tag',
    'gcgl2016.feature',
    "gcgl2016.enum"
]);
app.config(function($stateProvider, $urlRouterProvider){
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/main");
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
                    controller: function($scope,firebaseService){
                    }
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
app.controller('HomeController',function($scope,$location,$rootScope){

});