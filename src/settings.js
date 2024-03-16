import React, { useState, useEffect,useRef, } from 'react'

import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useGlobal,  } from './context'
import {   FaEye,FaUser ,FaSignOutAlt  } from 'react-icons/fa'; 
import axios from 'axios'




import LayOut from './lay-out';




const Settings= ()=>{

 const {prefix,setLoadingMessage,loadingMessage,resetLoadingText,userName,secondName,userNo,userEmail,fetchProfile,apiError,setApiError} =useGlobal()

 const [showPassWord,setShowPassWord,]=useState(false)


 const [newPassWord,setNewPassWord]=useState('')
 const [oldPassWord,setOldPassWord]=useState('')

const navigate= useNavigate()

 const handleShowPassWord=()=>{

   if(showPassWord){
     setShowPassWord(false)
     return
   }
  setShowPassWord(true)
 }


 const data={
  
  oldPassWord,
  newPassWord,
}





const handleChangePassWord=async(e)=>{
 e.preventDefault()
 setLoadingMessage('please wait....')
 if(newPassWord.length<8){
  setApiError(true)
   setLoadingMessage('password must contain atleast 8 characters')
   resetLoadingText()
   return
 }


 const config={
   headers:{
     'Content-Type': 'application/json',
    //  Authorization:`Bearer ${token}`
 },
 withCredentials: true,

 }


 

try{

 const url =`${prefix}/users/change-password`

const response= await axios.patch(url,data,config)

if(response.status===200){

setApiError(false)
 setLoadingMessage('Password reset successfully')
 
    setNewPassWord('')
    setOldPassWord('')

}

if(response.status===401){
  setApiError(true)
 setLoadingMessage('Invalid Old Password')

}

}


catch(error){

  setApiError(true)


  if (error.response) {
   


   
    setLoadingMessage(error.response.data.message)
  } else if (error.request) {
   
    setLoadingMessage('Error connecting to the server')

  } else {
   
    setLoadingMessage(error.message)
  }
  
  
   




 
 setNewPassWord('')
 setOldPassWord('')

}

finally{
 resetLoadingText()
}



}




useEffect(()=>{

 fetchProfile()

},[])



const logOut=async()=>{

  //alert('about to log out')
  
   // setIsPreLoaderRunning(true)
     const url=`${prefix}/users/log-out`;
  
     const config = {
      headers: {
      'Content-Type': 'application/json',
      },
    
    
      
    
    };
    
    
    
    
    
      try{
    
    
    
         const response= await axios.post(url,config,{  withCredentials: true,})
       //  setIsPreLoaderRunning(false)
  
      console.log(response,'log out response')
    if (response.status===200){
    
    navigate('/')
      
    }
     
      }
    
      catch(err){
        console.log(err)
      }
   
  
  
  
  
    
  
  
  
  }
  
  
  
  
  
  
  
  








 return(
  <>
  
  <LayOut>
    <main className='settings-container'>


    <div className='sign-out-container' onClick={logOut}>
    <FaSignOutAlt   style={{cursor:'pointer',color:'red'}}></FaSignOutAlt> <div> Log out </div> 

    </div>
  <p style={{fontSize:'3em',textAlign:'center',marginTop:'0.8em 0'}}>Settings </p>

  <div className='profile-container'>

   <div className='profile-circle'>

    <FaUser  className='fa-user'></FaUser>


   </div>

  </div>


<section  className='profile-details-container'>

 <div className='profile-row'>
  <div className='row-content'>
  <label htmlFor="firstName">First Name</label>
<input type="text"   value={userName}   className='form-control profile-input'  />
  </div>

  <div className='row-content'>
  <label htmlFor="firstName">Last Name</label>
<input type="text" value={secondName}  className='form-control profile-input'  />
  </div>
 
 </div>


 <div className='profile-row'>
  <div className='row-content'>
  <label htmlFor="firstName">Email</label>
<input type="text"    value={userEmail}  className='form-control profile-input'  />
  </div>

  <div className='row-content'>
  <label htmlFor="firstName">Telephone</label>
<input type="text"  value={userNo} className='form-control profile-input'  />
  </div>
 
 </div>


<div  className='password-container'>
<p style={{textAlign:'center',fontWeight:'600',fontSize:"2em"}}>Change Password</p>

<p style={{textAlign:'center',fontWeight:'400',fontSize:"1.0em"}}>Fill up the required information</p>

<label className='legend form-label'   htmlFor="">Old password</label>
  
  <div  className='settings-eye-password-container ' >
  <input  type={showPassWord?'text':'password'}  name='password' value={oldPassWord}   onChange={(e)=>setOldPassWord(e.target.value)}    className='settings-password form-control' />
  <div className='eye'>
  <FaEye  onClick={handleShowPassWord}></FaEye>
   </div>
  </div>

  <br />

  <label className='legend form-label'   htmlFor="">New password</label>
  
  <div  className='settings-eye-password-container' >
  <input  type={showPassWord?'text':'password'}  name='password' value={newPassWord}   onChange={(e)=>setNewPassWord(e.target.value)}   className='settings-password form-control' />
  <div className='eye'>
  <FaEye    onClick={handleShowPassWord}></FaEye>

  </div>

  
  </div>

<div className='submit-password-btn-container'>
<button  className='btn btn-primary submit-password-btn' onClick={handleChangePassWord}>Save Changes</button>

</div>



<div className={apiError===true?'alert alert-danger':apiError===false?'alert alert success':''}>{loadingMessage}</div>


</div>







</section>


</main>
  </LayOut>
  
  </>
 )
}


export default Settings