import React, { useState, useEffect,useRef, } from 'react'

import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useGlobal,  } from './context'
import {   FaEye,FaUser ,FaSignOutAlt,FaEyeSlash ,FaTimes } from 'react-icons/fa'; 
import axios from 'axios'
import { Vortex,RotatingLines } from 'react-loader-spinner';
import { Response } from './lay-out';


import LayOut from './lay-out';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';






const Settings= ()=>{

 const {prefix,setLoadingMessage,loadingMessage,resetLoadingText,userName,secondName,userNo,userEmail,userRole,fetchProfile,apiError,setApiError} =useGlobal()

 
 const [showOldPassWord,setShowOldPassWord,]=useState(false)
 const [showNewPassWord,setShowNewPassWord,]=useState(false)

 const [newPassWord,setNewPassWord]=useState('')
 const [oldPassWord,setOldPassWord]=useState('')
 const [instance,setInstance]=useState('profile')
 const [sourceData,setSourceData]=useState([])
 const [isSpinning,setIsSpinning]=useState(false)

const navigate= useNavigate()

 const handleShowPassWord=(instance)=>{

  if (instance==='old'){
    if(showOldPassWord){
      setShowOldPassWord(false)
     
    }
 
    else{
     setShowOldPassWord(true)
    }

  }

  if (instance==='new'){
    if(showNewPassWord){
      setShowNewPassWord(false)
     
    }
 
    else{
     setShowNewPassWord(true)
    }

  }

 
  
 }


 const data={
  
  oldPassWord,
  newPassWord,
}





const handleChangePassWord=async(e)=>{
 e.preventDefault()
 
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


 
setIsSpinning(true)
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
 setIsSpinning(false)
}



}








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
  
  
  
  
  const handleProfileSubmit=async()=>{


if (sourceData.length===0){
  setLoadingMessage('Empty field,no changes made')

  return
}

setIsSpinning(true)
    try{

     

      const config={
        headers:{
         'Content-Type': 'application/json',
       },
       withCredentials: true,
       }


      const url= `${prefix}/users/user-update-profile`
      const response= await axios.patch(url,sourceData,config)
console.log(response,'george')
setApiError(false)
setLoadingMessage('profile update sucessfully')

    }

    catch(err){
      setApiError(true)
      setLoadingMessage('error processing request, try again')
      console.log(err,'george')
    }
finally{
  setIsSpinning(false)
}
    

  }

  const deleteData={
    password:oldPassWord
  }
  
  
  


const handleDelete=async()=>{
  setIsSpinning(true)

  try{

    const url = `${prefix}/users/user-delete-profile`
    const response= await axios.post (url,deleteData,{withCredentials:true})

    setApiError(false)
    setLoadingMessage('')

    navigate('/')

  }

  catch(err){
    console.log(err.response.data,'error')
    setApiError(true)

    if (err.response.data==='Invalid password'){
      setLoadingMessage('Incorrect Password')

      return
    }

    if (err.response.data==='you are not allowed to perform this action, you can either  delete the whole store in general or tranfer ownership'){
      setLoadingMessage('you are not allowed to perform this action, you can either  delete the whole store in general or tranfer ownership')

      return
    }



    setLoadingMessage('error processing request, try again')
  }

finally{
  setIsSpinning(false)
}


}





 return(
  <>
  
  <LayOut>

    <main className='settings-container'>


 
 

  



<article className='profile-details-info-container'>

  <section className='all-details-container'>

    <h3 className='font-heading username-profile-heading'>{userName} {secondName}</h3>

    
  <div className='profile-container'>

<div className='profile-circle'>

 <FaUser  className='fa-user'></FaUser>


</div>

</div>
<div style={{margin:'2% 0'}}>
<div>Telephone:  <strong>{userNo} </strong> </div>
<div>Email: <strong>{userEmail} </strong> </div>
<div>Role:  <strong>{userRole} </strong> </div>
</div>
<button className='btn btn-secondary' onClick={logOut}> <FaSignOutAlt ></FaSignOutAlt>  Sign Out</button>


  </section>



  <section  className='profile-details-container'>




<section className='profile-details-first-container'>


{
  instance==='profile' && (
    <>
    <div  className='profile-first-section font-heading' >Edit Profile </div>
    </>
  )
}


{
  instance==='settings' && (
    <>
    <div  className='profile-first-section font-heading' >Change Password</div>
    </>
  )
}

{
  instance==='delete' && (
    <>
    <div  className='profile-first-section font-heading' >Deactivate Account</div>
    </>
  )
}


<div style={{width:'100%',height:"30%"}}>
<div className='profile-link-container'>
   <div className={instance==='profile'?'profile-link':'sub-profile-link'} onClick={(()=>setInstance('profile'))}>Profile</div>
   <div className={instance==='settings'?'profile-link':'sub-profile-link'} onClick={(()=>setInstance('settings'))}>Change Password</div>
   <div onClick={(()=>setInstance('delete'))} className={instance==='delete'?'profile-link':'sub-profile-link'} >Deactivate Account</div>



</div>
</div>


</section>












{
  instance==='profile' && (
    <>
    
    <section className='profile-partition'>


 <div className='profile-row'>

 <div htmlFor="firstName" className='row-content'>First Name</div>
 <div htmlFor="firstName" className='row-content'>Last Name</div>

 </div>

 
 <div className='profile-row' style={{marginTop:'0%'}}>
 <input type="text"  placeholder={userName}  onChange={(e)=>{
  setSourceData((prev)=>({...prev,firstName:e.target.value}))
 }}   className='form-control row-content'  />
 <input type="text"   placeholder={secondName}   onChange={(e)=>{
  setSourceData((prev)=>({...prev,lastName:e.target.value}))
 }}  className='form-control row-content'  />

 </div>





 <div className='profile-row'>

 <div htmlFor="firstName" className='row-content'>Telephone</div>
 <div htmlFor="firstName" className='row-content'>Email</div>

 </div>

 
 <div className='profile-row' style={{marginTop:'0%'}}>
 <input type="text"   placeholder={userNo}  onChange={(e)=>{
  setSourceData((prev)=>({...prev,telephone:e.target.value}))
 }}   className='form-control row-content'  />
 <input type="text"   placeholder={userEmail} onChange={(e)=>{
  setSourceData((prev)=>({...prev,email:e.target.value}))
 }}   className='form-control row-content'  />

 </div>


 

<button className='btn btn-primary submit-profile-btn' onClick={handleProfileSubmit}>

{
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SUBMIT   
      </>
    )
  }




</button>

{
  loadingMessage!=='' && (
    
    (
      <>
      <Response></Response>

      </>
    )
  )
}





  



<br />


</section>
    
    </>
  )
}






{
  instance==='settings' && (
    <>
    <section className='profile-partition'>


<div className='profile-row'>

<div htmlFor="firstName" className='row-content'>Old Password</div>
<div htmlFor="firstName" className='row-content'>New Password</div>

</div>


<div className='profile-row' style={{marginTop:'0%'}} >
<div  className='settings-eye-password-container ' >
 <input  type={(showOldPassWord && oldPassWord)?'text':'password'}  name='password' value={oldPassWord}   onChange={(e)=>setOldPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>
 {
     !showOldPassWord ? (
       <>
      <FaEye  onClick={()=>handleShowPassWord('old')}></FaEye>  
       </>
     ):(
       <>
       <FaEyeSlash onClick={()=>handleShowPassWord('old')}></FaEyeSlash>
       </>
     )
   }
  </div>
 </div>


 <div  className='settings-eye-password-container ' >
 <input  type={(showNewPassWord && newPassWord)?'text':'password'}  name='password' value={newPassWord}   onChange={(e)=>setNewPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>

   {
     !showNewPassWord ? (
       <>
      <FaEye  onClick={()=>handleShowPassWord('new')}></FaEye>  
       </>
     ):(
       <>
       <FaEyeSlash onClick={()=>handleShowPassWord('new')}></FaEyeSlash>
       </>
     )
   }

  </div>
 </div>


</div>










<button className='btn btn-primary submit-profile-btn' onClick={handleChangePassWord}>
{
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SUBMIT   
      </>
    )
  }
</button>
{
  loadingMessage!=='' && (
    
    (
      <>
      <Response></Response>

      </>
    )
  )
}


<br />
</section>
    </>
  )
}



{
  instance==='delete' && (
    <>
    <section className='profile-partition'>


<div className='delete-row' >

<div htmlFor="firstName" className='delete-content-title'>Input Password</div>
<div  className='delete-content ' >
 <input  type={(showOldPassWord && oldPassWord)?'text':'password'}  name='password' value={oldPassWord}   onChange={(e)=>setOldPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>
 {
     !showOldPassWord ? (
       <>
      <FaEye  onClick={()=>handleShowPassWord('old')}></FaEye>  
       </>
     ):(
       <>
       <FaEyeSlash onClick={()=>handleShowPassWord('old')}></FaEyeSlash>
       </>
     )
   }
  </div>
 </div>

</div>











<button className='btn btn-primary submit-profile-btn danger-shop-btn' onClick={handleDelete}>

{
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SUBMIT   
      </>
    )
  }







</button>
{
  loadingMessage!=='' && (
    
    (
      <>
      <Response></Response>

      </>
    )
  )
}


<br />
</section>
    </>
  )
}










 







</section>











</article>








</main>
  </LayOut>
  
  </>
 )
}


export default Settings