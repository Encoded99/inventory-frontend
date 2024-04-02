
import { useState,useEffect } from "react";

import axios from "axios";
import {useNavigate,useLocation } from "react-router-dom"
import { useParams } from "react-router-dom";
import { useGlobal, input } from './context'

import { FaEye } from 'react-icons/fa'; 
// or

export const ForgotPassWord=()=>{
  const {prefix}=useGlobal()
 const {token}=useParams()
 const [newPassWord,setNewPassWord]=useState('')
 const [showPassWord,setShowPassWord]=useState(false)

 const [errorMessage, setErrorMessage] = useState('')
 const [success, setSuccess] =useState(null)
// const [tk,setTk]=useState('')

 
  const [key, setKey] = useState(0);

 

const data={
 newPassWord
}

const resetPassWord=async(e)=>{
e.preventDefault()
setErrorMessage('please wait...')


if(newPassWord.length<8){
  setErrorMessage('password must contain atleast 8 characters')
  return
}

 const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

 try{


  if (!token) {
    // Handle the case where token is undefined
    throw new Error('Token is undefined');
  }



  const url=`${prefix}/users/reset-password/${token}`
  const response=await axios.patch(url,data,config)
  console.log(response,'response from change password jamboline');
  if(response.status===200){
    setErrorMessage('Your password has been reset successfully')
    setSuccess(true)
  }
  
 }

 catch(err){
  setSuccess(false)
  setErrorMessage('invalid/expired token, please reset the password and try again')
 }
}


const navigate=useNavigate()
const backToHomePage=()=>{
  navigate('/')
}


 return(



  <>
   <div key={key}>

  
  <section style={{display:'flex',position:'fixed',justifyContent:'center',alignItems:'center',width:'100vw',height:'100vh'}}>

  
  
  <div className='form-container ' style={{backgroundImage:'url()'}}>
<div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',width:'',height:'auto',backgroundImage:''}}>

<strong style={{color:'black',fontWeight:'800',fontSize:'large'}}>please input a new password</strong>
<br />
<form action="">



<div className="forgot-password-input-container">
  

<input type={showPassWord?'text':'password'}  name='password' value={newPassWord} onChange={(e)=>setNewPassWord(e.target.value)}
className='forgot-password-input' />
<FaEye className='forgot-password-eye' onMouseDown={()=>setShowPassWord(true)}   onMouseUp={()=>setShowPassWord(false)}></FaEye>
</div>


<br />
<button className='submit-button btn btn-primary'  onClick={resetPassWord}><strong>SUBMIT</strong></button>
<br />
</form>
<br />


    <>
    <div>
<strong class={success===false && success!==null ?"alert alert-danger":"alert alert-success"} role="alert">{errorMessage}</strong>
</div>
    </>
 


<br />
<button className="btn btn-secondary" style={{backgroundColor:'black',color:'white',}} onClick={backToHomePage}>Click to go back to Home Page</button>
<br />
</div>
</div>
</section>
</div>
  </>
 )
}