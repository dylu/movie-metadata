/** Global Variables containing data **/
// var movies;

var selected_genre;

function drawModule_genre()
{
    var graphName = "byGenre";
    var trans_dur = 600;                // Transition Duration in Milliseconds.
    // var mod_width = 600;
    var mod_width = 1000;
    var mod_height = 500;
    var chart_width = 900;
    var chart_height = 400;
    var chart_Xoffset = 60;
    var chart_Yoffset = 40;
    update_genresDB(false);

    var color_default   = '#42A5F5';    // Blue     400
    var color_filtered  = '#5C6BC0';    // Indigo   400
    var color_hover     = '#4FC3F7';    // L. Blue  300
    var color_click     = '#7E57C2';    // D. Purp  400
    
    var numGenres = 0;
	var genreLocalMax = 0;
	var genreArr = [];


	d3.select("#" + graphName)
        // .append("svg")
        .select("svg")
        .attr("width", mod_width)
        .attr("height", mod_height);
        // .append("g");

        // .append("rect")
        // .attr("x", 0)
        // .attr("y", 0)
        // .



    console.log("Printing db_genres.");
    console.log(db_genres);

    console.log("Printing db_genres length.");
    console.log(db_genres.length);


    // for (var property in mLens_genres)
    for (var property in db_genres)
    {
	    if (db_genres.hasOwnProperty(property))
	    {
	    	// do stuff
	    	genreArr[numGenres] = property;
	    	numGenres++;

	    	genreLocalMax = Math.max(genreLocalMax, db_genres[property]);
	    }
	}

	genreArr.sort();

	// console.log("Printing numGenres, genreArr.");
	// console.log(numGenres);
	// console.log(genreArr);

	var t_id;
	var t_genres;
	var t_rating;


	// var x - d3.scaleBand().r
	var svg = d3.select("#"+graphName).select("svg");

	var xScale = d3.scaleBand()
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



    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);//.ticks(20);

    var yAxis = d3.axisLeft();
    yAxis.scale(yScaleAxis);

    // svg.select("#xAxis")
    //     .transition()
    //     .duration(trans_dur)
    //     .attr("transform", "translate(" + 0 + "," + (chartHeight - yAxisHeight) + ")")
    //     .call(xAxis)
    //   .selectAll("text")
    //     .attr("y", -5)
    //     .attr("x", -28)
    //     .attr("transform", "rotate(-90)");

    // svg.select("#yAxis")
    //     .transition()
    //     .duration(trans_dur)
    //     .attr("transform", "translate(" + xAxisWidth + "," + (0) + ")")
    //     .call(yAxis);

    // svg.select("g")
    svg.select("#xAxisGenre")
    	// .append("g")
    	.attr("transform", "translate(" + chart_Xoffset + ", " + (chart_height + chart_Yoffset) + ")")
    	// .attr("transform", "translate(" + 40 + ", " + 440 + ")")
    	.call(xAxis);

    // svg.select("g")
    svg.select("#yAxisGenre")
    	// .append("g")
    	.attr("transform", "translate(" + chart_Xoffset + ", " + chart_Yoffset + ")")
    	.call(yAxis);


    // Create the bars (hint: use #bars)
    var bars;

	    // bars = svg.append("g").selectAll("rect").data(d3.entries(db_genres));
        bars = svg.select("#barsGenre").selectAll("rect").data(d3.entries(db_genres));

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
            	// return colorScale(d.key);
                return color_default;
        	})
	        .attr("id", function(d) {
	        	return d;
	        });

    var bars_filtered;

    // if (filters.genre.length > 0)
    // {
    //     console.log("mLens_genres_filtered");
    //     console.log(mLens_genres_filtered);
    //     bars_filtered = svg.select("g").selectAll("rect").data(d3.entries(mLens_genres_filtered));

    //     bars_filtered = bars_filtered.enter()
    //         .append("rect")
    //         .merge(bars_filtered);

    //     bars_filtered.exit().remove();

    //     bars_filtered.transition()
    //         .duration(100)
    //         .attr("x", function(d) {
    //             // return 58 + xScale("Action");
    //             // return 58 -(36/2) + xScale(genreElem);

    //             // console.log(d);

    //             // return 58 -(36/2) + xScale(d);
    //             // return 58 - (36/2) + xScale(d.key);
    //             // return chart_Xoffset - (chart_width/numGenres) + xScale(d.key);
    //             return chart_Xoffset + xScale(d.key);
    //         })
    //         .attr("y", function(d, i) {
    //             // return 2 + yScale(i/2);
    //             // return d.length;

    //             // console.log("iteration " + i + ",  val: " + d.value + ",  yScale: " + yScale(d.value));

    //             // return 2 + d.length;
    //             // console.log(i);
    //             // return yScale(2 + d.value);
    //             return chart_height + chart_Yoffset - yScale(d.value);
    //         })
    //         .attr("width", function (d) {
    //             // return (d.length/140);
    //             return (chart_width/numGenres)*9/10;
    //         })
    //         .attr("height", function (d) {
    //             // return 36;
    //             return yScale(d.value);
    //         })
    //         .style("fill", function(d) {
    //             // console.log(colorScale(d.key));
    //             return colorScale2(d.key);
    //         })
    //         .attr("id", function(d) {
    //             return d;
    //         });
    // }

    bars.on('mouseover', function(d) {
            // No transition time on mouseover, to preserve responsiveness.
            var nodeSelection = 
            	d3.select(this)
                	.style("fill", function(d) {
    					// console.log(d);
    					// console.log(d.key);
    					// console.log(hover_colorScale(d.key));
                		// return hover_colorScale(d.key);
                        return color_hover;
                		// return "#AAA";
            		});
        })
        // Tooltip follows mouse.
        .on('mousemove', function(d) {
            // var curr_loc = d3.mouse(this);

            // // fine tuning
            // // var xAdj = 20 + detailsXOffset;
            // // var yAdj = 32 + headerOffset;
            // var xAdj = -120;
            // var yAdj = 22;
            
            // var tt = d3.select("#bars_tooltip")
            //     .style("left", (curr_loc[0] + xAdj) + "px")
            //     .style("top", (curr_loc[1] + yAdj) + "px");

            // tt.select("#title")
            //     .text(capitalize([selectedDimension].toString()) + 
            //         " " + d.year + ":");
            // tt.select("#value")
            //     .text(d[selectedDimension]);

            // tt.classed("hidden", false);
        })
        // Original bar color restored.
        .on('mouseout', function(d) {
            var nodeSelection = d3.select(this)
                .transition().duration(trans_dur/4)
                .style("fill", function(d) {
                // return colorScale(d.key);
                return color_default;
            });
            
            // d3.select("#bars_tooltip").classed("hidden", true);
        })
        // Log + Display selected bar data.
        .on('click', function(d) {

        	selected_genre = d;

            // Reset old 'selected' value.
            // d3.selectAll(".selected")
            //     .transition()
            //     .duration(trans_dur/4)
            //     .style("fill", function(d) {
            //         return colorScale(d[selectedDimension]);
            //     });
            // d3.selectAll(".selected").classed("selected", false);

            // // selectedYear = d.year;
            // updateInfo(d);
            // clearMap();
            // updateMap(d);

            var nodeSelection = d3.select(this);

            nodeSelection
                .transition().duration(trans_dur/16)
                .style("fill", "#CCC")
                .on("end", function() {
                    d3.select(this)
                    .transition().duration(trans_dur/4)
                    // .style("fill", "#5E35B1");
                    .style("fill", color_click);
                });

            // Outputting selection to console.
            // console.log("Selected the " + d.year + " value for " + 
            //     [selectedDimension] + ", " + d[selectedDimension]);

            // console.log(selected_genre);

            console.log("---------");
            console.log("--CLICK--");
            console.log("---------");

            filters.num++;
            filters.genre.push(selected_genre.key);
            filter_movies();
        });
    

    // Color is separate, to prevent selecting a new chart from overriding current selection.
    // bars.filter(function(d, i) {
    //                 // Filtering 'selected' value to not change.
    //                 return (!d3.select(this).classed("selected"));
    //     })
    //     .style("fill", function(d) {
    //         return colorScale(d[selectedDimension]);
    //     });

}



function update_genresDB(onlyFilters)
{
    var t_movieGenres;

    // Non-filtered movies.
    if (!onlyFilters)
    {
        movies.forEach(function (movie_elem) {
            // console.log(d.genres.split("|"));
            t_movieGenres = movie_elem.genres;
            t_movieGenres.forEach(function (elem_genre) {
                // if ([elem_genre] == "1 - September 11 (2002)\"")
                // {
                //     console.log("hello -- test");
                //     console.log(d);
                // }
                if (!db_genres.hasOwnProperty([elem_genre]))
                // if (db_genres[elem_genre] == null || db_genres <= 0)
                {
                    db_genres[elem_genre] = 1;
                    db_genres.length++;
                }
                else
                {
                    db_genres[elem_genre]++;
                }
            })
        });
    }

    // Filtered Movies
    movies_filtered.forEach(function (movie_elem) {
        // console.log(d.genres.split("|"));
        t_movieGenres = movie_elem.genres;
        t_movieGenres.forEach(function (elem_genre) {
            if (!db_genres_filtered.hasOwnProperty([elem_genre]))
            {
                db_genres_filtered[elem_genre] = 1;
                db_genres_filtered.length++;
            }
            else
            {
                db_genres_filtered[elem_genre]++;
            }
        })
    });
    
}
