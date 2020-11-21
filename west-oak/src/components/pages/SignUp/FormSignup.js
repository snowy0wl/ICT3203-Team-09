import React, { useState } from 'react';
import validate from './validateInfo';
import useForm from './useForm';
import Recaptcha from 'react-recaptcha';
import { Link } from 'react-router-dom';

const FormSignup = ({ submitForm, qRCode, setUserValues }) => {
  const [isRecaptcha, setIsRecaptcha] = useState(0)
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    qRCode,
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
          Get started with us today! Create your account by filling out the
          information below.
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
          {errors.username && <p aria-label='errorIU'>{errors.username}</p>}
          {errors.userExist && <p aria-label='exist-username'>{errors.userExist}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Email</label>
          <input
            aria-label='email'
            className='form-input'
            type='email'
            name='email'
            placeholder='Enter your email'
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p aria-label='errorIE'>{errors.email}</p>}
          {errors.emailExist && <p aria-label='exist-email'>{errors.emailExist}</p>}
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
          {errors.password && <p aria-label='errorIP'>{errors.password}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Confirm Password</label>
          <input
            aria-label='password2'
            className='form-input'
            type='password'
            name='password2'
            placeholder='Confirm your password'
            value={values.password2}
            onChange={handleChange}
          />
          {errors.password2 && <p aria-label='errorICP'>{errors.password2}</p>}
          {errors.recaptcha && <p aria-label='errorC'>{errors.recaptcha}</p>}
        </div>
        <Recaptcha 
          sitekey="6LdrRuAZAAAAAFnZZKGFxoEZ6wOe3j9zZRj88nTY"
          render="explicit"
          name="recaptcha"
          onloadCallback={testRecaptcha}
          verifyCallback={verifyCallback}
          expiredCallback={expiredCallback}
        />
        <button className='form-input-btn' type='submit'>
          Sign up
        </button>
        <span className='form-input-login'>
          {/* Already have an account? Login <a href='/login'>here</a> */}
          Already have an account? Login <Link to='/login'>here</Link>
        </span>
      </form>
    </div>
  );
};

export default FormSignup;