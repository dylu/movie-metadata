package imdb;

import com.jaunt.*;

/**
 * DBProcessor runs a MovieScraper instance for each movie.
 * 
 * @author dlu
 * @version 04.06.2017
 */
public class DBProcessor
{
	// General UserAgent data
	public static UserAgent userAgent;
	public static String baseurl = "http://www.imdb.com/title/tt";
//	public static String imdbID = "0114709";
	
	
	
	public static void init()
	{
		// Creating a new userAgent (headless browser)
		userAgent = new UserAgent();
		userAgent.settings.autoSaveAsHTML = true;
	}
	
	public static void main(String[] args)
	{
		init();

//		MovieScraper test = new MovieScraper("0114709", userAgent);
		MovieScraper test = new MovieScraper("113497", userAgent);
		test.parse();
		test.printResults();
	}

}
