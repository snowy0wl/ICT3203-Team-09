export default function validateInfo(values) {
    let errors = {};
  
    if (!values.username.trim()) {
      errors.username = 'Username required';
    }
    else if (!/^(?:[A-Za-z]+|\d+)$/.test(values.username.trim())) {
      errors.username = 'Username is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password needs to be 6 characters or more';
    }
    if (!values.password2) {
        errors.password2 = 'Password is required';
    } else if (values.password2 !== values.password) {
        errors.password2 = 'Passwords do not match';
    }
    if (values.errorMsg == "nouserexist") {
      errors.nouserexist = "Username does not exist.";
    }
    if (!values.qrOtp) {
      errors.qrFlag= "Invalid OTP. Please enter again."
    } else if (values.qrFlag == 1) {
      errors.qrFlag = "Invalid OTP. Please enter again."
    }
    return errors;
  }