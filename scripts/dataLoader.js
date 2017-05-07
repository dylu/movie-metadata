/** Global Variables containing data **/
var movies;
var movies_filtered;
var filters;

/**
 * Initializes and loads all data from provided .csv files.
 */
function load_data()
{
    // Instantiating global variables.
    movies = [];
    filters = new Object();
    filters.num = 0;
    filters.genre = new Set();
    filters.month = new Set();
    filters.mpaa = new Set();

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

            movies[d.movieId] = t_movieObj;
        });


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

/**
 * imdb Data is huge -- split into six separate files.
 * 
 * Mostly to allow pre-processing an easier way to handle data scraping.
 */
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


/** 
 * Loads Rating Data.
 * Currently pulls rating data from MovieLens, instead of IMDB.
 */
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
                movies[d.movieId].ratingNum = d.numRatings;
                movies[d.movieId].ratingAvg = d.ratingAvg;
            }
        });

        filter_movies();

        if (isInit)
        {
            execute_control();
        }
    });
}


/**
 * Runs a filter through the movie list.
 */
function filter_movies()
{
    var filterDebugStr = "None.";

    if (filters.num == 0)
    {
        movies_filtered = movies;
    }
    else
    {
        movies_filtered = movies.filter(applyFilters);

        filterDebugStr = "";
        filters.genre.forEach(function(filterVal) {
            filterDebugStr += (filterVal + " | ");
        });
    }
    filterDebugStr = filterDebugStr.substring(0, filterDebugStr.length-3);


    // console.log("Filter:  Genres [" + filterDebugStr + "]");
    // console.log(" -- ");
    // console.log(".[dataloader.filter_movies] \n - Printing movies_filtered obj");
    // console.log(movies_filtered);

    console.log(".[dataloader.filter_movies] \n - Printing sizes");
    console.log("  movies num: " + movies.length);
    console.log("filtered num: " + movies_filtered.length);
}

/**
 * Helper function -- Filter
 */
function applyFilters(movElem)
{
    if (filters.num == 0)
    {
        return true;
    }

    var passFlag = true;

    if (filters.genre.size > 0)
    {
        filters.genre.forEach(function(filterVal) {
            if (!movElem.genres.includes(filterVal))
            {
                passFlag = false;
            }
        });
    }

    if (filters.month.size > 0)
    {
        filters.month.forEach(function(filterVal) {
            if (!movElem.releaseMonth.includes(filterVal))
            {
                passFlag = false;
            }
        });
    }

    if (filters.mpaa.size > 0)
    {
        filters.mpaa.forEach(function(filterVal) {
            if (!movElem.mpaaRating.includes(filterVal))
            {
                passFlag = false;
            }
        });
    }

    return passFlag;
}

