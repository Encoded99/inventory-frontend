import React, { useState, useEffect, } from 'react'




import { useGlobal} from './context'
import {  FaUser , } from 'react-icons/fa'; 
import axios from 'axios'




import LayOut from './lay-out';


import 'react-datepicker/dist/react-datepicker.css';



const Admin=()=>{
const {prefix,setLoadingMessage,loadingMessage,resetLoadingText,setIsPreLoaderRunning}=useGlobal()

const [users,setUsers]= useState([])
const [isWarningHidden, setIsWarningHidden]=useState(true)
const [isVerifyHidden,setIsVerifyHidden]= useState(true)
  const [userId,setUserId]=useState('')
const [position,setPosition]=useState(null)
const [leftPosition,setLeftPosition]=useState(null)
















const fetchUsers=async()=>{
  setIsPreLoaderRunning(true)
 try{
 const url=`${prefix}/admin/users`
 const response = await axios.get(url,{withCredentials:true})

setUsers(response.data.data.users)
setIsPreLoaderRunning(false)

 }

 catch(err){

 }


 finally{

 }

}




useEffect(()=>{

 fetchUsers()



},[])









const  handleDelete=(e)=>{

if(!isVerifyHidden){
 setIsVerifyHidden(true)
}

 const clickedId=e.target.dataset.id


const clickedPosition=e.target.offsetTop-250
const clickedLeftPostion=e.target.offsetLeft
const screenWidth= window.innerWidth

setPosition(clickedPosition)
setLeftPosition(clickedLeftPostion)

if(screenWidth<480){
  setLeftPosition(screenWidth/9.5)
}

setUserId(clickedId)


 setIsWarningHidden(false)

}

const deleteStyles={
  position:'absolute !important',
 top:!isWarningHidden?position:'0',
 left:!isWarningHidden?leftPosition:'0',
 backgroundColor:'white',
 color:'red',
 border:'solid 2px red',

 
 


}


const  handleVerify=(e)=>{
 if(!isWarningHidden){
  setIsWarningHidden(true)
 }
 const clickedId=e.target.dataset.id


const clickedPosition=e.target.offsetTop-250
const clickedLeftPostion=e.target.offsetLeft
const screenWidth= window.innerWidth

setPosition(clickedPosition)
setLeftPosition(clickedLeftPostion)

if(screenWidth<480){
  setLeftPosition(screenWidth/9.5)
}

setUserId(clickedId)

 setIsVerifyHidden(false)

}

const verifyStyles={
 top:!isVerifyHidden?position:'0px',
 left:!isVerifyHidden?leftPosition:'0px',
 backgroundColor:'white',
 color:'green',
 border:'solid 2px green',
 position:'absolute',

 


}





const deleteUser=async()=>{
setIsWarningHidden(true)

 setLoadingMessage('please wait...')


 try{
  const url=`${prefix}/admin/users/${userId}`
  const response = await axios.delete(url,{withCredentials:true})
  setLoadingMessage('user deleted')
  setUsers((prevUsers)=>prevUsers.filter((user)=>user._id!==userId))
 }


 catch(err){
  
  setLoadingMessage('error deleting user please try again')
 }

 finally{


  resetLoadingText()

 }

}


const data={
 isVerified:true,
}

const verifyUser=async()=>{


 setIsVerifyHidden(true)

 setLoadingMessage('please wait...')


 const config={
  headers:{
   'Content-Type': 'application/json',
 },
 withCredentials: true,
 }
 



 try{
  const url=`${prefix}/admin/verify-users/${userId}`
  const response = await axios.patch(url,data,config)
  setLoadingMessage('user has been verified successfully')
 }


 catch(err){
 
  setLoadingMessage('error verifying user')

 }

 finally{

  resetLoadingText()

 }

}








 return (
  <>
  <LayOut>
    <main className='admin-container'>

    

  <p style={{fontSize:'3em',textAlign:'center',margin:'0.0em 0'}}>Admin</p>


<section>

<p style={{textAlign:'center',fontWeight:'600',fontSize:"2em"}}>Users</p>

<div className='user-container'>



{

users.map((user,index)=>{
 return(
  <div className='user-group' key={user._id}>
 <div className='user-circle'>
  <FaUser className='users'></FaUser>
 </div>
<div className='user-text'>{user.firstName} {user.lastName}</div>
<div className='user-text'>Role:{user.role}</div>

<div className='user-btn-container'>

<button className='btn btn-primary user-btn' style={{backgroundColor:"green",border:'green solid 2px'}} data-id={user._id}  onClick={handleVerify}>Verify User</button>
<button className='btn btn-danger  user-btn' data-id={user._id}  onClick={handleDelete}>Delete User</button>

</div>


</div>
 )
})

}
















</div>


<div className={isWarningHidden?'hide':'delete-confirmation alert-warning'} style={deleteStyles}>
 <p style={{textAlign:'center'}}>Are you sure you want to delete this user</p>

 <div style={{display:'flex',justifyContent:"space-around",alignItems:'center',width:"60%"}}>
 <button className='btn btn-danger ' onClick={deleteUser}>Yes</button>
<button className='btn btn-secondary  '  onClick={()=>setIsWarningHidden(true)}>No</button>
 </div>
</div>


<div className={isVerifyHidden?'hide':'verify-confirmation alert-warning'} style={verifyStyles}>
 <p style={{textAlign:'center'}}>Are you sure you want to verify this user</p>

 <div style={{display:'flex',justifyContent:"space-around",alignItems:'center',width:"60%"}}>
 <button className='btn btn-primary ' onClick={verifyUser} style={{backgroundColor:'green'}}>Yes</button>
<button className='btn btn-secondary  '  onClick={()=>setIsVerifyHidden(true)}>No</button>
 </div>
</div>







<div style={{textAlign:'center'}}>{loadingMessage}</div>


</section>



</main>
  </LayOut>
  
  
  
  </>
 )
}


export default Admin