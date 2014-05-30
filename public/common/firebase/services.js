/**
 * Created by Administrator on 14-5-24.
 */
var firebase=angular.module('myApp.firebase', []);
firebase.factory("firebaseService",function($firebase){
    var baseUrl="https://sweltering-fire-3478.firebaseio.com"
    return {
        ref: function(path){
            return $firebase(new Firebase(baseUrl+path));
        }
    }
});
