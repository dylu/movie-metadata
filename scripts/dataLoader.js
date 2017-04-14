/** Global Variables containing data **/
var movies;
var mLens_movies;
// var mLens_links;
var mLens_genres;


function load_data()
{
    // Instantiating global variables.
    movies = [];
    // mLens_genres = new Object();
    mLens_genres = [];

    // Instantiating temporary variables.
    var t_allGenres;
    var t_movieObj;


    console.log(".[dataloader.load_data] \n - Calling MovieData");
    loadMovieData();

}

function loadMovieData()
{
    // Loading Data - MovieLens/movie.csv
    d3.csv("data/MovieLens/movie.csv", function (error_movie, csvData_movie) {
        mLens_movies = csvData_movie;
        // mLens_links = csvData_link;

        csvData_movie.forEach(function (d, i) {
            // console.log(d.genres.split("|"));
            t_allGenres = d.genres.replace("(no genres listed)","(none)").split("|");
            t_allGenres.forEach(function (elem_genre) {
                // if ([elem_genre] == "1 - September 11 (2002)\"")
                // {
                //     console.log("hello -- test");
                //     console.log(d);
                // }
                if (!mLens_genres.hasOwnProperty([elem_genre]))
                // if (mLens_genres[elem_genre] == null || mLens_genres <= 0)
                {
                    mLens_genres[elem_genre] = 1;
                    mLens_genres.length++;
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
            // t_movieObj.ratings = [];
            t_movieObj.ratingNum = 0;
            t_movieObj.ratingAvg = -1;

            // movies.push(t_movieObj);
            movies[d.movieId] = t_movieObj;
        });


        // console.log(".[dataloader.loadMovieData] \n - Calling LinkData");
        // loadLinkData();

        console.log(".[dataloader.loadMovieData] \n - Calling IMDbData");
        loadIMDbData();
    });
}

// Link Data Already in IMDB Data.

// function loadLinkData()
// {
//     // Loading Data - MovieLens/link.csv
//     d3.csv("data/MovieLens/link.csv", function (error_link, csvData_link) {

//         csvData_link.forEach(function (d, i) {
//             if (movies[d.movieId] == null)
//             {
//                 console.log("!![dataloader.loadLinkData] \n" +
//                     "Error - nonmatching movieId: " +
//                     d.movieId);

//                 // movies[movieId].imdbID = d.imdbId;
//             }
//             else
//             {
//                 movies[d.movieId].imdbID = d.imdbId;
//             }
            
//             // movies[i].tmdbID = d.tmdbId;
//         });


//         console.log(".[dataloader.loadLinkData] \n - Calling IMDbData");
//         loadIMDbData();
//     });
// }

function loadIMDbData()
{
    imdbHelper(0);
}

function imdbHelper(idx)
{
    // Loading Data - MovieLens/link.csv
    d3.csv("data/IMDb/postProcess/combined_metadata-0"+idx+".csv", function (error_link, csvData_link) {

        var t_movieID;

        csvData_link.forEach(function (d, i)
        {
            t_movieID = d.mLensID;

            if (movies[t_movieID] == null)
            {
                console.log("!![dataloader.imdbHelper] \n" +
                    "Error - nonmatching movieId: " +
                    t_movieID);
            }
            else
            {
                movies[t_movieID].imdbID        = d.imdbID;
                movies[t_movieID].imdbRatingAvg = d.ratingAvg;
                movies[t_movieID].imdbRatingNum = d.ratingNum;
                movies[t_movieID].releaseDate   = d.releaseDate;
                movies[t_movieID].releaseYear   = d.releaseYear;
                movies[t_movieID].durationMin   = d.durationMin;
                movies[t_movieID].mpaaRating    = d.mpaaRating;
                movies[t_movieID].director      = d.director;
                movies[t_movieID].country       = d.country;
                movies[t_movieID].language      = d.language;
                movies[t_movieID].budget        = d.budget;
                movies[t_movieID].gross         = d.gross;

                // If there are at least 3 units in Release date, 2nd should* be month.
                if (d.releaseDate.split(" ").length > 2)
                {
                    movies[t_movieID].releaseDay  = d.releaseDate.split(" ")[0];
                    movies[t_movieID].releaseMonth  = d.releaseDate.split(" ")[1];
                }
                else
                {
                    movies[t_movieID].releaseDay  = "Unavailable";
                    movies[t_movieID].releaseMonth  = "Unavailable";
                }
            }
        });

        if (idx >=0 && idx < 6)
        {
            // console.log(".[dataloader.imdbHelper] \n - Calling imdbHelper with value: " + (idx+1));
            imdbHelper(idx+1);
        }
        else if (idx == 6)
        {
            console.log(".[dataloader.imdbHelper] \n - Calling RatingData");
            loadRatingData();
        }
        else
        {
            console.log("!![dataloader.imdbHelper] \n Error - Invalid index value.");
        }
    });
}

function loadRatingData()
{
    // Loading data - MovieLends/rating.csv
    // d3.csv("data/MovieLens/rating.csv", function (error_rating, csvData_rating) {
    // d3.csv("data/MovieLens/rating-condensed.csv", function (error_rating, csvData_rating) {
    d3.csv("data/MovieLens/rating-summary.csv", function (error_rating, csvData_rating) {

        csvData_rating.forEach(function (d, i) {
            if (movies[d.movieId] == null)
            {
                // console.log("!![dataloader.loadRatingData] \n" +
                //     "Error nonmatching movieId: " +
                //     d.movieId);
            }
            else
            {
                // movies[d.movieId].ratings = d.ratings.split("|");
                movies[d.movieId].ratingNum = d.numRatings;
                movies[d.movieId].ratingAvg = d.ratingAvg;
            }

            // console.log(i);
            // if (i%1000000 == 0)
            // {
            //     console.log("Ratings foreach loop: working on it.");
            // }
            
            // movies[i].tmdbID = d.tmdbId;
        });


        execute_control();
        // console.log(mLens_genres);
        // console.log(mLens_links);

        console.log(".[dataloader.loadRatingData] \n - Printing movies obj");
        console.log(movies);

        // console.log(".[dataloader.load_data] \n - Printing csvData_rating obj");
        // console.log(csvData_rating);

    });
}




// console.log("hello2");
// console.log(mLens_movies);
