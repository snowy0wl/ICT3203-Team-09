import { fireEvent, render, cleanup, waitForElement } from '@testing-library/react';
import React, { useState } from 'react'
import axios from 'axios'
import FormBalance from '../../pages/Banking/FormBalance';

jest.mock('axios');

afterEach(cleanup);

const setup = () => {
  const utils = render(<FormBalance />)
  const inputFieldSearch = utils.getByLabelText
  const buttonSearch = utils.getByText
  const queryByLabelText = utils.queryByLabelText
  return { inputFieldSearch, buttonSearch, queryByLabelText }
}

describe('balance', () => {
    /*
      Text cases for successful balance
    */
    it('retrieve success', async () => {
      const { inputFieldSearch, buttonSearch, queryByLabelText } = setup();
  
      const data = { data: { balance: ['100'] }, status: "200" };
      axios.post.mockImplementationOnce(() => Promise.resolve(data));
      
      await waitForElement(() => FormBalance)
      const labelAfterSubmit = queryByLabelText(/balance-total/i)
      expect(labelAfterSubmit.textContent).toBe('SGD 100.00')
    });
});