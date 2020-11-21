package com.example.hello.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.google.zxing.WriterException;

import java.io.IOException;
import java.util.Scanner;

import static com.example.hello.demo.GoogleAuth.*;

@SpringBootApplication
public class Main {

	public static void main(String[] args) throws IOException, WriterException {
		SpringApplication.run(Main.class, args);
	}

}
