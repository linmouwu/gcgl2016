/**
 * Created by Administrator on 2014/8/15.
 */
var app=angular.module('gcgl2016.directives.header',[]);
app.directive("zrHeader",function(){
    return{
        restrict:'E',
        scope:{
            title:'@'
        },
        template:'<div class="row"><div class="col-lg-12"><h1 class="page-header">{{title}}</h1></div></div>'
    }
});
