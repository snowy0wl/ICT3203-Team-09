import React, { useEffect } from 'react';
import validate from './validateInfo';
import useForm from './useForm';
import axios from 'axios';
import { useState } from 'react';

const FormAccount = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );

  const [disableFields, updateDisableFields] = useState(true);

  function getProfileValues() {
    //axios method
    const userJson = {
      userName: sessionStorage.getItem('userName')
    };

    let response = axios.post(
      "http://localhost:8080/Profile",
      JSON.stringify(userJson)
    ).then(function(response) {
        if (response.status == 250)
        {
          values.errorMsg = response.data;
        }
        else if (response.status == 200)
        {
          // Information from server comes back
          // Do whatever

          values.email = response.data.email;
          values.username = sessionStorage.getItem('userName');
          updateDisableFields(false);
        }
    });
  }
  if (values.email == "") {
    getProfileValues();
  }
  
  return (
    <div className='form-content-middle'>
      {/* {disableFields ? <Loader type="Circles" color="#0088ff" height={500} width={500}/> : null} */}
      <form onSubmit={handleSubmit} className='form' noValidate>
        <h1>
          Edit Account Details
        </h1>
        {/* <div className='form-inputs'>
          <label className='form-label'>Username</label>
          <input
            className='form-input'
            type='text'
            name='username'
            placeholder='Enter your username'
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
          {errors.userExist && <p>{errors.userExist}</p>}
        </div> */}
        <div className='form-inputs'>
          <label className='form-label'>Email</label>
          <input
            className='form-input'
            type='email'
            name='email'
            placeholder='Enter your email'
            value={values.email}
            onChange={handleChange}
            disabled={disableFields}
          />
          {errors.email && <p>{errors.email}</p>}
          {errors.emailExist && <p>{errors.emailExist}</p>}
        </div>
        {/* <div className='form-inputs'>
          <label className='form-label'>Password</label>
          <input
            className='form-input'
            type='password'
            name='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Confirm Password</label>
          <input
            className='form-input'
            type='password'
            name='password2'
            placeholder='Confirm your password'
            value={values.password2}
            onChange={handleChange}
          />
          {errors.password2 && <p>{errors.password2}</p>}
        </div> */}
        <button className='form-input-btn' type='submit'>
          Save
        </button>
      </form>
    </div>
  );
};

export default FormAccount;