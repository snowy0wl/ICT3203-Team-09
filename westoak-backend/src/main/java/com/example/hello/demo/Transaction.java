package com.example.hello.demo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

public class Transaction {
    private String acctNum;
    private String toAcctNum;
    private Date dateTime;
    private String amount;
    private String memo;

    public Transaction(String acctNum, String toAcctNum, Date dateTime, String amount, String memo)
    {    
        this.acctNum = acctNum;
        this.toAcctNum = toAcctNum;
        this.dateTime = dateTime;
        this.amount = amount;
        this.memo = memo;
    }
    
    public String getAcctNum() {
        return acctNum;
    }

    public void setAcctNum(String acctNum) {
        this.acctNum = acctNum;
    }

    public String getToAcctNum() {
        return toAcctNum;
    }

    public void setToAcctNum(String toAcctNum) {
        this.toAcctNum = toAcctNum;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
