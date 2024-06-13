import React, { useState, useEffect, } from 'react'




import { useGlobal} from './context'
import {  FaUser ,FaEye,FaChevronRight,FaCheck, FaTimes,FaEyeSlash,FaArrowLeft } from 'react-icons/fa'; 
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { Preloader } from './preloader';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Response } from './lay-out';
import { AiOutlineDelete, } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayOut from './lay-out';
import { Vortex,RotatingLines } from 'react-loader-spinner';

import 'react-datepicker/dist/react-datepicker.css';

const SemiPreloader=()=>{
  return(
    <>
    <section className='inventory-delete-overlay'>

    </section>
<div class="loadingio-spinner-spinner-nq4q5u6dq7r" style={{backgroundColor:'white'}}><div class="ldio-x2uulkbinbj">
<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
</div></div>

    
    
    </>
  )
}









const Users=()=>{


  const {prefix,setLoadingMessage,loadingMessage,setApiError,userRole}=useGlobal()

  const [users,setUsers]= useState([])
  
  const [showPassWord,setShowPassWord,]=useState(false)
  const [userId,setUserId]=useState('')
const [userName,setUserName]=useState('')

const [instance,setInstance] =useState('')
const [isPasswordShown, setIsPassWordShown]= useState(false)
const [isSpecial,setIsSpecial]=useState(false)
const [password,setPassWord]=useState('')
const [hint,setHint]=useState('')
const [isSpinning,setIsSpinning]=useState(false)
const [isLoading,setIsLoading]= useState(false)
const handleShowPassWord=()=>{


    if(showPassWord){
      setShowPassWord(false)
     
    }
 
    else{
     setShowPassWord(true)
    }
  
 }













  const fetchUsers=async()=>{
   setIsLoading(true)
   try{
   const url=`${prefix}/admin/users`
   const response = await axios.get(url,{withCredentials:true})
  
  setUsers(response.data.data.users)
  
  
   }
  
   catch(err){
   console.log(err,'master-p')
    
  
   }
  
  
   finally{
    setIsLoading(false)
  
   }
  
  }



  useEffect(()=>{

   fetchUsers()
   
   
   
   },[])



   const deleteData={
    password
   }

 
  


   const deleteUser=async()=>{
   
    if (userRole!=='admin' && userRole!=='super-admin'){


      setApiError(true)
      setLoadingMessage('you are not authorised to perform this action ')
      
      return
      }
    

    setIsSpinning(true)
    
    
     try{
      const url=`${prefix}/admin/delete-user/${userId}`
      const response = await axios.patch(url,deleteData,{withCredentials:true})
      setApiError(false)
      setLoadingMessage('user deleted')
      setUsers((prevUsers)=>prevUsers.filter((user)=>user._id!==userId))
     }
    
    
     catch(error){
    setApiError(true)
    
     console.log(error,'megan')
     
      setLoadingMessage('error deleting user, please try again')
     }
    
    finally{
      setIsSpinning(false)
    }
    
    }










    const data={
      isVerified:true,
      role:isSpecial?'admin':'user',
      password,
     }
     









    const verifyUser=async()=>{
    
    console.log(userId,'kendal user')
    console.log(isSpecial,userRole,'kendal is special')
console.log(data,'kunis')

if (isSpecial && userRole!=='super-admin'){


setApiError(true)
setLoadingMessage('you are not authorised to perform this action ')

return
}



if (userRole!=='admin' && userRole!=='super-admin'){


 /// setApiError(true)
  setLoadingMessage('you are not authorised to perform this action ')
  
  return
  }
     
    
  
     
     setIsSpinning(true)
     
     
      const config={
       headers:{
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      }
      
     
     
     
      try{
       const url=`${prefix}/admin/verify-users/${userId}`
       console.log(url,'muller url')
       const response = await axios.patch(url,data,config)
       setApiError(false)
       console.log(response,'muller')
       setLoadingMessage('user has been verified successfully')
      }
     
     
      catch(error){
        setApiError(true)
        console.log(error,'muller')
     
       if (error.response.data==='Invalid Password' )  {
     
       
         setLoadingMessage('Invalid Password')
       
         return
       }

       if   ( error.response.data==='you are not authorised to perform this action'){
        setLoadingMessage('You are not authorised to perform this action ')
       
        return
       }


       if   ( error.response.data==='your cant perform this action as you are not an admin'){
        setLoadingMessage('your cant perform this action as you are not an admin')
       
        return
       }




      
       setLoadingMessage('error verifying user')
     
      }
     
      finally{

      setIsSpecial(false)
    setUserName('')
   
    setIsSpinning(false)
     
      }
     
     }
    







if (isLoading){
  return(
    <>
    
   <section  style={{width:'100%',height:'100%',display:"flex",justifyContent:"center"}}>
   <SemiPreloader></SemiPreloader>


   </section>
    
 
  

    </>
  )
}








  return(
    <>





  <section  className='admin-user-main-container'>




  {
      instance!=='' && (
        <>
        
  <div className='admin-confirm-overlay'>


  {
  isPasswordShown && (
    <>
    <div className={'delete-confirmation alert-warning'} style={{border:"2px gray solid",borderRadius:'8px'}}>
    <div style={{width:'100%',height:"auto"}}>
      <FaTimes style={{float:'right',cursor:"pointer"}}  onClick={()=>{setInstance('');setUserName('');setIsSpecial('');setUserId('');setIsPassWordShown(false);setPassWord('')}}></FaTimes>
      </div>

<p style={{textAlign:'center',fontWeight:'700'}}>Kindly Input your password

</p>

<div  className='admin-settings-eye-password-container ' >
 <input  type={(showPassWord && password)?'text':'password'}  name='password' value={password}   onChange={(e)=>setPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>
 {
     !showPassWord ? (
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



{
  instance==='delete' && (
    <>
    <button className='btn btn-danger admin-user-btn'    onClick={deleteUser}>    
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
  Delete User   
      </>
    )
  }
   </button>     
    </>
  )
}

{
  instance==='verify' && (
    <>
    <button className='btn btn-primary  admin-user-btn'   onClick={verifyUser}>
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
Verify User   
      </>
    )
  } 
      </button> 
    
    
    </>
  )
}
  
   
  


{
  loadingMessage!=='' && (
    <>
     <div style={{width:'100%',height:'auto',marginTop:'2%'}}>
 <Response></Response>

 </div>
    </>
  )
 }



</div>
    
    </>
  )
}














{
  (instance==='delete' && !isPasswordShown ) && (
    <>
    <div className={'delete-confirmation alert-warning'}>
    <div style={{width:'100%',height:"auto"}}>
      <FaTimes style={{float:'right',cursor:"pointer"}}  onClick={()=>{setInstance('');setUserName('');setIsSpecial('');setUserId('')}}></FaTimes>
      </div>

<p style={{textAlign:'center'}}>Are you sure you want to delete this user

<br />
<strong>{userName}</strong>
</p>

<div style={{display:'flex',justifyContent:"space-around",alignItems:'center',width:"60%"}}>
<button className='btn btn-danger ' onClick={()=>setIsPassWordShown(true)}>Yes</button>
<button className='btn btn-secondary  '    onClick={()=>{ setInstance(''); setUserId('') }}>No</button>
</div>
</div>
    
    </>
  )
}




{
  (instance==='verify' && !isPasswordShown ) && (
    <>
   


    <div className={'verify-confirmation alert-warning'}   style={{border:isSpecial?'solid 1px black':'solid 1px green'}}>

      <div style={{width:'100%',height:"auto"}}>
      <FaTimes style={{float:'right',cursor:"pointer"}}  onClick={()=>{setInstance('');setUserName('');setIsSpecial('');setUserId('')}}></FaTimes>
      </div>



      {
        isSpecial===true ? (<>
         <p style={{textAlign:'center'}}>Are you sure you want to make this user admin 
         <br />
         <strong>{userName}</strong>
         
          </p>
        </>):(
          <>
           <p style={{textAlign:'center'}}>Are you sure you want to verify this user
           <br />
           <strong>{userName}</strong>
           
           </p>
          </>
        )
      }
  
 <div style={{display:'flex',justifyContent:"space-around",alignItems:'center',width:"60%"}}>
 <button className='btn btn-primary '  onClick={()=>setIsPassWordShown(true)}  style={{backgroundColor:'green'}}    >Yes</button>
<button className='btn btn-secondary  '     onClick={()=>{ setInstance(''); setUserId('') }}>No</button>
 </div>

 {
  loadingMessage!=='' && (
    <>
     <div style={{width:'100%',height:'auto',marginTop:'2%'}}>
 <Response></Response>

 </div>
    </>
  )
 }

</div>

  
    
    </>
  )
}








</div>

        
        
        </>
      )
      
    }

















 
   <h4 className='admin-second-heading font-heading'>User Management</h4>

   <article className='admin-all-user-container'>

    <div className='admin-user-heading'>

      <div>User Info</div>
      <div>Role</div>
      <div>Action</div>



    </div>


    



    {
      users.map((user)=>{
        return (
          <>
          
          <div className='admin-user-content' key={user._id}>

      <div className='admin-circle-container'>

        <div className='admin-user-circle'>
        <FaUser className='admin-user-circle-content' ></FaUser>

           </div>

           <div className='admin-user-text'>
           <div>{user.firstName} {user.lastName}</div>
           <div className='admin-user-email'>{ user.email.length<=23 ? `${user.email}`:`${user.email.slice(0,20)}`+'...'} 
           </div>

           </div>
      

      </div>
      <div className='admin-role'>{(user.isVerified==false && user.role!=='admin' && user.role!=='super-admin') ? 'unverified' :  user.role}</div>
      <div className='admin-action-container'>


        <div className='admin-btn-cover'>

          {
            hint==='verify' && (
              <>
             <div className='admin-hint'>
    <div className='admin-hint-cont'>make user</div>
    <div class="admin-tri"></div>

   </div>  
              
              </>
            )
          }

  

        



        <button  onMouseEnter={()=>setHint('verify')}  onMouseLeave={(()=>setHint(''))}     className='btn btn-primary admin-all-btn admin-verify-btn' onClick={()=>{setInstance('verify');setIsSpecial(false);setUserId(user._id);setUserName(`${user.firstName},${user.lastName}`)}}  data-id={user._id} data-case='special'><FaCheck  onMouseEnter={()=>setHint('verify')} ></FaCheck></button>
        </div>


        <div className='admin-btn-cover'>

          {
            hint==='admin' && (
              <>
             <div className='admin-hint'>
    <div className='admin-hint-cont'>make admin </div>
    <div class="admin-tri"></div>

   </div>
    
              </>
            )
          }

     

        <button   onMouseEnter={()=>setHint('admin')}  onMouseLeave={(()=>setHint(''))}     className='btn btn-secondary admin-all-btn'  data-id={user._id} onClick={()=>{setInstance('verify');setIsSpecial(true);setUserId(user._id);setUserName(`${user.firstName},${user.lastName}`)}}     >
          <FaUser onMouseEnter={()=>setHint('admin')} ></FaUser>
        </button>
</div>

<div className='admin-btn-cover'>


{
  hint==='delete' && (
    <>
    <div className='admin-hint'>
    <div className='admin-hint-cont'>Delete</div>
    <div class="admin-tri"></div>

   </div>
    </>
  )
}



<button onMouseEnter={()=>setHint('delete')}  onMouseLeave={(()=>setHint(''))}     className='btn btn-primary admin-all-btn  admin-delete-btn' onClick={()=>{setInstance('delete');setUserId(user._id);setUserName(`${user.firstName},${user.lastName}`)}}  data-id={user._id} ><AiOutlineDelete  style={{cursor:"pointer"}}  onMouseEnter={()=>setHint('delete')} ></AiOutlineDelete></button>
  
</div>
   
  
   




      </div>



    </div>
          
          </>
        )
      })
    }

    


   </article>


  </section>
    </>
  )

}










const SuspendStore=()=>{
  const {setAinstance,setLoadingMessage,prefix,shopDetails,loadingMessage,setApiError,userRole}= useGlobal()
  const [password,setPassWord]=useState('')
  const [showPassWord,setShowPassWord,]=useState(false)
const [isSpinning,setIsSpinning]=useState(false)

  const handleShowPassWord=()=>{


    if(showPassWord){
      setShowPassWord(false)
     
    }
 
    else{
     setShowPassWord(true)
    }
  
 }







 const data={
  password
 }



 const suspendShop=async()=>{



  if (userRole!=='super-admin'){

    setLoadingMessage('You are not authorised to perform this action')
  setApiError(true)
  return
  }





 setIsSpinning(true)


  

  try{

    const  url= `${prefix}/shops/suspend-shop`
    const response = await  axios.patch(url,data, { withCredentials: true })
if (response.status===200){
  setApiError(false)
  setLoadingMessage('Shop activity suspended successfully')
}
  }

  catch(err){
    setApiError(true)
    console.log(err.response.data,'girod')

    if(err.response.data==='Invalid Password'){
      setLoadingMessage('Invalid Password')

      return
    }
    
    setLoadingMessage('an error occur, please try again')

  }


  finally{
    setPassWord('')
    setIsSpinning(false)
  }
}

const unsuspend=async()=>{

  if (userRole!=='super-admin'){

    setLoadingMessage('You are not authorised to perform this action')
  setApiError(true)
  return
  }


  setIsSpinning(true)




  try{

    const  url= `${prefix}/shops/unsuspend-shop`
    const response = await  axios.patch(url, data, { withCredentials: true })
if (response.status===200){
  setApiError(false)
  setLoadingMessage('Shop activity unsuspended successfully')
}
  }

  catch(err){
    setApiError(true)
    console.log(err.response.data,'girod')

    if(err.response.data==='Invalid Password'){
      setLoadingMessage('Invalid Password')

      return
    }



    setLoadingMessage('an error occur, please try again')

  }


  finally{
    setPassWord('')
    setIsSpinning(false)
  }
}





  
  
  
  
    return (
      <>

<h4 className='admin-second-section-heading font-heading'><FaArrowLeft style={{marginRight:"3%",cursor:'pointer'}} onClick={()=>setAinstance('')}></FaArrowLeft>     Suspend Store</h4>

{

shopDetails.isSuspended!==true  ? (
  <>
   
  <section  className='admin-store-section'>
  <h6 style={{color:'red'}}> Warning: Implications of Suspending Shop Activity</h6>
  <p className='warning-paragraph'>Before you proceed to suspend shop activity, please consider the following implications:


  <li>Inventory Management: Suspending shop activity will halt all sales transactions. Ensure that your inventory levels are accurately reflected in the system to avoid discrepancies.</li>

  <li>
  Safeguard sensitive data, such as customer information and financial records, during the suspension period.
  </li>
  <li>
  Business Planning: Plan for any potential impacts on your business, such as seasonal closures or operational adjustments.
  </li>
  kindly confirm that you understand and consent to the above warning by inputting your password and submit 

</p>



<section  className='edit-input-password-container'>
  <label htmlFor="">Input Password</label>
<div  className='admin-settings-eye-password-container ' >
 <input  type={(showPassWord && password)?'text':'password'}  name='password' value={password}   onChange={(e)=>setPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>
 {
     !showPassWord ? (
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
 <button  className='shop-button btn btn-danger' onClick={suspendShop} >

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
    Submit  
      </>
    )
  } 



 </button>

 {
  loadingMessage!=='' && (
    <>
   
    <Response></Response> 
    </>
  )
 }

  
</section>


 

  
  
  
  
  
  
  </section>
  
  </>
):(

<>

<section  className='admin-store-section'>
 
  <p className='warning-paragraph'>
  Shop activity is suspended for now please kindly unsuspend activity,To resume your shop's operations and restore full functionality, we kindly request you to click on the 'Unsuspend' button below. This will initiate the process to unsuspend your activity, allowing you to continue using our platform without interruption.
   Please input your password to unsuspend activity
</p>



<section  className='edit-input-password-container'>
  <label htmlFor="">Input Password</label>
<div  className='admin-settings-eye-password-container ' style={{width:"70%"}} >
 <input  type={(showPassWord && password)?'text':'password'}  name='password' value={password}   onChange={(e)=>setPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>
 {
     !showPassWord ? (
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
 <button  className='shop-button btn btn-primary' onClick={unsuspend} style={{width:"70%"}}>

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
    Submit  
      </>
    )
  } 
 
 
 
 </button>
 <br /> 

 {
  loadingMessage!=='' && (
    <>
    <Response></Response> 
    </>
  )
 }

  
</section>


 

  
  
  
  
  
  
  </section>



</>



)




}


  

      
      </>
    )
  }






const EditStore=()=>{
const {setAinstance,loadingMessage,setLoadingMessage,setApiError,prefix,shopDetails,userRole}= useGlobal()

const [data,setData]= useState({})
const [isSpinning,setIsSpinning] =useState(false)


const handleSubmit=async()=>{


if (userRole!=='admin' && userRole!=='super-admin'){
  setApiError(true)
  setLoadingMessage('You are not authorised to perform this action')
  return
}








setIsSpinning(true)


  try{
const url= `${prefix}/shops/update-shop`
const response = await axios.patch(url,data,{withCredentials:true})
  setApiError(false)
    console.log(response.data,'muller');
    setLoadingMessage('information updated successfully')

  }

  catch(error){

    setApiError(true)


    if   ( error.response.data==='unauthorised'){
      setLoadingMessage('unauthorised user')
     
      return
     }

     if   ( error.response.data==='Shop does not exist.'){
      setLoadingMessage('shop does not exist')
     
      return
     }


setLoadingMessage('error processing request, try again')

  }


  finally{
    setIsSpinning(false)
  }
}




  return (
    <>

<h4 className='admin-second-section-heading font-heading'><FaArrowLeft style={{marginRight:"3%",cursor:'pointer'}} onClick={()=>setAinstance('')}></FaArrowLeft>     Edit Store</h4>
<section  className='admin-store-section'>


<div style={{height:'',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'black'}}>Store Tag: {shopDetails.tag}</div>

<div style={{height:'',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Store Name</div>
<input type="text"  placeholder={shopDetails.shopName}  className='admin-management-input  form-control'  onChange={(e)=>setData((prev)=>({...prev,shopName:e.target.value}))}
value={data.shopName}
/>
<br />

<div style={{height:'',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}   >Store Contact 1</div>
<input type="text"  className='admin-management-input  form-control'
 onChange={(e)=>setData((prev)=>({...prev, telephoneOne:e.target.value}))}
value={data.telephoneOne}
placeholder={shopDetails.telephoneOne} 
/>
<br />


<div style={{height:'',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Store Contact 2</div>
<input type="text"  className='admin-management-input  form-control'

onChange={(e)=>setData((prev)=>({...prev, telephoneTwo:e.target.value}))}
value={data.telephoneTwo}
placeholder={shopDetails.telephoneTwo} 
/>
<br />
<div style={{height:'',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Address</div>
<input type="text"  className='admin-management-input  form-control'

onChange={(e)=>setData((prev)=>({...prev, address:e.target.value}))}
value={data.address}
placeholder={shopDetails.address} 

/>
<br />

<button  className='shop-button btn btn-primary' onClick={handleSubmit}>
  
  
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
 Save Changes  
      </>
    )
  }

  </button>

{
  loadingMessage!=='' && (
    <>
    <Response></Response>
    </>
  )
}




</section>
    
    </>
  )
}





const DeactivateStore=()=>{
  const {setAinstance,setLoadingMessage,prefix,userRole,loadingMessage,setApiError}= useGlobal()
  const [password,setPassWord]=useState('')
  const [showPassWord,setShowPassWord]=useState(false)
const navigate= useNavigate()















  const handleShowPassWord=()=>{




    if(showPassWord){
      setShowPassWord(false)
     
    }
 
    else{
     setShowPassWord(true)
    }
  
 }



 const data={
  password
}




 const deleteShop=async()=>{



  if (userRole!=='super-admin'){

    setLoadingMessage('You are not authorised to perform this action')
  setApiError(true)
  return
  }




  setLoadingMessage('please wait...')




  try{

   
    const  url= `${prefix}/shops/delete-shop`
    const response = await  axios.post(url,data, { withCredentials: true })
if (response.status===200){
  setLoadingMessage('Shop deleted successfully')
  navigate('/')
  setLoadingMessage('')
}
  }

  catch(err){

   
    setApiError(true)
    console.log(err.response.data,'girod')

    if(err.response.data==='Invalid Password'){
      setLoadingMessage('Invalid Password')

      return
    }



    setLoadingMessage('an error occur, please try again')

  }



}






  
  
  
  
    return (
      <>

<h4 className='admin-second-section-heading font-heading'><FaArrowLeft style={{marginRight:"3%",cursor:'pointer'}} onClick={()=>setAinstance('')}></FaArrowLeft>     Deactivate Store</h4>

<section  className='admin-store-section'>
 
  <p className='warning-paragraph'>
  Before you proceed to delete the shop account, please read the below implications:
Deleting your account is an irreversible action. This will permanently delete your account and associated data, including sales history,product, inventory level,users, and all data associated with your shop. Consider potential data loss, audit trail logging, dependencies on active processes, and your user permissions.
</p>



<section  className='edit-input-password-container'>
  <label htmlFor="">Input Password</label>
<div  className='admin-settings-eye-password-container '>
 <input  type={(showPassWord && password)?'text':'password'}  name='password' value={password}   onChange={(e)=>setPassWord(e.target.value)}    className='settings-password form-control' />
 <div className='eye'>
 {
     !showPassWord ? (
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
 <button  className='shop-button btn btn-primary danger-shop-btn' onClick={deleteShop} >Submit</button>
 <br /> 

 {
  loadingMessage!=='' && (
    <>
    <Response></Response> 
    </>
  )
 }

  
</section>


 

  
  
  
  
  
  
  </section>

  

      
      </>
    )
  }





const Store=()=>{


  const {ainstance, setAinstance,}=useGlobal()






  return(
    <>







    {
      ainstance==='' ? (
        <>
        
        <section  className='admin-user-pre-link-container'>


<h4 className='admin-second-section-heading font-heading'>Store Management</h4>

<div className='admin-sidebar-pre-link' onClick={()=>setAinstance('edit-store')}>
     <div>Edit Store Information</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-pre-link' onClick={()=>setAinstance('suspend')}>
     <div>Suspend Store Activity</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-pre-link' onClick={()=>setAinstance('deactivate')}>
     <div>Deactivate Account</div>
     <FaChevronRight></FaChevronRight>
  </div>







 </section> 
        
        
        </>
      ):(
        <>
        
        <section  className='admin-user-pre-link-container'>

          {

            ainstance==='edit-store' && (
              <>
              <EditStore></EditStore>
              </>
            )

          }

  {

ainstance==='suspend' && (
  <>
  <SuspendStore></SuspendStore>
  </>
)

  }




{

ainstance==='deactivate' && (
  <>
  <DeactivateStore></DeactivateStore>
  </>
)

  }


          </section>
        
        </>
      )
    }





    
    </>
  )
}





const GeneralPreferences=()=>{
  const {setAinstance,setLoadingMessage,prefix,userRole,loadingMessage,setApiError,shopDetails,isPreloaderRunning,setIsPreLoaderRunning}= useGlobal()
  const [data,setData]=useState({})
 const [receiptChecked,setReceiptChecked] =useState(false)
 const [isSpinning,setIsSpinning] =useState(false)

useEffect(()=>{
//setIsPreLoaderRunning(true)
},[])

 const handleReceiptCheck=(event)=>{

  if (receiptChecked===true){
    setReceiptChecked(event.target.checked)
    setData((prev)=>({...prev,receipt:false}))
  }

  else{
    setReceiptChecked(event.target.checked)
    setData((prev)=>({...prev,receipt:true}))

  }

  console.log(receiptChecked,'what is receiptchecked')
   
  console.log(data,'what is receiptchecked data')
 }





 useEffect(() => {




  if (shopDetails.receipt===true){
    setReceiptChecked(true)
  }

  
  setData((prev) => ({ ...prev, industry: shopDetails.industry }));

  setData((prev) => ({ ...prev, alertTime: shopDetails.alertTime }));

}, []);




















const handleSubmit=async()=>{


  if (userRole!=='admin' && userRole!=='super-admin'){
    setApiError(true)
    setLoadingMessage('You are not authorised to perform this action')
    return
  }
  console.log(data,' malo what is data')
  
 
  
  
  
  

  
  setIsSpinning(true)
    try{
  const url= `${prefix}/shops/update-shop`
  const response = await axios.patch(url,data,{withCredentials:true})
    setApiError(false)
      console.log(response.data,'muller');
      setLoadingMessage('information updated successfully')
  
    }
  
    catch(error){
  
      setApiError(true)
  
  
      if   ( error.response.data==='unauthorised'){
        setLoadingMessage('unauthorised user')
       
        return
       }
  
       if   ( error.response.data==='Shop does not exist.'){
        setLoadingMessage('shop does not exist')
       
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
    <h4 className='admin-second-section-heading font-heading'><FaArrowLeft style={{marginRight:"3%",cursor:'pointer'}} onClick={()=>setAinstance('')}></FaArrowLeft>     General Preferences</h4>
    <section  className='preference-store-section'>
    <article className='admin-preference-section'>
    <strong>Change  Industry Type</strong>

    <select name="group" id="group"  value={data.industry} className={'signup-form form-select admin-pref-select'} 
    onChange={(e)=>setData((prev)=>({...prev,industry:e.target.value}))}
     
    >
        <option value=""></option>
        <option value="Provision/Drinks/Pharmaceuticals">Provision/Drinks/Pharmaceuticals</option>
        <option value="Electronics/Phones/Computers">Electronics/Phones/Computers</option>
        <option value="Fashion,Clothing,Accesories and Jewelries">Fashion,Clothing,Accesories and Jewelries</option>
        <option value="Interior Design and Furnitures">Interior Design and Furnitures</option>
        <option value="Automobile Parts">Automobile Parts</option>
        <option value="Books and Stationaries">Books and Stationaries</option>
        <option value="Others">Others</option>
    </select>






    </article>

    <article className='admin-preference-section'>
    <strong>Would you like to enable receipt printing for transactions?</strong>
    <div className='admin-option-container'>
    <input name='alert' class="form-check-input" checked={ receiptChecked}  type="checkbox"  
    onChange={handleReceiptCheck}
    
    
    /><label htmlFor="" className='admin-label'>Yes</label>
    </div>
  
   
  



    </article>


    <article className='admin-preference-section'>
    <strong>Please specify your preferred time frame for receiving notifications about crucial information like expiry date</strong>
    <div className='admin-option-container'>
      <input
        name='alert'
        checked={data.alertTime === 7 * 60 * 60 * 1000}
        class="form-check-input"
        type="radio"
        onChange={(e) => setData({ ...data, alertTime: 7 * 60 * 60 * 1000 })}

        

      />
      <label htmlFor="" className='admin-label'>7 days</label>
    </div>
    <div className='admin-option-container'>
      <input
        name=''
        checked={data.alertTime === 14 * 60 * 60 * 1000}
        class="form-check-input"
        type="radio"
        onChange={(e) => setData({ ...data, alertTime: 14 * 60 * 60 * 1000 })}

        onClick={(e) => setData({ ...data, alertTime: 14 * 60 * 60 * 1000 })}
      />
      
      <label htmlFor="" className='admin-label'>14 days</label>
    </div>
    <div className='admin-option-container'>
      <input
        name=''
        checked={data.alertTime === 30 * 24 * 60 * 60 * 1000}
        class="form-check-input"
        type="radio"
        onChange={(e) => setData({ ...data, alertTime: 30 * 24 * 60 * 60 * 1000 })}
      />
      <label htmlFor="" className='admin-label'>30 days</label>
    </div>
    <div className='admin-option-container'>
      <input
        name=''
        checked={data.alertTime === 60 * 24 * 60 * 60 * 1000}
        class="form-check-input"
        type="radio"
        onChange={(e) => setData({ ...data, alertTime: 60 * 24 * 60 * 60 * 1000 })}
      />
      <label htmlFor="" className='admin-label'>60 days</label>
    </div>
  </article>



 <article className='admin-button-section'>
   
   <button  className='btn-primary btn' style={{width:'30%',fontSize:"1rem"}} onClick={handleSubmit}>
    

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
     Save
      </>
    )
  }
</button>
 </article>
 {
  loadingMessage!=='' && (
    <>
    <Response></Response>
    </>
  )
 }
    </section>
    
    </>
  )


}






const SalesPreferences=()=>{
  const {setAinstance,setLoadingMessage,prefix,userRole,loadingMessage,setApiError,shopDetails}= useGlobal()
  const [data,setData]=useState({})
  const [piecesChecked,setPiecesChecked]= useState(false)
  const [autoChecked,setAutoChecked]=useState(false)
const [isPasswordShown,setIsPassWordShown]= useState(false)
const [showPassWord,setShowPassWord,]=useState(false)

const [isSpinning,setIsSpinning] =useState(false)
const handleCheck=(e,param)=>{

  if (param==='pieces'){
    const checked= e.target.checked
  if (piecesChecked===true){
    setPiecesChecked(e.target.checked)
    setData((prev)=>({...prev,group:'group-2'}))

  }

  else{
    setPiecesChecked(e.target.checked)
    setData((prev)=>({...prev,group:'group-1'}))

  }


  }


  if (param==='auto'){
    if (autoChecked===true){
      setAutoChecked(e.target.checked)
      setData((prev)=>({...prev,autoPrice:false}))

    }

    else{
      setAutoChecked(e.target.checked)
      setData((prev)=>({...prev,autoPrice:true}))
    }
  }



}







useEffect(()=>{
 setAutoChecked(shopDetails.autoPrice)
 if (shopDetails.group==='group-1'){
  setPiecesChecked(true)
 }

 else{
  setPiecesChecked(false)
 }

 console.log(shopDetails,'forbid shop')
},[])



const handleShowPassWord=()=>{

  if (showPassWord){
    setShowPassWord(false)
  }

  else{
    setShowPassWord(true)
  }

}
  





  const handleSubmit=async()=>{
   console.log(data,'forbid')


   if (data.password==='' || !data.password){
    setApiError(true)
    setLoadingMessage('please input password')
    return
   }

   data.check=true
  
   console.log(data,'forbid 2')




    if (userRole!=='admin' && userRole!=='super-admin'){
      setApiError(true)
      setLoadingMessage('You are not authorised to perform this action')
      return
    }
    
    
    
    
    
    
    
    
  setIsSpinning(true)
    
    
      try{
    const url= `${prefix}/shops/update-shop`
    const response = await axios.patch(url,data,{withCredentials:true})
      setApiError(false)
        console.log(response.data,'muller');
        setLoadingMessage('information updated successfully')
    
      }
    
      catch(error){
    
        setApiError(true)
    
        if   ( error.response.data==='Invalid Password'){
          setLoadingMessage('Invalid Password')
         
          return
         }
    
        if   ( error.response.data==='unauthorised'){
          setLoadingMessage('unauthorised user')
         
          return
         }
    
         if   ( error.response.data==='Shop does not exist.'){
          setLoadingMessage('shop does not exist')
         
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
    <h4 className='admin-second-section-heading font-heading'><FaArrowLeft style={{marginRight:"3%",cursor:'pointer'}} onClick={()=>setAinstance('')}></FaArrowLeft>     Sales Preferences</h4>



    <section  className='preference-store-section'>
 
 
    {
      isPasswordShown && (
        <>
        <article className='admin-confirm-overlay'>

<div className={'delete-confirmation alert-warning'} style={{border:"1px rgb(230,230,230) solid",borderRadius:'8px'}}>
<div style={{width:'100%',height:"auto"}}>
  <FaTimes style={{float:'right',cursor:"pointer"}}  onClick={()=>{setIsPassWordShown(false);setData((prev)=>({...prev,password:''}))}}></FaTimes>
  </div>

<p style={{textAlign:'center',fontWeight:'400'}}>Kindly input your password to save this changes

</p>
<strong>Input Password</strong>

<div  className='admin-settings-eye-password-container ' >
<input  type={(showPassWord && data.password)?'text':'password'}  name='password' value={data.password}   onChange={(e)=>setData((prev)=>({...prev,password:e.target.value}))}    className='settings-password form-control' />
<div className='eye'>
{
 !showPassWord ? (
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




<button className='btn btn-primary admin-pref-btn'   onClick={handleSubmit}>
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
   Save   
      </>
    )
  }
  
  
  
  </button> 










{
loadingMessage!=='' && (
<>
 <div style={{width:'100%',height:'auto',marginTop:'2%'}}>
<Response></Response>

</div>
</>
)
}



</div>
  
  
  
  </article>
        
        </>
      )
    }



   

    <article className='admin-preference-section'>





    <strong>Would you like to enable sales in pieces printing </strong>
    <div className='admin-option-container'>
    <input name='alert' class="form-check-input" checked={ piecesChecked}  type="checkbox"  
        onChange={(e)=>handleCheck(e,'pieces')}

    
    
    /><label htmlFor="" className='admin-label'>Allow sales in pieces</label>
    </div>
  
   
  



    </article>


    <article className='admin-preference-section'>
    <strong>Would you like to enable auto price filling </strong>
    <div className='admin-option-container'>
    <input name='alert' class="form-check-input" checked={ autoChecked}  type="checkbox"  
    onChange={(e)=>handleCheck(e,'auto')}
    
    
    /><label htmlFor="" className='admin-label'>Allow auto filling</label>
    </div>
  
   
  



    </article>



   



 <article className='admin-button-section'>
   
   <button  className='btn-primary btn' style={{width:'30%',fontSize:"1rem"}} onClick={()=>setIsPassWordShown(true)}>Save</button>
 </article>

    </section>
    
    </>
  )


}











const Preferences=()=>{


  const {ainstance, setAinstance,}=useGlobal()







  return(
    <>

{
      ainstance==='' ? (
        <>
        
        <section  className='admin-user-pre-link-container'>


<h4 className='admin-second-section-heading font-heading'>Preferences</h4>

<div className='admin-sidebar-pre-link' onClick={()=>setAinstance('general')}>
     <div>General Preferences</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-pre-link' onClick={()=>setAinstance('sales')}>
     <div>Sales References</div>
     <FaChevronRight></FaChevronRight>
  </div>
  







 </section> 
        
        
        </>
      ):(
        <>
        
        <section  className='admin-user-pre-link-container'>

          {

            ainstance==='general' && (
              <>
              <GeneralPreferences></GeneralPreferences>
              </>
            )

          }

  {

ainstance==='sales' && (
  <>
  <SalesPreferences></SalesPreferences>
  </>
)

  }







          </section>
        
        </>
      )
    }


    
    
    </>
  )
}










const Admin=()=>{
const {setAinstance,ainstance}=useGlobal()
const [instance,setInstance]=useState('user')




useEffect(()=>{

  if(  window.innerWidth<=550){
  setAinstance('default')
  setInstance('')
  }

},[])



 return (
  <>
  <LayOut>





<main  className='admin-main-container' >

<aside  className={instance==='user'?'admin-first-section':"sub-admin-first-section"}   >
  <h4 className='font-heading'style={{padding:'20px'}}>Settings</h4>
  <div className='admin-sidebar-link' style={{backgroundColor:instance==='user'?'rgb(235,235,235)':''}}   onClick={()=>{setInstance('user');setAinstance('')}}>
     <div>User Management</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-link' style={{backgroundColor:instance==='shop'?'rgb(235,235,235)':''}} onClick={()=>{setInstance('shop');setAinstance('')}}   >
     <div>Store Management</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-link'      style={{backgroundColor:instance==='preference'?'rgb(235,235,235)':''}} onClick={()=>{setInstance('preference');setAinstance('')}} >
     <div>Preferences Settings</div>
     <FaChevronRight></FaChevronRight>
  </div>
</aside>

<section   className={instance==='user'?'admin-second-section':"sub-admin-second-section"} >

{
  instance==='user' && (
    <>
    <Users></Users>
    </>
  )
}


{
  instance==='shop' && (
    <>
    <Store></Store>
    </>
  )
}


{
  instance==='preference' && (
    <>
    <Preferences></Preferences>
    </>
  )
}



  
</section>


</main>






<main  className='mobile-admin-main-container' >


  {
    ainstance==='' && (
      <>
      <div className='mobile-back-container'> <FaArrowLeft onClick={()=>{setAinstance('default');setInstance('')}} style={{cursor:'pointer'}}/>   <span>back</span>  </div>
      </>
    )
  }








{
  ainstance==='default' && (
    <>
<aside   className='mobile-admin-section' >
  <h4 className='font-heading'style={{padding:'20px'}}>Settings</h4>

  <div className='admin-sidebar-link' style={{backgroundColor:instance==='user'?'rgb(235,235,235)':''}}   onClick={()=>{setInstance('user');setAinstance('')}}>
     <div>User Management</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-link' style={{backgroundColor:instance==='shop'?'rgb(235,235,235)':''}} onClick={()=>{setInstance('shop');setAinstance('')}}   >
     <div>Store Management</div>
     <FaChevronRight></FaChevronRight>
  </div>
  <div className='admin-sidebar-link'      style={{backgroundColor:instance==='preference'?'rgb(235,235,235)':''}} onClick={()=>{setInstance('preference');setAinstance('')}} >
     <div>Preferences Settings</div>
     <FaChevronRight></FaChevronRight>
  </div>
</aside>

    
    </>
  )
  
}



{
  instance==='user' && (
    <>
   <aside   className='mobile-admin-section' >

<Users></Users>

</aside>
    </>
  )
}


{
  instance==='shop' && (
    <>
    <aside   className='mobile-admin-section' >
    <Store></Store>
   </aside>


    </>
  )
}

{
  instance==='preference' && (
    <>
    <aside   className='mobile-admin-section' >
    <Preferences></Preferences>
   </aside>
   
    </>
  )
}





</main>




















   
  </LayOut>
  
  
  
  </>
 )
}


export default Admin