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