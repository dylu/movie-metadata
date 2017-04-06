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
	// General UserAgent data
	public static UserAgent userAgent;
	public static String baseurl = "http://www.imdb.com/title/tt";
	public static String imdbID = "0114709";
	public static String visiturl = "";
	public static Document userDoc;
	
	// Movie-specific Fields
	public static String ratingAvg;
	public static String ratingNum;
	public static String releaseDate;
	public static String releaseYear;
	public static int durationMin;
	public static String mpaaRating;
	public static String director;
	public static String country;
	public static String language;
	public static String budget;
	public static String gross;
	
	/**
	 * Constructor for the MovieScraper class.
	 * 
	 * @param id
	 */
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
	
	public static void connect()
	{
		try {
			userAgent.visit(visiturl);
//			System.out.println(userAgent.doc.innerHTML());
			userDoc = userAgent.doc;
		} catch (ResponseException e) {
			e.printStackTrace();
		}
	}
	
	public static void parse()
	{
		try {
			ratingAvg =
					userDoc.findFirst("span class=\"rating\"")
					.getText();
			
			ratingNum =
					userDoc.findFirst("span class=\"small\" " + 
							"itemprop=\"ratingCount\"")
					.getText();
			
			mpaaRating =
					userDoc.findFirst("span itemprop=\"contentRating\"")
					.getText();

			Element summaryE = userDoc.findFirst("div class=" + 
							"\"plot_summary \"");
			
			director = summaryE.findFirst(
						"span itemprop=\"director\" itemscope " + 
						"itemtype=\"http://schema.org/Person\"")
					.findFirst(
						"span class=\"itemprop\" itemprop=\"name\"")
					.getText();
			
			
			Element detailsE = userDoc.findFirst("div class = " + 
							"\"article\" id=\"titleDetails\"");
			
//			System.out.println(details.innerText());
			
//			String test =
//					userDoc.findFirst("span itemprop=\"contentRating\"").getText();
			
			
			Elements detElems = detailsE.findEach("div class=\"txt-block\"");
			Element tmpTitle;
			
			for (Element elem : detElems)
			{
				if (!elem.getText().contains("Show detailed"))
				{
					tmpTitle = elem.findFirst("h4 class=\"inline\"");
					
//					System.out.println("---- New Elem.");
//					System.out.println(" ---- Title HTML: " + tmpTitle.innerHTML());
//					System.out.println(" ---- Title Text: " + tmpTitle.getText());
					
					if (tmpTitle.getText().equals("Release Date:"))
					{
						releaseDate = elem.getText()
								.replaceAll("\n", "")
								.replaceAll("     ","")
								.replaceAll("   ", "");
						releaseYear = releaseDate.split(" ")[2];
					}
					else if (tmpTitle.getText().equals("Country:"))
					{
						country = elem.findFirst("a")
								.getText()
								.replaceAll("\n", "")
								.replaceAll("     ","")
								.replaceAll("   ", "");
					}
					else if (tmpTitle.getText().equals("Language:"))
					{
						language = elem.findFirst("a")
								.getText()
								.replaceAll("\n", "")
								.replaceAll("     ","")
								.replaceAll("   ", "");
					}
					else if (tmpTitle.getText().equals("Budget:"))
					{
						budget = elem.getText()
								.replaceAll("\n", "")
								.replaceAll(" ", "");
					}
					else if (tmpTitle.getText().equals("Gross:"))
					{
						gross = elem.getText()
								.replaceAll("\n", "")
								.replaceAll(" ","");
					}
					else if (tmpTitle.getText().equals("Runtime:"))
					{
						durationMin = Integer.parseInt(
								elem.findFirst("time")
								.getText().split(" ")[0]);
					}
				}
				
			}
			
		} catch (NotFound e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void printResults()
	{
		System.out.println(" ---- Printing Output: ----");
		System.out.println(" * Movie: " + imdbID);
		System.out.println("");
		System.out.println("- Average Rating");
		System.out.println("   " + ratingAvg);
		System.out.println("- Number of Ratings");
		System.out.println("   " + ratingNum);
		System.out.println("- Release Date");
		System.out.println("   " + releaseDate);
		System.out.println("- Release Year");
		System.out.println("   " + releaseYear);
		System.out.println("- Duration in Minutes");
		System.out.println("   " + durationMin);
		System.out.println("- MPAA Rating");
		System.out.println("   " + mpaaRating);
		System.out.println("- Director");
		System.out.println("   " + director);
		System.out.println("- Country");
		System.out.println("   " + country);
		System.out.println("- Language");
		System.out.println("   " + language);
		System.out.println("- Budget");
		System.out.println("   " + budget);
		System.out.println("- Gross");
		System.out.println("   " + gross);
		System.out.println("");
	}
	
	public static void main(String[] args)
	{
		MovieScraper test = new MovieScraper("0114709");
		init();
		connect();
		parse();
		
		printResults();
		
	}

}
