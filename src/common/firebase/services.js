/**
 * Created by Administrator on 14-5-24.
 */
var firebase=angular.module('gcgl2016.firebase', []);
firebase.factory("firebaseService",function($firebase){
    var baseUrl="https://sweltering-fire-3478.firebaseio.com";
    var firebaseService = {
        ref: function(path){
            return $firebase(new Firebase(baseUrl+path));
        },

        extend:function (ids,ref) {
            if(_.isUndefined(ids)){
                return [];
            }
            //base is an array of id
            //ref is a reference of entities
            var entities= _.filter(ids,function(id){
                if(_.contains(Object.keys(ref),id)){
                    return true;
                }
                return false;
            });
            var result= _.map(entities,function(id){
                var o={};
                o[id]=angular.copy(ref[id]);
                return o;
            });
            return result;
        },
        extendSingle:function(id,ref){
            if(_.isUndefined(id)){
                return {};
            }
            var result={};
            result[id]=angular.copy(ref[id]);
            return result;
        },
        //before {key:{field1:"",field2:""}}
        //after {id:key,field1:"",field2:""}
        embedIdsObj:function(obj){
            var keys=Object.keys(obj);
            var ret=_.map(keys,function(id){
                var o=angular.copy(obj[id]);
                o.id=id;
                return o;
            });
            return ret;
        },
        embedIdsArray:function(objs){
            var ret=_.map(objs,function(obj){
                return firebaseService.embedId(obj);
            });
            return ret;
        },
        embedId:function(obj){
            var keys=Object.keys(obj);
            if(keys.length!=1){
                return {};
            }
            var id=keys[0];
            var ret=angular.copy(obj[id]);
            ret.id=id;
            return ret;
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
        },
        objToArray:function(obj){
            var keys=Object.keys(obj);
            var ret= _.map(keys,function(key){
                var o={};
                o[key]=obj[key];
                return o;
            });
            return ret;
        }
    };
    return firebaseService;
});
