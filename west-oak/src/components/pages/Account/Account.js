import React, { useState } from 'react';
// import './Form.css';
import FormAccount from './FormAccount';
import FormSuccess from './FormSuccess';
import { Redirect } from 'react-router-dom';

const Account = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);

  function submitForm() {
    setIsSubmitted(true);
  }

  function setRedirect() {
    setIsRedirect(true)
  }
  return (
    <>
      <div className='form-container'>
        
        {
          (() => {
            if (sessionStorage.getItem('userName') == null)
              return <Redirect to="/" />
            if (!isSubmitted)
              return <FormAccount submitForm={submitForm} />
            // else if (!isSubmitted && toVerify)
            //   return <FormVerify submitForm={submitForm} allUserValues={allUserValues} />
            else if (!isRedirect)
              return <FormSuccess redirectCallback={setRedirect}/>
            else
              return <Redirect to='/banking' />
          })()
        }

      </div>
    </>
  );
};

export default Account;