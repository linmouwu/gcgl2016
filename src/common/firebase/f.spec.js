/**
 * Created by Administrator on 14-7-11.
 */
describe('Unit: f suite',function(){
    beforeEach(module('gcgl2016.firebase'));
    describe('f',function(){
        var service;
        beforeEach(inject(function($injector){
            service=$injector.get('f');
        }));
        describe('getContent',function(){
            it('should have right output',function(){
                /*
                 getContent:function(obj){
                 var key=Object.keys(obj)[0];
                 return angular.copy(obj[key]);
                 }
                 */
                var obj={sth:{a:1,b:2}};
                var content={a:1,b:2};
                expect(service.getContent(obj)).toEqual(content);
            });
        });
        describe('extend',function(){
            it('should have right output',function(){
//                extend:function (ids,ref) {
                var ids=['a0001','a0002','a0003'];
                var ref={
                    'a0001':'aaaaa',
                    'a0002':'bbbbb',
                    'a0004':'ccccc'
                };
                var answer=[
                    {'a0001':'aaaaa'},
                    {'a0002':'bbbbb'}
                ];

                expect(service.extend(ids,ref)).toEqual(answer);
            });
        });
        describe('extendSingle',function(){
            it('should have right output',function(){
                /*
                 extendSingle:function(id,ref){
                 if(_.isUndefined(id)){
                 return {};
                 }
                 var result={};
                 result[id]=angular.copy(ref[id]);
                 return result;
                 },
                 */
                var id="-JQaOhgF-bENZmxbI5zO";
                var ref={
                    '-JQaOhgF-bENZmxbI5zO':{
                        description:"lskfjsldkfjsdf",
                        name: "Mid Product A",
                        type: "document"
                    },
                    b:2,
                    c:3
                };
                var content={
                    '-JQaOhgF-bENZmxbI5zO':{
                        description:"lskfjsldkfjsdf",
                        name: "Mid Product A",
                        type: "document"
                    }

                };

                expect(service.extendSingle(id,ref)).toEqual(content);
            });
            it('first parameter is undefine',function(){
                /*
                 extendSingle:function(id,ref){
                 if(_.isUndefined(id)){
                 return {};
                 }
                 var result={};
                 result[id]=angular.copy(ref[id]);
                 return result;
                 },
                 */
                var id;
                var ref={
                    a:{
                        c:1
                    },
                    b:2,
                    c:3
                };
                var content={};

                expect(service.extendSingle(id,ref)).toEqual(content);
            });
        });

        describe('embedId',function(){
            it('should have right output',function(){
//                embedId:function(obj){
//                    var keys=Object.keys(obj);
//                    if(keys.length!=1){
//                        return {};
//                    }
//                    var id=keys[0];
//                    var ret=angular.copy(obj[id]);
//                    ret.id=id;
//                    return ret;
//                },
                var obj={
                    a00001:{
                        name:'dzr',
                        age:18
                    }
                };
                var answer={
                    id:'a00001',
                    name:'dzr',
                    age:18
                };
                expect(service.embedId(obj)).toEqual(answer);
            });
            it('obj is undefine',function(){
                var obj;
                var answer={};
                expect(service.embedId(obj)).toEqual(answer);
            });
        });
    });
});