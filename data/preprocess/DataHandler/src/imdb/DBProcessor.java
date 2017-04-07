package imdb;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

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
	private static UserAgent userAgent;
	private static ArrayList<String> mLenIDs;
	private static ArrayList<String> imdbIDs;
	private static ArrayList<String> metadata;
	private static BufferedReader reader;
	private static PrintWriter writer;
	
	private static final int BATCH_SIZE = 200;
//	private static final int ESTIMATED_SIZE = 27300;
//	private static final String IN_FILE = "link.csv";
//	private static final String OUT_FILE = "combined_metadata.csv";
//	private static final int ESTIMATED_SIZE = 5000;
	private static final int ESTIMATED_SIZE = 2000;
	private static final String num = "00";
	private static final String IN_FILE_PREFIX = "link-split-";
	private static final String OUT_FILE_PREFIX = "combined_metadata-";
	
	private static void init()
	{
		System.out.println("[DBProcessor] Starting init.");
		
		// Creating a new userAgent (headless browser)
		userAgent = new UserAgent();
		userAgent.settings.autoSaveAsHTML = false;
		
		mLenIDs = new ArrayList<String>(ESTIMATED_SIZE);
		imdbIDs = new ArrayList<String>(ESTIMATED_SIZE);
		metadata = new ArrayList<String>(BATCH_SIZE + 1);
		
		reader = null;
		writer = null;
		try {
			reader = new BufferedReader(
					new FileReader(IN_FILE_PREFIX + num + ".csv"));
			writer = new PrintWriter(
					new BufferedWriter(
					new FileWriter(OUT_FILE_PREFIX + num + ".csv")));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void readLinkCSV()
	{
		System.out.println("[DBProcessor] Starting readLinkCSV.");
		
		try {
			// First line is headers.
			reader.readLine();
			
			String nextLine = reader.readLine();
			String[] buf;
			while (nextLine != null)
			{
				buf = nextLine.split(",");
				mLenIDs.add(buf[0]);
				imdbIDs.add(buf[1]);
				
				nextLine = reader.readLine();
			}
			
			reader.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void generateCSV()
	{
		System.out.println("[DBProcessor] Starting generateCSV.");
		
		MovieScraper mScraper;
		
		for (int i = 0; i < mLenIDs.size(); i++)
		{
			if (i % (BATCH_SIZE/4) == 0)
			{
				System.out.println("  generateCSV.processing: #" + i);
			}
			if (i % BATCH_SIZE == 0 && i != 0)
			{
				System.out.println("  [DBProcessor]generateCSV: " + 
									"flushing metadata to file.");
				writeCSV();
			}
			
			mScraper = new MovieScraper(
					mLenIDs.get(i), imdbIDs.get(i), userAgent, true);
			
			mScraper.parse();
			metadata.add(mScraper.combineFields());
		}
	}
	
	private static void writeCSVHeader()
	{
		System.out.println("[DBProcessor] Starting writeCSVHeader.");
		
		// Header.
		writer.println("mLensID,imdbID,ratingAvg,ratingNum," + 
					"releaseDate,releaseYear,durationMin,mpaaRating," + 
					"director,country,language,budget,gross");
		
	}
	
	private static void writeCSV()
	{
		System.out.println("[DBProcessor] writeCSV batchwrite.");
		
		for (int i = 0; i < metadata.size(); i++)
		{
			writer.println(metadata.get(i));
		}
		
		metadata.clear();
	}
	
	private static void closeWriter()
	{
		writer.flush();
		writer.close();
	}
	
	public static void main(String[] args)
	{
		init();

		// Toy Story
//		MovieScraper test = new MovieScraper("1", "0114709", userAgent);
		
		// Jumanji
//		MovieScraper test = new MovieScraper("2", "113497", userAgent);
		
//		MovieScraper mScraper = new MovieScraper("128878", "2375559", userAgent);
//		
//		mScraper.parse();
//		mScraper.combineFields();
//		mScraper.printResults();
		
		readLinkCSV();
		writeCSVHeader();
		
		generateCSV();
		
		writeCSV();
		closeWriter();
	}

}
