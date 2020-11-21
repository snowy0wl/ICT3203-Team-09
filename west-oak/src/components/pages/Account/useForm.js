import { useState, useEffect } from 'react';
import axios from 'axios';

const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    errorMsg: ''
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

    //Reset errorMsg state to previous leak from previous sumission
    values.errorMsg = '';

    setErrors(validate(values));
    setIsSubmitting(true);
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        //axios method
        const userJson = {
          userName: values.username,
          email: values.email
        };

        let response = axios.post(
          "http://localhost:8080/Editprofile",
          JSON.stringify(userJson)
        ).then(function(response) {
            if (response.status == 200)
            {
              if (response.data == "success")
              {

                setErrors(validate(values));
                setIsSubmitting(true);

                callback();
                return

              }
            }
            else if (response.status == 250)
            {
              if (response.data == "emailexist")
              {
                values.errorMsg = response.data;

                setErrors(validate(values));
                setIsSubmitting(true);
              }
            }
            else if (response.status == 400)
            {
              if (response.data == "sqlerror")
              {
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