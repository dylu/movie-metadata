package imdb;


public class MLScraperController
{
//	private int startYear = 1920;
//	private int endYear = 1940;
	
	public static void main(String[] args)
	{
		MovieListScraper mls;
		
		if (args.length == 2)
		{
			int year = Integer.parseInt(args[0]);
			int pdepth = Integer.parseInt(args[1]);
			
			mls = new MovieListScraper(year, year, pdepth);
		}
		else if (args.length >= 3)
		{
			int yearS = Integer.parseInt(args[0]);
			int yearE = Integer.parseInt(args[1]);
			int pdepth = Integer.parseInt(args[2]);
			
			mls = new MovieListScraper(yearS, yearE, pdepth);
		}
		else
		{
//			mls = null;
			System.out.println("[MLSController] Error - "
					+ "Must input at least 2 arguments.");
			return;
		}
		
		mls.process();
	}

}
