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




function SignUp() {
 const {prefix,loadingMessage,setLoadingMessage,resetLoadingText,apiError,setApiError,setIsSignUpHidden,}= useGlobal()


 const [instance,setInstance] =useState('shop')

 const [firstName, setFirstName] = useState('')
 const [lastName, setLastName] = useState('')
 const [telephone, setTelephone] = useState('')
 const [password, setPassword] = useState('')
 const [showPassWord,setShowPassWord]=useState(false)
 const [hasSubmitButtonClicked,setHasSubmitButtonClicked]= useState(false)
 const [congrats,setCongrats]=useState('')
 const [shopTag,setShopTag]=useState('')
 const [email, setEmail] = useState('')
 const [group,setGroup]= useState("")

 const [industry,setIndustry]=useState('')
 const [shopName,setShopName]=useState('')
 const [ doesEmptyFieldExist, setDoesEmptyFieldExist] =useState(false)
 const [tagId,setTagId] =useState('')

 const [isSpinning,setIsSpinning] =useState(false)



const   navigate =useNavigate()




const handleIndustry = (e) => {
  const industryValue = e.target.value;
  setIndustry(industryValue);
  

  if (industryValue==='Provision/Drinks/Pharmaceuticals' || industryValue ==='Books and Stationaries' ||  industryValue==='Fashion,Clothing,Accesories and Jewelries' ){

    setGroup('')

  }

  else{
    setGroup('group-2')
  }


  }






const  CheckValidation=()=>{

  if (instance==='shop'){

    if(!firstName || !lastName || !telephone || !password || !email  || !shopName || !group  || !industry){

   
   
      setDoesEmptyFieldExist(true)
      
     }
   
     
  
  
  else {
    setDoesEmptyFieldExist(false)
  }
  
  

  }

  else if (instance==='user') {



    if(!firstName || !lastName || !telephone || !password || !email  || !shopTag){

   
   
      setDoesEmptyFieldExist(true)
      
     }
   
     
  
  
  else {
    setDoesEmptyFieldExist(false)
  }
  
  



  }


  




}





useEffect(()=>{


 CheckValidation()



},[firstName,lastName,telephone,email,password,shopName,group])



const handleSignInPassWordChange=(e)=>{
 setPassword(e.target.value)

}
const handleShowPassWord=()=>{

 if(showPassWord){
   setShowPassWord(false)
   return
 }
setShowPassWord(true)
}











const shopData = {
 firstName,
 lastName,
 shopName,
 password,
 telephone,
 email,
group,
industry,


}



const registerShop=async()=>{


console.log(shopData.perishable, 'shopgroup:',shopData.group,   'shop-data')




CheckValidation()
setHasSubmitButtonClicked(true)
 if(doesEmptyFieldExist){
   setApiError(true)
     setLoadingMessage('please fill up all required field')
   
  
     return
   }

 try{

   const config = {
     headers: {
       'Content-Type': 'application/json',
     },
   };


   setIsSpinning(true)

   const url = `${prefix}/users/register`;
     const response = await axios.post(url, shopData,config);
     if (response.status === 201) {
    
       setApiError(false)
 
    
     
    setCongrats('shop')
    setTagId(response.data.data)
   
         
         // Successful response status is 200
       } 


 }

 catch(error){


   setApiError(true)
    if(error.response){


     if(error.response.data.message.includes('E11000 duplicate')){

       setLoadingMessage('business name exist, change business name ')
       return
 
     }





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
   setHasSubmitButtonClicked(false)
   setIsSpinning(false)
   
 }

}











const registerData = {
 firstName,
 lastName,
 shopTag,
 password,
 telephone,
 email,

 

}




const register=async()=>{

console.log(registerData,'hulu');



console.log(instance,'hulu')


CheckValidation()
setHasSubmitButtonClicked(true)
 if(doesEmptyFieldExist){
   setApiError(true)
     setLoadingMessage('please fill up all required field')

     return
   }

   setIsSpinning(true)

 try{

   const config = {
     headers: {
       'Content-Type': 'application/json',
     },
   };

   const url = `${prefix}/users/`;
     const response = await axios.post(url, registerData,config);
     console.log(response,'chichi')
     if (response.status === 200) {
    
       setApiError(false)
 
    
      
       setCongrats('user')
     
     
       setIsSignUpHidden(false)
 
    

   
         
         // Successful response status is 200
       } 


 }

 catch(error){


   setApiError(true)
    if(error.response){


     if(error.response.data.message.includes('E11000 duplicate')){

       setLoadingMessage('business name exist, change business name ')
       return
 
     }





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
   setHasSubmitButtonClicked(false)
   setIsSpinning(false)
   
 }

}

























return(
 <>

<Helmet>
        
        <meta name="description" content="Software designed for tracking and managing inventories efficiently" />
        
    

       
      

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="format-detection" content="telephone=no" />

        <title> - Software design to track and manage inventory efficiently</title>

      </Helmet>





<main className='sign-up-main'>

 <section  className='sign-up-img'>
 <p className='inventory-confirm'   style={{fontStyle:'italic',color:"green"}}>iVy</p>

 <div className='sign-up-pitch font-text'>Boost your SME's efficiency with our smart inventory management.</div>

 </section>


 <section  className='sign-up-content '>
 <h1 className='ivy-header' >ivy</h1>


  <h1 className='font-sub-heading'>Register</h1>

 {
   instance==='shop' && (
    <>
    <section className='whole-sign-up-container'>
    <div className='register-option-container'>
<div className='register-option' style={{borderBottom:instance==='shop'?'solid 4px green':''}} onClick={()=>setInstance('shop')}>Register as Owner</div>
<div className='register-option'  style={{borderBottom:instance==='user'?'solid 4px green':''}} onClick={()=>setInstance('user')}>Register as Staff</div>
</div> 



<div className='input-holder' >
<br />
<label className='form-label legend'  htmlFor="">First Name*</label>
    <input type="text" name='firstName'
    placeholder={hasSubmitButtonClicked && firstName === '' ? 'Please enter first name' : ''}
     className={hasSubmitButtonClicked && firstName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    <br />
</div>

<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Last Name*</label>
    <input type="text" name='lastName'
    
    placeholder={hasSubmitButtonClicked && lastName === '' ? 'Please enter last name' : ''}
     className={hasSubmitButtonClicked && lastName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}  
    
    value={lastName} onChange={(e) => setLastName(e.target.value)}/>
    <br />
</div>



<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Telephone *</label>
    <input type="text" name='telephone1'
    placeholder={hasSubmitButtonClicked && telephone === '' ? 'Please enter your telephone number' : ''}
     className={hasSubmitButtonClicked && telephone ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={telephone} onChange={(e) => setTelephone(e.target.value)} />
    <br />
</div>


<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Email *</label>
    
    <input type="text" name='email'
    placeholder={hasSubmitButtonClicked && email === '' ? 'Please enter your email address' : ''}
     className={hasSubmitButtonClicked && email ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={email} onChange={(e) => setEmail(e.target.value)} />
    <br />
</div>


<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Business Name *</label>
    <input type="text" name='name'
    placeholder={hasSubmitButtonClicked && shopName === '' ? 'Please enter your business name' : ''}
     className={hasSubmitButtonClicked && shopName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={shopName} onChange={(e) => setShopName(e.target.value)} />
    <br />
</div>



<div className='input-holder'>
    <label className='form-label legend' htmlFor="">Industry *</label>
    <select name="group" id="group" value={industry} className={hasSubmitButtonClicked && industry === '' ? 'unfilled form-select signup-form' : 'signup-form form-select'} onChange={handleIndustry}>
        <option value=""></option>
        <option value="Provision/Drinks/Pharmaceuticals">Provision/Drinks/Pharmaceuticals</option>
        <option value="Electronics/Phones/Computers">Electronics/Phones/Computers</option>
        <option value="Fashion,Clothing,Accesories and Jewelries">Fashion,Clothing,Accesories and Jewelries</option>
        <option value="Interior Design and Furnitures">Interior Design and Furnitures</option>
        <option value="Automobile Parts">Automobile Parts</option>
        <option value="Books and Stationaries">Books and Stationaries</option>
        <option value="Others">Others</option>
    </select>
    <br />
</div>



{
  (industry==='Provision/Drinks/Pharmaceuticals' || industry==='Books and Stationaries' || industry==='Fashion,Clothing,Accesories and Jewelries' ) && (
    <>
    
    <div className='input-holder' >

{
  industry==='Provision/Drinks/Pharmaceuticals' && (
    <>
   <div style={{textAlign:'justify',fontSize:'0.7rem'}}>Selecting secondary units that is pieces is relevant for products that are sold in smaller quantities within a larger package like Drinks and Provisions. If your business involves selling items like crates of drinks, packs of noodles in cartons, or similar products where customers can buy individual units from a larger package, like buying one bottle of coke from a crate of minerals, please indicate below.</div> 
    
    </>
  )
}

{
  industry==='Books and Stationaries' && (
    <>
   <div style={{textAlign:'justify', fontSize:'0.7rem'}}>Selecting secondary units is relevant for products that are sold in smaller quantities within a larger package, such as books and stationery items. If your business involves selling items like packs of pens, boxes of pencils, or similar products where customers can buy individual units from a larger package, like buying one pen from a pack or one pencil from a box, please indicate below.</div>

    
    </>
  )
}


{
  industry==='Fashion,Clothing,Accesories and Jewelries'  && (
    <>
   <div style={{textAlign:'justify', fontSize:'0.7rem'}}><p style={{textAlign:'justify', fontSize:'0.7rem'}}>Selecting secondary units is relevant for products that are sold in smaller quantities within a larger package, such as fashion and clothing wears. If your business involves selling items like bundles of shirts, packs of socks, bale of ankara fabrics or similar products where customers can buy individual units from a larger package, like buying one pair of t-shirt from a bundle or one sock from a pack, please indicate below.</p>
</div>

    
    </>
  )
}






<div>Do you sell in pieces?*</div>
<div className='signup-input-container'>
<label htmlFor="">Yes</label>
<input type="radio" name='group'  onClick={()=>setGroup('group-1')}/>
<label htmlFor="">No</label>
<input type="radio" name='group' onClick={()=>setGroup('group-2')}/>
</div>

{
  (hasSubmitButtonClicked && group==='') &&  (
    <>
   <p style={{textAlign:'justify',fontSize:'0.7rem', color:'red'}}>please select option from above </p> 
    
    </>
  )
}

       
<br />

</div> 
    
    </>
  )
}



















<div className='input-holder' >


<label className='legend form-label'  htmlFor="">Password *</label>
  
  <div  className='signup-eye-password-container '>
  <input  type={showPassWord?'text':'password'}  name='password' value={password} onChange={handleSignInPassWordChange}  placeholder={hasSubmitButtonClicked && password === '' ? 'Please enter your password' : ''}
 className={hasSubmitButtonClicked && password ==='' ? 'unfilled signup-password   form-control' : 'signup-password  form-control'}   />

 <div  className='eye'>
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


<p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',textAlign:'center',width:'70%'}} >By clicking the “Sign Up” button, you agree to Ivy's <span style={{color:'green',cursor:'pointer',}}> terms and policy.</span> </p>


     


  
</div>




<div className='input-holder mobile-holder' >


<div   className='btn-container'   style={{display:'flex',justifyContent:'center', width:""}}>
     <button className='btn btn-primary submit-btn'  type='submit' onClick={registerShop}>
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
    Sign Up
      </>
    )
  }  
     
     
     
     </button>
     </div>
    {
      loadingMessage!==''&&(
        <>
        <Response></Response>
        
        </>
      )
    }
  
</div>


<div className='input-holder mobile-holder' >

<p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',cursor:'pointer'}}  onClick={()=>{

    navigate('/log-in')
     }}> Already have an account? Log in </p>


     

<br />
  
</div>































    </section>





















   
    
    
    </>
   )
 }





{
   instance==='user' && (
    <>
    <section className='whole-sign-up-container'>
    <div className='register-option-container'>
<div className='register-option' style={{borderBottom:instance==='shop'?'solid 4px green':''}} onClick={()=>setInstance('shop')}>Register as owner</div>
<div className='register-option'  style={{borderBottom:instance==='user'?'solid 4px green':''}} onClick={()=>setInstance('user')}>Register as staff</div>
</div> 



<div className='input-holder' >
<br />
<label className='form-label legend'  htmlFor="">First Name*</label>
    <input type="text" name='firstName'
    placeholder={hasSubmitButtonClicked && firstName === '' ? 'Please enter first name' : ''}
     className={hasSubmitButtonClicked && firstName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    <br />
</div>

<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Last Name*</label>
    <input type="text" name='lastName'
    
    placeholder={hasSubmitButtonClicked && lastName === '' ? 'Please enter last name' : ''}
     className={hasSubmitButtonClicked && lastName ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}  
    
    value={lastName} onChange={(e) => setLastName(e.target.value)}/>
    <br />
</div>



<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Telephone *</label>
    <input type="text" name='telephone1'
    placeholder={hasSubmitButtonClicked && telephone === '' ? 'Please enter your telephone number' : ''}
     className={hasSubmitButtonClicked && telephone ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={telephone} onChange={(e) => setTelephone(e.target.value)} />
    <br />
</div>


<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Email *</label>
    
    <input type="text" name='email'
    placeholder={hasSubmitButtonClicked && email === '' ? 'Please enter your email address' : ''}
     className={hasSubmitButtonClicked && email ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={email} onChange={(e) => setEmail(e.target.value)} />
    <br />
</div>




<div className='input-holder' >

<label className='form-label legend'  htmlFor="">Shop Tag*</label>
    <input type="text" name='name'
    placeholder={hasSubmitButtonClicked && shopTag === '' ? 'Please enter your shop tag' : ''}
     className={hasSubmitButtonClicked && shopTag ==='' ? 'unfilled signup-form  form-control' : 'signup-form  form-control'}         value={shopTag} onChange={(e) => setShopTag(e.target.value)} />


    <br />
</div>





<div className='input-holder' >


<label className='legend form-label'  htmlFor="">Password *</label>
  
  <div  className='signup-eye-password-container '>
  <input  type={showPassWord?'text':'password'}  name='password' value={password} onChange={handleSignInPassWordChange}  placeholder={hasSubmitButtonClicked && password === '' ? 'Please enter your password' : ''}
 className={hasSubmitButtonClicked && password ==='' ? 'unfilled signup-password   form-control' : 'signup-password  form-control'}   />

 <div  className='eye'>
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


<p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',textAlign:'center',width:'70%'}} >By clicking the “Sign Up” button, you agree to Ivy's <span style={{color:'green',cursor:'pointer',}}> terms and policy.</span> </p>


     


  
</div>




<div className='input-holder mobile-holder' >


<div   className='btn-container'   style={{display:'flex',justifyContent:'center', width:""}}>
     <button className='btn btn-primary submit-btn'  type='submit' onClick={register}>
     
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
    Sign Up
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

<p style={{color:'black',fontSize:'0.9em',fontWeight:'bolder',cursor:'pointer'}}  onClick={()=>{
  navigate('/log-in')
    
     }}> Already have an account? Log in </p>


     

<br />
  
</div>















    </section>
   
    
    
    </>
   )
 }










 </section>


 {

congrats==='user' && (


  <>

<div className='congrat-modal' >
  <div style={{width:'100%'}}>
  <FaTimes  onClick={()=>{
   setCongrats('')
  
    setTagId('')
  
  }}     style={{float:'right',cursor:'pointer'}} size={32}></FaTimes>
  </div>
  
  <p style={{textAlign:'center',fontWeight:'500',width:'90%'}}>Congrats, you have successfully register
  <br />
   <strong style={{color:'red'}}>NOTE:  Please contact the admin for approval before you try to log in, 
  without the admin approval you might not be able to log in </strong>
  

  
  </p>

  </div>
  
  </>
)

}



{

congrats==='shop' && (


  <>

<div className='congrat-modal' style={{flexDirection:'column',display:'flex',justifyContent:'center',alignItems:"center",padding:'8px'}}>
  <div style={{width:'100%'}}>
  <FaTimes  onClick={()=>{
   setCongrats('')
  
    setTagId('')
   
    
  }}     style={{float:'right',cursor:'pointer'}} size={32}></FaTimes>
  </div>
  
  <p style={{textAlign:'center',fontWeight:'500',width:'90%'}}>Congrats, you have successfully register, your store tag is
  <br /> 
 
  <strong style={{color:'green', fontSize:'2.5rem'}}>{tagId}</strong>
  <br />
  Kindly copy this store tag, this store tag will be used by subsequent user for registeration.
  <br />
   <span style={{fontWeight:'700'}}>You have also been given 7 days free trial, to access our app </span> 
  

  
  </p>

  </div>
  
  </>
)

}






</main>











 







 
 </>
)

}



export default SignUp