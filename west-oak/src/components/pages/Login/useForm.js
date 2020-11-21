import { useState, useEffect } from 'react';
import axios from 'axios';

const useForm = (callback, toVerify, setUserValues, validate, isRecaptcha) => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    errorMsg: '',
    qrOtp: '',
    qrFlag: 0,
    gAuth: 0,
    recaptcha: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Reset error messages to allow for revalidation
    values.errorMsg = '';
    values.qrFlag = 0;
    values.recaptcha = isRecaptcha

    setErrors(validate(values));
    setIsSubmitting(true);
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        
        const userJson = {
          userName: values.username,
          password: values.password,
          gAuth: values.gAuth,
          qrOtp: values.qrOtp,
        };


        let response = axios.post(
          "http://localhost:8080/Login",
          JSON.stringify(userJson)
        ).then(function(response) {
            if (response.status == 250)
            {
              values.errorMsg = response.data;

              setErrors(validate(values));
              // setIsSubmitting(true);

              // if (Object.keys(errors).length === 0 && isSubmitting) {
              //   callback();
              //   return;
              // }
            }
            else if (response.status == 200)
            {
              if (response.data.response[0] === "qrVerified")
              {
                setValues({qrFlag: 0});
                setErrors(validate(values));
                setIsSubmitting(true);

                if (Object.keys(errors).length === 0 && isSubmitting) {
                  // sessionStorage.setItem('userName', values.username);
                  sessionStorage.setItem('userName', response.data.userName[0])
                  sessionStorage.setItem('acctNum', response.data.acctNum[0])
                  callback();
                  return;
                }
              }
              else if (response.data.response[0] === "qrNotVerified")
              {
                setValues({qrFlag: 1});
                setErrors(validate(values))
                return
              }

              setUserValues(values)
              toVerify()
              
              // Information from server comes back
              // Do whatever

              // Stores username in session for us to identify the 
              // logged in user
              
              // sessionStorage.setItem('userName', values.username);

              // callback();

            }
        });
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;