export default function validateInfo(values) {
  let errors = {};

  if (!values.username.trim()) {
    errors.username = 'Username required';
  }
  else if (!/^(?:[A-Za-z]+|\d+)$/.test(values.username.trim())) {
    errors.username = 'Username / Password is incorrect';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password needs to be 8 characters or more';
  }
  // if (values.errorMsg == "nouserexist") {
  //   errors.nouserexist = "Username does not exist.";
  // }
  if (values.errorMsg == "wrongpassword") {
    errors.password = "Username / Password is incorrect";
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