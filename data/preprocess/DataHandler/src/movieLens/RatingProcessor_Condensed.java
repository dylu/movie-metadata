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
public class RatingProcessor_Condensed
{
//	private static final int NUM_MOVIES = 131262;
	private static final int NUM_MOVIES = 131270;
	private static double[][] ratings;
	private static String[] aggregate;
	
	public static void readIn()
	{
		int index = 0;
		String[] tokens;
		
		try {
			BufferedReader br = 
					new BufferedReader(new FileReader("rating.csv"));

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
				ratings[index][0] = Integer.parseInt(tokens[0]);
				ratings[index][1] = Integer.parseInt(tokens[1]);
				ratings[index][2] = Double.parseDouble(tokens[2]);
				
				index++;
				nextLine = br.readLine();
				
				if (index % 100000 == 0)
				{
					System.out.println(" [Reading data] " + 
							"Processing 100k batch " + index/100000);
				}
			}
			
			br.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void condense()
	{
		aggregate = new String[NUM_MOVIES];
		
		int movieId;
		double rating;
		
		for (int i = 0; i < ratings.length; i++)
		{
			movieId = (int)(ratings[i][1]);
			rating = ratings[i][2];
			
//			if (aggregate[movieId].isEmpty())
			if (aggregate[movieId] == null ||
				aggregate[movieId].equals(""))
			{
				aggregate[movieId] = rating + "";
			}
			else
			{
				aggregate[movieId] += "|" + rating;
			}
			
			if (i % 100000 == 0)
			{
				System.out.println(" [Condensing data] " + 
						"Processing 100k batch " + i/100000);
			}
			else if (i > 5000000 && i % 40000 == 20000)
			{
				System.out.println("   [Condensing data] " + 
						"Processing sub  " + i/100000 + 
						" " + (i/10000)%10);
			}
			else if (i > 11000000 && i % 20000 == 0)
			{
				System.out.println("   [Condensing data] " + 
						"Processing sub  " + i/100000 + 
						" " + (i/10000)%10);
			}
			else if (i > 16000000 && i % 10000 == 0)
			{
				System.out.println("   [Condensing data] " + 
						"Processing sub  " + i/100000 + 
						" " + (i/10000)%10);
			}
		}
	}
	
	public static void printOut()
	{
		PrintWriter out = null;
		
		try {
			out = new PrintWriter(new BufferedWriter(
					new FileWriter("rating-condensed.csv")));
		} catch (IOException e) {
			e.printStackTrace();
		}

		out.println("\"movieId\",\"ratings\"");
		for (int i = 1; i < aggregate.length; i++)
		{
			if (aggregate[i] != null)
			{
				out.print(i + ",");
				out.println(aggregate[i]);
			}
			
			if (i % 10000 == 0)
			{
				System.out.println(" [Writing data] " + 
						"Processing 10k batch " + i/10000);
			}
		}
//		out.print(possible.size());
	    out.close();
	}
	
	public static void main(String[] args)
	{
		ratings = new double[20001000][3];
		System.out.println("Reading in data.");
		readIn();
		System.out.println();

		System.out.println("Condensing data.");
		condense();
		System.out.println();

		System.out.println("Printing out data.");
		printOut();
		System.out.println();
	}
}