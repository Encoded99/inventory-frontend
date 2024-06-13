         
     
import React, { useState, useEffect } from 'react'
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaSearch, FaPhone, FaTimes, FaEnvelope, FaFacebook, FaTwitter, FaInstagram,  FaEye,FaUser , FaCloud, FaPlug,FaEyeSlash } from 'react-icons/fa'; 
import axios from 'axios'
import { Response } from './lay-out';
import { Vortex,RotatingLines } from 'react-loader-spinner';


//import {cloth} from './filter'
//import { cl } from './context'
import {LoadingSpinner} from './spinner'
























function Login() {

const {prefix,loadingMessage,setLoadingMessage,resetLoadingText,apiError,setApiError,}= useGlobal()

  const [email, setEmail] = useState('')

 



  const [password, setPassword] = useState('')
  const [showPassWord,setShowPassWord]=useState(false)
 
  const [hasSubmitButtonClicked,setHasSubmitButtonClicked]= useState(false)
 
  const [instance,setInstance] =useState('log-in')
 const [isSpinning,setIsSpinning] =useState(false)
 

const navigate= useNavigate()














  















  const handleSignInPassWordChange=(e)=>{
    setPassword(e.target.value)
  
  }






const signInData = {
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





   

  

 



const signIn=async()=>{


if (email==='' || password===''){
  setApiError(true)
  setLoadingMessage('email or password can not be empty')
  return
}

setIsSpinning(true)
  

  const url=`${prefix}/users/login`

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
     withCredentials: true
  };
  console.log('hummels reach api')

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

 setLoadingMessage('error processing request, try again')

}


else{
 setLoadingMessage(error.message)
}



    
  }


  finally{
    setIsSpinning(false)
  }



  

}








const handleForgotPassWord=async(e)=>{
  e.preventDefault()
 
  const data= {
    email,
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  };

setIsSpinning(true)
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

setLoadingMessage('error processing request, please try again')

}


else{
setLoadingMessage(error.message)
}


  
}

finally{
  setIsSpinning(false)
}


}



























var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;





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

      
      <main className='sign-up-main' style={{backgroundColor:'white',minHeight:'100vh'}}>

<section  className='sign-up-img'>
<p className='inventory-confirm'   style={{fontStyle:'italic',color:"green"}}>iVy</p>

<div className='sign-up-pitch font-text'>Boost your SME's efficiency with our smart inventory management.</div>

</section>



{
  instance==='log-in' && (
    <>
    
    <section  className='sign-up-content '>
    <h1 className='font-text'>windo width {windowWidth}</h1>
<h1 className='font-text'>windo height {windowHeight}</h1>

  <h1 className='ivy-header' >ivy</h1>

 <h1 className='font-sub-heading'>Log In</h1>


   <section className='whole-sign-up-container'>
   


<div className='input-holder' >
<br />
<label className='form-label legend'  htmlFor="">Email</label>
    <input type="text" name='user-id' className="form-control  signup-form" value={email} onChange={(e) => setEmail(e.target.value)}/>
   <br />
</div>






<div className='input-holder' >

<label className='legend form-label'   htmlFor="">Password</label>
  
  <div  className='signup-eye-password-container '>
  <input  type={showPassWord?'text':'password'}  name='password' value={password} onChange={handleSignInPassWordChange} className='signup-password form-control ' />
  <div className='eye'>



  {
     !showPassWord ? (
       <>
      <FaEye  onClick={handleShowPassWord}></FaEye>  
       </>
     ):(
       <>
       <FaEyeSlash onClick={handleShowPassWord}></FaEyeSlash>
       </>
     )
   }





  </div>
  
  </div>

  <br />

</div>



<div className='input-holder mobile-holder' >


<div   className='btn-container'   style={{display:'flex',justifyContent:'center', width:""}}>
    <button className='btn btn-primary submit-btn'  type='submit' onClick={signIn}>
    {
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="40"
  width="40"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    Log In
      </>
    )
   }
    
    
    
    
    </button>
    </div>
   {
    loadingMessage!=='' && (
      <>

      <Response></Response>
      
      </>
    )
   }
 
</div>

<div className='input-holder mobile-holder' >

<p style={{color:'green',fontSize:'0.9em',cursor:'pointer'}} onClick={()=>setInstance('forgot-password')}>forgot password?</p>

</div>




<div className='input-holder mobile-holder' >

<p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',cursor:'pointer'}}  onClick={()=>{

   navigate('/sign-up')
    }}> Dont have an account ? Sign Up </p>


    

<br />
 
</div>















   </section>
  
   
   
  










</section>
    </>
  )
}









{
  instance==='forgot-password' && (
    <>
    
    <section  className='sign-up-content '>

    <h1 className='ivy-header' >ivy</h1>

 <h1 className='font-sub-heading'>Forgot Password</h1>


   <section className='whole-sign-up-container'>
   


<div className='input-holder' >
<br />
<label className='form-label legend'  htmlFor="">Enter the email associated with your account</label>
<input type="text" name='email'
    placeholder={hasSubmitButtonClicked && email === '' ? 'Please enter your email address' : ''}
     className={hasSubmitButtonClicked && email ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={email} onChange={(e) => setEmail(e.target.value)} />
    <br />
</div>


<div className='input-holder mobile-holder' >


<div   className='btn-container'   style={{display:'flex',justifyContent:'center', width:""}}>
    <button className='btn btn-primary submit-btn'  type='submit' onClick={handleForgotPassWord}>
    {
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="40"
  width="40"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    Reset Password
      </>
    )
   }
    



    </button>
    </div>
   {
    loadingMessage!=='' && (
      <>

      <Response></Response>
      
      </>
    )
   }
 
</div>





<div className='input-holder mobile-holder' >

<p style={{color:'green',fontSize:'0.9em',cursor:'pointer'}} onClick={()=>setInstance('log-in')}>back to log in</p>

</div>




















   </section>
  
   
   
  










</section>
    </>
  )
}
















</main>



    







 



















      
  </>
)




  
  


}






export default Login
// 