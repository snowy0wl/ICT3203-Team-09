import React, { useState } from 'react';
import validate from './validateInfo';
import useForm from './useForm';
import Recaptcha from 'react-recaptcha';
import { Link } from 'react-router-dom';

const FormLogin = ({ submitForm, toVerify, setUserValues }) => {
  const [isRecaptcha, setIsRecaptcha] = useState(0)
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    toVerify,
    setUserValues,
    validate,
    isRecaptcha
  );

  function testRecaptcha() {
    console.log("recaptcha loaded")
  }

  function verifyCallback(response) {
    if (response) {
      setIsRecaptcha(1)
    }
    else {
      setIsRecaptcha(0)
    }

  }

  function expiredCallback() {
    setIsRecaptcha(0)
  }

  // Set values to prevent null in useForm
  values.qrOtp = "none"
  values.gAuth = 0

  return (
    <div className='form-content-middle'>
      <form onSubmit={handleSubmit} className='form' noValidate>
        <h1>
          Log in to West Oak
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
          {/* {errors.username && <p aria-label='invalid-username'>{errors.username}</p>}
          {errors.nouserexist && <p aria-label='noexist-username'>{errors.nouserexist}</p>} */}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Password</label>
          <input
            aria-label='password'
            className='form-input'
            type='password'
            name='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
          />
          {errors.username && <p aria-label='errorIU'>{errors.username}</p>}
          {/* {errors.nouserexist && <p aria-label='error'>{errors.nouserexist}</p>} */}
          {errors.password && <p aria-label='errorIP'>{errors.password}</p>}
          {/* {errors.wrongpassword && <p aria-label='error'>{errors.wrongpassword}</p>} */}
          {errors.recaptcha && <p aria-label='errorC'>{errors.recaptcha}</p>}
        </div>
        <Recaptcha 
          sitekey="6LdrRuAZAAAAAFnZZKGFxoEZ6wOe3j9zZRj88nTY"
          render="explicit"
          onloadCallback={testRecaptcha}
          verifyCallback={verifyCallback}
          expiredCallback={expiredCallback}
        />
        <button className='form-input-btn' type='submit'>
          Login
        </button>
        <span className='form-input-signup'>
          {/* Don't have an account? <Link to='/sign-up'><a href='#'>Sign up</a></Link> */}
          {/* Don't have an account? <Link to='/sign-up'>Sign up</Link> */}
          Don't have an account? <Link to='/sign-up'>Sign up</Link>
        </span>
        <span className='form-input-forgetpw'>
          {/* Forgotten your password? <Link to='/resetpw'><a href='#'>Reset here</a></Link> */}
          {/* Forgotten your password? <Link to='/resetpw'>Reset here</Link> */}
          Forgot your password? Reset <Link to='/resetpw'>here</Link>
        </span>
      </form>
    </div>
  );
};

export default FormLogin;