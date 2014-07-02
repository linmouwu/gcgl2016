/**
 * Created by Administrator on 14-5-24.
 */
var firebase=angular.module('myApp.firebase', []);
firebase.factory("firebaseService",function($firebase){
    var baseUrl="https://sweltering-fire-3478.firebaseio.com"
    return {
        ref: function(path){
            return $firebase(new Firebase(baseUrl+path));
        },

        extend:function (ids,ref) {
            if(_.isUndefined(ids)){
                return [];
            }
            //base is an array of id
            //ref is a firebase reference of entities
            var entities= _.filter(ids,function(id){
                if(_.contains(ref.$getIndex(),id)){
                    return true;
                }
                return false;
            });
            var result= _.map(entities,function(id){
                var o=ref[id];
                o.id=id;
                return o;
            });
            return result;
        },
        extendSingle:function(id,ref){
            if(_.isUndefined(id)){
                return {};
            }
            var result=angular.copy(ref[id]);
            result.id=id;
            return result;
        },
        toIds:function(array){
            return _.map(array,function(item){
                return item.id;
            });
        },
        copy:function(data){
            return angular.copy(data);
        },
        //data is an firebase collection
        copyList:function(data){
            var list={};
            _.each(data.$getIndex(),function(id){
                list[id]=angular.copy(data[id]);
            });
            return list;
        }
    }
});
