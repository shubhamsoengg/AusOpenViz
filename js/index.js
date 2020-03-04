(function() {

    /*code for the donut chart for all the champions*/
    var donutGraph = (playerObj) => {
        console.log(playerObj);
        var margin = { top: 20, right: 20, bottom: 20, left: 20 };
        width = 400 - margin.left - margin.right;
        height = width - margin.top - margin.bottom;

        var chart = d3.select(".donut-chart")
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + ((width / 2) + margin.left) + "," + ((height / 2) + margin.top) + ")");


        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
            .range(["#3399FF", "#05dfd7", "#ea728c", "#63aabc", "#f9d5bb"]);

        var arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 50);

        var arcOver = d3.arc()
            .outerRadius(radius + 30);

        var pie = d3.pie()
            .sort(null)
            .startAngle(1.1 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(function(d) { return d.value; });

        var g = chart.selectAll(".arc")
            .data(pie(playerObj))
            .enter().append("g")
            .attr("class", "arc")
            .style("cursor", "pointer")
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.7);
            })
            .on("mouseleave", function(d) {
                d3.select(this).transition()
                    .style("opacity", 1)
            })
            .on('click', function(d) {
                groupedChart(d.data);
                /*d3.select(this)
                    .attr("stroke", "white")
                    .transition()
                    .duration(200)
                    .attr("d", arcOver)
                    .attr("stroke-width", 5);*/

            });

        g.append("path")
            .style("fill", function(d) { return color(d.data.name); })
            .transition().duration(1000)
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                    return arc(d);
                }
            });

        g.append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("fill", "#fff")
            .text(function(d, i) { return d.data.value; })

        // g.selectAll(".arc text").call(wrap, arcText.range([0, width]));

        var path = chart.selectAll('path')
            .data(pie(playerObj))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.title);
            })
            .attr('transform', 'translate(0, 0)')

        var legendRectSize = 13;
        var legendSpacing = 7;
        var legend = chart.selectAll('.legend') //the legend and placement
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'circle-legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize - 25;
                var vert = i * height - offset + 8;
                return 'translate(' + horz + ',' + vert + ')';
            });
        legend.append('circle') //keys
            .style('fill', color)
            .style('stroke', color)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', '.4rem');
        legend.append('text') //labels
            .attr('x', legendRectSize + legendSpacing - 10)
            .attr('y', legendRectSize - legendSpacing)
            .style("font-size", "14px")
            .text(function(d) {
                return d;
            });
    }


    /*code for the grouped bar chart for each player*/
    var groupedChart = (playerInfo) => {

        d3.select(".bar-chart svg").remove();

        console.log(playerInfo);
        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.4);

        var x1 = d3.scaleBand();

        var y = d3.scaleLinear()
            .range([height, 50]);

        var xAxis = d3.axisBottom()
            .scale(x0);

        var yAxis = d3.axisLeft()
            .scale(y);

        var color = d3.scaleOrdinal()
            .range(["#8882ef", "#8cd8d4", "#ea9953", "#ea5353", "#0571b0"]);

        var svg = d3.select('.bar-chart').append("svg")
            .attr("width", 900 + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        /*svg.append("text")
            .text("The Final Match Stats of "+playerInfo.name)
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .attr("x", 30)
            .attr("y", 10);*/
        svg.append("text").transition()
            .attr("x", (width / 2))             
            .attr("y", 0)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px") 
            .style("text-decoration", "underline")  
            .style("font-weight", "bold")  
            .text("The Final match stats (in %) - "+playerInfo.name );


        var data = playerInfo.categories
        var categoriesNames = data.map(function(d) { return d.categoryName; });
        var rateNames = data[0].values.map(function(d) { return d.year; });
        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value");

        svg.select('.y').transition().duration(200).delay(200).style('opacity', '1');

        var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.categoryName) + ",0)"; });

        slice.selectAll("rect")
            .data(function(d) { return d.values; })
            .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.year); })
            .style("fill", function(d) { return color(d.year) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.year)).darker(0.3));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.year));
            });

        slice.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        //Legend
        var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.year; }).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity", "0");

        legend.append("rect")
            .attr("x", width + 50)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return color(d); });

        legend.append("text")
            .attr("x", width + 44)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend.transition().duration(200).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

    }

    /*loading the data from a csv file and preorocessing the data */
    d3.csv('data.csv')
        .then(function(data) {
            var winnerObj = {};
            var categories = [["firstServe1", "First Serve In"], ["firstPointWon1", "First Serve Points Won"], ["secPointWon1", "Second Serve Points Won"], 
            ["break1", "Break Points Converted"], ["return1", "Return % "], ["net1", "Net Points Won"]];
            for (match of data) {
                if (match["round"] === "Final") {
                    var player = match["winner"];
                    if (winnerObj.hasOwnProperty(player)) {
                        winnerObj[player]["count"] += 1
                        var categoriesData = winnerObj[player]["categories"];
                        for (var i = 0; i < categoriesData.length; i++) {
                            var cat = categoriesData[i]["category"];
                            categoriesData[i]["values"].push({ "value": parseFloat(match[cat]), "year": match["year"] });
                        }

                    } else {
                        var categoryArray = [];
                        for (var i = 0; i < categories.length; i++) {
                            obj = {
                                "category": categories[i][0],
                                "categoryName": categories[i][1],
                                "values": [{
                                    "value": parseFloat(match[categories[i][0]]),
                                    "year": match["year"]
                                }]
                            }
                            categoryArray.push(obj);
                        }
                        winnerObj[player] = {
                            "count": 1,
                            "categories": categoryArray
                        }
                    }
                }
            }
            var playerObj = []
            for (player in winnerObj) {
                playerObj.push({ "name": player, "value": winnerObj[player]["count"], "categories": winnerObj[player]["categories"] });
            }
            donutGraph(playerObj);
            groupedChart(playerObj[1])
            $(".donut-text").fadeIn();
        })
        .catch(function(error) {
            // handle error  
            console.log(error);
        })
})();