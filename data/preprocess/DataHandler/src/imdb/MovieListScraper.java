package imdb;

import java.io.IOException;

import org.jsoup.Connection.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class MovieListScraper
{
	private static final String BASE_URL = "http://www.imdb.com/";
//	private static String url = "http://www.google.com";
//	private static String url = "http://www.davidylu.com";
	
	private static String start_year = "2009";
	private static String end_year = "2010";
	private static int current_page = 1;
	
	private static String url_search_year = "2009";
	private static final String URL_PARAM_BASE = "search/title?" + 
			"sort=moviemeter,asc&title_type=feature&year=";
	private static String url_search_params = URL_PARAM_BASE + 
			url_search_year + "," + url_search_year;
	
	private static String url = BASE_URL + url_search_params;
	
	
	private static final String USER_AGENT = 
			"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) "
			+ "Gecko/20100101 Firefox/25.0";
	private static final String REFERRER_STR = "http://www.google.com";
	private static final int TIMEOUT = 12000;
	
	
	private static Response response;
	private static Document doc;
	

//	final Document doc = Jsoup.connect("https://google.com/search?q=apple")  
//	                          .userAgent(USER_AGENT)
//	                          .get();

	public static void setup()
	{
		url_search_year = start_year;
		url_search_params = URL_PARAM_BASE + 
				url_search_year + "," + url_search_year;
		
		url = BASE_URL + url_search_params;
		
		url += "&page=" + current_page + "&ref_=adv_nxt";
	}
	
	public static void connect()
	{
//		Response response;
		try {
			response = Jsoup.connect(url)
			           .ignoreContentType(true)
			           .userAgent(USER_AGENT)  
			           .referrer(REFERRER_STR)   
			           .timeout(TIMEOUT) 
			           .followRedirects(true)
			           .execute();

			doc = response.parse();
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void process()
	{
		
		Elements movieList = doc.select("div.lister-list").select("div.lister-item.mode-advanced");
		
		processList(movieList);
		
//		System.out.println(response.statusCode());
//		System.out.println();
//		System.out.println(response.body());
	}
	
	/**
	 * Method to process the resulting lister-list class off IMDb.
	 * 
	 * 
	 * @param movieList
	 */
	private static void processList(Elements movieList)
	{
		Elements itemContentsList;
		Element itemContents;
		for (Element mlistElem : movieList)
		{
			System.out.println(" Element " + Integer.parseInt(mlistElem
					.select("div.lister-item-content").first()
					.select("h3.lister-item-header>span.lister-item-index")
					.text().replace(".", "")) + ".");
			
			itemContentsList = mlistElem.select("div.lister-item-content").first().children();
			itemContents = mlistElem.select("div.lister-item-content").first();
			
			/* 
			 * item contents format, by element
			 * 
			 * 0 - h3	lister-item-header:		Title
			 * 1 - p	text-muted:			MPAA | Duration | Genres
			 * 2 - div	ratings-bar:		Rating | Metascore
			 * 3 - p	text-muted:			Summary
			 * 4 - p	<none>:				Director(s) | Stars
			 * 5 - p	sort-num_votes-visible:		Num Votes | Gross
			 */
			
			// Year Ranking
//			System.out.println("\t  Year Ranking:");
//			System.out.println("\t\t  " + Integer.parseInt(itemContents
//					.select("h3.lister-item-header>span.lister-item-index")
//					.text().replace(".", "")));
			// Title
			System.out.println("\t  Title, MPAA, Duration:");
			System.out.println("\t\t  " + itemContents
					.select("h3.lister-item-header>a").text());
			
			// MPAA
			System.out.println("\t\t  " + itemContents
					.select("p.text-muted").first().select("span.certificate")
					.text());
			// Duration (Minutes)
			System.out.println("\t\t  " + itemContents
					.select("p.text-muted").first().select("span.runtime")
					.text().replaceAll("[^0-9]+", ""));
			
			// Genres
			System.out.println("\t  Genres:");
			System.out.println("\t\t  " + itemContents
					.select("p.text-muted").first().select("span.genre")
					.text().split(", ")[0]);
			if (itemContents.select("p.text-muted").first()
					.select("span.genre").text().split(", ").length > 1)
			System.out.println("\t\t  " + itemContents
					.select("p.text-muted").first().select("span.genre")
					.text().split(", ")[1]);
			
			// Rating
			System.out.println("\t  Rating, Metascore:");
			System.out.println("\t\t  " + itemContents
					.select("div.ratings-bar>"
							+ "div.inline-block.ratings-imdb-rating").text());
			// Metascore
			System.out.println("\t\t  " + itemContents
					.select("div.ratings-bar>"
							+ "div.inline-block.ratings-metascore")
					.select("span.metascore").text());
			
			// Summary
			System.out.println("\t\t  " + itemContents
					.select("p.text-muted").get(1).text());
			
			
			
			
//			for (int i = 0; i < itemContentsList.size(); i++)
			for (int i = 0; i < 0; i++)
			{
				System.out.println("\t" + i + ". " + itemContentsList.get(i).text());
				
				switch(i)
				{
				case 0:
					System.out.println("\t\t f-loop: 0");
//					// Year Ranking
//					System.out.println("\t\t  " + Integer.parseInt(itemContents.get(i).select("span.lister-item-index").text().replace(".", "")));
//					// Title
//					System.out.println("\t\t  " + itemContents.get(i).select("a").text());
					
					// Year Ranking
					System.out.println("\t\t  " + Integer.parseInt(itemContents.select("h3.lister-item-header>span.lister-item-index").text().replace(".", "")));
					// Title
					System.out.println("\t\t  " + itemContents.select("h3.lister-item-header>a").text());
					break;
				case 1:
					System.out.println("\t\t f-loop: 1");
					// MPAA
					System.out.println("\t\t  " + itemContentsList.get(i).select("span.certificate").text());
					// Duration (Minutes)
					System.out.println("\t\t  " + itemContentsList.get(i).select("span.runtime").text().replaceAll("[^0-9]+", ""));
					// Genres
					System.out.println("\t\t  " + itemContentsList.get(i).select("span.genre").text().split(", ")[0]);
					if (itemContentsList.get(i).select("span.genre").text().split(", ").length > 1)
					System.out.println("\t\t  " + itemContentsList.get(i).select("span.genre").text().split(", ")[1]);
					break;
				case 2:
					// Rating
					System.out.println("\t\t  " + itemContentsList.get(2).select("div.inline-block.ratings-imdb-rating").text());
					// Metascore
					System.out.println("\t\t  " + itemContentsList.get(2).select("div.inline-block.ratings-metascore").select("span.metascore").text());
					break;
				case 3:
					// Summary
					System.out.println("\t\t  " + itemContentsList.get(3).text());
					break;
				case 4:
					// Director | Stars
					System.out.println("\t\t  " + itemContentsList.get(4).text());
					break;
				case 5:
					// Number of Votes | Gross
					System.out.println("\t\t  " + itemContentsList.get(5).text());
					break;
				default:
					System.out.println("\t\t  *Defaulted.");
				}
			}
			
			
//			System.out.println();
//			System.out.println(itemContents.size());
//			System.out.println();
			
//			System.out.println("\t" + mlistElem.text());
		}
	}
	
	public static void main(String[] args)
	{
		
		setup();
		connect();

		process();
		
		
	}

}
