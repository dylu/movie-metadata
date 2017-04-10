# movie-vis
Visualization for 05-499: Visualization in HCI | Visualizing Movie Metadata

--

Milestone 1:

I have visualized only a basic graph at the moment, sorted by Genre.

Most of the effort in the first two weeks were collecting and cleaning data, from files provided by MovieLens as well as scraping IMDb's website.

To show I have a relevant datastructure in place, I've printed the structure into my console:
It should appear at the end, after the line:
```
	[dataloader.loadRatingData] 
	 - Printing movies obj
```

The movies object is organized as such:  It's an array of all movies in the MovieLens database subset, with its MovieLens ID being the index position in the array.  (MovieLens Movie ID 423 = movies[423])
Each movie object in this array then contains the following fields:
[budget, country, director, durationMin, genres[], gross, id, imdbID, imdbRatingAvg, imdbRatingNum, language, mpaaRating, ratingAvg, ratingNum, releaseDate, releaseYear, title].
