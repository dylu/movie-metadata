/** Global Variables containing data **/
// var movies;
// var mLens_movies;

// var selected_genre;

var monthNames = ["January", "February", "March", "April",  
                      "May", "June", "July", "August", "September", 
                      "October", "November", "December"];


function drawModule_month()
{
    graphName = "byMonth";

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

	var mod_width = 1000;
	var mod_height = 500;
	var chart_width = 900;
	var chart_height = 400;
	var chart_Xoffset = 60;
	var chart_Yoffset = 40;
	var genreLocalMax = 0;

	var monthArr = [];

	d3.select("#" + graphName)
        .append("svg")
        .attr("width", mod_width)
        .attr("height", mod_height)
        .append("g");
        // .append("rect")
        // .attr("x", 0)
        // .attr("y", 0)
        // .


	init_monthArray(monthArr);

	var t_id;
	var t_month;
	var t_rating;

	// for (var movie in movies)
	movies.forEach(function(movie)
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

            monthArr[t_month].movieIds.push(t_id);
            monthArr[t_month].totalRating += t_rating;
        }
		
	});

	console.log("Printing monthArr (After Populating)");
	console.log(monthArr);

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


/**
 * Function to initialize a monthArray.
 * 2-tiered structure:
 * T1: Month Num   (e.g. '1', for Jan)
 * T2a: Numbers    (Total Ratings, Average stuff.)
 * T2b: Movie IDs  (e.g. 01, for Toy Story)
 */
function init_monthArray(monthArr)
{
    console.log("monthNames: ");
    console.log(monthNames);

    console.log("monthArr: ");
    console.log(monthArr);

    var monthObj;
    for (i = 0; i < 12; i++)
    {
        monthObj = new Object();

        monthObj.monthName = monthNames[i];
        monthObj.totalRating = 0;
        monthObj.movieIds = [];

        monthArr[i] = monthObj;
    }
}


/**
 * Helper function; converts a string to a number.
 */
function parseMonthStr(monthStr)
{
    return monthNames.indexOf(monthStr);
}