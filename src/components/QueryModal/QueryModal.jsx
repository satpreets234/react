import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { validateFormFields } from '../../common/commonFunctions';
import {CFormText} from "@coreui/react";
import { toast } from 'react-toastify';
import { postData } from '../../config/axios-config';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../redux/actions';

function QueryModal({isOpen,handleToggle}) {
    const [queryInputs,setQueryInputs]=useState({name:'',email:'',query:'',errors:{name:'',email:'',query:''}})
    const loading = useSelector((state) => state.userManagementReducer.loading);
    
    const handleOnErrors = (fieldName, fieldValue) => {
        setQueryInputs((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            [fieldName]: fieldValue,
          },
        }));
      };
    const queryFormValiadte = () =>{
        const {name,email,query}=queryInputs;
        const nameIsValid=validateFormFields('name',name);
        const emailIsValid=validateFormFields('email',email);
        const queryIsValid=validateFormFields('name',query);
        if(nameIsValid){    
            handleOnErrors("name",nameIsValid.message)
        }
        if(emailIsValid){
            handleOnErrors("email",emailIsValid.message)
        }
        if(queryIsValid){
            handleOnErrors("query",queryIsValid.message)
        }
        return (
            nameIsValid.status &&
            emailIsValid.status &&
            queryIsValid.status
          );
    }
    const dispatch=useDispatch();
    const [submit,setSubmit]=useState(false)

    const handleSubmit =async () => {
        setSubmit(true)
      // Handle form submission
      const isQueryFormFieldsValid= queryFormValiadte();
      if(!isQueryFormFieldsValid){
      console.log("You may enter wrong value, please try again");
      }else{
         try {
            dispatch(setLoader(true))
            const newQuery =await postData('user/query',queryInputs);
            console.log(newQuery);
            handleToggle()
            dispatch(setLoader(false))
            toast.success("Query sent successfully !")
         } catch (error) {
            toast.error(error.message)
         }   
      }
    };
    return (
        <div>
             {isOpen ? (
        <IconButton onClick={handleToggle}>
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton style={{ borderRadius: "48%",backgroundColor: "grey",width: "4%"}} onClick={handleToggle}>
        ?

        </IconButton>
      )}
      <Dialog open={isOpen} onClose={handleToggle}>
      <CloseIcon onClick={handleToggle}/>
            <DialogTitle>Query Box</DialogTitle>
            <DialogContent>
                <TextField onChange={(e)=>{setQueryInputs({...queryInputs,name:e.target.value})
            queryFormValiadte()}} label="Name"  />
                <CFormText className="help-block-error">
                      {submit && queryInputs.errors.name && queryInputs.errors.name}
                </CFormText>
                <TextField onChange={(e)=>{setQueryInputs({...queryInputs,email:e.target.value})
            queryFormValiadte()}} label="Email"  />
                <CFormText className="help-block-error">
                      {submit && queryInputs.errors.email && queryInputs.errors.email}
                </CFormText>
                <TextField onChange={(e)=>{setQueryInputs({...queryInputs,query:e.target.value})
            queryFormValiadte()}} label="Message" fullWidth multiline />
                <CFormText className="help-block-error">
                      {submit && queryInputs.errors.query && queryInputs.errors.query}
                </CFormText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                {loading? <CircularProgress style={{color:'white'}}  size={28} /> : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default QueryModal