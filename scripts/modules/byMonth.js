/** Global Variables containing data **/
var db_month;
var db_month_filtered;

var monthNames = ["January", "February", "March", "April",  
                      "May", "June", "July", "August", "September", 
                      "October", "November", "December"];

var monVars;


/**
 * Initialize and first draw of month module.
 */
function drawModule_month()
{
    db_month = [];
    db_month_filtered = [];

	monVars = [];

    var graphName = "byMonth";
    var trans_dur = 600;                // Transition Duration in Milliseconds.
    var mod_width = 740;
    var mod_height = 450;
    var chart_width = 654;
    var chart_height = 380;

    var chart_Xoffset = 60;
    var chart_Yoffset = 26;

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
        .select("svg")
        .attr("width", mod_width)
        .attr("height", mod_height);


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


    var svg = d3.select("#"+graphName).select("svg");

    var xScale = d3.scaleBand()
        .domain(monthNames)
        .range([0, chart_width])
        .paddingInner(0.1)
        .paddingOuter(0.12);

    var yScaleL = d3.scaleLinear()
        .domain([0, monthNumLocalMax])
        .range([0, chart_height]).nice();

    var yScaleAxisL = d3.scaleLinear()
        .domain([0, monthNumLocalMax])
        .range([chart_height, 0]).nice();


    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);

    var yAxisL = d3.axisLeft();
    yAxisL.scale(yScaleAxisL);


    // More updating of global genre variables.
    monVars.svg                 = svg;
    monVars.monthAvgLocalMax    = monthAvgLocalMax;
    monVars.monthNumLocalMax    = monthNumLocalMax;
    monVars.xScale              = xScale;
    monVars.yScaleL             = yScaleL;
    monVars.xAxis               = xAxis;
    monVars.yScaleAxisL         = yScaleAxisL;
    monVars.yAxisL              = yAxisL;


    redrawAxes_month();

    drawFiltered_month();
}


/**
 * Function to update axes according to filtered data.
 */
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

    monVars.yAxisL.scale(monVars.yScaleAxisL);
}

/**
 * Function to redraw axes according to filtered data.
 */
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

                // 'Repeating' logic here as well as below, for smooth transitions.
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
}

/**
 * Redraw month bars according to filtered values.
 */
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
                return monVars.chart_Xoffset + monVars.xScale(d.monthName);
            })
            .attr("y", function(d, i) {
                return monVars.chart_height + monVars.chart_Yoffset - monVars.yScaleL(d.movieIds.length);
            })
            .attr("width", function(d) {
                return (monVars.chart_width/monVars.numMonths)*9/10;
            })
            .attr("height", function(d) {
                return monVars.yScaleL(d.movieIds.length);
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
                    .style("fill", monVars.color_click);
                });
            clickMonth(d.monthName);
        });
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


/**
 * Reused function -- updates filters and adds a new byMonth button.
 */
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

/**
 * Function to update the filtered values in db_month_filtered.
 */
function update_monthDB()
{
    var t_movieGenres;
    db_month_filtered = init_monthArray();

    
    // Filtered Movies
    movies_filtered.forEach(function(movie)
    {
        t_id = movie.id;
        t_month = parseMonthStr(movie.releaseMonth);

        if (t_month >= 0)
        {
            // Currently mapping all non-votes to zero.
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