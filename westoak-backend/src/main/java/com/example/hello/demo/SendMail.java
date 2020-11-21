package com.example.hello.demo;

import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.File; // Import the File class

import java.util.*;

public class SendMail 
{
    public static void sendMail(String recipient, String amt, String recv)
    throws Exception
    {
        File in = new File(System.getProperty("user.dir") + "\\src\\main\\java\\com\\example\\hello\\demo\\hello2.txt");
        Properties properties = new Properties();

        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        readFile rd = new readFile();
        ArrayList<String> line = rd.credentials(in);

        String myAccount = line.get(0);
        String password = line.get(1);

        Session session = Session.getInstance(properties, new Authenticator()
        {
            @Override
            protected PasswordAuthentication getPasswordAuthentication(){
                return new PasswordAuthentication(myAccount, password);
            }
        } );
    

        Message message = prepareMessage(session, myAccount, recipient, amt, recv);

        Transport.send(message);
        //System.out.println("Success");
    }
        
    private static Message prepareMessage(Session session, String myAccountEmail, String recepient, String amt, String recv)
    {
        try{
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(myAccountEmail));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(recepient));
            //This is the subject of the email 
            message.setSubject("WestOak Bank Sending Of Payment Confirmation");
            //This is the text of the email 
            message.setText("Payment of " + amt + " has been successfully sent to " + recv);
            return message;
        }catch (Exception ex)
        {
            Logger.getLogger(SendMail.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
}
