import { useState, useEffect } from 'react';
import axios from 'axios';

const useForm = (callback, qrCallback, setUserValues, validate, isRecaptcha) => {
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
        //axios method
        const userJson = {
          userName: values.username,
          password: values.password,
          email: values.email,
          gAuth: values.gAuth,
          qrOtp: values.qrOtp
        };

        let response = axios.post(
          "http://localhost:8080/SignUp",
          JSON.stringify(userJson)
        ).then(function(response) {
            if (response.status == 200)
            {
              // Response from back end to display QR code
              if (response.data.response[0] === "qrCode")
              {
                qrCallback(response.data.base64[0]);
                setUserValues(values)
              }
              // Response from back end if QR verification is successfully
              else if (response.data.response[0] === "qrVerified")
              // else
              {
                values.qrFlag = 0
                setErrors(validate(values));
                setIsSubmitting(true);

                if (Object.keys(errors).length === 0 && isSubmitting) {
                  callback();
                  return;
                }
              }
              // Response from backend if QR verification is unsuccessfully
              else {
               
                values.qrFlag = 1
                // setValues({qrFlag: 1});
                setErrors(validate(values))
                return
              }
              // if (response.data == "success")
              // {

              //   setErrors(validate(values));
              //   setIsSubmitting(true);

              //   if (Object.keys(errors).length === 0 && isSubmitting) {
              //     callback();
              //     return;
              //   }
              // }
            }
            else if (response.status == 250)
            {
              if (response.data == "userexist")
              {
                values.errorMsg = response.data;

                setErrors(validate(values));
                setIsSubmitting(true);

                // if (Object.keys(errors).length === 0 && isSubmitting) {
                //   callback();
                //   return;
                // }
              } else if (response.data == "emailexist") {
                values.errorMsg = response.data;
                setErrors(validate(values));
                setIsSubmitting(true);
              }
            }
        });
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;