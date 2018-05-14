# movie-metadata
Visualizing Movie Metadata

--

Data collected from MovieLens and IMDb.

Trying to transition to solely IMDb.


The movies object is organized as such:  It's an array of all movies in the MovieLens database subset, with its MovieLens ID being the index position in the array.  (MovieLens Movie ID 423 = movies[423])

Each movie object in this array then contains the following fields:  
[budget, country, director, durationMin, genres[], gross, id, imdbID, imdbRatingAvg, imdbRatingNum, language, mpaaRating, ratingAvg, ratingNum, releaseDate, releaseYear, title].

As a reference, here is one element (MovieLens ID #1, Toy Story):
```
1: Object
  budget:"$30,000,000"
  country:"USA"
  director:"John Lasseter"
  durationMin:"81"
  genres:Array(5)
    0:"Adventure"
    1:"Animation"
    2:"Children"
    3:"Comedy"
    4:"Fantasy"
  gross:"$191,796,233"
  id:"1"
  imdbID:"114709"
  imdbRatingAvg:"8.3"
  imdbRatingNum:"666,965"
  language:"English"
  mpaaRating:"G"
  ratingAvg:"3.921239561324077"
  ratingNum:"49695"
  releaseDate:"22 November 1995 (USA)"
  releaseYear:"1995"
  title:"Toy Story (1995)"
```

With this data organized as such, I should be able to easily graph out relationships between various fields, into the various module concepts and link them appropriately.
