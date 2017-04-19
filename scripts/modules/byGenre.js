/** Global Variables containing data **/
// var movies;
// var mLens_movies;

var selected_genre;

function drawModule_genre()
{
    var graphName = "byGenre";

	var catColors = ['#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5',
					 '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5',
					 '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5',
					 '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5', '#42A5F5'];
	var catColorsLight = 
					['#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7',
					 '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7',
					 '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7',
					 '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7', '#68B7F7'];

	var trans_dur = 600;
	// var genreTree = new Object();
	var genreTree = [];
	// var mod_width = 600;
	var mod_width = 1000;
	var mod_height = 500;
	var numGenres = 0;
	var chart_width = 900;
	var chart_height = 400;
	var chart_Xoffset = 60;
	var chart_Yoffset = 40;
	var genreLocalMax = 0;

	var genreArr = [];

	d3.select("#" + graphName)
        .append("svg")
        .attr("width", mod_width)
        .attr("height", mod_height)
        .append("g");
        // .append("rect")
        // .attr("x", 0)
        // .attr("y", 0)
        // .


    console.log("Printing mLens_genres.");
    console.log(mLens_genres);

    console.log("Printing mLens_genres length.");
    console.log(mLens_genres.length);

    for (var property in mLens_genres)
    {
	    if (mLens_genres.hasOwnProperty(property))
	    {
	    	// do stuff
	    	genreArr[numGenres] = property;
	    	numGenres++;

	    	genreLocalMax = Math.max(genreLocalMax, mLens_genres[property]);
	    }
	}

	genreArr.sort();

	console.log("Printing numGenres, genreArr.");
	console.log(numGenres);
	console.log(genreArr);

	init_genreTree(genreTree, genreArr);

	var t_id;
	var t_genres;
	var t_rating;

	// for (var movie in movies)
	movies.forEach(function(movie)
	{
		t_id = movie.id;
		t_genres = movie.genres;
		// Currently mapping all non-votes to zero.
		// TODO: REMAP UNRATED TO -1.
		t_rating = Math.max(movie.ratingAvg, 0);

		// "Floor" the rating to nearest bucket starting value.
		// e.g. 3.74 -> 3.5,  4.29 -> 4.0,  2.5 -> 2.5.
		t_rating = t_rating - (t_rating % 0.5);
		// Edge case of maximum rating.
		if (t_rating == 5)
		{
			t_rating = 4.5;
		}

		// Multiplying everything to deal with js not handling .5 values.
		t_rating = t_rating * 2;

		// for (var t_genre in t_genres)
		t_genres.forEach(function(t_genre)
		{
			// console.log(t_genre);
			genreTree[t_genre][t_rating].push(t_id);
		});
	});

	console.log("Printing genreTree (After Populating)");
	console.log(genreTree);

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

    // genreTree.forEach(function(genreElem) {
    // for (var genreElem in genreTree) {
    	// console.log("hello");
    	// console.log(genreElem);
    	// bars = svg.append("g").selectAll("rect").data(genreTree.Action);
    	// bars = svg.append("g").selectAll("rect").data(genreTree[genreElem]);
	    // var bars = svg.append("g").selectAll("rect").data(genreTree);
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
                return colorScale(d.key);
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
                    .style("fill", "#5E35B1");
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


/**
 * Function to initialize a genreTree.
 * 3-tiered structure:
 * T1: Genre Name  (e.g. 'Adventure')
 * T2: Bucket Val  (0.5 intervals from 0-5)
 * T3: Movie IDs   (e.g. 01, for Toy Story)
 */
function init_genreTree(genreTree, genreArr)
{
	var t_bucketName;
	var t_buckets;

	for (i = 0; i < genreArr.length; i++)
	{
		t_buckets = [];
		for (j = 0; j < 10; j++)
		{
			// t_bucketName = j/2;
			t_bucketName = j;
			t_buckets[t_bucketName] = [];
		}

		genreTree[genreArr[i]] = t_buckets;
	}

	console.log("Printing genreTree");
	console.log(genreTree);
}