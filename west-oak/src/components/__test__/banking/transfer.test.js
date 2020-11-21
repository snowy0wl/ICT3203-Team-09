import { fireEvent, render, cleanup, waitForElement } from '@testing-library/react';
import React, { useState } from 'react'
import axios from 'axios'
import FormTransfer from '../../pages/Banking/FormTransfer';
import useForm from '../../pages/Banking/useForm';

 
jest.mock('axios');

afterEach(cleanup);

const setup = () => {
  const utils = render(<FormTransfer />)
  // const input = utils.getByLabelText('username')
  // const submit = utils.getByText('Sign up')
  const inputFieldSearch = utils.getByLabelText
  const buttonSearch = utils.getByText
  const queryByLabelText = utils.queryByLabelText
  return { inputFieldSearch, buttonSearch, queryByLabelText }
}
 
describe('transfer', () => {
  /*
    Text cases for unsuccessful transfer
  */
  it('to_acct_num noexist', async () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();

    const data = { data: "nouserexist", status: "250" };
    axios.post.mockImplementationOnce(() => Promise.resolve(data));

    const toAcctNumInput = inputFieldSearch('to_acct_num')
    const amountInput = inputFieldSearch('amount')
    const memoInput = inputFieldSearch('memo')
    const submit = buttonSearch('Submit')
    fireEvent.change(toAcctNumInput, { target: { value: '0' }})
    fireEvent.change(amountInput, { target: { value: '100' }})
    fireEvent.change(memoInput, { target: { value: 'dinner' }})
    fireEvent.click(submit)
    
    await waitForElement(() => useForm)
    const labelAfterSubmit = queryByLabelText(/noexist-acct/i)
    expect(labelAfterSubmit.textContent).toBe('Account does not exist.')
  });

  it('insufficient balance', async () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();

    const data = { data: "insufficientbalance", status: "250" };
    axios.post.mockImplementationOnce(() => Promise.resolve(data));

    const toAcctNumInput = inputFieldSearch('to_acct_num')
    const amountInput = inputFieldSearch('amount')
    const memoInput = inputFieldSearch('memo')
    const submit = buttonSearch('Submit')
    fireEvent.change(toAcctNumInput, { target: { value: '0' }})
    fireEvent.change(amountInput, { target: { value: '100' }})
    fireEvent.change(memoInput, { target: { value: 'dinner' }})
    fireEvent.click(submit)
    
    await waitForElement(() => useForm)
    const labelAfterSubmit = queryByLabelText(/insufbal/i)
    expect(labelAfterSubmit.textContent).toBe('Insufficient balance!')
  });

  /*
    Test cases for to_acct_num
  */
  it('valid to_acct_num', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('to_acct_num')
    const submit = buttonSearch('Submit')
    fireEvent.change(input, { target: { value: '1'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/invalid-acct/i)
    expect(labelAfterSubmit).toBeNull()
  })

  it('invalid to_acct_num', () => {
    const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
    const input = inputFieldSearch('to_acct_num')
    const submit = buttonSearch('Submit')
    fireEvent.change(input, { target: { value: 'hi@'}})
    fireEvent.click(submit)
    const labelAfterSubmit = queryByLabelText(/invalid-acct/i)
    expect(labelAfterSubmit.textContent).toBe('Invalid account number')
  })

  /*
    Test cases for amount
  */
 it('valid amount', () => {
  const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
  const input = inputFieldSearch('amount')
  const submit = buttonSearch('Submit')
  fireEvent.change(input, { target: { value: '100'}})
  fireEvent.click(submit)
  const labelAfterSubmit = queryByLabelText(/invalid-amount/i)
  expect(labelAfterSubmit).toBeNull()
})

it('invalid amount', () => {
  const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
  const input = inputFieldSearch('amount')
  const submit = buttonSearch('Submit')
  fireEvent.change(input, { target: { value: 'hi@'}})
  fireEvent.click(submit)
  const labelAfterSubmit = queryByLabelText(/invalid-amount/i)
  expect(labelAfterSubmit.textContent).toBe('Invalid amount')
})

});
