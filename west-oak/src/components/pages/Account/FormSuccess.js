import React, { useEffect } from 'react';
// import './Form.css';

const FormSuccess = ({ redirectCallback }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      redirectCallback()
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='form-content-middle'>
      <h1 className='form-success'>We have received your request!</h1>
    </div>
  );
};

export default FormSuccess;