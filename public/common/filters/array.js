/**
 * Created by Administrator on 2014/8/16.
 */

var app=angular.module('gcgl2016.filters.array',[]);
app.filter('array', function() {
    return function(items) {
        var filtered = [];
        angular.forEach(items, function(item,key) {
            item.id=key;
            filtered.push(item);
        });
        return filtered;
    };
});