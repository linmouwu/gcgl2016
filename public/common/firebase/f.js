/**
 * Created by Administrator on 14-5-24.
 */
var firebase=angular.module('gcgl2016.firebase', ['firebase']);
firebase.factory("f",function($firebase){
    var baseUrl="https://sweltering-fire-3478.firebaseio.com";
    var firebaseService = {
        ref: function(path){
            return $firebase(new Firebase(baseUrl+path));
        },
        /**
         *
         * @param ids [id1,id2]
         * @param refs [
         *              {$id:id1,name:YY},
         *              {$id:id2,name:YY},
         *              {$id:id3,name:YY}
         *              ]
         *
         * @returns {Array} [{$id:id1,name:YY},{$id:id2,name:YY}]
         */
        extend:function (ids,refs) {
            if(_.isUndefined(ids)|| _.isUndefined(refs)){
                return [];
            }
            return _.chain(ids).map(function(id){
                return angular.copy(refs.$getRecord(id));
            }).filter(function(id){
                if(id){
                    return true;
                }
                else{
                    return false;
                }
            }).value();
        },
        extendProperty:function (ids,refs,property) {
            console.log('extendProperty');
            console.log(ids);
            console.log(refs);
            console.log(property);
            if(_.isUndefined(ids)|| _.isUndefined(refs)|| _.isUndefined(property)){
                return [];
            }
            return _.chain(ids).map(function(id){
                var ret=null;
                _.each(refs,function(ref){
                    console.log('ref');
                    console.log(ref);
                    console.log(property);
                    console.log(id);
                    if(ref[property]===id){
                        console.log('equal');
                        ret=angular.copy(ref);
                    }
                });
                return ret;
            }).filter(function(item){
                console.log('item');
                console.log(item);
                if(item){
                    return true;
                }
                else{
                    return false;
                }
            }).value();
        },
        /**
         *
         * @param id "id1"
         * @param refs [
         *              {$id:id1,name:YY},
         *              {$id:id2,name:YY},
         *              {$id:id3,name:YY}
         *              ]
         *
         * @returns {Object} {$id:id1,name:YY}
         */
        extendSingle:function(id,refs){
            if(_.isUndefined(id)|| _.isUndefined(refs)){
                return null;
            }
            return angular.copy(refs.$getRecord(id));
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
            if(_.isUndefined(obj)){
                return {};
            }
            var keys=Object.keys(obj);
            if(keys.length!=1){
                return {};
            }
            var id=keys[0];
            var ret=angular.copy(obj[id]);
            ret.id=id;
            return ret;
        },
        //before [{id:XX,name:XX},{id:YY,name:YY}]
        //after [XX,YY]
        toIds:function(array){
            if(angular.isDefined(array)) {
                return _.map(array, function (item) {
                    return item.$id;
                });
            }
            else{
                return [];
            }
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
        },
        getContent:function(obj){
            if(_.isUndefined(obj)){
                return {};
            }
            var key=Object.keys(obj)[0];
            return angular.copy(obj[key]);
        },
        //c r u d
        add:function(ref,item){
            if(_.isUndefined(ref)|| _.isUndefined(item)||!ref.hasOwnProperty('$add')){
                return;
            }
            return ref.$add(item);
        },
        save:function(ref,item){
            if(_.isUndefined(ref)|| _.isUndefined(item)||!ref.hasOwnProperty('$save')){
                return;
            }
            return ref.$save(item);
        },
        find:function(refLoad,ref,key){
            var promise=refLoad.promise.then(function(){
                return angular.copy(ref[key]);
            });
            return promise;
        },
        remove:function(ref,item){
            if(_.isUndefined(ref)|| _.isUndefined(item)||!ref.hasOwnProperty('$remove')){
                return;
            }
            return ref.$remove(ref.$getRecord(item.$id));
        },
        list: function(refLoad){
            return refLoad.promise.then(function(data){
                return firebaseService.copyList(data);
            });
        },
        getTypes:function(){
            var types=["document"];
            return types;
        },
        /**
         *
         * @param array [id:{name:xx,age:xx},id2:{name:yy,age:xx}]
         * @param field name
         * @returns {string} "xx, yy"
         */
        arrayToString:function(array,field){
            var ret="";
            _.each(array,function(item){
                ret+=item[field]+", ";
            });
            return ret;
        }
    };
    return firebaseService;
});
