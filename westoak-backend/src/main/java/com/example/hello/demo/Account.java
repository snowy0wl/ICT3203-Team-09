package com.example.hello.demo;

public class Account {
    private String userName;
    private String acctNum;
    private String acctType;
    private String balance;

    public Account(String userName, String acctNum, String acctType, String balance)
    {
        this.userName = userName;
        this.acctNum = acctNum;
        this.acctType = acctType;
        this.balance = balance;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAcctNum() {
        return acctNum;
    }

    public void setAcctNum(String acctNum) {
        this.acctNum = acctNum;
    }

    public String getAcctType() {
        return acctType;
    }

    public void setAcctType(String acctType) {
        this.acctType = acctType;
    }

    public String getBalance() {
        return balance;
    }

    public void setBalance(String balance) {
        this.balance = balance;
    }
}
