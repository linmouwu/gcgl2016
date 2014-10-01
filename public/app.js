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
    "gcgl2016.enum",
    'angularFileUpload'
]);
app.config(function($stateProvider, $urlRouterProvider){
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/main");
});
app.controller('HomeController',function($scope,$location,$rootScope){

});