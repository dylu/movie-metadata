package imdb;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import org.jsoup.Connection.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class MovieListScraper
{
	private static final String OUT_FILE_PREFIX = "list-metadata_";
	private static final String BASE_URL = "http://www.imdb.com/";

	private static final String USER_AGENT = 
			"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) "
			+ "Gecko/20100101 Firefox/25.0";
	private static final String REFERRER_STR = "http://www.google.com";
	private static final int TIMEOUT = 12000;

	private static final String URL_PARAM_BASE = "search/title?" + 
			"sort=num_votes,desc&title_type=feature&year=";
	
	
	private PrintWriter writer;
	
	private int startYear;
	private int endYear;
	private int pageDepth;
	private int currentPage;
	private int currentYear;
	
	private String urlSearchParams;
	private String url;
	private String outFileSuffix;
	private Response response;
	private Document doc;
	
	private String movieDataStr;
	

	public MovieListScraper(int startYear, int endYear, int pageDepth)
	{
		this.startYear = startYear;
		this.endYear = endYear;
		this.pageDepth = pageDepth;
		
		setup();
	}
	
	private void setup()
	{
		movieDataStr = "";
		currentYear = startYear-1;
		
		if (startYear == endYear)
		{
			outFileSuffix = "" + startYear + "_" + pageDepth;
		}
		else
		{
			outFileSuffix = startYear + "-" + endYear + 
					"_" + pageDepth;
		}
		
		writer = null;
		try {
			writer = new PrintWriter(
					new BufferedWriter(
					new FileWriter(OUT_FILE_PREFIX + outFileSuffix + ".csv")));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void nextYear()
	{
		currentPage = 0;
		currentYear++;
		
		urlSearchParams = URL_PARAM_BASE + currentYear + "," + currentYear;
		
		url = BASE_URL + urlSearchParams;
		
		connect();
	}
	
	private void nextPage()
	{
		currentPage++;
		
		if (currentPage > 1)
		{
			url = BASE_URL + urlSearchParams + 
					"&page=" + currentPage + "&ref_=adv_nxt";
		}
		
		connect();
	}
	
	private void connect()
	{
		try {
			response = Jsoup.connect(url)
			           .ignoreContentType(true)
			           .userAgent(USER_AGENT)  
			           .referrer(REFERRER_STR)   
			           .timeout(TIMEOUT) 
			           .followRedirects(true)
			           .execute();

			doc = response.parse();
			
			if (response.statusCode() != 200)
			{
				System.out.println("[MovieListScraper] Error: Status Code = "
						+ response.statusCode() + "  for url: " + url);
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void process()
	{
		System.out.println("[MovieListScraper] Starting process for years "
				+ startYear + "-" + endYear + ", page depth " + pageDepth);
		
		writeCSVHeader();
		
		for (int cYear = startYear; cYear < endYear+1; cYear++)
		{
			nextYear();
			System.out.println("  Year: " + currentYear);
			
			for (int cPage = 0; cPage < pageDepth; cPage++)
			{
				nextPage();
				if (cPage == 0 || currentPage%(Math.min(pageDepth/10, 1)) == 0 
						|| cPage == pageDepth-1)
					System.out.println("    Page:  " + currentPage);
				
				Elements movieList = doc.select("div.lister-list")
						.select("div.lister-item.mode-advanced");
				processList(movieList);
			}
		}

		closeWriter();
		
		System.out.println("[MovieListScraper] Process completed for years "
				+ startYear + "-" + endYear + ", page depth " + pageDepth);
		
	}
	
	/**
	 * Method to process the resulting lister-list class off IMDb.
	 * 
	 * @param movieList
	 */
	private void processList(Elements movieList)
	{
		Element itemContents;
		Element tmpElem;
		String[] tmpArr;
		int tmpIdx;
		
		for (Element mlistElem : movieList)
		{
			itemContents = mlistElem.select("div.lister-item-content").first();
			
			
			// Year Ranking
//			System.out.println("\t  Year Ranking:");
//			System.out.println("\t\t  " + Integer.parseInt(itemContents
//					.select("h3.lister-item-header>span.lister-item-index")
//					.text().replace(".", "")));
			
			// IMDb ID, Title, Year
			tmpElem = itemContents
					.select("h3.lister-item-header>a").first();
			movieDataStr = tmpElem.attr("href")
					.substring(9, 16) + ",\"" +
					tmpElem.text().replace("\"", "\"\"") + "\"," + 
					currentYear;
			
			
			// MPAA, Duration, Genres
			tmpElem = itemContents
					.select("p.text-muted").first();
			if (!tmpElem.select("span.genre").text().isEmpty())
			{
				tmpArr = tmpElem.select("span.genre")
						.text().split(", ");
			}
			else
			{
				tmpArr = new String[0];
			}
			
			movieDataStr += "," + tmpElem.select("span.certificate").text()
					+ "," + tmpElem.select("span.runtime")
						.text().replaceAll("[^0-9]+", "")
					+ ",";
			
			tmpIdx = 0;
			for (String genre : tmpArr)
			{
				if (tmpIdx > 0)
				{
					 movieDataStr += "++";
				}
				movieDataStr += genre;
				tmpIdx++;
			}
			
			// Rating, Metascore
			tmpElem = itemContents
					.select("div.ratings-bar").first();
			if (tmpElem != null)
			{
				movieDataStr += "," + tmpElem.select(
						"div.inline-block.ratings-imdb-rating").text() + ","
						+ tmpElem.select("div.inline-block.ratings-metascore")
						.select("span.metascore").text();
			}
			else
			{
				movieDataStr += ",,";
			}
			
			// Summary
			movieDataStr += ",\"" + 
					itemContents.select("p.text-muted").get(1).text()
					.replace("Add a Plot", "")
					.replace("\"", "\"\"")
					+ "\"";
			
			// Director | Stars
			parseCompoundField(itemContents, 1);
			
			
			// Number of Votes | Gross
			parseCompoundField(itemContents, 2);
			
			
			// Debug Print
//			System.err.println("------- ------- ------- -------");
//			System.err.println(movie_data_str);
			
			writeToFile(movieDataStr);
		}
	}
	
	private void writeCSVHeader()
	{
		System.out.println("[MovieListScraper] Starting writeCSVHeader.");
		
		// Header.
		writer.println("imdbID,title,year,mpaa,duration,genres,rating,"
				+ "metascore,summary,directors,stars,numvotes,gross");
		
	}
	
	private void writeToFile(String str)
	{
		writer.println(str);
	}
	
	private void closeWriter()
	{
		writer.flush();
		writer.close();
	}
	
	/**
	 * 1 == director/stars
	 * 2 == votes/gross
	 * 
	 * @param itemContents
	 * @param id
	 */
	private void parseCompoundField(Element itemContents, int id)
	{
		// Short Circuit, if empty.
		if (itemContents == null || itemContents.text().isEmpty())
		{
			movieDataStr += ",,";
			return;
		}
		
		Element tmpElem;
		String[] tmpArr;
		String cmpStr1, cmpStr2;
		String tmpStr1, tmpStr2;
		int tmpIdx;
		
		if (id == 1)
		{
			tmpElem = itemContents.select("p").get(2);
			cmpStr1 = "Director";
			cmpStr2 = "Star";
		}
		else if (id == 2)
		{
			tmpElem = itemContents.select("p.sort-num_votes-visible").first();
			cmpStr1 = "Votes";
			cmpStr2 = "Gross";
		}
		else
		{
			movieDataStr += "error: parseCompountField-id";
			return;
		}
		
		if (tmpElem != null && !tmpElem.text().isEmpty())
		{
			tmpArr = tmpElem.text().split(" \\| ");
			
			if (tmpArr.length == 2)
			{
				movieDataStr += ",";
				
				tmpStr1 = tmpArr[0];
				tmpStr2 = tmpArr[1];
				
				tmpArr = tmpStr1.split(": ")[1].split(", ");
				if (!tmpStr1.contains(cmpStr1))
				{
					movieDataStr += "error";
				}
				else
				{
					tmpIdx = 0;
					for (String dirVotes : tmpArr)
					{
						if (tmpIdx > 0)
						{
							 movieDataStr += "++";
						}
						movieDataStr += dirVotes.replace(",", "");
						tmpIdx++;
					}
				}

				movieDataStr += ",";
				tmpArr = tmpStr2.split(": ")[1].split(", ");
				if (!tmpStr2.contains(cmpStr2))
				{
					movieDataStr += "error";
				}
				else
				{
					tmpIdx = 0;
					for (String starGross : tmpArr)
					{
						if (tmpIdx > 0)
						{
							 movieDataStr += "++";
						}
						movieDataStr += starGross.replace(",", "");
						tmpIdx++;
					}
				}
			}
			else if (tmpArr.length == 1)
			{
				tmpStr1 = tmpArr[0];
				tmpArr = tmpStr1.split(": ")[1].split(", ");
				movieDataStr += ",";

				if (tmpStr1.contains(cmpStr2))
				{
					movieDataStr += ",";
				}
				
				tmpIdx = 0;
				for (String dirStar : tmpArr)
				{
					if (tmpIdx > 0)
					{
						 movieDataStr += "++";
					}
					movieDataStr += dirStar.replace(",", "");
					tmpIdx++;
				}
				
				if (tmpStr1.contains(cmpStr1))
				{
					movieDataStr += ",";
				}
			}
			else
			{
				movieDataStr += ",,";
			}
		}
		else
		{
			movieDataStr += ",,";
		}
	}
	

}
