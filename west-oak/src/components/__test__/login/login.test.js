import { fireEvent, render, cleanup, waitForElement } from '@testing-library/react';
import React, { useState } from 'react'
import { Router, BrowserRouter } from 'react-router-dom';
import axios from 'axios'
import FormLogin from '../../pages/Login/FormLogin';
import useForm from '../../pages/Login/useForm';


jest.mock('axios');

afterEach(cleanup);

const setup = () => {
    const utils = render(<BrowserRouter><FormLogin /></BrowserRouter>)
    const inputFieldSearch = utils.getByLabelText
    const buttonSearch = utils.getByText
    const queryByLabelText = utils.queryByLabelText
    return { inputFieldSearch, buttonSearch, queryByLabelText }
  }

  describe('login', () => {
    /*
    Text cases for unsuccessful login
    */
    // it('username noexists', async () => {
    //     const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        
    //     const data = { data: "usernoexist", status: "250" };
    //     axios.post.mockImplementationOnce(() => Promise.resolve(data));
    
    //     const userNameInput = inputFieldSearch('username')
    //     const passwordInput = inputFieldSearch('password')
    //     const submit = buttonSearch('Login')
    //     fireEvent.change(userNameInput, { target: { value: 'hi' }})
    //     fireEvent.change(passwordInput, { target: { value: 'hihihi' }})
    //     fireEvent.click(submit)

    //     await waitForElement(() => useForm)
    //     const labelAfterSubmit = queryByLabelText(/noexist-username/i)
    //     expect(labelAfterSubmit.textContent).toBe('Username does not exist.')
    // });
    
    /*
    Test cases for username
    */
    it('valid username', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('username')
        const submit = buttonSearch('Login')
        fireEvent.change(input, { target: { value: 'hi'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/errorIU/i)
        expect(labelAfterSubmit).toBeNull()
    })
    
    it('invalid username', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('username')
        const submit = buttonSearch('Login')
        fireEvent.change(input, { target: { value: 'hi@'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/errorIU/i)
        expect(labelAfterSubmit.textContent).toBe('Username / Password is incorrect')
    })

    /*
    Test cases for password
    */
    it('valid password', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('password')
        const submit = buttonSearch('Login')
        fireEvent.change(input, { target: { value: 'P@ssw0rd'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/errorIP/i)
        expect(labelAfterSubmit).toBeNull()
    })
    
    it('invalid password', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('password')
        const submit = buttonSearch('Login')
        fireEvent.change(input, { target: { value: 'P@ssw0r'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/errorIP/i)
        expect(labelAfterSubmit.textContent).toBe('Password needs to be 8 characters or more')
    })

});