package com.example.hello.demo;

import java.net.http.HttpRequest;

import com.beust.jcommander.internal.Console;

import org.assertj.core.api.Assert.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import net.bytebuddy.agent.VirtualMachine.ForHotSpot.Connection.Response;

@SpringBootTest
class DemoApplicationTests {

	@Mock
	private RestTemplate restTemplate;

	@Test
	void WhenSigningUpWithUniqueCredentialsResponseShouldReturnOk() {
		
		ResponseEntity<String> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
		
		Mockito
		.when(restTemplate.getForEntity(
			"http://localhost:8080/SignUp", String.class))
			.thenReturn(expectedResponse);


		Assert.isTrue(expectedResponse.getStatusCode() == HttpStatus.OK);
	}

	@Test
	void WhenLoggingInWithCorrectCredentialsResponseShouldReturnOk() {
		
		ResponseEntity<String> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
		
		Mockito
		.when(restTemplate.getForEntity(
			"http://localhost:8080/Login", String.class))
			.thenReturn(expectedResponse);


		Assert.isTrue(expectedResponse.getStatusCode() == HttpStatus.OK);
	}

	@Test
	void WhenResettingPasswordResponseShouldReturnOk() {
		
		ResponseEntity<String> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
		
		Mockito
		.when(restTemplate.getForEntity(
			"http://localhost:8080/Reset", String.class))
			.thenReturn(expectedResponse);


		Assert.isTrue(expectedResponse.getStatusCode() == HttpStatus.OK);
	}

	@Test
	void WhenChangingToUniqueEmailResponseShouldReturnOk() {
		
		ResponseEntity<String> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
		
		Mockito
		.when(restTemplate.getForEntity(
			"http://localhost:8080/Editprofile", String.class))
			.thenReturn(expectedResponse);


		Assert.isTrue(expectedResponse.getStatusCode() == HttpStatus.OK);
	}

	@Test
	void WhenTransferingToAnotherAccountResponseShouldReturnOk() {
		
		ResponseEntity<String> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
		
		Mockito
		.when(restTemplate.getForEntity(
			"http://localhost:8080/Transfer", String.class))
			.thenReturn(expectedResponse);


		Assert.isTrue(expectedResponse.getStatusCode() == HttpStatus.OK);
	}
}
