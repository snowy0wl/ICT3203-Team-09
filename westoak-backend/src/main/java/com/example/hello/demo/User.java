package com.example.hello.demo;

public class User {
    private String userName;
    private String password;
    private String email;
    private String salt;
    private int attempt;

    public User(String userName, String password, String email, String salt, int attempt)
    {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.salt = salt;
        this.attempt = attempt;
    }

    public void SetUserName(String userName)
    {
        this.userName = userName;
    }

    public String GetUserName()
    {
        return userName;
    }

    public void SetPassword(String password)
    {
        this.password = password;
    }

    public String GetPassword()
    {
        return password;
    }

    public void SetEmail(String email)
    {
        this.email = email;
    }

    public String GetEmail()
    {
        return email;
    }

    public void SetString(String salt)
    {
        this.salt = salt;
    }

    public String GetSalt()
    {
        return salt;
    }

    public void SetAttempt(int attemept)
    {
        this.attempt = attempt;
    }

    public int GetAttempt()
    {
        return attempt;
    }
}
