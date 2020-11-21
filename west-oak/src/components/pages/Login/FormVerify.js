import React, { useEffect } from 'react';
// import './Form.css';
import validate from './validateInfo';
import useForm from './useForm';

const FormVerify = ({ submitForm, allUserValues }) => {
    const { handleChange, handleSubmit, values, errors } = useForm(
        submitForm,
        null,
        null,
        validate
    )

    values.username = allUserValues.username
    values.password = allUserValues.password
    values.gAuth = 1
    values.recaptcha = 1

  return (
    <div className='form-content-middle'>
      {/* <h1 className='form-success'>You are being redirected..</h1> */}
      {/* <img className='form-img-2' src='img/img-3.svg' alt='success-image' /> */}
      <form onSubmit={handleSubmit} className='form' noValidate>
          <h1> Enter OTP from Google Authenticator</h1>
          <div className='form-inputs'>
            <input
                className='form-input'
                type='text'
                name='qrOtp'
                placeholder="Enter OTP"
                values={values.qrOtp}
                onChange={handleChange}
            />
            {errors.qrFlag && <p>{errors.qrFlag}</p>}
          </div>
          <button className='form-input-btn' type='submit'>
              Verify
          </button>
      </form>
    </div>
  );
};

export default FormVerify;