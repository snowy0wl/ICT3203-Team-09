import React, { useState } from 'react';
import validate from './validateInfo';
import useForm from './useForm';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';

  const FormTransfer = ({ submitForm, toVerify, setUserValues }) => {
    const { handleChange, handleSubmit, values, errors } = useForm(
      submitForm,
      toVerify,
      setUserValues,
      validate
    );
    
    // Set values to prevent null in useForm
    values.qrOtp = "none"
    values.gAuth = 0

  return (
      <form onSubmit={handleSubmit} className='form' noValidate>
        <h1>
          Transfer Funds
        </h1>
        <div className='form-inputs'>
          <label className='form-label'>From account</label>
            <FormControl className='form-dropdown'>
                <NativeSelect>
                  <option value="Savings Account">Savings Account</option>
                  {/* <option value="Joint Account">Joint Account</option> */}
                </NativeSelect>
            </FormControl>
        </div>
        <div className='form-inputs'>
          <label className='form-label'>To account</label>
          <input
            aria-label='to_acct_num'
            className='form-input'
            type='text'
            name='to_acct_num'
            placeholder='Enter account number'
            value={values.to_acct_num}
            onChange={handleChange}
          />
          {errors.to_acct_num && <p aria-label='invalid-acct'>{errors.to_acct_num}</p>}
          {errors.nouserexist && <p aria-label='noexist-acct'>{errors.nouserexist}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Amount</label>
          <input
            aria-label='amount'
            className='form-input'
            type='text'
            name='amount'
            placeholder='Enter amount'
            value={values.amount}
            onChange={handleChange}
          />
          {errors.amount && <p aria-label='invalid-amount'>{errors.amount}</p>}
          {errors.insufBal && <p aria-label='insufBal'>{errors.insufBal}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Memo (Optional: Maximum of 120 characters)</label>
          <input
            aria-label='memo'
            className='form-input'
            type='text'
            name='memo'
            placeholder='Enter message'
            value={values.memo}
            onChange={handleChange}
          />
        </div>
        <button className='form-input-btn' type='submit'>
          Submit
        </button>
      </form>
  );
};

export default FormTransfer;