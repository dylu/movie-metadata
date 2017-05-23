package imdb;

public class MLScraperControllerTest
{	
	public static void main(String[] args)
	{
		MovieListScraper mls;
		
		mls = new MovieListScraper(1920, 1930, 4);
		
		mls.process();
	}

}
