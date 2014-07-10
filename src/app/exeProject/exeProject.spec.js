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
    });
});