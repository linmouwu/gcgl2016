/**
 * Created by Administrator on 14-6-4.
 */

var util=angular.module('gcgl2016.util', []);
util.factory("utilService",function(){
    var baseUrl="https://sweltering-fire-3478.firebaseio.com"
    return {
        ref: function(path){
            return $firebase(new Firebase(baseUrl+path));
        }
    }
});
