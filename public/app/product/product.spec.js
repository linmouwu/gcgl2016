/**
 * Created by Administrator on 14-7-10.
 */
describe('unit: product',function(){
    beforeEach(module('gcgl2016.product'));
    describe('ProductService',function(){
        var service;
        beforeEach(inject(function($injector){
            service=$injector.get('ProductService');
        }));
        describe('getContent',function(){

        });
    });
});