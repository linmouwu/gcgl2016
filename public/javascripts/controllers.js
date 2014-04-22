/**
 * Created by Administrator on 14-3-17.
 */
var app=angular.module("myApp");
app.controller('ListController',function($scope,$firebase){
    var usersRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/people");
    $scope.users = $firebase(usersRef);
});
app.controller('CreateController',function($scope,$firebase){
    var usersRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/people");
    $scope.users = $firebase(usersRef);
    $scope.user={};
    $scope.create = function() {
        // AngularFire $add method
        $scope.users.$add({"user":$scope.user});
        $scope.user = {};
        $scope.message="create success!";
    };
});

app.controller('LoginController',function($scope){
    $scope.fields = [
        {placeholder: 'Username', isRequired: true},
        {placeholder: 'Password', isRequired: true},
        {placeholder: 'Email (optional)', isRequired: false}
    ];

    $scope.submitForm = function(){
        alert("it works!");
    };
});
app.controller('ProcessController',function($scope,$firebase){
    var processesRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/process");
    $scope.processes = $firebase(processesRef);
    $scope.process={};
    $scope.click={value:true,name:"新建过程"};
    $scope.remove = function(key){
        $scope.processes.$remove(key);
    }
    $scope.change=function(){
        if($scope.click.value){
            $scope.click.value=false;
            $scope.click.name="显示过程列表";
        }
        else{
            $scope.click.value=true;
            $scope.click.name="新建过程";
        }
    }
    $scope.create = function(){
        $scope.processes.$add($scope.process).then(function(){
            $scope.process={};
            $scope.change();
        });

    }
});
app.controller('ProductController',function($scope,$firebase){
    var productsRef = new Firebase("https://sweltering-fire-3478.firebaseio.com/product");
    $scope.products = $firebase(productsRef);
    $scope.product={};
    $scope.click={value:true,name:"新建产品"};
    $scope.remove = function(key){
        $scope.products.$remove(key);
    }
    $scope.change=function(){
        if($scope.click.value){
            $scope.click.value=false;
            $scope.click.name="显示产品列表";
        }
        else{
            $scope.click.value=true;
            $scope.click.name="新建产品";
        }
    }
    $scope.create = function(){
        $scope.products.$add($scope.product).then(function(){
            $scope.product={};
            $scope.change();
        });

    }
});