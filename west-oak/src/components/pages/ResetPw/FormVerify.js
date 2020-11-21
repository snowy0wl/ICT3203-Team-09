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
    values.password2 = allUserValues.password2
    values.gAuth = 1

  return (
    <div className='form-content-middle'>
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