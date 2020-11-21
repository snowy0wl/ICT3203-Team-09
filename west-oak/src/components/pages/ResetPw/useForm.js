import { useState, useEffect } from 'react';
import axios from 'axios';

const useForm = (callback, toVerify, setUserValues, validate) => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    errorMsg: '',
    qrOtp: '',
    qrFlag: 0,
    gAuth: 0,
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

    setErrors(validate(values));
    setIsSubmitting(true);
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        
        //axios method
        const userJson = {
          userName: values.username,
          password: values.password,
          gAuth: values.gAuth,
          qrOtp: values.qrOtp,
        };


        let response = axios.post(
          "http://localhost:8080/Reset",
          JSON.stringify(userJson)
        ).then(function(response) {
            if (response.status == 250)
            {
              values.errorMsg = response.data;

              setErrors(validate(values));

            }
            else if (response.status == 200)
            {
              if (response.data.response[0] === "qrVerified")
              {
                setValues({qrFlag: 0});
                setErrors(validate(values));
                setIsSubmitting(true);

                if (Object.keys(errors).length === 0 && isSubmitting) {
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
            }
        });
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;