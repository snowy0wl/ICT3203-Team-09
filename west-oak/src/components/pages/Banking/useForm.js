import { useState, useEffect } from 'react';
import axios from 'axios';

// const useForm = (callback, validate) => {
  const useForm = (callback, toVerify, setUserValues, validate) => {
  const [values, setValues] = useState({
    acct_num: 0,
    to_acct_num: '',
    amount: 0,
    memo: 'none',
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

        const transferJson = {
          acctNum: sessionStorage.getItem('acctNum'),
          toAcctNum: values.to_acct_num,
          amount: values.amount,
          memo: values.memo,
          gAuth: values.gAuth,
          qrOtp: values.qrOtp,
          userName: sessionStorage.getItem('userName')
        };

        let response = axios.post(
          "http://localhost:8080/Transfer",
          JSON.stringify(transferJson)
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
                // setErrors(validate(values));
                setIsSubmitting(true);

                if (Object.keys(errors).length === 0 && isSubmitting) {
                  callback();
                  return;
                }
              }
              else if (response.data.response[0] === "qrNotVerified")
              {
                values.errorMsg = response.data;
                setValues({qrFlag: 1})
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