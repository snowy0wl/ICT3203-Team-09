import React, { useState } from 'react';
// import '../../Form.css';
import FormSignup from './FormSignup';
import FormSuccess from './FormSuccess';
import FormQR from './FormQR';
import { Redirect } from 'react-router-dom';

const SignUp = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isQRCode, setIsQRCode] = useState(false);
  const [isBase64, setIsBase64] = useState("");
  const [allUserValues, setAllUserValues] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [isRedirect, setIsRedirect] = useState(false);

  function submitForm() {
    setIsSubmitted(true);
  }

  function setQRCode(base64) {
    setIsQRCode(true)
    setIsBase64(base64)
  }

  function setRedirect() {
    setIsRedirect(true)
  }

  function setUserValues(values) {
    setAllUserValues({
      username: values.username,
      email: values.email,
      password: values.password,
      password2: values.password2});
  }

  return (
    <>
      <div className='form-container'>
        {/* <div className='form-content-left'>
          <img className='form-img' src='img/img-2.svg' alt='spaceship' />
        </div> */}

        {
          (() => {
            if (sessionStorage.getItem('userName') != null && isQRCode == false)
              return <Redirect to="/banking" />
            if (!isSubmitted && !isQRCode)
              return <FormSignup submitForm={submitForm} qRCode={setQRCode} setUserValues={setUserValues}/>
            else if (!isSubmitted && isQRCode)
              return <FormQR submitForm={submitForm} base64={isBase64} allUserValues={allUserValues} />
            else if (isSubmitted && !isRedirect)
              return <FormSuccess redirectCallback={setRedirect}/>
            else
              return <Redirect to='/home' />
          })()
        }

        {/* {!isSubmitted ? (
          <FormSignup submitForm={submitForm} />
        ) : (
          <FormSuccess />
        )} */}
      </div>
    </>
  );
};

export default SignUp;