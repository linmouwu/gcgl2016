/**
 * Created by Administrator on 2014/9/12.
 */

var app=angular.module('gcgl2016.directives.help',[]);
app.directive("zrHelp",function(){
    return{
        scope:{
            title:'@',
            colLg:'@'
        },
        templateUrl:'common/directives/help.tpls.html',
        transclude:true,
        controller:function($scope){
            $scope.isCollapsed=true;
        }
    };
});