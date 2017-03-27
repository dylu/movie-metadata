package movieLens;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Class to process MovieLens' rating file.
 * Minimize and condense information from 20M lines,
 * making it easier for Javascript to process.
 * 
 * @author dlu1
 * @version 03.26.17
 */
public class RatingProcessor_Summary
{
//	private static final int NUM_MOVIES = 131262;
	private static final int NUM_MOVIES = 131270;
	private static String[] ratings;
	
	public static void readIn()
	{
		int index = 0;
		String[] tokens;
		
		try {
			BufferedReader br = 
					new BufferedReader(new FileReader("rating-condensed.csv"));
			
			// First line contains the headers.
			String nextLine = br.readLine();
			System.out.println("  [Reading data]" +
					"  Header Line:" + nextLine);
			
			nextLine = br.readLine();
			System.out.println("  [Reading data]" +
					"  First Line:" + nextLine);
			
			while (nextLine != null)
			{
				tokens = nextLine.split(",");
				index = Integer.parseInt(tokens[0]);
				
				ratings[index] = tokens[1];
				
				nextLine = br.readLine();
				
				if (index % 10000 == 0)
				{
					System.out.println(" [Reading data] " + 
							"Processing 10k batch " + index/10000);
				}
			}
			
			br.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public static void printOut()
	{
		String[] tokens;
		double avg;
		PrintWriter out = null;
		
		try {
			out = new PrintWriter(new BufferedWriter(
					new FileWriter("rating-summary.csv")));
		} catch (IOException e) {
			e.printStackTrace();
		}

		out.println("\"movieId\",\"numRatings\",\"ratingAvg\"");
		for (int i = 1; i < ratings.length; i++)
		{
			if (ratings[i] != null)
			{
				tokens = ratings[i].split("\\|");
				avg = 0;
				for (int j = 0; j < tokens.length; j++)
				{
					avg += Double.parseDouble(tokens[j]);
				}
				avg /= tokens.length;
				
				out.print(i + ",");
				out.print(tokens.length + ",");
				out.println(avg);
			}
			
			if (i % 10000 == 0)
			{
				System.out.println(" [Writing data] " + 
						"Processing 10k batch " + i/10000);
			}
		}
	    out.close();
	}
	
	public static void main(String[] args)
	{
		ratings = new String[NUM_MOVIES];
		System.out.println("Reading in data.");
		readIn();
		System.out.println();
		

		System.out.println("Printing out data.");
		printOut();
		System.out.println();
	}
}