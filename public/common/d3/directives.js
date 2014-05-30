var dir=angular.module('myApp.directives', ['d3']);
dir.directive('burndown',function($window,$timeout,d3Service){
        return {
            restrict: 'A',
            scope:{
                data: '='
            },
            link: function(scope,ele,attrs){
                d3Service.d3().then(function(d3) {
                    var width=attrs.$$element.context.clientWidth;
                    var height= width/4*3;

                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.chart.setSeries(scope.data);
                        scope.chart.render();
                    });
                    scope.$watch('data', function(newData) {
                        scope.chart.setSeries(newData);
                        scope.chart.render();
                    }, true);
                    scope.chart=barChart()
                                    .width(width)
                                    .height(height);
                    //begin of barChart()
                    function barChart() {
                        var _chart = {};

                        var _width = 400, _height = 300,
                                _margins = {top: 30, left: 30, right: 30, bottom: 30},
                                _x, _y,
                                _data = [],
                                _maxData = 10,
                                _colors = d3.scale.category10(),
                                _svg,
                                _bodyG;

                        _chart.render = function () {
                            if (!_svg) {
                                _svg = d3.select(ele[0]).append("svg")
                                        .attr("height", _height)
                                        .attr("width", _width);

                                renderAxes(_svg);

                                defineBodyClip(_svg);
                            }

                            renderBody(_svg);
                        };

                        function renderAxes(svg) {
                            var axesG = svg.append("g")
                                    .attr("class", "axes");

                            var xAxis = d3.svg.axis()
                                    .scale(_x.range([0, quadrantWidth()]))
                                    .ticks(_maxData)
                                    .orient("bottom");

                            var yAxis = d3.svg.axis()
                                    .scale(_y.range([quadrantHeight(), 0]))
                                    .orient("left");

                            axesG.append("g")
                                    .attr("class", "axis")
                                    .attr("transform", function () {
                                        return "translate(" + xStart() + "," + yStart() + ")";
                                    })
                                    .call(xAxis);

                            axesG.append("g")
                                    .attr("class", "axis")
                                    .attr("transform", function () {
                                        return "translate(" + xStart() + "," + yEnd() + ")";
                                    })
                                    .call(yAxis);
                        }

                        function defineBodyClip(svg) {
                            var padding = 5;

                            svg.append("defs")
                                    .append("clipPath")
                                    .attr("id", "body-clip")
                                    .append("rect")
                                    .attr("x", 0)
                                    .attr("y", 0)
                                    .attr("width", quadrantWidth() + 2 * padding)
                                    .attr("height", quadrantHeight());
                        }

                        function renderBody(svg) {
                            if (!_bodyG)
                                _bodyG = svg.append("g")
                                        .attr("class", "body")
                                        .attr("transform", "translate(" 
                                                + xStart() 
                                                + "," 
                                                + yEnd() + ")")
                                        .attr("clip-path", "url(#body-clip)");

                            renderBars();
                        }
                        
                        function renderBars() {
                            var padding = 2; // <-A
                            
                            _bodyG.selectAll("rect.bar")
                                        .data(_data)
                                    .enter()
                                    .append("rect") // <-B
                                    .attr("class", "bar");

                            _bodyG.selectAll("rect.bar")
                                        .data(_data)                    
                                    .transition()
                                    .attr("x", function (d) { 
                                        return _x(d.x); // <-C
                                    })
                                    .attr("y", function (d) { 
                                        return _y(d.y); // <-D 
                                    })
                                    .attr("height", function (d) { 
                                        return yStart() - _y(d.y); 
                                    })
                                    .attr("width", function(d){
                                        return Math.floor(quadrantWidth() / _maxData) - padding;
                                    });
                        }

                        function xStart() {
                            return _margins.left;
                        }

                        function yStart() {
                            return _height - _margins.bottom;
                        }

                        function xEnd() {
                            return _width - _margins.right;
                        }

                        function yEnd() {
                            return _margins.top;
                        }

                        function quadrantWidth() {
                            return _width - _margins.left - _margins.right;
                        }

                        function quadrantHeight() {
                            return _height - _margins.top - _margins.bottom;
                        }

                        _chart.width = function (w) {
                            if (!arguments.length) return _width;
                            _width = w;
                            return _chart;
                        };

                        _chart.height = function (h) {
                            if (!arguments.length) return _height;
                            _height = h;
                            return _chart;
                        };

                        _chart.margins = function (m) {
                            if (!arguments.length) return _margins;
                            _margins = m;
                            return _chart;
                        };

                        _chart.colors = function (c) {
                            if (!arguments.length) return _colors;
                            _colors = c;
                            return _chart;
                        };

                        _chart.x = function (x) {
                            if (!arguments.length) return _x;
                            _x = x;
                            return _chart;
                        };

                        _chart.y = function (y) {
                            if (!arguments.length) return _y;
                            _y = y;
                            return _chart;
                        };

                        _chart.setSeries = function (series) {
                            var array=[];
                            if(!series){
                                return _data;
                            }
                            var minDate=series[0].x;
                            var maxDate=series[series.length-1].x;
                            console.log(minDate);
                            console.log(maxDate);
                            var maxValue=0;
                            for(item in series){
                                if(series[item].y>maxValue){
                                    maxValue=series[item].y;
                                }
                            }
                            console.log(maxDate.getTime());
                            _chart.x(d3.time.scale().domain([minDate,maxDate]))
                                .y(d3.scale.linear().domain([0, maxValue]))
                                .maxData(Math.ceil(
                                    (maxDate.getTime()-minDate.getTime())/24/1000/60/60
                                ));
                            console.log(series);
                            _data = series;
                            return _chart;
                        };

                        _chart.maxData = function (m) {
                            if (!arguments.length) return _maxData;
                            _maxData = m;
                            return _chart;
                        };

                        return _chart;
                    }
                    //end of barChart()
                })
            }
        }
    });
dir.directive('d3Bars', ['$window', '$timeout', 'd3Service',
        function($window, $timeout, d3Service) {
            return {
                restrict: 'A',
                scope: {
                    //data: '=',
                    //label: '@',
                    //onClick: '&'
                },
                link: function(scope, ele, attrs) {
                    d3Service.d3().then(function(d3) {

                        scope.data = [
                            {name: "Greg", score: 98},
                            {name: "Ari", score: 96},
                            {name: 'Q', score: 75},
                            {name: "Loser", score: 48}
                        ];
                        var renderTimeout;
                        var margin = parseInt(attrs.margin) || 20,
                            barHeight = parseInt(attrs.barHeight) || 20,
                            barPadding = parseInt(attrs.barPadding) || 5;

                        var svg = d3.select(ele[0])
                            .append('svg')
                            .style('width', '100%');

                        $window.onresize = function() {
                            scope.$apply();
                        };

                        scope.$watch(function() {
                            return angular.element($window)[0].innerWidth;
                        }, function() {
                            scope.render(scope.data);
                        });

                        scope.$watch('data', function(newData) {
                            scope.render(newData);
                        }, true);

                        scope.render = function(data) {
                            svg.selectAll('*').remove();

                            if (!data) return;
                            if (renderTimeout) clearTimeout(renderTimeout);

                            renderTimeout = $timeout(function() {
                                var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                                    height = scope.data.length * (barHeight + barPadding),
                                    color = d3.scale.category20(),
                                    xScale = d3.scale.linear()
                                        .domain([0, d3.max(data, function(d) {
                                            return d.score;
                                        })])
                                        .range([0, width]);

                                svg.attr('height', height);

                                svg.selectAll('rect')
                                    .data(data)
                                    .enter()
                                    .append('rect')
                                    .on('click', function(d,i) {
                                        return scope.onClick({item: d});
                                    })
                                    .attr('height', barHeight)
                                    .attr('width', 140)
                                    .attr('x', Math.round(margin/2))
                                    .attr('y', function(d,i) {
                                        return i * (barHeight + barPadding);
                                    })
                                    .attr('fill', function(d) {
                                        return color(d.score);
                                    })
                                    .transition()
                                    .duration(1000)
                                    .attr('width', function(d) {
                                        return xScale(d.score);
                                    });
                                svg.selectAll('text')
                                    .data(data)
                                    .enter()
                                    .append('text')
                                    .attr('fill', '#fff')
                                    .attr('y', function(d,i) {
                                        return i * (barHeight + barPadding) + 15;
                                    })
                                    .attr('x', 15)
                                    .text(function(d) {
                                        return d.name + " (scored: " + d.score + ")";
                                    });
                            }, 200);
                        };
                    });
                }}
        }])