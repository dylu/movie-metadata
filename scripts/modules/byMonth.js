/** Global Variables containing data **/
// var movies;
// var mLens_movies;

// var selected_genre;

var db_month;
var db_month_filtered;

var monthNames = ["January", "February", "March", "April",  
                      "May", "June", "July", "August", "September", 
                      "October", "November", "December"];

var monVars;

function drawModule_month()
{
    db_month = [];
    db_month_filtered = [];

	monVars = [];

    var graphName = "byMonth";
    var trans_dur = 600;                // Transition Duration in Milliseconds.
    // var mod_width = 600;

    // var mod_width = 1000;
    // var mod_height = 500;
    // var chart_width = 900;
    // var chart_height = 400;

    var mod_width = 740;
    var mod_height = 450;
    var chart_width = 654;
    var chart_height = 380;

    var chart_Xoffset = 60;
    var chart_Yoffset = 26;
    // update_genresDB(false);

    var color_default   = '#42A5F5';    // Blue     400
    var color_hover     = '#4FC3F7';    // L. Blue  300
    var color_filtered  = '#5C6BC0';    // Indigo   400
    var color_f_hover   = '#7986CB';    // Indigo   300
    var color_click     = '#1E88E5';    // Blue     600
    
    var numMonths = 12;
    var monthAvgLocalMax = 0;
    var monthNumLocalMax = 0;

    // Updating Global Genre Variables List (for helper functions).
    monVars.graphName       = graphName;
    monVars.trans_dur       = trans_dur;
    monVars.mod_width       = mod_width;
    monVars.mod_height      = mod_height;
    monVars.chart_width     = chart_width;
    monVars.chart_height    = chart_height;
    monVars.chart_Xoffset   = chart_Xoffset;
    monVars.chart_Yoffset   = chart_Yoffset;
    monVars.color_default   = color_default;
    monVars.color_hover     = color_hover;
    monVars.color_filtered  = color_filtered;
    monVars.color_f_hover   = color_f_hover;
    monVars.color_click     = color_click;
    monVars.numMonths       = numMonths;


    d3.select("#" + graphName)
        // .append("svg")
        .select("svg")
        .attr("width", mod_width)
        .attr("height", mod_height);



/**
 * Function to initialize a monthArray.
 * 2-tiered structure:
 * T1: Month Num   (e.g. '1', for Jan)
 * T2a: Numbers    (Total Ratings, Average stuff.)
 * T2b: Movie IDs  (e.g. 01, for Toy Story)
 */

    update_monthDB();

    var t_num;
    var t_avg;

	for (i = 0; i < numMonths; i++)
    {
        t_num = db_month_filtered[i].movieIds.length;
        t_avg = db_month_filtered[i].totalRating / t_num;

        monthNumLocalMax = Math.max(monthNumLocalMax, t_num);
        monthAvgLocalMax = Math.max(monthAvgLocalMax, t_avg);
    }

	var t_id;
	var t_month;
	var t_rating;

	// for (var movie in movies)

	console.log("Printing db_month_filtered (After Populating)");
	console.log(db_month_filtered);


    var svg = d3.select("#"+graphName).select("svg");

    var xScale = d3.scaleBand()
        .domain(monthNames)
        // .domain([0, numMonths])
        .range([0, chart_width])
        .paddingInner(0.1)
        .paddingOuter(0.12);

    var yScaleL = d3.scaleLinear()
        .domain([0, monthNumLocalMax])
        .range([0, chart_height]).nice();

    // var yScaleR = d3.scaleLinear()
    //     // .domain([0, monthAvgLocalMax])
    //     .domain([0, 10])
    //     .range([0, chart_height]).nice();

    var yScaleAxisL = d3.scaleLinear()
        .domain([0, monthNumLocalMax])
        .range([chart_height, 0]).nice();

    // var yScaleAxisR = d3.scaleLinear()
    //     // .domain([0, monthAvgLocalMax])
    //     .domain([0, 10])
    //     .range([chart_height, 0]).nice();


    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);

    var yAxisL = d3.axisLeft();
    yAxisL.scale(yScaleAxisL);

    // var yAxisR = d3.axisRight();
    // yAxisR.scale(yScaleAxisR);


    // More updating of global genre variables.
    monVars.svg                 = svg;
    monVars.monthAvgLocalMax    = monthAvgLocalMax;
    monVars.monthNumLocalMax    = monthNumLocalMax;
    monVars.xScale              = xScale;
    monVars.yScaleL             = yScaleL;
    // monVars.yScaleR             = yScaleR;
    monVars.xAxis               = xAxis;
    monVars.yScaleAxisL         = yScaleAxisL;
    // monVars.yScaleAxisR         = yScaleAxisR;
    monVars.yAxisL              = yAxisL;
    // monVars.yAxisR              = yAxisR;


    redrawAxes_month();

    drawFiltered_month();

    /*

	// var x - d3.scaleBand().r
	var svg = d3.select("#"+graphName).select("svg");

	var xScale = d3.scaleBand()
        // .domain(genreTree)
        .domain(genreArr)
        // .domain(["Action", "Animation", "Drama"])
        // .range([xAxisWidth, chartWidth])
        .range([0, chart_width])
        .paddingInner(0.1)
        .paddingOuter(0.12);

    var yScale = d3.scaleLinear()
        // .domain([0, maxYval])
        // .range([chartHeight - yAxisHeight, yPadding]).nice();
        .domain([0, genreLocalMax])
        .range([0, chart_height]).nice();

    var yScaleAxis = d3.scaleLinear()
        // .domain([0, maxYval])
        // .range([chartHeight - yAxisHeight, yPadding]).nice();
        .domain([0, genreLocalMax])
        .range([chart_height, 0]).nice();


    // Create colorScale
    // var colorScale = d3.scaleBand()
    //     .domain(genreArr)
    //     .range(["#90CAF9", "#1565C0"]);     // Blue 200 - 800
    // var colorScale = d3.scaleBand()
    var colorScale = d3.scaleOrdinal()
    	.domain(genreArr)
    	// .range(d3.schemeCategory20);
    	.range(catColors);

    // Hover Interaction.
    // var hover_colorScale = d3.scaleBand()
    //     .domain(genreArr)
    //     .range(["#9FA8DA", "#3949AB"]);     // Cyan 200 - 800

    var hover_colorScale = d3.scaleOrdinal()
        .domain(genreArr)
    	// .range(d3.schemeCategory20c);
    	.range(catColorsLight);


    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);//.ticks(20);

    var yAxis = d3.axisLeft();
    yAxis.scale(yScaleAxis);


    svg
    	.append("g")
    	.attr("transform", "translate(" + chart_Xoffset + ", " + (chart_height + chart_Yoffset) + ")")
    	// .attr("transform", "translate(" + 40 + ", " + 440 + ")")
    	.call(xAxis);

    // svg.select("g")
    svg
    	.append("g")
    	.attr("transform", "translate(" + chart_Xoffset + ", " + chart_Yoffset + ")")
    	.call(yAxis);


    // Create the bars (hint: use #bars)
    var bars;

	    bars = svg.append("g").selectAll("rect").data(d3.entries(mLens_genres));

	    bars = bars.enter()
	        .append("rect")
	        .merge(bars);

	    bars.exit().remove();

	    bars.transition()
	        .duration(100)
	        .attr("x", function(d) {
	            // return 58 + xScale("Action");
	            // return 58 -(36/2) + xScale(genreElem);

	            // console.log(d);

	            // return 58 -(36/2) + xScale(d);
	            // return 58 - (36/2) + xScale(d.key);
	            // return chart_Xoffset - (chart_width/numGenres) + xScale(d.key);
	            return chart_Xoffset + xScale(d.key);
	        })
	        .attr("y", function(d, i) {
	            // return 2 + yScale(i/2);
	            // return d.length;

	            // console.log("iteration " + i + ",  val: " + d.value + ",  yScale: " + yScale(d.value));

	            // return 2 + d.length;
	            // console.log(i);
	            // return yScale(2 + d.value);
	            return chart_height + chart_Yoffset - yScale(d.value);
	        })
	        .attr("width", function (d) {
	            // return (d.length/140);
	            return (chart_width/numGenres)*9/10;
	        })
	        .attr("height", function (d) {
	            // return 36;
	            return yScale(d.value);
	        })
	        .style("fill", function(d) {
	        	// console.log(colorScale(d.key));
            	return colorScale(d.key);
        	})
	        .attr("id", function(d) {
	        	return d;
	        });
    // }

    bars.on('mouseover', function(d) {
            // No transition time on mouseover, to preserve responsiveness.
            var nodeSelection = 
            	d3.select(this)
                	.style("fill", function(d) {
    					// console.log(d);
    					// console.log(d.key);
    					// console.log(hover_colorScale(d.key));
                		return hover_colorScale(d.key);
                		// return "#AAA";
            		});
        })
        // Tooltip follows mouse.
        .on('mousemove', function(d) {
        })
        // Original bar color restored.
        .on('mouseout', function(d) {
            var nodeSelection = d3.select(this)
                .transition().duration(trans_dur/4)
                .style("fill", function(d) {
                return colorScale(d.key);
            });
            
            // d3.select("#bars_tooltip").classed("hidden", true);
        })
        // Log + Display selected bar data.
        .on('click', function(d) {

        	selected_genre = d;

            var nodeSelection = d3.select(this);

            nodeSelection
                .transition().duration(trans_dur/16)
                .style("fill", "#CCC")
                .on("end", function() {
                    d3.select(this)
                    .transition().duration(trans_dur/4)
                    .style("fill", "#5E35B1");
                });

            // Outputting selection to console.
            // console.log("Selected the " + d.year + " value for " + 
            //     [selectedDimension] + ", " + d[selectedDimension]);
        }); */
    

    // Color is separate, to prevent selecting a new chart from overriding current selection.
    // bars.filter(function(d, i) {
    //                 // Filtering 'selected' value to not change.
    //                 return (!d3.select(this).classed("selected"));
    //     })
    //     .style("fill", function(d) {
    //         return colorScale(d[selectedDimension]);
    //     });

}

function recalculateAxes_month()
{
    var t_monthAvgLocalMax = 0;
    var t_monthNumLocalMax = 0;
    var t_num = 0;
    var t_avg = 0;

    for (i = 0; i < monVars.numMonths; i++)
    {
        t_num = db_month_filtered[i].movieIds.length;
        t_avg = db_month_filtered[i].totalRating / t_num;

        t_monthNumLocalMax = Math.max(t_monthNumLocalMax, t_num);
        t_monthAvgLocalMax = Math.max(t_monthAvgLocalMax, t_avg);
    }


    monVars.monthNumLocalMax = t_monthNumLocalMax;
    monVars.monthAvgLocalMax = t_monthAvgLocalMax;

    monVars.yScaleL = d3.scaleLinear()
        .domain([0, t_monthNumLocalMax])
        .range([0, monVars.chart_height]).nice();

    monVars.yScaleAxisL = d3.scaleLinear()
        .domain([0, t_monthNumLocalMax])
        .range([monVars.chart_height, 0]).nice();

    // monVars.yAxisL = d3.axisLeft();
    monVars.yAxisL.scale(monVars.yScaleAxisL);

    // monVars.yAxisR = d3.axisRight();
    // monVars.yAxisR.scale(yScaleAxisR);

}

function redrawAxes_month()
{
    monVars.svg.select("#xAxisMonth")
        .attr("transform", "translate(" + monVars.chart_Xoffset + ", " + 
            (monVars.chart_height + monVars.chart_Yoffset) + ")")
        .call(monVars.xAxis);

    monVars.svg.select("#xAxisMonth")
        .selectAll('.tick')
        .on("click", function(d, i) {
            if (filters.month.size > 0)
            {
                var filterStr = "month_" + Array.from(filters.month)[0];

                // 'Repeating' logic for smooth transitions.
                clickMonth(d);

                removeButton(filterStr);
            }
            else
            {
                clickMonth(d);
            }
        });

    monVars.svg.select("#yAxisMonthL")
        .transition()
        .duration(monVars.trans_dur*2)
        .attr("transform", "translate(" + monVars.chart_Xoffset + ", " + 
            monVars.chart_Yoffset + ")")
        .call(monVars.yAxisL);

    // monVars.svg.select("#yAxisMonthR")
    //     .attr("transform", "translate(" + (monVars.chart_Xoffset + monVars.chart_width) + 
    //         ", " + monVars.chart_Yoffset + ")")
    //     .call(monVars.yAxisR);
}

function drawFiltered_month()
{
    var bars_filtered;

        bars_filtered = monVars.svg.select("#barsMonth_filtered")
            .selectAll("rect")
            .data(db_month_filtered);

        bars_filtered = bars_filtered.enter()
            .append("rect")
            .merge(bars_filtered);

        bars_filtered.exit().remove();

        bars_filtered.transition()
            .duration(monVars.trans_dur/6)
            .attr("x", function(d) {
                // console.log("d = ");
                // console.log(d);
                // return chart_Xoffset + xScale(d);
                // return chart_Xoffset + xScale(d.movieIds.length);

                return monVars.chart_Xoffset + monVars.xScale(d.monthName);
            })
            .attr("y", function(d, i) {
                return monVars.chart_height + monVars.chart_Yoffset - monVars.yScaleL(d.movieIds.length);
            })
            .attr("width", function(d) {
                console.log(d);
                return (monVars.chart_width/monVars.numMonths)*9/10;
                // return 10;
            })
            .attr("height", function(d) {
                return monVars.yScaleL(d.movieIds.length);
                // return 100;
            })
            .style("fill", function(d) {
                return monVars.color_default;
            })
            .attr("id", function(d) {
                return "month_" + d.monthName;
            });

    bars_filtered.on('mouseover', function(d) {
            // No transition time on mouseover, to preserve responsiveness.
            var nodeSelection = 
                d3.select(this)
                    .style("fill", function(d) {
                        return monVars.color_hover;
                    });
        })
        // Original bar color restored.
        .on('mouseout', function(d) {
            var nodeSelection = d3.select(this)
                .transition().duration(monVars.trans_dur/4)
                .style("fill", function(d) {
                // return colorScale(d.key);
                return monVars.color_default;
            });
            
            // d3.select("#bars_tooltip").classed("hidden", true);
        })
        // New Filters.
        .on('click', function(d) {

            var nodeSelection = d3.select(this);

            nodeSelection
                .transition().duration(monVars.trans_dur/16)
                .style("fill", "#CCC")
                .on("end", function() {
                    d3.select(this)
                    .transition().duration(monVars.trans_dur/4)
                    // .style("fill", "#5E35B1");
                    .style("fill", monVars.color_click);
                });

            // Outputting selection to console.
            // console.log("Selected the " + d.year + " value for " + 
            //     [selectedDimension] + ", " + d[selectedDimension]);

            // console.log(selected_genre);

            console.log("---------");
            console.log("--CLICK--");
            console.log("---------");
            console.log(d);

            clickMonth(d.monthName);
        });

    // var ratingLine = d3.line()
    //     .x(function(d, i){
    //         return monVars.chart_Xoffset + (monVars.xScale(monthNames[1])/2) - monVars.xScale(monthNames[0]) + 
    //             monVars.xScale(monthNames[i]);
    //     })
    //     .y(function(d, i){
    //         // console.log("Hello");
    //         // console.log(monVars.xScale(monthNames[i]));
    //         // console.log(monVars.yScaleR(d.totalRating / d.movieIds.length));
    //         return monVars.chart_height + monVars.chart_Yoffset - 
    //                 monVars.yScaleR(d.totalRating / d.movieIds.length);
    //     });


    // // var t_oldX = 0;
    // // var t_oldY = 0;

    // var lines_filtered;

    //     lines_filtered = monVars.svg.select("#lineMonth_filtered")
    //         .selectAll("line")
    //         .data(db_month_filtered);

    //     lines_filtered = lines_filtered.enter()
    //         .append("line")
    //         .merge(lines_filtered);

    //     lines_filtered.exit().remove();

    //     lines_filtered.transition()
    //         .duration(monVars.trans_dur/6)
    //         .attr("x1", function(d, i) {
    //             if (i == 0)
    //             {
    //                 return monVars.chart_Xoffset + 
    //                         (monVars.xScale(monthNames[1])/2) - monVars.xScale(monthNames[0]) + 
    //                         monVars.xScale(monthNames[i]);
    //                 // return t_oldX;
    //             }
    //             else
    //             {
    //                 // return t_oldX;
    //                 return monVars.chart_Xoffset + 
    //                         (monVars.xScale(monthNames[1])/2) - monVars.xScale(monthNames[0]) + 
    //                         monVars.xScale(monthNames[i-1]);
    //             }
    //         })
    //         .attr("y1", function(d, i) {
    //             if (i == 0)
    //             {
    //                 // if (d.movieIds.length )
    //                 t_oldY = monVars.chart_height + monVars.chart_Yoffset - 
    //                         monVars.yScaleR(d.totalRating / d.movieIds.length);

    //                 return t_oldY;
    //             }
    //             else
    //             {
    //                 // return t_oldY;
    //                 return monVars.chart_height + monVars.chart_Yoffset - 
    //                         monVars.yScaleR(db_month_filtered[i-1].totalRating / db_month_filtered[i-1].movieIds.length);
    //             }
    //         })
    //         .attr("x2", function(d, i) {
    //             return monVars.chart_Xoffset + 
    //                     (monVars.xScale(monthNames[1])/2) - monVars.xScale(monthNames[0]) + 
    //                     monVars.xScale(monthNames[i]);

    //             // return t_oldX;
    //         })
    //         .attr("y2", function(d, i) {
    //             return monVars.chart_height + monVars.chart_Yoffset - 
    //                     monVars.yScaleR(d.totalRating / d.movieIds.length);
                
    //             // return t_oldY;
    //         })
    //         .attr("stroke", "black");

        // lines_filtered = monVars.svg.select("#lineMonth_filtered")
        //     .selectAll("path")
        //     .data(db_month_filtered);

      //       .append("path")
      //       .datum(db_month_filtered)
      //       .attr("fill", "none")
      // .attr("stroke", "steelblue")
      // .attr("stroke-linejoin", "round")
      // .attr("stroke-linecap", "round")
      // .attr("stroke-width", 1.5)
      // .attr("d", ratingLine);

            // .data(db_month_filtered);
            // .data(ratingLine(db_month_filtered));

        // lines_filtered = lines_filtered.enter()
        //     .append("path")
        //     .merge(lines_filtered)
        //     // ;
        //     .attr("class", "line")
        //     .attr("d", ratingLine);

        // lines_filtered = monVars.svg.select("#lineMonth_filtered");

        // lines_filtered
        //     .select("path")
        //     // .remove();

        // // lines_filtered
        //     // .selectAll("path")
        //     .datum(db_month_filtered)
        //     // .enter()
        //     // .append("path")
        //     // .

        //     .attr("stroke", "steelblue")
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-linecap", "round")
        //     .attr("stroke-width", 1.5)

        //     .attr("class", "line")
        //     .attr("d", ratingLine);

        // // console.log("HELLO")
        // // console.log(ratingLine(db_month_filtered));

        // lines_filtered
        //     .transition()
        //     .duration(monVars.trans_dur/6);
        
        // lines_filtered.exit().remove();

        // lines_filtered
            
            // .transition()
            // .duration(monVars.trans_dur/6)

            // .attr("d", function(d) {
            //     return ratingLine(d);
            // });

            // .attr("d", ratingLine(db_month_filtered));

            // .datum(db_month_filtered)


            // .attr("class", "line")
            // .attr("d", ratingLine);

            // .attr("d", ratingLine);

}


/**
 * Function to initialize a monthArray.
 * 2-tiered structure:
 * T1: Month Num   (e.g. '1', for Jan)
 * T2a: Numbers    (Total Ratings, Average stuff.)
 * T2b: Movie IDs  (e.g. 01, for Toy Story)
 */
function init_monthArray()
{
    // console.log("monthNames: ");
    // console.log(monthNames);

    // console.log("monthArr: ");
    // console.log(monthArr);

    var mArray = [];
    var t_monthObj;
    for (i = 0; i < 12; i++)
    {
        t_monthObj = new Object();

        t_monthObj.monthName = monthNames[i];
        t_monthObj.totalRating = 0;
        t_monthObj.movieIds = [];

        mArray[i] = t_monthObj;
    }

    return mArray;
}


/**
 * Helper function; converts a string to a number.
 */
function parseMonthStr(monthStr)
{
    return monthNames.indexOf(monthStr);
}


function clickMonth(monthName)
{
    if (!filters.month.has(monthName))
    {
        filters.num++;
        filters.month.add(monthName);
        // filters.month.push(d.key);
        newButton("month_"+monthName);

        updateFiltered();
    }
}


// function update_monthDB(onlyFilters)
function update_monthDB()
{
    var t_movieGenres;
    db_month_filtered = init_monthArray();

    // Non-filtered movies.
    // if (!onlyFilters)
    // {
    //     db_month = init_monthArray();
    //     // db_month_filtered = init_monthArray();

    //     movies.forEach(function(movie)
    //     {
    //         t_id = movie.id;
    //         t_month = parseMonthStr(movie.releaseMonth);

    //         if (t_month >= 0)
    //         {
    //             // Currently mapping all non-votes to zero.
    //             // TODO: REMAP UNRATED TO -1.
    //             if (movie.imdbRatingAvg != "Unavailable")
    //             {
    //                 t_rating = Math.max(movie.imdbRatingAvg, 0);
    //             }
    //             else
    //             {
    //                 // MovieLens has ratings out of 5.
    //                 t_rating = Math.max(movie.ratingAvg, 0) * 2;
    //             }

    //             db_month[t_month].movieIds.push(t_id);
    //             db_month[t_month].totalRating += t_rating;
    //         }
            
    //     });
    // }
    // else
    // {
    //     db_month_filtered = emptyGenreArray();
    // }

    
    // Filtered Movies
    movies_filtered.forEach(function(movie)
    {
        t_id = movie.id;
        t_month = parseMonthStr(movie.releaseMonth);

        if (t_month >= 0)
        {
            // Currently mapping all non-votes to zero.
            // TODO: REMAP UNRATED TO -1.
            if (movie.imdbRatingAvg != "Unavailable")
            {
                t_rating = Math.max(movie.imdbRatingAvg, 0);
            }
            else
            {
                // MovieLens has ratings out of 5.
                t_rating = Math.max(movie.ratingAvg, 0) * 2;
            }

            db_month_filtered[t_month].movieIds.push(t_id);
            db_month_filtered[t_month].totalRating += t_rating;
        }
        
    });
    
}