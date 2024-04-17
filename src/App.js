         
     
import React, { useState, useEffect } from 'react'
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaSearch, FaPhone, FaTimes, FaEnvelope, FaFacebook, FaTwitter, FaInstagram,  FaEye,FaUser , FaCloud, FaPlug } from 'react-icons/fa'; 
import axios from 'axios'




//import {cloth} from './filter'
//import { cl } from './context'
import {LoadingSpinner} from './spinner'
























function App() {

const {prefix,loadingMessage,setLoadingMessage,resetLoadingText,apiError,setApiError}= useGlobal()
  const [isSignInHidden, setIsSignInHidden] = useState(false)
  const [isSignUpHidden, setIsSignUpHidden] = useState(true)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [telephone, setTelephone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassWord,setShowPassWord]=useState(false)
  const [isForgotPassWord, setIsForgotPassWord]=useState(false)
  const [hasSubmitButtonClicked,setHasSubmitButtonClicked]= useState(false)
  const [ doesEmptyFieldExist, setDoesEmptyFieldExist] =useState(false)

const navigate= useNavigate()









const  CheckValidation=()=>{

  

  if(!firstName || !lastName || !telephone || !email || !password){
   
   setDoesEmptyFieldExist(true)
   
  }

  else{
   
    setDoesEmptyFieldExist(false)
  }
}







useEffect(()=>{


  CheckValidation()

 

},[firstName,lastName,telephone,email,password])



  const handleSignInPassWordChange=(e)=>{
    setPassword(e.target.value)
  
  }

const showSignIn=()=>{
  setIsSignUpHidden(true)
  setIsSignInHidden(false)
}

const showSignUp=()=>{
  setIsSignInHidden(true)
  setIsSignUpHidden(false)
}



const signInData = {
  email,
  password,
}




const signUpData = {
  firstName,
  lastName,
  telephone,
  email,
  password,
 

}











  const handleShowPassWord=()=>{

     if(showPassWord){
       setShowPassWord(false)
       return
     }
    setShowPassWord(true)
   }





   

  

   const signUp=async()=>{

  

setLoadingMessage('Please wait...')
   
  
CheckValidation()
setHasSubmitButtonClicked(true)

if(doesEmptyFieldExist){
setApiError(true)
  setLoadingMessage('please fill up all required field')

resetLoadingText()
  return
}







  
    try {
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
  
  
      const url = `${prefix}/users`;
      const response = await axios.post(url, signUpData,config);
    
      if (response.status === 201) {
     
      setApiError(false)

      setLoadingMessage('You have sucessfully sign up,kindly wait for the admin approval to log in')
     
        
        // Successful response status is 200
      } 
    }
  
    catch (error) {
     // alert('an error occured')

     
  setApiError(true)
     if(error.response){
      setLoadingMessage(error.response.data.message)
     }

else if(error.request){

  setLoadingMessage('Error connecting to the server')

}


else{
  setLoadingMessage(error.message)
}


     
    }




    finally{
      resetLoadingText()
    }
     
    
  
    
  }




const signIn=async()=>{
  setLoadingMessage('please wait...')

  const url=`${prefix}/users/login`

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
     withCredentials: true
  };


  try{

    const response= await axios.post(url,signInData,config)


    if(response.status===200){
      navigate('/dashboard')
    }

    setLoadingMessage('')

  }

  catch(error){
    setApiError(true)
    if(error.response){
     setLoadingMessage(error.response.data.message)
    }

else if(error.request){

 setLoadingMessage('Error connecting to the server')

}


else{
 setLoadingMessage(error.message)
}


    
  }






  finally{
    resetLoadingText()
  }

}








const handleForgotPassWord=async(e)=>{
  e.preventDefault()
  setLoadingMessage('Please wait...')
  const data= {
    email,
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };


try{

const url=`${prefix}/users/forgot-password-email`
  const response= await axios.post(url,data,config)
 

  if(response.status===201){
    setApiError(false)
    setLoadingMessage('A reset link has been sent to your email address, kindly note that you will only get this message if you submitted a registered email address')
  }
}



catch(error){
  setApiError(true)
  if(error.response){
   setLoadingMessage(error.response.data.message)
  }

else if(error.request){

setLoadingMessage('Error connecting to the server')

}


else{
setLoadingMessage(error.message)
}

resetLoadingText()
  
}










}








return (
<>

<Helmet>
        
        <meta name="description" content="Software designed for tracking and managing inventories efficiently" />
        
    

       
      

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="format-detection" content="telephone=no" />

        <title> - Software design to track and manage inventory efficiently</title>

      </Helmet>

      
<main id='body-container'>
  <div className='logo-container'>

  <div className='logo-header'>
  <div >
  <LazyLoadImage src='open_cardboard_box_with_arrows_export_delivery_shipping_icon_sign_or_symbol_3d_background_illustration.jpg'  className='image-logo'></LazyLoadImage>
  </div>

  <h1 style={{marginLeft:'1vw'}}>InventoryHero</h1>
 

</div>

  </div>

  {
  !isForgotPassWord && (
    <>

<section className='login-register-section'>


  {
    isSignUpHidden &&(
      <>
      
      <div className='login-modal'>
<div className='first-section'>
<p className='inventory-confirm'>InventoryHero</p>
<label className='form-label legend'  htmlFor="">Email</label>
    <input type="email" name='email' className="form-control  signup-form" value={email} onChange={(e) => setEmail(e.target.value)}/>
    <br />


    <label className='legend form-label'   htmlFor="">Password</label>
  
      <div  className='signup-eye-password-container '>
      <input  type={showPassWord?'text':'password'}  name='password' value={password} onChange={handleSignInPassWordChange} className='signup-password form-control ' />
      <div className='eye'>
      <FaEye className=' ' style={{color:'black',borderLeft:'white',fontSize:'',width:'',color:""}}  onClick={handleShowPassWord}></FaEye>
      </div>
      
      </div>
     <div className='btn-container' style={{display:'flex',justifyContent:'center', }}>
     <button className='btn btn-primary submit-btn' type='submit' onClick={signIn}>Log In</button>
     </div>

     <div className={apiError===true?'alert alert-danger':apiError===false?'alert alert-success':''}>{loadingMessage}</div>
     

     <p style={{color:'green',fontSize:'0.9em',cursor:'pointer'}} onClick={()=>setIsForgotPassWord(true)}>forgot password?</p>
     <p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',cursor:'pointer'}} onClick={showSignUp}> Dont have an account? Sign Up </p>
<br />
    
</div>

<div className='second-section'>

  <h2 style={{margin:'2vw ',color:'white',}}>Encoded Enterprise</h2>

</div>
    
      </div>



    
      
      
      </>
    )
  }







{
    isSignInHidden &&(
      <>
   
      <div className='login-modal' >
<div className='first-section'>

<br />

<p className='inventory-confirm'>InventoryHero</p> 
<label className='form-label legend'  htmlFor="">First Name</label>
    <input type="text" name='firstName'
    placeholder={hasSubmitButtonClicked && firstName === '' ? 'Please enter first name' : ''}
     className={hasSubmitButtonClicked && firstName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    <br />


  
<label className='form-label legend'  htmlFor="">Last Name</label>
    <input type="text" name='lastName'
    
    placeholder={hasSubmitButtonClicked && lastName === '' ? 'Please enter last name' : ''}
     className={hasSubmitButtonClicked && lastName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}  
    
    value={lastName} onChange={(e) => setLastName(e.target.value)}/>
    <br />

    
    <label className='form-label legend'  htmlFor="">Telephone</label>
    <input type="text" name='telephone'
    
    
    placeholder={hasSubmitButtonClicked && telephone === '' ? 'Please enter your phone number' : ''}
    className={hasSubmitButtonClicked && telephone ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}  


      value={telephone} onChange={(e) => setTelephone(e.target.value)} />
    <br />

    <label className='form-label legend'  htmlFor="">Email</label>
    <input type="email" name='email'
    placeholder={hasSubmitButtonClicked && email === '' ? 'Please enter your email address' : ''}
    className={hasSubmitButtonClicked && email ==='' ? 'unfilled signup-form   form-control' : 'signup-form  form-control'}  
    
    value={email} onChange={(e) => setEmail(e.target.value)} />
    <br />


    <label className='legend form-label'  htmlFor="">Password</label>
  
      <div  className='signup-eye-password-container '>
      <input  type={showPassWord?'text':'password'}  name='password' value={password} onChange={handleSignInPassWordChange}  placeholder={hasSubmitButtonClicked && password === '' ? 'Please enter first password' : ''}
     className={hasSubmitButtonClicked && password ==='' ? 'unfilled signup-password   form-control' : 'signup-password  form-control'}   />

     <div  className='eye'>
     <FaEye  style={{color:'black',borderLeft:'white',}}  onClick={handleShowPassWord}></FaEye>
     </div>
    
      </div>
     <div   className='btn-container'   style={{display:'flex',justifyContent:'center', width:""}}>
     <button className='btn btn-primary submit-btn'  type='submit' onClick={signUp}>Sign Up</button>
     </div>
     <div className={apiError===true?'alert alert-danger':apiError===false?'alert alert-success':''}>{loadingMessage}</div>
     

     
     <p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',cursor:'pointer'}} onClick={showSignIn}> Already have an account? Log in </p>

<br />

    
</div>

<div className='second-section'>

  <h1   className='modal-heading'>Encoded Enterprise</h1>

</div>



    
      </div>




      
      </>
    )
  }













</section>
</>
  )
}

{
  isForgotPassWord && (
    <>
    
    
    <section className='login-register-section'>


<div  className='login-modal'>

  <div  className='first-section'>
  <p className='inventory-confirm'>InventoryHero</p> 
 
  <div style={{fontWeight:'bolder'}}>Please enter your email address</div>
<label className='form-label legend'  htmlFor="">Email</label>
    <input type="email" name='email' className="form-control  signup-form" value={email} onChange={(e) => setEmail(e.target.value)}/>
    <br />
    <div className='btn-container' style={{display:'flex',justifyContent:'center', }}>
     <button className='btn btn-primary submit-btn' type='submit' onClick={handleForgotPassWord}>Submit</button>

    
</div>
<div className={apiError===true?'alert alert-danger':apiError===false?'alert alert-success':''}>{loadingMessage}</div>


<p style={{color:'green',fontSize:'0.9em',fontWeight:'bolder',cursor:'pointer'}} onClick={()=>setIsForgotPassWord(false)}>click to go back to Log In</p>
<br />
  </div>


  <div className='second-section'>

  <h1 style={{margin:'5vw',color:'white',}}>Encoded Enterprise</h1>

</div>

</div>
<br />

</section>
    
    
    </>
  )
}





<br />






<h2 className='last-hero'>InventoryHero</h2>

</main>



    


    






 



















      
  </>
)




  
  


}






export default App
// 