import React, { useEffect } from 'react';
// import '../../Form.css';

const FormSuccess = ({redirectCallback}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      redirectCallback()
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='form-content-middle'>
      <h1 className='form-success'>Account created! Redirecting..</h1>
      {/* <img className='form-img-2' src='img/img-3.svg' alt='success-image' /> */}
    </div>
  );
};

export default FormSuccess;