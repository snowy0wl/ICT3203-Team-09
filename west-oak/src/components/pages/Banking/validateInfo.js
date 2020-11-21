import { ContactSupportOutlined } from "@material-ui/icons";

export default function validateInfo(values) {
    let errors = {};
  
    if (!values.to_acct_num.trim()) {
      errors.to_acct_num = 'Account number required';
    } else if (isNaN(values.to_acct_num)) {
      errors.to_acct_num = 'Invalid account number'
    }
    if (!values.amount) {
      errors.amount = 'Amount required';
    } else if (isNaN(values.amount)) {
      errors.amount = 'Invalid amount';
    } else if (!/^(?:[0-9]+|\d+)$/.test(values.amount.trim())) {
      errors.amount = 'Invalid amount';
    }
    if (values.errorMsg == "nouserexist") {
      errors.nouserexist = "Account does not exist."
    }
    if (values.errorMsg == "insufficientbalance") {
      errors.insufBal = "Insufficient balance!"
    }
    if (!values.qrOtp) {
      errors.qrFlag= "Invalid OTP. Please enter again."
    } else if (values.qrFlag == 1) {
      errors.qrFlag = "Invalid OTP. Please enter again."
    }
    
    return errors;
  }