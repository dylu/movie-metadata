/** Global Variables containing data **/
var db_mpaa;
var db_mpaa_filtered;

var mpaaVars;


/**
 * First draw of mpaa rating pie chart.
 */
function drawModule_mpaaRating()
{
    db_mpaa = [];
    db_mpaa_filtered = [];

    mpaaVars = [];

    var graphName = "byMpaaRating";
    var trans_dur = 600;                // Transition Duration in Milliseconds.
    var mod_width = 450;
    var mod_height = 450;
    var chart_width = 424;
    var chart_height = 424;
    var chart_Xoffset = 50;
    var chart_Yoffset = 40;
    update_mpaaDB();

    var colors_default  = [ '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', 
                            '#2196F3', '#1E88E5', '#1976D2', '#1565C0', 
                            '#0D47A1', '#2196F3'];  // Blue 100-900 + 500
    var color_scale = d3.scaleOrdinal(colors_default);
    var colors_hover    = [ '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', 
                            '#03A9F4', '#039BE5', '#0288D1', '#0277BD', 
                            '#01579B', '#03A9F4'];  // L. Blue 100-900 + 500
    var color_scale_hover = d3.scaleOrdinal(colors_hover);

    var color_default   = '#42A5F5';    // Blue     400
    var color_hover     = '#4FC3F7';    // L. Blue  300
    var color_filtered  = '#5C6BC0';    // Indigo   400
    var color_f_hover   = '#7986CB';    // Indigo   300
    var color_click     = '#1E88E5';    // Blue     600
    
    var chartRadius = Math.min(chart_width, chart_height) / 2;
	var genreLocalMax = 0;
	var mpaaArr = [];

    // Updating Global Genre Variables List (for helper functions).
    mpaaVars.graphName       = graphName;
    mpaaVars.chartRadius     = chartRadius;
    mpaaVars.trans_dur       = trans_dur;
    mpaaVars.mod_width       = mod_width;
    mpaaVars.mod_height      = mod_height;
    mpaaVars.chart_width     = chart_width;
    mpaaVars.chart_height    = chart_height;
    mpaaVars.chart_Xoffset   = chart_Xoffset;
    mpaaVars.chart_Yoffset   = chart_Yoffset;
    mpaaVars.color_default   = color_default;
    mpaaVars.color_hover     = color_hover;
    mpaaVars.color_filtered  = color_filtered;
    mpaaVars.color_f_hover   = color_f_hover;
    mpaaVars.color_click     = color_click;
    mpaaVars.color_scale     = color_scale;
    mpaaVars.color_scale_hover  = color_scale_hover;


	d3.select("#" + graphName)
        .select("svg")
        .attr("width", mod_width)
        .attr("height", mod_height);

    d3.select("#" + graphName)
        .select("svg")
        .select("g")
        .attr("transform", "translate(" + mod_width/2 + "," + mod_height/2 + ")");


	var svg = d3.select("#"+graphName).select("svg");


    // More updating of global genre variables.
    mpaaVars.svg             = svg;


    var pieData = d3.pie()
                    .sort(null)
                    .value(function(d) {
                        return +d.value;
                    });

    var piePath = d3.arc()
                    .outerRadius(chartRadius - 10)
                    .innerRadius(0);

    var pieLabel = d3.arc()
                    .outerRadius(chartRadius - 46)
                    .innerRadius(chartRadius - 46);


    // var bars;
    var arcs_filtered;
    var arcs_text_filtered;

        arcs_filtered =
        svg .selectAll(".arc")
            .data(pieData(d3.entries(db_mpaa_filtered)))
            .enter()
            .append("g")
            .attr("transform", "translate(" + mod_width/2 + "," + mod_height/2 + ")")
            .attr("class", "arc");

	    arcs_filtered = arcs_filtered.enter()
            .append("g")
            .attr("class", "arc")
	        .merge(arcs_filtered);

	    arcs_filtered.exit().remove();

	    arcs_filtered
            .append("path")
            .attr("d", piePath)
            .style("fill", function(d, i) {
                // return color_default;
                return color_scale(i);
            })
            .attr("id", function(d) {
                return d;
            });

        arcs_filtered
            .on('mouseover', function(d, i) {
                d3.select(this)
                    .style("fill", function(d2) {
                        return color_scale_hover(i);
                    });
            })
            .on('click', function(d, i) {
                if (d.data.key != "Other" &&
                    !filters.mpaa.has(d.data.key))
                {
                    filters.num++;
                    filters.mpaa.add(d.data.key);
                    newButton("mpaa_"+d.data.key);

                    updateFiltered();
                }
            });


        arcs_text_filtered = arcs_filtered;

        arcs_text_filtered = 
            arcs_text_filtered.append("text")
	        .attr("transform", function(d, i) { 
                return "translate(" + pieLabel.centroid(d) + ")"; 
            })
	        .attr("dy", "0.35em")
	        .text(function(d) {
	            return d.data.key;
	        })

}


/**
 * Redrawing pie chart with updated filtered data.
 */
function drawFiltered_mpaa()
{
    mpaaVars.svg.selectAll(".arc").remove();

    var pieData = d3.pie()
                    .sort(null)
                    .value(function(d) {
                        return +d.value;
                    });

    var piePath = d3.arc()
                    .outerRadius(mpaaVars.chartRadius - 10)
                    .innerRadius(0);

    var pieLabel = d3.arc()
                    .outerRadius(mpaaVars.chartRadius - 46)
                    .innerRadius(mpaaVars.chartRadius - 46);

    var arcs_filtered;
    var arcs_text_filtered;

        arcs_filtered = mpaaVars.svg
            .selectAll(".arc")
            .data(pieData(d3.entries(db_mpaa_filtered)))
            .enter()
            .append("g")
            .attr("transform", "translate(" + mpaaVars.mod_width/2 + "," + mpaaVars.mod_height/2 + ")")
            .attr("class", "arc");

        arcs_filtered = arcs_filtered.enter()
            .append("g")
            .attr("class", "arc")
            .merge(arcs_filtered);

        arcs_filtered.exit().remove();

        arcs_filtered
            .append("path")
            .attr("d", piePath)
            .style("fill", function(d, i) {
                return mpaaVars.color_scale(i);
            })
            .attr("id", function(d) {
                return d;
            });


        arcs_filtered
            .on('mouseover', function(d, i) {
                d3.select(this)
                    .style("fill", function(d2) {
                        return mpaaVars.color_scale_hover(i);
                    });
            })
            .on('click', function(d, i) {
                if (d.data.key != "Other" &&
                    !filters.mpaa.has(d.data.key))
                {
                    filters.num++;
                    filters.mpaa.add(d.data.key);
                    newButton("mpaa_"+d.data.key);

                    updateFiltered();
                }
            });

        arcs_text_filtered = arcs_filtered;

        arcs_text_filtered = 
            arcs_text_filtered.append("text")
            .attr("transform", function(d) { 
                return "translate(" + pieLabel.centroid(d) + ")"; 
            })
            .attr("dy", "0.35em")
            .text(function(d) {
                return d.data.key;
            })
}


/**
 * updating db of pie chart with filtered data.
 */
function update_mpaaDB()
{
    var t_mpaaRatings;
    db_mpaa_filtered = [];

    movies_filtered.forEach(function (movie_elem) {
        t_mpaaRatings = movie_elem.mpaaRating;

        if (t_mpaaRatings != "R"        &&
            t_mpaaRatings != "PG"       &&
            t_mpaaRatings != "PG-13"    &&
            t_mpaaRatings != "Unrated"  &&
            t_mpaaRatings != "M"        &&
            t_mpaaRatings != "X"        &&
            t_mpaaRatings != "G"        &&
            t_mpaaRatings != "Approved")
        {
            t_mpaaRatings = "Other";
        }

        if (!db_mpaa_filtered.hasOwnProperty([t_mpaaRatings]))
        {
            db_mpaa_filtered[t_mpaaRatings] = 1;
        }
        else
        {
            db_mpaa_filtered[t_mpaaRatings]++;
        }
    });
    
}
