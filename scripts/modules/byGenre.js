/** Global Variables containing data **/
// var movies;

// var selected_genre;
var genVars;

function drawModule_genre()
{
    genVars = [];

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

    // Updating Global Genre Variables List (for helper functions).
    genVars.graphName       = graphName;
    genVars.trans_dur       = trans_dur;
    genVars.mod_width       = mod_width;
    genVars.mod_height      = mod_height;
    genVars.chart_width     = chart_width;
    genVars.chart_height    = chart_height;
    genVars.chart_Xoffset   = chart_Xoffset;
    genVars.chart_Yoffset   = chart_Yoffset;
    genVars.color_default   = color_default;
    genVars.color_filtered  = color_filtered;
    genVars.color_hover     = color_hover;
    genVars.color_click     = color_click;


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

    // console.log("Printing db_genres length.");
    // console.log(db_genres.length);


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


    // More updating of global genre variables.
    genVars.genreArr        = genreArr;
    genVars.svg             = svg;
    genVars.numGenres       = numGenres;
    genVars.genreLocalMax   = genreLocalMax;
    genVars.xScale          = xScale;
    genVars.yScale          = yScale;


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


    var bars;
    var bars_filtered;

        bars = svg.select("#barsGenre")
            .selectAll("rect")
            .data(d3.entries(db_genres));

	    bars = bars.enter()
	        .append("rect")
	        .merge(bars);

	    bars.exit().remove();

	    bars.transition()
	        .duration(100)
	        .attr("x", function(d) {
	            return chart_Xoffset + xScale(d.key);
	        })
	        .attr("y", function(d, i) {
	            return chart_height + chart_Yoffset - yScale(d.value);
	        })
	        .attr("width", function (d) {
	            return (chart_width/numGenres)*9/10;
	        })
	        .attr("height", function (d) {
	            return yScale(d.value);
	        })
	        .style("fill", function(d) {
                return color_default;
        	})
	        .attr("id", function(d) {
	        	return d;
	        });

    // if (filters.genre.length > 0)
    {
        drawFiltered_genre();
    }

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

        	// selected_genre = d;

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
            if (!filters.genre.has(d.key))
            {
                filters.genre.add(d.key);
                // filters.genre.push(d.key);
                newButton("genre:"+d.key);

                updateFiltered();
            }
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

function drawFiltered_genre()
{
    console.log("[drawFiltered_genre]  ");
    console.log("db_genres: ");
    console.log(db_genres);
    console.log("db_genres_filtered: ");
    console.log(db_genres_filtered);

    // console.log("movies: ");
    // console.log(movies);
    // console.log("movies_filtered: ");
    // console.log(movies_filtered);

    if (filters.genre.size <= 0)
    // if (filters.genre.length <= 0)
    {
        bars_filtered = genVars.svg.select("#barsGenre_filtered")
            .selectAll("rect")
            .data(d3.entries(emptyGenreArray()));
    }
    else
    {
        bars_filtered = genVars.svg.select("#barsGenre_filtered")
            .selectAll("rect")
            .data(d3.entries(db_genres_filtered));
    }


    bars_filtered = bars_filtered.enter()
        .append("rect")
        .merge(bars_filtered);

    bars_filtered.exit().remove();

    bars_filtered.transition()
        .duration(100)
        .attr("x", function(d) {
            return genVars.chart_Xoffset + genVars.xScale(d.key);
        })
        .attr("y", function(d, i) {
            return genVars.chart_height + genVars.chart_Yoffset - genVars.yScale(d.value);
        })
        .attr("width", function (d) {
            return (genVars.chart_width/genVars.numGenres)*9/10;
        })
        .attr("height", function (d) {
            return genVars.yScale(d.value);
        })
        .style("fill", function(d) {
            return genVars.color_filtered;
            // return "#222";
        })
        .attr("id", function(d) {
            return d;
        });
}


function emptyGenreArray()
{
    var emptyArr = [];

    genVars.genreArr.forEach(function (genre_val) {
        if (!emptyArr.hasOwnProperty([genre_val]))
        {
            emptyArr[genre_val] = 0;
        }
    });

    return emptyArr;
}



function update_genresDB(onlyFilters)
{
    var t_movieGenres;
    db_genres_filtered = [];

    // Non-filtered movies.
    if (!onlyFilters)
    {
        db_genres = [];
        db_genres_filtered = [];

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
                    // db_genres.length++;
                }
                else
                {
                    db_genres[elem_genre]++;
                }
            })
        });
    }
    else
    {
        db_genres_filtered = emptyGenreArray();
    }

    console.log("LENGTHS ");
    console.log(movies.length);
    console.log(movies_filtered.length);

    // Filtered Movies
    movies_filtered.forEach(function (movie_elem) {
        // console.log(d.genres.split("|"));
        t_movieGenres = movie_elem.genres;
        t_movieGenres.forEach(function (elem_genre) {
            if (!db_genres_filtered.hasOwnProperty([elem_genre]))
            {
                // console.log("uuuugh");
                // console.log(elem_genre);
                db_genres_filtered[elem_genre] = 1;
            }
            else
            {
                db_genres_filtered[elem_genre]++;
            }
        })
    });
    
}
