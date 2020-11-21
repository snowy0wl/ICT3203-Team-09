const hasNumber = value => {
  return new RegExp(/[0-9]/).test(value);
}
const hasMixed = value => {
  return new RegExp(/[a-z]/).test(value) &&
           new RegExp(/[A-Z]/).test(value);
}
const hasSpecial = value => {
  return new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
}

export default function validateInfo(values) {
    let errors = {};

    if (!values.username.trim()) {
      errors.username = 'Username required';
    }
    else if (!/^(?:[A-Za-z]+|\d+)$/.test(values.username.trim())) {
      errors.username = 'Username is invalid';
    }
  
    if (!values.email) {
      errors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password needs to be 8 characters or more';
    } 
    else if (values.password.length > 64) {
      errors.password = 'Password can only be a maximum of 64 characters';
    } 
    else if (!hasMixed(values.password)) {
      errors.password = 'Please include at least one upper case and one lower case letter';
    }
    else if (!hasNumber(values.password)) {
      errors.password = 'Please include at least one number';
    }
        else if (!hasSpecial(values.password)) {
      errors.password = 'Please include at least one special character';
    }   
    if (!values.password2) {
      errors.password2 = 'Password is required';
    } else if (values.password2 !== values.password) {
      errors.password2 = 'Passwords do not match';
    }
    if (values.errorMsg == "userexist") {
      errors.userExist = 'Username already exists.';
    }
    if (values.errorMsg == "emailexist") {
      errors.emailExist = "Email already exists."
    }
    if (!values.qrOtp) {
      errors.qrFlag= "Invalid OTP. Please enter again."
    } else if (values.qrFlag == 1) {
      errors.qrFlag = "Invalid OTP. Please enter again."
    }

    if (values.recaptcha == 0) {
      errors.recaptcha = "Please complete ReCaptcha."
    }

    return errors;
  }