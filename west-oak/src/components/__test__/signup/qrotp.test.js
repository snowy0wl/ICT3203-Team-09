import { fireEvent, render, cleanup, waitForElement } from '@testing-library/react';
import React, { useState } from 'react'
import axios from 'axios'
import FormQR from '../../pages/SignUp/FormQR';
import useForm from '../../pages/SignUp/useForm';

 
jest.mock('axios');

afterEach(cleanup);

const allUserValues = {
    username: 'hi',
    email: 'hi@gmail.com',
    password: 'P@ssw0rd',
    password2: 'P@ssw0rd',
}


const setup = () => {
  const utils = render(<FormQR allUserValues={allUserValues}/>)
  // const input = utils.getByLabelText('username')
  // const submit = utils.getByText('Sign up')
  const inputFieldSearch = utils.getByLabelText
  const buttonSearch = utils.getByText
  const queryByLabelText = utils.queryByLabelText
  return { inputFieldSearch, buttonSearch, queryByLabelText }
}
 
describe('qr verification', () => {
  /*
    Text cases for UNSUCESSFUL verification
  */
  it('invalid qr otp', async () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();

    const data = { data: { response: ["qrNotVerified"] }, status: "200" };
    axios.post.mockImplementationOnce(() => Promise.resolve(data));

    const qrOtpInput = inputFieldSearch('qrOtp')
    const submit = buttonSearch('Verify')
    fireEvent.change(qrOtpInput, { target: { value: '123321' }})
    fireEvent.click(submit)
    
    await waitForElement(() => useForm)
    const labelAfterSubmit = queryByLabelText(/invalid-otp/i)
    expect(labelAfterSubmit.textContent).toBe('Invalid OTP. Please enter again.')
  });

//   /*
//     Text cases for SUCCESSFUL verification
//   */
//  it('valid qr otp', async () => {
//   const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();

//   const data = { data: { response: ["qrVerified"] }, status: "200" };
//   axios.post.mockImplementationOnce(() => Promise.resolve(data));

//   const qrOtpInput = inputFieldSearch('qrOtp')
//   const submit = buttonSearch('Verify')
//   fireEvent.change(qrOtpInput, { target: { value: '123321' }})
//   fireEvent.click(submit)
  
//   await waitForElement(() => useForm)
//   const labelAfterSubmit = queryByLabelText(/invalid-otp/i)
//   expect(labelAfterSubmit).toBeNull()
// });


});
