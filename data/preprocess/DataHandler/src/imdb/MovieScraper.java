package imdb;

import com.jaunt.*;

/**
 * MovieScraper populates data for one specific movie instance,
 * given an IMDb id.
 * 
 * @author dlu
 * @version 04.05.2017
 */
public class MovieScraper
{
	public static UserAgent userAgent;
	public static String baseurl = "http://www.imdb.com/title/tt";
	public static String imdbID = "0114709";
	public static String visiturl = "";
	
	public MovieScraper(String id)
	{
		imdbID = id;
		visiturl = baseurl + imdbID + "/";
//		visiturl = "www.google.com/";
	}
	
	public static void init()
	{
		// Creating a new userAgent (headless browser)
		userAgent = new UserAgent();
		userAgent.settings.autoSaveAsHTML = true;
	}
	
	public static void start()
	{
		try {
			userAgent.visit(visiturl);
			System.out.println(userAgent.doc.innerHTML());
		} catch (ResponseException e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args)
	{
		MovieScraper test = new MovieScraper("0114709");
		init();
		start();
	}

}
