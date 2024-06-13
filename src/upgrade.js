
import React, { useState, useEffect,useRef, } from 'react'
import { Link } from 'react-router-dom'
import LayOut from './lay-out'
import { useGlobal } from './context'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import { FaArrowUp, } from 'react-icons/fa'; 
  const Upgrade=()=>{



  const {setIsPreLoaderRunning} =useGlobal()


  useEffect(()=>{

   setIsPreLoaderRunning(false)

  },[])






 return(
  <>

  

  <section className='upgrade-main-container'>
   <div  className='upgrade-article-container' >
  
 
    <LazyLoadImage 
        src='/hand-drawn-cartoon-rocket-illustration_561641-10511.jpg' 
        className='upgrade-img'
     />
  <h4  style={{fontSize:'2em'}} className='subscription-title'>Upgrade your Plan</h4>

  <p className='upgrade-text' style={{color:"gray"}}>Please upgrade your plan to  access this feature</p>


    <strong className='upgrade-text ' >Premium: <span  className='upgrade-text upgrade-price'> &#x20A6;10000/ 30 days </span></strong>

    
    <strong className='upgrade-text ' >Outright: <span  className='upgrade-text upgrade-price'> &#x20A6;150000  </span></strong>



<Link to={'/subscriptions'}  className='upgrade-link'> 

<button className='btn btn-primary upgrade-btn upgrade-text'
     ><FaArrowUp></FaArrowUp> Upgrade Now</button>
</Link>



   </div>
   
   
   
   </section>  



 
  </>
 )
}


export default Upgrade