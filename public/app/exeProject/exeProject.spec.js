/**
 * Created by Administrator on 14-7-10.
 */
describe('Unit: gcgl2016.exeProject',function(){
    beforeEach(module('gcgl2016.exeProject'));
    describe('exeProject',function(){
        var service;
        beforeEach(inject(function($injector){
            service=$injector.get('ExeProjectService');
        }));
        it('should return hello world',function(){
            expect(service.test()).toEqual("hello world");
        });
        describe('withInputOutputAndEmbed',function(){
            it('have right input and output',function(){
                var process={
                    id:"a00003",
                    name:"hello",
                    input:"a00001",
                    output:"a00002",
                    inputType:"product",
                    outputType:"process"

                };
                var productList={
                    a00001:{
                        name:'product1',
                        f1:'sdf',
                        f2:'dfd'
                    }
                };
                var processList={
                    a00002:{
                        name:'process1',
                        f1:'haha',
                        f2:'what'
                    }
                };
                var answer={
                    id:'a00003',
                    name:"hello",
                    input:{
                        id:'a00001',
                        name:'product1',
                        f1:'sdf',
                        f2:'dfd'
                    },
                    output:{
                        id:'a00002',
                        name:'process1',
                        f1:'haha',
                        f2:'what'
                    },
                    inputType:"product",
                    outputType:"process"
                };
                expect(service.withInputOutputAndEmbed(process,productList,processList)).toEqual(answer);
            });
        });
        /*
        it('should return a full process',function(){
            var process={
                id00001:{
                    inputType:"process",
                    name:"process1",
                    output:"id00002",
                    outputType:"product"
                }
            };
            var processList={

            };
            var productList={
                id00002:{
                    description:"hahah",
                    name:'product1',
                    type:'document'
                }
            };
            service.withInputOutput(process,processList,productList);
            expect(process).toEqual(
                {

                    id00001:{
                        inputType:"process",
                        name:"process1",
                        output:{
                            id00002:{
                                description:"hahah",
                                name:'product1',
                                type:'document'
                            }
                        },
                        outputType:"product",
                        input:{}
                    }
                }
            );
        });
        */
    });
});