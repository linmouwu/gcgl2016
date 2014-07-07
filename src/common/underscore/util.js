/**
 * Created by Administrator on 14-6-4.
 */

var util=angular.module('myApp.util', []);
util.factory("utilService",function(){
    var baseUrl="https://sweltering-fire-3478.firebaseio.com"
    return {
        ref: function(path){
            return $firebase(new Firebase(baseUrl+path));
        }
    }
});
