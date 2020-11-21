import { fireEvent, render, cleanup, waitForElement } from '@testing-library/react';
import React, { useState } from 'react'
import { Link, BrowserRouter } from 'react-router-dom';
import axios from 'axios'
import FormReset from '../../pages/ResetPw/FormReset';
import useForm from '../../pages/ResetPw/useForm';

jest.mock('axios');

afterEach(cleanup);

const setup = () => {
    const utils = render(<FormReset />)
    const inputFieldSearch = utils.getByLabelText
    const buttonSearch = utils.getByText
    const queryByLabelText = utils.queryByLabelText
    return { inputFieldSearch, buttonSearch, queryByLabelText }
  }

  describe('resetpw', () => {
    /*
    Text cases for unsuccessful pw reset
    */
    it('username noexist', async () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        
        const data = { data: "nouserexist", status: "250" };
        axios.post.mockImplementationOnce(() => Promise.resolve(data));

        const userNameInput = inputFieldSearch('username')
        const passwordInput = inputFieldSearch('newpassword')
        const confirmPasswordInput = inputFieldSearch('confirmnewpassword')
        const submit = buttonSearch('Confirm')
        fireEvent.change(userNameInput, { target: { value: 'hi' }})
        fireEvent.change(passwordInput, { target: { value: 'hihihi' }})
        fireEvent.change(confirmPasswordInput, { target: { value: 'hihihi' }})
        fireEvent.click(submit)
    
        await waitForElement(() => useForm)
        const labelAfterSubmit = queryByLabelText(/noexist-username/i)
        expect(labelAfterSubmit.textContent).toBe('Username does not exist.')
    });

    /*
    Test cases for username
    */
    it('valid username', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('username')
        const submit = buttonSearch('Confirm')
        fireEvent.change(input, { target: { value: 'hi'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/invalid-username/i)
        expect(labelAfterSubmit).toBeNull()
    })
    
    it('invalid username', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('username')
        const submit = buttonSearch('Confirm')
        fireEvent.change(input, { target: { value: 'hi@'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/invalid-username/i)
        expect(labelAfterSubmit.textContent).toBe('Username is invalid')
    })

    /*
    Test cases for new password
    */
    it('valid new password', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('newpassword')
        const submit = buttonSearch('Confirm')
        fireEvent.change(input, { target: { value: 'hihihi'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/invalid-new-password/i)
        expect(labelAfterSubmit).toBeNull()
    })
    
    it('invalid new password', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('newpassword')
        const submit = buttonSearch('Confirm')
        fireEvent.change(input, { target: { value: 'hihih'}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/invalid-new-password/i)
        expect(labelAfterSubmit.textContent).toBe('Password needs to be 6 characters or more')
    })

    /*
    Test cases for confirm new password
    */
    it('valid confirm new password', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('newpassword')
        const input2 = inputFieldSearch('confirmnewpassword')
        const submit = buttonSearch('Confirm')
        fireEvent.change(input, { target: { value: 'hihihi'}})
        fireEvent.change(input2, { target: { value: "hihihi"}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/invalid-confirm-new-password/i)
        expect(labelAfterSubmit).toBeNull()
    })
      
    it('invalid confirm new password', () => {
        const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
        const input = inputFieldSearch('newpassword')
        const input2 = inputFieldSearch('confirmnewpassword')
        const submit = buttonSearch('Confirm')
        fireEvent.change(input, { target: { value: 'hihihi'}})
        fireEvent.change(input2, { target: { value: "hihih"}})
        fireEvent.click(submit)
        const labelAfterSubmit = queryByLabelText(/invalid-confirm-new-password/i)
        expect(labelAfterSubmit.textContent).toBe('Passwords do not match')
    })

});