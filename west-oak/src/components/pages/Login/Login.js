import React, { useState } from 'react';
// import './Form.css';
import FormLogin from './FormLogin';
import FormVerify from './FormVerify';
import FormSuccess from './FormSuccess';
import { Redirect } from 'react-router-dom';

const Login = ({setLogin}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toVerify, setToVerify] = useState(false);
  const [allUserValues, setAllUserValues] = useState({
    username: '',
    password: '',
  });
  const [isRedirect, setIsRedirect] = useState(false);
  const [isRecaptcha, setIsRecaptcha] = useState(false);

  function setLoginCallback() {
    setLogin(true);
  }

  function setRedirect() {
    setIsRedirect(true)
  }

  function setVerify() {
    setToVerify(true)
  }

  function setRecaptcha() {
    setIsRecaptcha(true)
  }

  function setUserValues(values) {
    setAllUserValues({
      username: values.username,
      password: values.password,});
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
              return <FormLogin submitForm={submitForm} toVerify={setVerify} setUserValues={setUserValues}/>
            else if (!isSubmitted && toVerify)
              return <FormVerify submitForm={submitForm} allUserValues={allUserValues}/>
            else if (isSubmitted && !isRedirect)
              return <FormSuccess loginCallback={setLoginCallback} redirectCallback={setRedirect}/>
            else
              return <Redirect to='/banking' />

          })()
        }
      </div>
    </>
  );
};

export default Login;