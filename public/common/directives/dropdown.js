/**
 * Created by Administrator on 2014/8/16.
 */
var app=angular.module('gcgl2016.directives.dropdown',[]);
app.directive("zrDropdown",function(){
    return{
        templateUrl:'common/directives/dropdown.tpls.html',
        transclude:true
    }
});

