import React, { useState } from 'react';
import FormReset from './FormReset';
import FormSuccess from './FormSuccess';
import FormVerify from './FormVerify';
import { Redirect } from 'react-router-dom';

const ResetPw = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toVerify, setToVerify] = useState(false);
  const [allUserValues, setAllUserValues] = useState({
    username: '',
    password: '',
  });
  const [isRedirect, setIsRedirect] = useState(false);

  function setVerify() {
    setToVerify(true)
  }

  function setUserValues(values) {
    setAllUserValues({
      username: values.username,
      password: values.password,
      password2: values.password2,        
    });
  }

  function setRedirect() {
    setIsRedirect(true)
  }

  function submitForm() {
    setIsSubmitted(true);
  }

  return (
    <>
      <div className='form-container'>
        {
          (() => {
            if (sessionStorage.getItem('userName') != null && toVerify == false)
              return <Redirect to="/banking" />
            if (!isSubmitted && !toVerify)
              return <FormReset submitForm={submitForm} toVerify={setVerify} setUserValues={setUserValues}/>
            else if (!isSubmitted && toVerify)
              return <FormVerify submitForm={submitForm} allUserValues={allUserValues}/>
            else if (isSubmitted && !isRedirect)
              return <FormSuccess redirectCallback={setRedirect}/>
            else
              return <Redirect to='/home' />

          })()
        }
      </div>
    </>
  );
};

export default ResetPw;