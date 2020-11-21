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
import java.time.LocalDate;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.Base64;
import java.util.Date;

import com.google.gson.*;
import com.mysql.cj.protocol.Resultset;
import org.json.JSONObject;
import java.io.File;

import java.util.*;

@RestController
public class UserController {

    private static File in = new File(System.getProperty("user.dir")
            + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\hello.txt");

    private static GoogleAuth gAuth = new GoogleAuth();
    private static HashMap secretKeyHM = new HashMap<String, String>();
    private static String secretKey;
    private static String gAuthBarCode;
    private static String base64QR;
    private static JSONObject tempJsonObj;
    // FileHandler fh;

    @PostMapping(path = "/SignUp")
    public ResponseEntity<String> SignUp(@RequestBody String userJson) throws Exception {
        Connection conn = null;

        tempJsonObj = new JSONObject();

        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);

        try {
            String decodedJson = EncodedUrlToJsonString(userJson);

            JSONObject jsonObj = new JSONObject(decodedJson);

            // Create user class
            Gson gson = new GsonBuilder().setLenient().create();
            User user = gson.fromJson(decodedJson, User.class);

            // conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));

            String sqlQuery;
            PreparedStatement pstmt;
            int rowsChanged;

            if (jsonObj.get("gAuth").equals(0)) {

                // Select to check if username already exist
                sqlQuery = "SELECT user_name FROM User WHERE user_name = ?";
                pstmt = conn.prepareStatement(sqlQuery);
                pstmt.setString(1, user.GetUserName());

                ResultSet rs = pstmt.executeQuery();

                if (rs.next() == true) // Means there is existing entry at all
                {
                    // System.out.println(rs.getString("user_name"));
                    return ResponseEntity.status(250).header("Access-Control-Allow-Origin", "*").body("userexist");
                }

                // Select to check if email already exist
                sqlQuery = "SELECT email FROM User WHERE email = ?";
                pstmt = conn.prepareStatement(sqlQuery);
                pstmt.setString(1, user.GetEmail());

                rs = pstmt.executeQuery();

                if (rs.next() == true) {
                    return ResponseEntity.status(250).header("Access-Control-Allow-Origin", "*").body("emailexist");
                }

                // google authentication part
                secretKey = gAuth.generateSecretKey();
                secretKeyHM.put(user.GetUserName(), secretKey);

                gAuthBarCode = gAuth.getGoogleAuthenticatorBarCode(secretKey, user.GetUserName(), "WestOak");

                base64QR = gAuth.createQRCode(gAuthBarCode, 300, 300);

                tempJsonObj.append("response", "qrCode");
                tempJsonObj.append("base64", "data:image/png;base64," + base64QR);

                return ResponseEntity.ok().header("Access-Control-Allow-Origin", "*").body(tempJsonObj.toString());

            } else {
                try {

                    if (!jsonObj.get("qrOtp").toString().isEmpty()) {
                        String qrOtp = jsonObj.get("qrOtp").toString();
                        String totp = gAuth.getTOTPCode(secretKey);

                        if (qrOtp.equals(totp)) {

                            PBKDF2 pbkdf2 = new PBKDF2();

                            byte[] salt = pbkdf2.getSalt();

                            String convertSalt = Base64.getEncoder().encodeToString(salt);

                            byte[] saltedHash = pbkdf2.generateStorngPasswordHash(user.GetPassword(), salt);

                            String convertSaltedHash = Base64.getEncoder().encodeToString(saltedHash);

                            // INSERT into USER
                            sqlQuery = "INSERT INTO User (user_name, password, email, salt) " + "VALUES (?, ?, ?, ?)";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, user.GetUserName());
                            // pstmt.setString(2, user.GetPassword());
                            pstmt.setString(2, convertSaltedHash);
                            pstmt.setString(3, user.GetEmail());
                            pstmt.setString(4, convertSalt);
                            rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged < 1) {
                                throw new SQLException();
                            }

                            // INSERT into SecretKey
                            rowsChanged = 0;
                            sqlQuery = "INSERT INTO SecretKey (user_name, secret_key) " + "VALUES (?, ?)";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, user.GetUserName());
                            pstmt.setString(2, secretKey);
                            rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged < 1) {
                                throw new SQLException();
                            }

                            // INSERT into Account
                            rowsChanged = 0;
                            sqlQuery = "INSERT INTO Account (user_name, acct_type, balance) " + "VALUES (?, ?, ?)";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, user.GetUserName());
                            pstmt.setString(2, "savings");
                            pstmt.setDouble(3, 100.69);
                            rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged < 1) {
                                throw new SQLException();
                            }

                            tempJsonObj.append("response", "qrVerified");
                        } else {
                            tempJsonObj.append("response", "qrNotVerified");
                        }

                        return ResponseEntity.ok().header("Access-Control-Allow-Origin", "*")
                                .body(tempJsonObj.toString());
                    } else {
                        tempJsonObj.append("response", "qrNotVerified");
                        return ResponseEntity.ok().header("Access-Control-Allow-Origin", "*")
                                .body(tempJsonObj.toString());
                    }
                } catch (Exception e) {
                    tempJsonObj.append("response", "qrNotVerified");
                    return ResponseEntity.ok().header("Access-Control-Allow-Origin", "*").body(tempJsonObj.toString());
                }
            }

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*").body("sqlerror");
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*").body("unknownerror");
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }

    }

    @PostMapping(path = "/Login")
    public ResponseEntity<String> Login(@RequestBody String userJson) throws Exception {
        Connection conn = null;

        tempJsonObj = new JSONObject();

        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);
        Logger logger = Logger.getLogger(UserController.class.getName());
        FileHandler fh;
        // fh = new FileHandler(System.getProperty("user.dir") +
        // "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\newlogs.log",0,1,true);
        // logger.addHandler(fh);
        // SimpleFormatter formatter = new SimpleFormatter();
        // fh.setFormatter(formatter);

        try {
            String decodedJson = EncodedUrlToJsonString(userJson);

            JSONObject jsonObj = new JSONObject(decodedJson);
            Gson gson = new GsonBuilder().setLenient().create();

            User user = gson.fromJson(decodedJson, User.class);

            // Check if user/email already exist. Save to db, else, return error message
            // Attempt to write to database
            // conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));

            String sqlQuery;
            PreparedStatement pstmt;
            ResultSet rs;
            PBKDF2 pbkdf2 = new PBKDF2();
            int count = 0;
            Date dateTime;
            Date currentTime = new Date();

            if (jsonObj.get("gAuth").equals(0)) {
                // Select to check if username already exist
                sqlQuery = "SELECT * FROM User WHERE user_name = ?";
                pstmt = conn.prepareStatement(sqlQuery);
                pstmt.setString(1, user.GetUserName());

                // Result of query will be stored in rs
                rs = pstmt.executeQuery();

                if (rs.next() == false) // No user exist, return error message
                {
                    logger.setUseParentHandlers(false);
                    fh = new FileHandler(System.getProperty("user.dir") + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\" + LocalDate.now() + " Login.log", true);
                    logger.addHandler(fh);
                    SimpleFormatter formatter = new SimpleFormatter();
                    fh.setFormatter(formatter);
                    String error = user.GetUserName().toString() + " failed login";
                    logger.log(Level.WARNING, error);
                    fh.close();

                    return ResponseEntity.status(250).header("Access-Control-Allow-Origin", "*").body("wrongpassword");
                } else if (rs.getInt("statusCode") == 0) {
                    // Check if password is correct
                    // Retrieve pw and salt from db and convert from base64 to byte[]
                    byte[] saltedPassword = Base64.getDecoder().decode(rs.getString("password"));

                    byte[] salt = Base64.getDecoder().decode(rs.getString("salt"));

                    // This is the input pw
                    String input_pw = user.GetPassword();

                    count = rs.getInt("attempts");
                    dateTime = rs.getTimestamp("lastFailed");

                    // If password wrong
                    if (pbkdf2.validatePW(input_pw, salt, saltedPassword) == false) {
                        logger.setUseParentHandlers(false);
                        fh = new FileHandler(System.getProperty("user.dir") + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\" + LocalDate.now() + " Login.log", true);
                        logger.addHandler(fh);
                        SimpleFormatter formatter = new SimpleFormatter();
                        fh.setFormatter(formatter);
                        String error = user.GetUserName().toString() + " failed login";
                        logger.log(Level.WARNING, error);
                        fh.close();

                        // Lock user if attempts more than 3
                        if (count >= 2) {
                            try {
                                sqlQuery = "UPDATE User SET lastFailed = NOW(), attempts = ?,statusCode = 1 WHERE user_name = ?";
                                pstmt = conn.prepareStatement(sqlQuery);
                                pstmt.setInt(1, count + 1);
                                pstmt.setString(2, user.GetUserName());

                                int rowsChanged = pstmt.executeUpdate();
                                if (rowsChanged == 0) {
                                    throw new SQLException("No rows changed.");
                                }
                            } catch (SQLException ex) {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                        .body("sqlerror");
                            } catch (Exception ex) {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                        .body("unknownerror");
                            }
                            return ResponseEntity.status(250).header("Access-Control-Allow-Origin", "*")
                                    .body("wrongpassword");
                        } else // attempts is less than 3 and password wrong
                        {
                            try {
                                // fh = new FileHandler(System.getProperty("user.dir") +
                                // "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\newlogs.log");
                                // logger.addHandler(fh);
                                // fh.setFormatter(formatter);
                                // error = user.GetUserName().toString() + " Wrong User3";
                                // logger.log(Level.SEVERE, error);

                                sqlQuery = "UPDATE User SET lastFailed = NOW(), attempts = ? WHERE user_name = ?";
                                pstmt = conn.prepareStatement(sqlQuery);
                                pstmt.setInt(1, count + 1);
                                pstmt.setString(2, user.GetUserName());

                                int rowsChanged = pstmt.executeUpdate();
                                if (rowsChanged == 0) {
                                    throw new SQLException("No rows changed.");
                                }
                            } catch (SQLException ex) {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                        .body("sqlerror");
                            } catch (Exception ex) {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                        .body("unknownerror");
                            }
                            return ResponseEntity.status(250).header("Access-Control-Allow-Origin", "*")
                                    .body("wrongpassword");
                        }
                    } else // password is correct
                    {
                        logger.setUseParentHandlers(false);
                        fh = new FileHandler(System.getProperty("user.dir") + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\" + LocalDate.now() + " Login.log", true);
                        logger.addHandler(fh);
                        SimpleFormatter formatter = new SimpleFormatter();
                        fh.setFormatter(formatter);
                        String error = user.GetUserName().toString() + " login successfully";
                        logger.log(Level.WARNING, error);
                        fh.close();
                        try {
                            sqlQuery = "UPDATE User SET lastLogin = NOW(), attempts = 0 WHERE user_name = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, user.GetUserName());

                            int rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged == 0) {
                                throw new SQLException("No rows changed.");
                            }
                        } catch (SQLException ex) {
                            System.out.println(ex.getMessage());
                            return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                    .body("sqlerror");
                        } catch (Exception ex) {
                            System.out.println(ex.getMessage());
                            return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                    .body("unknownerror");
                        }
                        tempJsonObj.append("response", "ok");
                        return ResponseEntity.ok().header("Access-Control-Allow-Origin", "*")
                                .body(tempJsonObj.toString());
                    }
                } else if (rs.getInt("statusCode") == 1) {
                    byte[] saltedPassword = Base64.getDecoder().decode(rs.getString("password"));

                    byte[] salt = Base64.getDecoder().decode(rs.getString("salt"));

                    // This is the input pw
                    String input_pw = user.GetPassword();

                    count = rs.getInt("attempts");
                    dateTime = rs.getTimestamp("lastFailed");

                    long newTime = currentTime.getTime() - dateTime.getTime();
                    newTime = TimeUnit.MILLISECONDS.toMinutes(newTime);

                    if (newTime >= 5) // check if 5 mins have passed
                    {
                        try {
                            sqlQuery = "UPDATE User SET attempts = 0, statusCode = 0 WHERE user_name = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, user.GetUserName());

                            int rowsChanged = pstmt.executeUpdate();
                            if (rowsChanged == 0) {
                                throw new SQLException("No rows changed.");
                            }
                        } catch (SQLException ex) {
                            System.out.println(ex.getMessage());
                            return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                    .body("sqlerror");
                        } catch (Exception ex) {
                            System.out.println(ex.getMessage());
                            return ResponseEntity.badRequest().header("Access-Control-Allow-Origin", "*")
                                    .body("unknownerror");
                        }

                        if (pbkdf2.validatePW(input_pw, salt, saltedPassword) == false) // password is wrong
                        {
                            logger.setUseParentHandlers(false);
                            fh = new FileHandler(System.getProperty("user.dir") + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\" + LocalDate.now() + " Login.log", true);
                            logger.addHandler(fh); 
                            SimpleFormatter formatter = new SimpleFormatter();
                            fh.setFormatter(formatter);  
                            String error = user.GetUserName().toString() + " failed login";
                            logger.log(Level.WARNING, error);
                            fh.close();

                            try
                            {
                                sqlQuery = "UPDATE User SET lastFailed = NOW(), attempts = ? WHERE user_name = ?";
                                pstmt = conn.prepareStatement(sqlQuery);
                                pstmt.setInt(1, user.GetAttempt()+1);
                                pstmt.setString(2, user.GetUserName());

                                int rowsChanged = pstmt.executeUpdate();
                                if (rowsChanged == 0)
                                {
                                    throw new SQLException("No rows changed.");
                                }

                            }
                            catch (SQLException ex)
                            {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest()
                                .header("Access-Control-Allow-Origin", "*")
                                .body("sqlerror");
                            }
                            catch (Exception ex)
                            {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest()
                                .header("Access-Control-Allow-Origin", "*")
                                .body("unknownerror");
                            } 
                            return ResponseEntity.status(250)
                            .header("Access-Control-Allow-Origin", "*")
                            .body("wrongpassword");
                        }
                        else //password is correct
                        {
                            logger.setUseParentHandlers(false);
                            fh = new FileHandler(System.getProperty("user.dir") + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\" + LocalDate.now() + " Login.log", true);
                            logger.addHandler(fh);
                            SimpleFormatter formatter = new SimpleFormatter();
                            fh.setFormatter(formatter);
                            String error = user.GetUserName().toString() + " login successfully";
                            logger.log(Level.WARNING, error);
                            fh.close();
                            try
                            {
                                sqlQuery = "UPDATE User SET lastLogin = NOW(), attempts = 0 WHERE user_name = ?";
                                pstmt = conn.prepareStatement(sqlQuery);
                                pstmt.setString(1, user.GetUserName());

                                int rowsChanged = pstmt.executeUpdate();
                                if (rowsChanged == 0)
                                {
                                    throw new SQLException("No rows changed.");
                                }
                            }
                            catch (SQLException ex)
                            {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest()
                                .header("Access-Control-Allow-Origin", "*")
                                .body("sqlerror");
                            }
                            catch (Exception ex)
                            {
                                System.out.println(ex.getMessage());
                                return ResponseEntity.badRequest()
                                .header("Access-Control-Allow-Origin", "*")
                                .body("unknownerror");
                            } 

                            tempJsonObj.append("response", "ok");
                            return ResponseEntity.ok()
                            .header("Access-Control-Allow-Origin", "*")
                            .body(tempJsonObj.toString());
                        }
                        
                    }
                    else //5 min have not passed
                    {
                        logger.setUseParentHandlers(false);
                        fh = new FileHandler(System.getProperty("user.dir") + "\\westoak-backend\\src\\main\\java\\com\\example\\hello\\demo\\" + LocalDate.now() + " Login.log", true);
                        SimpleFormatter formatter = new SimpleFormatter();
                        fh.setFormatter(formatter);  
                        String error = user.GetUserName().toString() + " failed login";
                        logger.log(Level.WARNING, error);
                        fh.close();

                        return ResponseEntity.status(250)
                        .header("Access-Control-Allow-Origin", "*")
                        .body("wrongpassword");
                    }

                }
                else //not statusCode 0 or 1
                {
                    return ResponseEntity.status(250)
                    .header("Access-Control-Allow-Origin", "*")
                    .body("wrongpassword");     
                }

            }
            else {
                try {

                    sqlQuery = "SELECT * FROM SecretKey WHERE user_name = ?";
                    pstmt = conn.prepareStatement(sqlQuery);
                    pstmt.setString(1, user.GetUserName());
                    rs = pstmt.executeQuery();
                    if (!rs.next()) {
                        System.out.println("no results");
                    }
                    secretKey = rs.getString("secret_key");
    
                    if (!jsonObj.get("qrOtp").toString().isEmpty()) {
                        String qrOtp = jsonObj.get("qrOtp").toString();
                        String totp = gAuth.getTOTPCode(secretKey);

                        if (qrOtp.equals(totp)) {
                            // Select
                            sqlQuery = "SELECT * FROM Account WHERE user_name = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, user.GetUserName());

                            rs = pstmt.executeQuery();

                            if (rs.next() == false)
                            {
                                return ResponseEntity.status(250)
                                .header("Access-Control-Allow-Origin", "*")
                                .body("wrongpassword");
                            }
                            tempJsonObj.append("response", "qrVerified");
                            tempJsonObj.append("acctNum", rs.getInt("acct_num"));
                            tempJsonObj.append("userName", rs.getString("user_name"));
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
        catch (SQLException ex)
        {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest()
            .header("Access-Control-Allow-Origin", "*")
            .body("sqlerror");
        }
        catch (Exception ex)
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

    // Retrieve user information
    @PostMapping(path = "/Profile")
    public ResponseEntity<String> Profile(@RequestBody String userJson)
    throws Exception
    {
        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);

        Connection conn = null;
        try
        {
            String decodedJson = EncodedUrlToJsonString(userJson);

            Gson gson = new GsonBuilder().setLenient().create();

            User user = gson.fromJson(decodedJson, User.class);

            // Check if user/email already exist. Save to db, else, return error message
            // Attempt to write to database
            // conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));
            

            // Select to check if username already exist
            String sqlQuery = "SELECT * FROM User WHERE user_name = ?";
            PreparedStatement pstmt = conn.prepareStatement(sqlQuery);
            pstmt.setString(1, user.GetUserName());

            ResultSet rs = pstmt.executeQuery();

            if (rs.next() == false) // No user exist, return error message
            {
                return ResponseEntity.status(250)
                .header("Access-Control-Allow-Origin", "*")
                .body("nouserexist");
            }
            else
            {
                // Only sends back the email to reduce the security risk
                User dbUser = new User(
                    "", 
                    "", 
                    rs.getString("email"),
                    "", 0);
                
                String dbUserJson = gson.toJson(dbUser);

                return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .body(dbUserJson);
            }
        }
        catch (SQLException ex)
        {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest()
            .header("Access-Control-Allow-Origin", "*")
            .body("sqlerror");
        }
        catch (Exception ex)
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

    @PostMapping(path = "/Editprofile")
    public ResponseEntity<String> Editprofile(@RequestBody String userJson)
    throws Exception
    {
        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);
        Connection conn = null;
        try
        {
            String decodedJson = EncodedUrlToJsonString(userJson);

            Gson gson = new GsonBuilder().setLenient().create();

            User user = gson.fromJson(decodedJson, User.class);

            // Check if user/email already exist. Save to db, else, return error message
            // Attempt to write to database
            // conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));
            

            // Select to check if email already exist
            String sqlQuery = "SELECT email FROM User WHERE email = ? AND NOT user_name = ?";
            PreparedStatement pstmt = conn.prepareStatement(sqlQuery);
            pstmt.setString(1, user.GetEmail());
            pstmt.setString(2, user.GetUserName());

            ResultSet rs = pstmt.executeQuery();

            if (rs.next() == true)
            {
                // System.out.println(rs.getString("email"));
                return ResponseEntity.status(250)
                    .header("Access-Control-Allow-Origin", "*")
                    .body("emailexist");
            }

            sqlQuery = "UPDATE User SET email = ? WHERE user_name = ?";
            pstmt = conn.prepareStatement(sqlQuery);
            pstmt.setString(1, user.GetEmail());
            pstmt.setString(2, user.GetUserName());

            int rowsChanged = pstmt.executeUpdate();

            if (rowsChanged == 0) // No user exist, return error message
            {
                throw new SQLException("No rows changed.");
            }
            else
            {
                return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .body("success");
            }
        }
        catch (SQLException ex)
        {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest()
            .header("Access-Control-Allow-Origin", "*")
            .body("sqlerror");
        }
        catch (Exception ex)
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

    @PostMapping(path = "/Reset")
    public ResponseEntity<String> Reset(@RequestBody String userJson)
    throws Exception
    {
        Connection conn = null;

        tempJsonObj = new JSONObject();

        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);

        try
        {
            
            String decodedJson = EncodedUrlToJsonString(userJson);

            JSONObject jsonObj = new JSONObject(decodedJson);
            Gson gson = new GsonBuilder().setLenient().create();

            User user = gson.fromJson(decodedJson, User.class);

            // Check if user/email already exist. Save to db, else, return error message
            // Attempt to write to database
            // conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
            conn = DriverManager.getConnection(line.get(0), line.get(1), line.get(2));
            

            String sqlQuery;
            PreparedStatement pstmt;
            ResultSet rs;

            if (jsonObj.get("gAuth").equals(0)) {
                // Select to check if username already exist
                sqlQuery = "SELECT * FROM User WHERE user_name = ?";
                pstmt = conn.prepareStatement(sqlQuery);
                pstmt.setString(1, user.GetUserName());

                rs = pstmt.executeQuery();

                if (rs.next() == false) // No user exist, return error message
                {
                    return ResponseEntity.status(250)
                    .header("Access-Control-Allow-Origin", "*")
                    .body("nouserexist");
                }
                else
                {
                    tempJsonObj.append("response", "ok");
                    return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(tempJsonObj.toString());
                    // // Check if password is correct
                    // if (!rs.getString("password").equals(user.GetPassword()))
                    // {
                    //     return ResponseEntity.status(250)
                    //     .header("Access-Control-Allow-Origin", "*")
                    //     .body("wrongpassword");
                    // }
                    // else    // If password is correct, 
                    // {

                    //     tempJsonObj.append("response", "ok");
                    //     return ResponseEntity.ok()
                    //     .header("Access-Control-Allow-Origin", "*")
                    //     .body(tempJsonObj.toString());
                    // }
                }
            }
            else {
                try {

                    sqlQuery = "SELECT * FROM SecretKey WHERE user_name = ?";
                    pstmt = conn.prepareStatement(sqlQuery);
                    pstmt.setString(1, user.GetUserName());
                    rs = pstmt.executeQuery();
                    if (!rs.next()) {
                        System.out.println("no results");
                    }
                    secretKey = rs.getString("secret_key");
    
                    if (!jsonObj.get("qrOtp").toString().isEmpty()) {
                        String qrOtp = jsonObj.get("qrOtp").toString();
                        String totp = gAuth.getTOTPCode(secretKey);

                        if (qrOtp.equals(totp)) {
                            // Select
                            PBKDF2 pbkdf2 = new PBKDF2();

                            // generate the random salt
                            byte[] salt = pbkdf2.getSalt();
                            // Convert the byte array to base64 encoding
                            String convertSalt = Base64.getEncoder().encodeToString(salt);

                            // generate salted hashed password
                            byte[] saltedhash = pbkdf2.generateStorngPasswordHash(user.GetPassword(), salt);
                            // Convert the byte array to base64 encoding
                            String convertSaltedHash = Base64.getEncoder().encodeToString(saltedhash);

                            sqlQuery = "UPDATE User SET password = ?, salt = ? WHERE user_name = ?";
                            pstmt = conn.prepareStatement(sqlQuery);
                            pstmt.setString(1, convertSaltedHash);
                            pstmt.setString(2, convertSalt);
                            pstmt.setString(3, user.GetUserName());

                            int rowsChanged = pstmt.executeUpdate();

                            if (rowsChanged == 0)
                            {
                                throw new SQLException("No rows changed.");
                            }
                            tempJsonObj.append("response", "qrVerified");
                            // tempJsonObj.append("acctNum", rs.getInt("acct_num"));
                            // tempJsonObj.append("userName", rs.getString("user_name"));
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
        catch (SQLException ex)
        {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest()
            .header("Access-Control-Allow-Origin", "*")
            .body("sqlerror");
        }
        catch (Exception ex)
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

}

