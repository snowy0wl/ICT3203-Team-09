package com.example.hello.demo;

import java.io.BufferedReader;
import java.io.File; // Import the File class
import java.io.FileNotFoundException; // Import this class to handle errors
import java.io.FileReader;
import java.lang.reflect.Array;
import java.util.Scanner; // Import the Scanner class to read text files
import javax.print.DocFlavor.STRING;
import java.util.*;

public class readFile 
{
    public static void main(String args[])
    throws Exception
    {
        
    }

    public ArrayList<String> credentials(File in)
    throws Exception
    {
        ArrayList<String> result = new ArrayList<>();

        // Open this file.
        BufferedReader reader = new BufferedReader(new FileReader(in));

        // Read lines from file.
        while (true) 
        {
            String line = reader.readLine();
            if (line == null) 
            {
                break;
            }
            // Split line by comma.
            String[] parts = line.split(",");
            for (String part : parts) 
            {
                result.add(part);
            }
        }

        reader.close();
        return result;
    }

}
