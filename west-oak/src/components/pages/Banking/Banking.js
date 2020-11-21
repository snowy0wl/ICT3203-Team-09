import React, { useState } from 'react';
import { Tabs, Tab, AppBar } from "@material-ui/core";
import FormBalance from './FormBalance';
import FormTransfer from './FormTransfer';
import FormVerify from './FormVerify';
import FormTransferSuccess from './FormSuccess';
import { Redirect } from 'react-router-dom';

const Banking = () => {

  const [selectedTab, setSelectedTab] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toVerify, setToVerify] = useState(false);
  const [allUserValues, setAllUserValues] = useState({
    acct_num: 0,
    to_acct_num: 0,
    amount: 0,
    memo: 'none'
  })
  const [isRedirect, setIsRedirect] = useState(false);

  function setVerify() {
    setToVerify(true)
  }

  function setRedirect() {
    setIsRedirect(true)
  }

  function setUserValues(values) {
    setAllUserValues({
      acct_num: values.acct_num,
      to_acct_num: values.to_acct_num,
      amount: values.amount,
      memo: values.memo,
    })
  }

  function submitForm() {
    setIsSubmitted(true);
  }

  const handleChange2 = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Main view for banking page
  var main = (
    <div>
      <AppBar style={{background: '#1c2237'}} position="static">
        <Tabs value={selectedTab} onChange={handleChange2} centered>
          <Tab label="View Balance" />
          <Tab label="Transfer Funds" />
        </Tabs>
      </AppBar>
      {selectedTab === 0 && <FormBalance />}
      {selectedTab === 1 && <FormTransfer submitForm={submitForm} toVerify={setVerify} setUserValues={setUserValues}/>}
    </div>
  )

  return (
    <>
      <div className='form-container'>
        <div className='form-content-middle'>
          {
            (() => {
              if (sessionStorage.getItem('userName') == null)
                return <Redirect to="/" />
              if (!isSubmitted && !toVerify)
                return main
              else if (!isSubmitted && toVerify)
                return <FormVerify submitForm={submitForm} allUserValues={allUserValues} />
              else if (isSubmitted && !isRedirect)
                return <FormTransferSuccess redirectCallback={setRedirect}/>
              else
                return <Redirect to='/home' />
            })()
          }
        </div>
      </div>
    </>
  );
};

export default Banking;