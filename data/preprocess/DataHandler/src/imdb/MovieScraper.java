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
	public final String BASE_URL = "http://www.imdb.com/title/tt";
	private String visiturl = "";
	private Document userDoc;
	private String imdbID = "";
	
	// Movie-specific Fields
	private String ratingAvg;
	private String ratingNum;
	private String releaseDate;
	private String releaseYear;
	private int durationMin;
	private String mpaaRating;
	private String director;
	private String country;
	private String language;
	private String budget;
	private String gross;
	
	/**
	 * Constructor for the MovieScraper class.
	 * 
	 * @param id
	 */
	public MovieScraper(String id, UserAgent ua)
	{
		imdbID = id;
		visiturl = BASE_URL + imdbID + "/";
		
		try {
			ua.visit(visiturl);
//			System.out.println(userAgent.doc.innerHTML());
			userDoc = ua.doc;
		} catch (ResponseException e) {
			e.printStackTrace();
		}
	}
	
	private void grabRatingAvg()
	{
		try {
			ratingAvg =
					userDoc.findFirst("span class=\"rating\"")
					.getText();
		} catch (NotFound e) {
			ratingAvg = "-1";
		}
	}
	
	private void grabRatingNum()
	{
		try {
			ratingNum =
					userDoc.findFirst("span class=\"small\" " + 
							"itemprop=\"ratingCount\"")
					.getText();
		} catch (NotFound e) {
			ratingNum = "-1";
		}
	}
	
	private void grabMPAA()
	{
		try {
			mpaaRating =
					userDoc.findFirst("div class=\"title_wrapper\"")
					.findFirst("div class=\"subtext\"")
					.getText()
					.replaceAll("\n", "")
					.replaceAll(",","")
					.replaceAll(" ", "");
		} catch (NotFound e) {
			mpaaRating = "None";
		}
		
		if (mpaaRating.isEmpty())
		{
			mpaaRating = "None";
		}
	}
	
	public void parse()
	{
		grabRatingAvg();
		grabRatingNum();
		grabMPAA();
		
		Element summaryE = null;
		
		try {
			summaryE = userDoc.findFirst("div class=" + 
							"\"plot_summary \"");
		} catch (NotFound e) {
			try {
				summaryE = userDoc.findFirst("div class=" + 
								"\"plot_summary minPlotHeightWithPoster\"");
			} catch (NotFound e1) {
				e1.printStackTrace();
			}
		}
		
		try {
			if (summaryE != null)
			{
				director = summaryE.findFirst(
						"span itemprop=\"director\" itemscope " + 
						"itemtype=\"http://schema.org/Person\"")
					.findFirst(
						"span class=\"itemprop\" itemprop=\"name\"")
					.getText();
			}
		} catch (NotFound e) {
			e.printStackTrace();
		}
		
		try {
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

	/**
	 * Returns a string formatted with csv standards.
	 * @return csv-formatted string of fields.
	 */
	public String combineFields()
	{
		return 	imdbID 		+ "," +
				ratingAvg 	+ "," +
				ratingNum 	+ "," +
				releaseDate + "," +
				releaseYear + "," +
				durationMin + "," +
				mpaaRating 	+ "," +
				director 	+ "," +
				country 	+ "," +
				language 	+ "," +
				budget 		+ "," +
				gross;
	}

	/**
	 * Mostly used for debugging.
	 */
	public void printResults()
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
	
}
