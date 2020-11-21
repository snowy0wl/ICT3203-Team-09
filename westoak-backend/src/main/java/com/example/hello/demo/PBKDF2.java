package com.example.hello.demo;

import javax.crypto.*;
import java.security.*;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.Scanner;
import java.util.Arrays;

public class PBKDF2 
{
    public static void main(String args[])
    throws Exception
    {
        
    }

    //Generate the random salt
    public byte[] getSalt() 
    throws NoSuchAlgorithmException 
    {
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    //Generate salted hash
    public byte[] generateStorngPasswordHash(String password, byte[] salt)
    throws NoSuchAlgorithmException, InvalidKeySpecException 
    {
        int iterations = 1000;
        char[] chars = password.toCharArray();

        PBEKeySpec spec = new PBEKeySpec(chars, salt, iterations, 64 * 8);
        SecretKeyFactory key = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] hash = key.generateSecret(spec).getEncoded();
        return hash;
    }

    public boolean validatePW(String password, byte[] salt, byte[] saltedPW)
    throws Exception
    {

        byte[] saltedInputPW = generateStorngPasswordHash(password, salt);

        if (Arrays.equals(saltedInputPW, saltedPW)) 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    }

}
