import { fireEvent, render, cleanup, waitForElement } from '@testing-library/react';
import React, { useState } from 'react'
import axios from 'axios'
import FormSignup from '../../pages/SignUp/FormSignup';
import FormQR from '../../pages/SignUp/FormQR';
import useForm from '../../pages/SignUp/useForm';
import { Router, BrowserRouter } from 'react-router-dom';

 
jest.mock('axios');

afterEach(cleanup);

const setup = () => {
  const utils = render(<BrowserRouter><FormSignup /></BrowserRouter>)
  // const input = utils.getByLabelText('username')
  // const submit = utils.getByText('Sign up')
  const inputFieldSearch = utils.getByLabelText
  const buttonSearch = utils.getByText
  const queryByLabelText = utils.queryByLabelText
  return { inputFieldSearch, buttonSearch, queryByLabelText }
}
 
describe('signup', () => {
  /*
    Text cases for unsuccessful signup
  */
  // it('username exists', async () => {
  //   const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();

  //   const data = { data: "userexist", status: "250" };
  //   axios.post.mockImplementationOnce(() => Promise.resolve(data));

  //   const userNameInput = inputFieldSearch('username')
  //   const emailInput = inputFieldSearch('email')
  //   const passwordInput = inputFieldSearch('password')
  //   const confirmPasswordInput = inputFieldSearch('password2')
  //   // const captchaInput = inputFieldSearch('recaptcha')
  //   const submit = buttonSearch('Sign up')
  //   fireEvent.change(userNameInput, { target: { value: 'hi' }})
  //   fireEvent.change(emailInput, { target: { value: 'hi@gmail.com' }})
  //   fireEvent.change(passwordInput, { target: { value: 'P@ssw0rd' }})
  //   fireEvent.change(confirmPasswordInput, { target: { value: 'P@ssw0rd' }})
  //   // fireEvent.change(captchaInput, { target: { value: 1 }})
  //   fireEvent.click(submit)
    
  //   await waitForElement(() => useForm)
  //   const labelAfterSubmit = queryByLabelText(/exist-username/i)
  //   expect(labelAfterSubmit.textContent).toBe('Username already exists.')
  // });

  // it('email exists', async () => {
  //   const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();

  //   const data = { data: "emailexist", status: "250" };
  //   axios.post.mockImplementationOnce(() => Promise.resolve(data));

  //   const userNameInput = inputFieldSearch('username')
  //   const emailInput = inputFieldSearch('email')
  //   const passwordInput = inputFieldSearch('password')
  //   const confirmPasswordInput = inputFieldSearch('password2')
  //   // const captchaInput = inputFieldSearch('g-recaptcha')
  //   const submit = buttonSearch('Sign up')
  //   fireEvent.change(userNameInput, { target: { value: 'hi' }})
  //   fireEvent.change(emailInput, { target: { value: 'hi@gmail.com' }})
  //   fireEvent.change(passwordInput, { target: { value: 'P@ssw0rd' }})
  //   fireEvent.change(confirmPasswordInput, { target: { value: 'P@ssw0rd' }})
  //   // fireEvent.change(captchaInput, { target: { value: 1 }})
  //   fireEvent.click(submit)
    
  //   await waitForElement(() => useForm)
  //   const labelAfterSubmit = queryByLabelText(/exist-email/i)
  //   expect(labelAfterSubmit.textContent).toBe('Email already exists.')
  // });


  /*
    Test cases for username
  */
  it('valid username', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('username')
    const submit = buttonSearch('Sign up')
    fireEvent.change(input, { target: { value: 'hi'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/errorIU/i)
    expect(labelAfterSubmit).toBeNull()
  })

  it('invalid username', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('username')
    const submit = buttonSearch('Sign up')
    fireEvent.change(input, { target: { value: 'hi@'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/errorIU/i)
    expect(labelAfterSubmit.textContent).toBe('Username is invalid')
  })

  
  /*
    Test cases for email
  */
  it('valid email', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('email')
    const submit = buttonSearch('Sign up')
    fireEvent.change(input, { target: { value: 'hi@gmail.com'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/errorIE/i)
    expect(labelAfterSubmit).toBeNull()
  })

  it('invalid email', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('email')
    const submit = buttonSearch('Sign up')
    fireEvent.change(input, { target: { value: 'hi@@gmail'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/errorIE/i)
    expect(labelAfterSubmit.textContent).toBe('Email address is invalid')
  })

  /*
    Test cases for password
  */
  it('valid password', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('password')
    const submit = buttonSearch('Sign up')
    fireEvent.change(input, { target: { value: 'P@ssw0rd'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/errorIP/i)
    expect(labelAfterSubmit).toBeNull()
  })

  it('invalid password', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('password')
    const submit = buttonSearch('Sign up')
    fireEvent.change(input, { target: { value: 'hihih'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/errorIP/i)
    expect(labelAfterSubmit.textContent).toBe('Password needs to be 8 characters or more')
  })

  /*
    Test cases for confirm password
  */
 it('valid confirm password', () => {
  const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
  const input = inputFieldSearch('password')
  const input2 = inputFieldSearch('password2')
  const submit = buttonSearch('Sign up')
  fireEvent.change(input, { target: { value: 'P@ssw0rd'}})
  fireEvent.change(input2, { target: { value: "P@ssw0rd"}})
  fireEvent.click(submit)
  const labelAfterSubmit = queryByLabelText(/errorICP/i)
  expect(labelAfterSubmit).toBeNull()
})

it('invalid confirm password', () => {
  const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
  const input = inputFieldSearch('password')
  const input2 = inputFieldSearch('password2')
  const submit = buttonSearch('Sign up')
  fireEvent.change(input, { target: { value: 'hihihi'}})
  fireEvent.change(input2, { target: { value: "hihih"}})
  fireEvent.click(submit)
  const labelAfterSubmit = queryByLabelText(/errorICP/i)
  expect(labelAfterSubmit.textContent).toBe('Passwords do not match')
})

});
