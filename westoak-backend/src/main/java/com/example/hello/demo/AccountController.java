package com.example.hello.demo;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import org.json.JSONObject;

import com.google.gson.*;
import java.io.File; // Import the File class

import java.util.*;

@RestController
public class AccountController {

    private static File in = new File(System.getProperty("user.dir") + "\\src\\main\\java\\com\\example\\hello\\demo\\hello.txt");
    private static JSONObject tempJsonObj;

    @PostMapping(path = "/Balance")
    public ResponseEntity<String> Balance(@RequestBody String accountJson)
    throws Exception
    {
        Connection conn = null;

        tempJsonObj = new JSONObject();
        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);

        try
        {
            String decodedJson = EncodedUrlToJsonString(accountJson);

            Gson gson = new GsonBuilder().setLenient().create();

            Account account = gson.fromJson(decodedJson, Account.class);

            // conn = DriverManager.getConnection(url, mysqlUser, password);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));

            //Select to check if there's an existing account
            String sqlQuery = "SELECT acct_num from Account WHERE acct_num = ?";
            PreparedStatement pstmt = conn.prepareStatement(sqlQuery);
            pstmt.setInt(1, Integer.parseInt(account.getAcctNum()));
            

            ResultSet rs = pstmt.executeQuery();

            if (rs.next() == false) 
            {
                return ResponseEntity.status(250)
                    .header("Access-Control-Allow-Origin", "*")
                    .body("account doesn't exist");
            }
            
            // Retrieve balance from db
            sqlQuery = "SELECT balance from Account WHERE user_name = ?";

            pstmt = conn.prepareStatement(sqlQuery);
            pstmt.setString(1, account.getUserName());
            rs = pstmt.executeQuery();
            
            if (rs.next() == false)
            {
                return ResponseEntity.status(250)
                    .header("Access-Control-Allow-Origin", "*")
                    .body("emailnoexist");
            }
            else {
                tempJsonObj.append("balance", rs.getDouble("balance"));
                return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(tempJsonObj.toString());

            }

        }
        catch(SQLException ex)
        {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest()
                .header("Access-Control-Allow-Origin", "*")
                .body("sqlerror");
        }
        catch(Exception ex)
        {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest()
                .header("Access-Control-Allow-Origin", "*")
                .body("unknownerror");
        }
        finally
        {
            try
            {
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch(SQLException ex)
            {
                System.out.println(ex.getMessage());
            }
        }
        
    }

    public String EncodedUrlToJsonString(String encodedUrl) {
        String decodedJson;
        try {
            decodedJson = URLDecoder.decode(encodedUrl, "UTF-8");
            // Format the json string into something acceptable by gson
            decodedJson = decodedJson.replaceAll("=", "");
            decodedJson = decodedJson.replaceAll("\"", "");

            return decodedJson;
        } catch (UnsupportedEncodingException e) {
            System.out.println(e.getMessage());
            return "";
        }
    }
}

