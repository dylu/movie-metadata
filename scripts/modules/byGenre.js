/** Global Variables containing data **/
// var movies;
// var mLens_movies;

function drawModule_genre()
{
	var genreTree = new Object();
	var mod_width = 600;
	var mod_height = 500;
	var numGenres = 0;

	var genreArr = [];

	d3.select("#byGenre")
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

    for (var property in mLens_genres)
    {
	    if (mLens_genres.hasOwnProperty(property))
	    {
	    	// do stuff
	    	genreArr[numGenres] = property;
	    	numGenres++;
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
		t_rating = Math.max(movie.ratingAvg, 0);

		// "Floor" the rating to nearest bucket starting value.
		// e.g. 3.74 -> 3.5,  4.29 -> 4.0,  2.5 -> 2.5.
		t_rating = t_rating - (t_rating % 0.5);
		// Edge case of maximum rating.
		if (t_rating == 5)
		{
			t_rating = 4.5;
		}

		// for (var t_genre in t_genres)
		t_genres.forEach(function(t_genre)
		{
			// console.log(t_genre);
			genreTree[t_genre][t_rating].push(t_id);
		});
	});

	console.log("Printing genreTree (After Populating)");
	console.log(genreTree);
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
			t_bucketName = j/2;
			t_buckets[t_bucketName] = [];
		}

		genreTree[genreArr[i]] = t_buckets;
	}

	console.log("Printing genreTree");
	console.log(genreTree);
}