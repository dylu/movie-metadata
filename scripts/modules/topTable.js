/**
 * Manages the movies table on the far right.
 */

var db_table_filtered;

/**
 * First draw -- same as any other draw.
 */
function drawModule_table()
{
	update_tableDB();
	redrawFiltered_table();
}

/**
 * Redraws using filtered values.
 */
function redrawFiltered_table()
{
	var trans_dur = 600;
	var tableName = "topTableWrapper";
	var base_url = "http://www.imdb.com/title/tt";

	d3.select("#topTable")
			.select("tbody")
            .selectAll("tr")
            .remove();


	var table_trs;
	var table_tds;

	var t_tdArray;

		table_trs = d3.select("#topTable")
			.select("tbody")
            .selectAll("tr")
            .data(db_table_filtered);

        table_trs = table_trs.enter()
        	.append("tr")
        	.merge(table_trs);

        table_trs.on("click", function(d, i) {
        	window.open(base_url + d.imdbId);
        });

        table_tds = table_trs.selectAll("td")
        	.data(function(d) {
        		t_tdArray = d3.values(d);
        		t_tdArray.splice(4, 1);
        		t_tdArray.splice(2, 1);
        		return t_tdArray;
        	});

        table_tds.enter()
        	.append("td")
        	.text(function(d) {
        		return d;
        	})
        	.attr("width", function(d, i) {
        		if (i == 0)
        		{
        			return "70%";
        		}
        		return "15%";
        	})
        	.attr("class", function(d, i) {
        		if (i == 0)
        		{
        			return "td_left";
        		}
        		return "td_center";
        	});

}


/**
 * Updates db_table_filtered.
 */
function update_tableDB()
{
    // Number of movies to show in table.
	var MOVIE_LIMIT = 30;
    // Minimum number of votes needed to be shown.
	var MINIMUM_VOTES = 20000 * 10;

	db_table_filtered = [];

	var rmYearRegex = /\s\(\d{4}-*–*\)/;
	var matchYearRegex = /\d{4}/;

    /**
     * Sorts in order based off rating avg.
     * 
     * TODO: explore other factors, such as number of ratings.
     */
	function ratingSort(mov1, mov2)
	{
		return mov2.rating - mov1.rating;
	}


	while (db_table_filtered.length < MOVIE_LIMIT &&
		db_table_filtered.length < movies_filtered.length/1000)
	{
		MINIMUM_VOTES = MINIMUM_VOTES/10;

		db_table_filtered = [];


		// Filtered Movies
	    movies_filtered.forEach(function(movie)
	    {
	    	t_movObj = new Object();

	    	t_movObj.title 		= movie.title.replace(rmYearRegex, "");
	        // t_movObj.rating 	= movie.ratingAvg;
	        // t_movObj.ratingNum 	= movie.ratingNum;
	        t_movObj.rating 	= movie.imdbRatingAvg;
	        t_movObj.ratingNum 	= movie.imdbRatingNum;
	        t_movObj.year 		= movie.releaseYear;
	        
	        if (t_movObj.year.length != 4 ||
        		!matchYearRegex.test(t_movObj.year))
	        {
	        	t_movObj.year 	= "N/A";
	        }

	        t_movObj.imdbId 	= movie.imdbID;

	        if (t_movObj.ratingNum > MINIMUM_VOTES)
	    	{
	    		db_table_filtered.push(t_movObj);
	    	}

	    });


		db_table_filtered.sort(ratingSort);

	}

	db_table_filtered = db_table_filtered.slice(0, MOVIE_LIMIT);

	
}

