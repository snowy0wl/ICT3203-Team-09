import React, { useState } from 'react';
import validate from './validateInfo';
import useForm from './useForm';
import axios from 'axios';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const FormBalance = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );

    const [selectedTab, setSelectedTab] = useState(0);
    const [balance, setBalance] = useState(0);

    const handleChange2 = (event, newValue) => {
        setSelectedTab(newValue);
    };

    function setStateBalance(balance) {
        setBalance(balance)
    }

    function getBalanceValues() {
        //axios method
        const accountJson = {
          userName: sessionStorage.getItem('userName'),
          acctNum: sessionStorage.getItem('acctNum'),
        };
   
        let response = axios.post(
          "http://localhost:8080/Balance",
          JSON.stringify(accountJson)
        ).then(function(response) {
            if (response.status == 250)
            {
              values.errorMsg = response.data;
            }
            else if (response.status == 200)
            {
              // Information from server comes back
              // Do whatever

                // values.username = sessionStorage.getItem('userName'); 
                // values.balance = response.data.balance[0];
                setStateBalance(response.data.balance[0]);
            }
        });
      }

      getBalanceValues();



      /*
        ---------------- Accordion CSS --------------------
      */
    const BlackTypography = withStyles({
        root: {
            color: '#1c2237'
        }
    })(Typography);

    const useStyles = makeStyles((theme) => ({
        heading: {
          fontSize: theme.typography.pxToRem(15),
          fontStyle: 'italic',
          flexBasis: '70%',
          flexShrink: 0
        },

        secondaryHeading: {
          fontSize: theme.typography.pxToRem(15),
          color: theme.palette.text.secondary
        }
      }));

    const classes = useStyles();

    // --------------------------------------------------




    return (
        <div className='form'>
          <h1>Balance</h1>
          <div className='form-inputs'>
              <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <BlackTypography className={classes.heading} variant="h4">Total</BlackTypography>
                      <BlackTypography className={classes.secondaryHeading} variant="h4" aria-label="balance-total">SGD {balance}</BlackTypography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <BlackTypography className={classes.heading} variant="h4">Savings Account ({sessionStorage.getItem('acctNum')})</BlackTypography>
                      <BlackTypography className={classes.secondaryHeading} variant="h4" aria-label="balance-savings">SGD {balance}</BlackTypography>
                  </AccordionDetails>
                  {/* <AccordionDetails>
                      <BlackTypography className={classes.heading} variant="h4">Joint Savings Account</BlackTypography>
                      <BlackTypography className={classes.secondaryHeading} variant="h4">SGD 0.00</BlackTypography>
                  </AccordionDetails> */}
              </Accordion>
          </div>
        </div>
    );
};

export default FormBalance;