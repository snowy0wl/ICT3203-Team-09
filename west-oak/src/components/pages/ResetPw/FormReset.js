import React from 'react';
import validate from './validateInfo';
import useForm from './useForm';

const FormReset = ({ submitForm, toVerify, setUserValues }) => {
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
    <div className='form-content-middle'>
      <form onSubmit={handleSubmit} className='form' noValidate>
        <h1>
          Reset your password
        </h1>
        <div className='form-inputs'>
          <label className='form-label'>Username</label>
          <input
            aria-label='username'
            className='form-input'
            type='text'
            name='username'
            placeholder='Enter your username'
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <p aria-label='invalid-username'>{errors.username}</p>}
          {errors.nouserexist && <p aria-label='noexist-username'>{errors.nouserexist}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>New Password</label>
          <input
            aria-label='newpassword'
            className='form-input'
            type='password'
            name='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p aria-label='invalid-new-password'>{errors.password}</p>}
          {errors.wrongpassword && <p>{errors.wrongpassword}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Confirm New Password</label>
          <input
            aria-label='confirmnewpassword'
            className='form-input'
            type='password'
            name='password2'
            placeholder='Confirm your password'
            value={values.password2}
            onChange={handleChange}
          />
          {errors.password2 && <p aria-label='invalid-confirm-new-password'>{errors.password2}</p>}
        </div>
        <button className='form-input-btn' type='submit'>
          Confirm
        </button>
      </form>
    </div>
  );
};

export default FormReset;