

var db_table_filtered;


// <span class="d3_module" id="topTableWrapper">
// 		<h2>Score Table</h2>
// 		<table id="topTable">
// 			<thead>
// 			<tr>
// 				<th>Title 1</th>
// 				<th>TD1</th>
// 				<th>TD2</th>
// 				<th>TD3</th>
// 			</tr>
// 			</thead>
// 			<tbody>
// 			<tr>
// 				<td>TEST 00</td>
// 				<td>TEST 01</td>
// 				<td>TEST 02</td>
// 				<td>TEST 03</td>
// 			</tr>
// 
// 			<tr>
// 				<td>TEST 10</td>
// 				<td>TEST 11</td>
// 				<td>TEST 12</td>
// 				<td>TEST 13</td>
// 			</tr>


function drawModule_table()
{
	update_tableDB();
	redrawFiltered_table();
}


function redrawFiltered_table()
{
	var trans_dur = 600;
	var tableName = topTableWrapper;


	var table_trs;
	var table_tds;

	var t_tdArray;

		// table_rows = d3.select("#"+tableName).select("svg").select("#topTable")
		table_trs = d3.select("#topTable")
			.select("tbody")
            .selectAll("tr")
            .data(db_table_filtered);

        table_trs = table_trs.enter()
        	.append("tr")
        	.merge(table_trs);

        // table_rows.transition()
        // 	.duration(trans_dur/6)
        // 	.append("td")
        // 	.html("test 222");

        table_tds = table_trs.selectAll("td")
        	.data(function(d) {
        		// console.log("HELLO KITTY");
        		// console.log(d);
        		// return d3.values(d);
        		// console.log("Hello");
        		// console.log(d3.values(d));
        		t_tdArray = d3.values(d);
        		t_tdArray.splice(4, 1);
        		t_tdArray.splice(2, 1);
        		return t_tdArray;
        	});

        table_tds.enter()
        	.append("td")
        	.text(function(d) {
        		return d;
        	});

}


function update_tableDB()
{
	var MOVIE_LIMIT = 20;
	var MINIMUM_VOTES = 10000 * 10;

	db_table_filtered = [];

	var rmYearRegex = /\s\(\d{4}-*–*\)/;
	var matchYearRegex = /\d{4}/;


	function ratingSort(mov1, mov2)
	{
		return mov2.rating - mov1.rating;
	}

	// Filtered Movies
    // movies_filtered.forEach(function(movie)
    // {
    // 	t_movObj = new Object();

    // 	t_movObj.title 		= movie.title.replace(rmYearRegex, "");
    //     // t_movObj.rating 	= movie.ratingAvg;
    //     // t_movObj.ratingNum 	= movie.ratingNum;
    //     t_movObj.rating 	= movie.imdbRatingAvg;
    //     t_movObj.ratingNum 	= movie.imdbRatingNum;
    //     t_movObj.year 		= movie.releaseYear;

    //     if (t_movObj.year.length != 4 ||
    //     	matchYearRegex.test(t_movObj.year))
    //     {
    //     	t_movObj.year 	= "Unavailable";
    //     }

    //     t_movObj.imdbId 	= movie.imdbID;

    //     if (t_movObj.ratingNum > MINIMUM_VOTES)
    // 	{
    // 		db_table_filtered.push(t_movObj);
    // 	}

    // });


	while (db_table_filtered.length < movies_filtered.length/1000)
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

