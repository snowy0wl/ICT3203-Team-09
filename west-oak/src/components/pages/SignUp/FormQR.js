import React from 'react';
import validate from './validateInfo';
import useForm from './useForm';
// import '../../Form.css';

const FormQR = ({ submitForm, base64, allUserValues }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    null,
    null,
    validate
  );

  values.username = allUserValues.username
  values.email = allUserValues.email
  values.password = allUserValues.password
  values.password2 = allUserValues.password2
  values.gAuth = 1
  values.recaptcha = 1

  return (
    <div className='form-content-middle'>
        <form onSubmit={handleSubmit} className='form' noValidate>
          <img src={base64} />
          <br />
          <h1> Enter OTP from Google Authenticator</h1>
          <div className='form-inputs'>
            <input
              aria-label='qrOtp'
              className='form-input'
              type='text'
              name='qrOtp'
              placeholder='Enter OTP'
              value={values.qrOtp}
              onChange={handleChange}
            />
            {errors.qrFlag && <p aria-label='invalid-otp'>{errors.qrFlag}</p>}
          </div>
          <button className='form-input-btn' type='submit'>
            Verify
          </button>
        </form>

    </div>
  );
};

export default FormQR;