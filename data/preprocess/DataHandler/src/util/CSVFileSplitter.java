package util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;


/**
 * Splits csv files into multiple separate files to make it easier to manage.
 * 
 * @author dlu
 * @version 04.06.2017
 */
public class CSVFileSplitter
{
	// General UserAgent data
	private static BufferedReader reader;
	private static PrintWriter writer;
	private static int splitIndex;
	private static int lineCounter;
	private static String headerLine;
	
	private static final int BATCH_SIZE = 2000;
	private static final String IN_FILE_PREFIX = "link";
	private static final String OUT_FILE_POSTFIX = "-split-";
	
	private static void init()
	{
		System.out.println("[CSVFileSplitter] Starting init.");
		
		splitIndex = 0;
		lineCounter = 0;
		headerLine = "";
		reader = null;
		writer = null;
		try {
			reader = new BufferedReader(
					new FileReader(IN_FILE_PREFIX + ".csv"));
			nextWriter();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void nextWriter()
	{
		try {
			writer = new PrintWriter(new BufferedWriter(
					new FileWriter(IN_FILE_PREFIX + OUT_FILE_POSTFIX + 
							String.format("%02d", splitIndex) + ".csv")));
			splitIndex++;
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void readProcessCSV()
	{
		System.out.println("[CSVFileSplitter] Starting readLinkCSV.");
		
		try {
			// First line is headers.
			headerLine = reader.readLine();
			
			System.out.println("  -- [CSVFileSplitter] Writing File #" + 
					String.format("%02d", splitIndex-1));
			writer.println(headerLine);
			
			String nextLine = reader.readLine();
			while (nextLine != null)
			{
				if (lineCounter >= BATCH_SIZE)
				{
					writer.close();
					lineCounter = 0;
					nextWriter();
					writer.println(headerLine);
					
					System.out.println("  -- [CSVFileSplitter] Writing " + 
							"File #" + String.format("%02d", splitIndex-1));
				}
				writer.println(nextLine);
				lineCounter++;
				
				nextLine = reader.readLine();
			}
			
			reader.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void closeWriter()
	{
		writer.flush();
		writer.close();
	}
	
	public static void main(String[] args)
	{
		init();
		
		readProcessCSV();
		closeWriter();
	}

}
