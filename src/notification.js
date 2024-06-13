import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import 'react-datepicker/dist/react-datepicker.css';

import { AiOutlineDelete } from 'react-icons/ai';
import {  useNavigate } from 'react-router-dom'
import { FaRegClock,FaAngleLeft,FaAngleRight, } from 'react-icons/fa';
//import {shoes, } from './context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useGlobal, input } from './context'

import axios from 'axios'


import LayOut from './lay-out';
import { logDOM } from '@testing-library/react';




  const Notification= ()=>{
    const {prefix}= useGlobal()

const [notificationData,setNotificationData]= useState([])

const [textId,setTextId]=useState('')
const [page,setPage]=useState(1)


const [isPageLoading,setIsPageLoading] =useState(false)
  const [isEnd,setIsEnd]=useState(false)


   


   const fetchNotification=async()=>{
    try{

      const url=`${prefix}/shops/fetch-notifications/${page}`
      const response= await axios.get(url,{withCredentials:true})
      console.log(response,'notfication fetched');
      console.log(response.data.data.notifications,'notfication fetched');
      setNotificationData(response.data.data.notifications)

    }

    catch(err){
      console.log(err);
    }
   }




   useEffect(()=>{

   fetchNotification()

   },[])


  

  

   const readMessage=async(e)=>{
    

    const id=e.currentTarget.dataset.id

    const read=e.currentTarget.dataset.read




    if(read==='false'){

      try{

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
  
        const url=`${prefix}/shops/mark-as-read`
  
        const response= await axios.patch(url,{id},{withCredentials:true})
       console.log(response,'tako');
  
       setTextId(id)
   
  
      }
  
      catch(err){
        console.log(err);
      }

    }
  
   }



   const handlePage=(track)=>{

    if (track==='prev'){
      if (page===1){
        return
      }
  
      setIsPageLoading(true)
      setPage(page-1)
  
    }
  else {
    setIsPageLoading(true)
  
    setPage(page+1)
  }
  
  
  
  
  }
   






  const deleteNotification= async(e)=>{
const id= e.currentTarget.dataset.id


    try{
      const url = `${prefix}/shops/delete-notification/${id}`

      const response= await axios.delete(url,{withCredentials:true})

      if(response.status===200){
        setNotificationData((prev)=>prev.filter((item)=>item._id!==textId))
      }

    }

    catch(err){

    }
  }



 return(
  <>
  
  <LayOut>

  
<main  className='notification-whole-container'>




<h4>Notifications</h4>

{
  notificationData.length!==0 ?(
    <>
    
<section className='notification-content-container'>

{
  notificationData.map((item)=>{
    return(
      <>
      <div className='notification-part'>
  <div className='notification-part-one'>



   <section className='notification-part-one-right'>
   <div className='not-cancel-container'  data-id={item._id} onClick={deleteNotification}  style={{cursor:'pointer'}}>X</div>
   <button className='notification-title-btn'>MESSAGE</button>
   </section>

  
   <div className='notification-clock-container'>
    <FaRegClock></FaRegClock>
    <div className='notification-time-shower'>{moment.utc(item.createdAt).tz('Africa/Lagos').format('DD/MM/YYYY   MM ss')}</div>
   </div>
  </div>

  <div className='notification-head' style={{fontWeight: item.isRead===false?"700":'500',color: item.isRead===false?"green":'black'}}>{item.subject} {
     
  }  {
    item.isRead===false && (
      <>
    <div className=' notification-read-btn'   data-id={item._id} data-read={item.isRead}  onClick={readMessage}>read </div>
      </>
    )
  } </div> 


{
  (item.isRead===true || textId===item._id) && (
    <>
    
    <article >
  {
  item.identity==='understock' && (
    <>
   <p className='notification-text'> The inventory level for product Id {item.productSku} of {item.productName} is now below the restock threshold. Please take action to replenish stock to avoid shortages.</p>  
    
    </>
  )
}

{
  item.identity === 'expiring-soon' && (
    <>
      <p className='notification-text'> The product {item.productName} with (batch No: {item.invBatch}) (SKU: {item.productSku}) is about to expire. Please take action to utilize or dispose of it before the expiry date.</p>
    </>
  )
}




{
  item.identity === 'about-expire-sub' && (
    <>
      <p className='notification-text'>Your {item.subType} subscription is about to expire. Please renew your subscription within the next two days to continue enjoying uninterrupted access to our services. {
        
        item.subCredit!==undefined && item.subCredit>0  && (
          <>
           Kindly note that you have {item.subCredit} unused sales credit, kindly ensure you subscribe before your subscription expire to avoid loosing it.
          
          </>
        )
      }
      </p>
    
    </>
  )
}


{
  item.identity === 'subscription-expire'  && (
    <>
      <p className='notification-text'>Your  {item.subType} subscription has  expire. Please subscribe  to continue enjoying our services.</p>
    </>
  )
}





  </article>
    </>
  )
}




 
<div className='notification-last-line'></div>
 </div>
      
      </>
    )
  })
}




{
  isPageLoading && (
    <>
    
    <div style={{width:'100%',textAlign:'center',height:'30px',backgroundColor:'blue',color:'white',display:'flex',justifyContent:'center',alignItems:'center',margin:'8px',fontWeight:'500'}}>Loading Documents...</div> 
    
    </>
  )
}

 


<div className='load-more-container'>
  <div className='load-more-button-text'>
   <button className={page!==1?'btn btn-primary loadmore-btn':'btn btn-primary loadmore-btn dead-btn'} onClick={()=>handlePage('prev')}>
    <FaAngleLeft size={20}></FaAngleLeft>
   </button> 
   <div style={{marginLeft:'8%'}}>Previous</div>
  </div>

  <div className='load-more-button-text'>
  <div style={{marginRight:'8%'}}>Next</div>
   <button className={!isEnd?'btn btn-primary loadmore-btn':'btn btn-primary loadmore-btn dead-btn'}  onClick={()=>handlePage('next')}>
    <FaAngleRight size={20}></FaAngleRight>
   </button>
   

  </div>


</div>



</section>

    </>
  ):(
    <>
    
<section className='notification-content-container'>

<div style={{width:'100%',height:'20%',display:'flex',textAlign:'center',justifyContent:'center'}}>


<div>
          <FontAwesomeIcon icon={faBell} size="3x" />
          <p>No notifications to show.</p>
        </div>

</div>


</section>

    
    </>
  )
}





</main>



  </LayOut>
  
 
  
  </>
 )
}


export default Notification