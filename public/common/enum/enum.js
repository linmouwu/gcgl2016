/**
 * Created by Administrator on 2014/7/27.
 */
var app=angular.module("gcgl2016.enum",[]);
app.factory("EnumService",function(){
    var service={
        getProductTypes:function(){
            var types=["simple","treeDocument","document","json"];
            return types;
        }
    };
    return service;
});