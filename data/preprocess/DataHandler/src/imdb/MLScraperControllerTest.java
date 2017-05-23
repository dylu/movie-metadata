package imdb;

public class MLScraperControllerTest
{	
	public static void main(String[] args)
	{
		MovieListScraper mls;
		
//		mls = new MovieListScraper(1920, 1930, 4);
		mls = new MovieListScraper(2010, 2014, 50);
		
		mls.process();
	}

}
