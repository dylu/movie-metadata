/** Global Variables containing data **/
var movies;
var mLens_movies;
// var mLens_links;
var mLens_genres;


function load_data()
{
    // Instantiating global variables.
    movies = [];
    mLens_genres = new Object();

    // Instantiating temporary variables.
    var t_allGenres;
    var t_movieObj;


    // Loading Data - MovieLens/movie.csv
    d3.csv("data/MovieLens/movie.csv", function (error_movie, csvData_movie) {

    // Loading Data - MovieLens/link.csv
    d3.csv("data/MovieLens/link.csv", function (error_link, csvData_link) {

    // Loading data - MovieLends/rating.csv
    d3.csv("data/MovieLens/rating.csv", function (error_rating, csvData_rating) {
        mLens_movies = csvData_movie;
        // mLens_links = csvData_link;

        csvData_movie.forEach(function (d, i) {
            // console.log(d.genres.split("|"));
            t_allGenres = d.genres.split("|");
            t_allGenres.forEach(function (elem_genre) {
                // if ([elem_genre] == "1 - September 11 (2002)\"")
                // {
                //     console.log("hello -- test");
                //     console.log(d);
                // }
                if (!mLens_genres.hasOwnProperty([elem_genre]))
                {
                    mLens_genres[elem_genre] = 1;
                }
                else
                {
                    mLens_genres[elem_genre]++;
                }
            });

            // Building the 'movies' global variable.
            t_movieObj = new Object();
            t_movieObj.id = d.movieId;
            t_movieObj.title = d.title;
            t_movieObj.genres = t_allGenres;
            t_movieObj.imdbID = -1;
            t_movieObj.ratings = [];

            movies.push(t_movieObj);
        });

        csvData_link.forEach(function (d, i) {
            if (movies[i].id != d.movieId)
            {
                console.log("!![dataloader.load_data.linkData] \n" +
                    "Error nonmatching chronological movieId: " +
                    d.movieId);

                movies[(movieId-1)].imdbID = d.imdbId;
            }
            else
            {
                movies[i].imdbID = d.imdbId;
            }
            
            // movies[i].tmdbID = d.tmdbId;
        });

        csvData_rating.forEach(function (d, i) {
            // if (movies[i].id != d.movieId)
            // {
            //     console.log("!![dataloader.load_data.ratingData] \n" +
            //         "Error nonmatching chronological movieId: " +
            //         d.movieId);
            // }
            // else
            // {
                movies[(d.movieId-1)].ratings.push(d.rating);
            // }

            // console.log(i);
            if (i%1000000 == 0)
            {
                console.log("Ratings foreach loop: working on it.");
            }
            
            // movies[i].tmdbID = d.tmdbId;
        });


        execute_control();
        // console.log(mLens_genres);
        // console.log(mLens_links);

        console.log(".[dataloader.load_data] \n - Printing movies obj");
        console.log(movies);

    });     // end rating.csv
    });     // end link.csv
    });     // end movie.csv

}




// console.log("hello2");
// console.log(mLens_movies);
