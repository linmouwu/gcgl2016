/**
 * Created by Administrator on 2014/9/20.
 */

var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.file', {
            url: "/file/:productId",
            templateUrl: "app/template/productTemplate/file.html",
            resolve:{
                product:function($stateParams,productListRef){
                    return productListRef.$getRecord($stateParams.productId);
                }
            },
            controller: function ($scope,FileUploader,productListRef,product) {
                $scope.uploader=new FileUploader({
                    url: 'upload'
                });
                $scope.product=product;
                $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
//                console.info('onCompleteItem', fileItem, response, status, headers);
                    if(response&&response[0]){
                        fileItem.originalFilename=response[0].originalFilename;
                        fileItem.path=response[0].path.replace("public\\","");
                    }
                    $scope.product.data.push({path:fileItem.path,name:fileItem.originalFilename});
                    productListRef.$save($scope.product);
                };
                $scope.uploader.onAfterAddingFile = function(fileItem, response, status, headers) {
                    fileItem.upload();
                };
                $scope.removeFile=function(index){
                    $scope.product.data.splice(index,1);
                    productListRef.$save($scope.product);
                }

            }
        });
});