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

import com.google.gson.*;
import com.mysql.cj.xdevapi.PreparableStatement;
import org.json.JSONObject;
import java.io.File; // Import the File class

import java.util.*;

@RestController
public class TransactionController {

    private static File in = new File(System.getProperty("user.dir") + "\\src\\main\\java\\com\\example\\hello\\demo\\hello.txt");

    private static GoogleAuth gAuth = new GoogleAuth();
    private static JSONObject tempJsonObj;
    private static String secretKey;



    @PostMapping(path = "/Transfer")
    public ResponseEntity<String> Transfer(@RequestBody String transferJson)
    throws Exception
    {
        Connection conn = null;
        tempJsonObj = new JSONObject();
        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);

        try
        {
            String decodedJson = EncodedUrlToJsonString(transferJson);

            JSONObject jsonObj = new JSONObject(decodedJson);

            Gson gson = new GsonBuilder().setLenient().create();
            Transaction transaction = gson.fromJson(decodedJson, Transaction.class);

            // Check if user/email already exist. Save to db, else, return error message
            // Attempt to write to database
            // String url = "jdbc:mysql://remotemysql.com:3306/6rrSCXqtl5";
            // String mysqlUser = "6rrSCXqtl5";
            // String password = "GkgteSYpm5";

            // conn = DriverManager.getConnection(url, mysqlUser, password);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));


            String sqlQuery;
            String sqlQuery2;
            PreparedStatement pstmt;
            PreparedStatement pstmt2;
            ResultSet rs;
            ResultSet rs2;

            String SenderEmail = "";
            String RecvEmail = "";
            String SenderUserName = "";
            String RecvUserName = "";
            int rowsChanged;

            if (jsonObj.get("gAuth").equals(0)) {
                // Select to check if there's an existing account
                sqlQuery = "SELECT acct_num from Account WHERE acct_num = ?";
                pstmt = conn.prepareStatement(sqlQuery);
                pstmt.setInt(1, Integer.parseInt(transaction.getToAcctNum()));
                rs = pstmt.executeQuery();
                if (rs.next() == false) 
                {
                    return ResponseEntity.status(250)
                        .header("Access-Control-Allow-Origin", "*")
                        .body("nouserexist");
                }

                // Select to check if balance is enough
                sqlQuery = "SELECT balance from Account WHERE acct_num = ?";
                pstmt = conn.prepareStatement(sqlQuery);
                pstmt.setInt(1, Integer.parseInt(transaction.getAcctNum()));
                rs = pstmt.executeQuery();
                if (rs.next() == false) 
                {
                    return ResponseEntity.status(250)
                        .header("Access-Control-Allow-Origin", "*")
                        .body("nouserexist");
                }
                else 
                {
                    if (rs.getDouble("balance") < Double.parseDouble(jsonObj.get("amount").toString())) 
                    {
                        return ResponseEntity.status(250)
                            .header("Access-Control-Allow-Origin", "*")
                            .body("insufficientbalance");
                    }
                }
                // return ResponseEntity.ok()
                //     .header("Access-Control-Allow-Origin", "*")
                //     .body("success");
                tempJsonObj.append("response", "ok");
                return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(tempJsonObj.toString());
            }
            else {
                try {
                    // Retrieve Secret Key
                    sqlQuery = "SELECT * FROM SecretKey WHERE user_name = ?";
                    pstmt = conn.prepareStatement(sqlQuery);
                    pstmt.setString(1, jsonObj.getString("userName"));
                    rs = pstmt.executeQuery();
                    if (!rs.next()) {
                        System.out.println("no results");
                    }
                    secretKey = rs.getString("secret_key");

                    if (!jsonObj.get("qrOtp").toString().isEmpty()) {
                        String qrOtp = jsonObj.get("qrOtp").toString();
                        String totp = gAuth.getTOTPCode(secretKey);

                        if (qrOtp.equals(totp)) {
                            // Update senders balance (minus from amount)
                            sqlQuery = "UPDATE Account SET balance = balance - ? WHERE acct_num = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setDouble(1, Double.parseDouble(transaction.getAmount()));
                            pstmt.setInt(2, Integer.parseInt(transaction.getAcctNum()));
                            rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged < 1)
                            {
                                throw new SQLException();
                            }

                            // Update recipients balance (add from amount)
                            sqlQuery = "UPDATE Account SET balance = balance + ? WHERE acct_num = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setDouble(1, Double.parseDouble(transaction.getAmount()));
                            pstmt.setInt(2, Integer.parseInt(transaction.getToAcctNum()));
                            rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged < 1)
                            {
                                throw new SQLException();
                            }

                            // ----------------------------------------------------------------------------
                            // Insert transaction details into db
                            sqlQuery = "INSERT INTO Transaction (acct_num, to_acct_num, dateTime, amount, memo) " + 
                            "VALUES (?, ?, ?, ?, ?)";
                            // Date date=java.util.Calendar.getInstance().getTime();  
                            // System.out.println(date);              
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setInt(1, Integer.parseInt(transaction.getAcctNum()));
                            pstmt.setInt(2, Integer.parseInt(transaction.getToAcctNum()));
                            // pstmt.setDate(3, new java.sql.Date(System.currentTimeMillis()));
                            pstmt.setTimestamp(3, new java.sql.Timestamp(System.currentTimeMillis()));
                            pstmt.setDouble(4, Double.parseDouble(transaction.getAmount()));
                            pstmt.setString(5, transaction.getMemo());
                            rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged < 1)
                            {
                                throw new SQLException();
                            }
                            // ---------------------------------------------------------------------------------

                            // return ResponseEntity.ok()
                            //     .header("Access-Control-Allow-Origin", "*")
                            //     .body("success");
                            tempJsonObj.append("response", "qrVerified");

                            //get email of the sender
                            sqlQuery = "SELECT U.email, A.user_name FROM Account A INNER JOIN User U ON A.user_name = U.user_name WHERE A.acct_num = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setInt(1, Integer.parseInt(transaction.getAcctNum()));
                            rs = pstmt.executeQuery();
                            //Get the amount of the transaction 
                            String amt = transaction.getAmount();

                            //get the receiver username 
                            sqlQuery2 = "SELECT U.email, A.user_name FROM Account A INNER JOIN User U ON A.user_name = U.user_name WHERE A.acct_num = ?";
                            pstmt2 = conn.prepareStatement(sqlQuery2);
                            pstmt2.setInt(1, Integer.parseInt(transaction.getToAcctNum()));
                            rs2 = pstmt2.executeQuery();

                            while (rs.next())
                            {//Retreive the email
                            SenderEmail = rs.getString("email");
                            SenderUserName = rs.getString("user_name");
                            
                            }
                            
                            while (rs2.next())
                            {//Retreive the email
                            RecvEmail = rs2.getString("email");
                            RecvUserName = rs2.getString("user_name");
                            
                            }
                            //Send email to sender
                            SendMail.sendMail(SenderEmail, amt, RecvUserName);
                            //Send email to recv
                            SendMailTo.sendMail(RecvEmail, amt, SenderUserName);
                            
                        } 
                        else {
                            tempJsonObj.append("response", "qrNotVerified");
                        }
                        return ResponseEntity.ok()
                        .header("Access-Control-Allow-Origin", "*")
                        .body(tempJsonObj.toString());
                    }
                    else {
                        tempJsonObj.append("response", "qrNotVerified");
                        return ResponseEntity.ok()
                        .header("Access-Control-Allow-Origin", "*")
                        .body(tempJsonObj.toString());
                    }

                } catch (Exception e) {
                    tempJsonObj.append("response", "qrNotVerified");
                    return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(tempJsonObj.toString());

                }
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

