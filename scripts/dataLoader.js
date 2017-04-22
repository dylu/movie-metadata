/** Global Variables containing data **/
var movies;
var movies_filtered;
var filters;
// var mLens_links;

var db_genres;
var db_genres_filtered;


function load_data()
{
    // Instantiating global variables.
    movies = [];
    filters = new Object();
    filters.num = 0;
    filters.genre = [];
    filters.month = [];
    // filters.year = [];

    db_genres = [];
    db_genres_filtered = [];


    console.log(".[dataloader.load_data] \n - Calling MovieData");
    loadMovieData(true);

}

function loadMovieData(isInit)
{
    // Instantiating temporary variables.
    var t_allGenres;
    var t_movieObj;

    // Loading Data - MovieLens/movie.csv
    d3.csv("data/MovieLens/movie.csv", function (error_movie, csvData_movie) {

        var filterFlag;

        csvData_movie.forEach(function (d, i) {
            // console.log(d.genres.split("|"));
            t_allGenres = d.genres.replace("(no genres listed)","(none)").split("|");
            

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

        if (isInit)
        {
            console.log(".[dataloader.loadMovieData] \n - Calling IMDbData");
            loadIMDbData(isInit);
        }
    });
}


function loadIMDbData(isInit)
{
    imdbHelper(0, isInit);
}

function imdbHelper(idx, isInit)
{
    // Loading Data - MovieLens/link.csv
    d3.csv("data/IMDb/postProcess/combined_metadata-0"+idx+".csv", function (error_link, csvData_link)
    {
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
            imdbHelper(idx+1, isInit);
        }
        else if (idx == 6)
        {
            if (isInit)
            {
                console.log(".[dataloader.imdbHelper] \n - Calling RatingData");
                loadRatingData(isInit);
            }
        }
        else
        {
            console.log("!![dataloader.imdbHelper] \n Error - Invalid index value.");
        }
    });
}


/** Loads Rating Data.
 *  Currently pulls rating data from MovieLens, instead of IMDB.
 **/
function loadRatingData(isInit)
{
    // Loading data - MovieLends/rating.csv
    // d3.csv("data/MovieLens/rating.csv", function (error_rating, csvData_rating) {
    // d3.csv("data/MovieLens/rating-condensed.csv", function (error_rating, csvData_rating) {
    d3.csv("data/MovieLens/rating-summary.csv", function (error_rating, csvData_rating)
    {
        csvData_rating.forEach(function (d, i) {
            if (movies[d.movieId] == null)
            {
                console.log("!![dataloader.loadRatingData] \n" +
                    "Error nonmatching movieId: " +
                    d.movieId);
            }
            else
            {
                // movies[d.movieId].ratings = d.ratings.split("|");
                movies[d.movieId].ratingNum = d.numRatings;
                movies[d.movieId].ratingAvg = d.ratingAvg;
            }
        });

        filter_movies();

        if (isInit)
        {
            execute_control();
        }
        
        // console.log(".[dataloader.loadRatingData] \n - Printing movies obj");
        // console.log(movies);

    });
}



function filter_movies()
{
    // loadMovieData(false);

    // filters.num++;
    // filters.genre = ["Action", "Drama"];


    var filterDebugStr = "None.";

    if (filters.num == 0)
    {
        movies_filtered = movies;
    }
    else
    {
        movies_filtered = movies.filter(applyFilters);


        filterDebugStr = filters.genre[0];
        for (i = 1; i < filters.genre.length; i++)
        {
            filterDebugStr += (", " + filters.genre[i]);
        }
    }
    


    console.log("Filter:  Genres [" + filterDebugStr + "]");
    console.log(" -- ");
    // console.log(".[dataloader.filter_movies] \n - Printing movies_filtered obj");
    // console.log(movies_filtered);

    console.log(".[dataloader.filter_movies] \n - Printing sizes");
    console.log("  movies num: " + movies.length);
    console.log("filtered num: " + movies_filtered.length);

    // execute_control();
}

function applyFilters(movElem)
{
    if (filters.num == 0)
    {
        return true;
    }

    // var passFlag = true;

    if (filters.genre.length > 0)
    {

        // filters.genre.forEach(function (genre) {
            // console.log(movElem.genres.includes(genre));
            // if (!movElem.genres.includes(genre))
            // {
            //     console.log("no, " + movElem.id);
            //     return false;
            // }
        for (i = 0; i < filters.genre.length; i++)
        {
            if (!movElem.genres.includes(filters.genre[i]))
            {
                return false;
            }
        }
            
        // });
    }

    return true;
}








