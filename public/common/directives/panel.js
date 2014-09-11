/**
 * Created by Administrator on 2014/8/15.
 */
var app=angular.module('gcgl2016.directives.panel',[]);
app.directive("zrPanel",function(){
    return{
        scope:{
            title:'@',
            colLg:'@'
        },
        templateUrl:'common/directives/panel.tpls.html',
        transclude:true
    };
});
