import React, { useState, useEffect,useRef, } from 'react';
import LayOut from './lay-out';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios'

import { useGlobal } from './context'






const Upgrade=()=>{




  return(
    <>
    
  <h1>Upgrade your plan</h1>
    
    </>
  )

}















 const Subscription=()=>{


const {prefix} = useGlobal()




const subscribe= async(parameter)=>{

  const data={
    type: parameter
  }


  console.log(data,'this case is yet to end')


  try{


    const config={
      headers:{
        'Content-Type':'application/json'
      },

      withCredentials:true

    }

    const url= `${prefix}/shops/subscribe`

    const response = await  axios.post (url,data,config)

  }

  catch(err){
    console.log(err);
  }
}







 return (
  <>
 
<main  className='subscription-whole-container'>

<section className='subscription-first-line'>
 <h5  className='subscription-title'>Subscription</h5>

 <div className='subscription-indicator'>
  Monthly
 </div>

</section>

<section className='subscription-block-container'>








<div  className='subscription-block'>
  <div className='block-first-line'>
  <div>BASIC</div>


  </div>
  <div className='block-second-line'>

    <div>&#x20A6;3,000</div>
  </div>
  <div className='block-third-line'>

  <div><FaCheck style={{color:'green'}}></FaCheck>  2 Users</div>
  <div><FaCheck style={{color:'green'}}></FaCheck>  500 Sales Record/Month</div>


  </div>

<div className='block-fourth-line'>
<button className='sub-btn'   onClick={()=>subscribe('basic')}>SUBSCRIBE</button>

</div>


<div className='block-fifth-line'>

<div  className='more-ft'>more features</div>

  <div><FaCheck style={{color:'green'}}></FaCheck> Basic Financial Analysis</div>

  

</div>



 </div>



















 <div  className='subscription-block'>
  <div className='block-first-line'>
  <div>STANDARD</div>


  </div>
  <div className='block-second-line'>

    <div>&#x20A6;5,000</div>
  </div>
  <div className='block-third-line'>

  <div><FaCheck style={{color:'green'}}></FaCheck>  3 Users</div>
  <div><FaCheck style={{color:'green'}}></FaCheck>  800 Sales Record/Month</div>


  </div>

<div className='block-fourth-line'>
<button className='sub-btn' onClick={()=>subscribe('standard')}>SUBSCRIBE</button>

</div>

<div className='block-fifth-line'>

<div  className='more-ft'>more features</div>

  <div><FaCheck style={{color:'green'}}></FaCheck> Basic Financial Analysis</div>

 

</div>


 </div>











 <div  className='subscription-block'>
  <div className='block-first-line'>
  <div>PREMIUM</div>


  </div>
  <div className='block-second-line'>

    <div>&#x20A6;10,000</div>
  </div>
  <div className='block-third-line'>

  <div><FaCheck style={{color:'green'}}></FaCheck>  5 Users</div>
  <div><FaCheck style={{color:'green'}}></FaCheck>  1200 Sales Record/Month</div>
  



  </div>

<div className='block-fourth-line'>
<button className='sub-btn'  onClick={()=>subscribe('premium')}>SUBSCRIBE</button>

</div>

<div className='block-fifth-line'>

<div  className='more-ft'>more features</div>
<div><FaCheck style={{color:'green'}}></FaCheck> Batch History Tracking</div>
  <div><FaCheck style={{color:'green'}}></FaCheck> Detail Financial Analysis</div>

  <div><FaCheck style={{color:'green'}}></FaCheck> Detail Product Analysis</div>

</div>



 </div>





 <div  className='subscription-block'>
  <div className='block-first-line'>
  <div>OUTRIGHT</div>


  </div>
  <div className='block-second-line'>

    <div>&#x20A6;150,000</div>
  </div>
  <div className='block-third-line'>

  <div><FaCheck style={{color:'green'}}></FaCheck>  Unlimited Users</div>
  <div><FaCheck style={{color:'green'}}></FaCheck>  Unlimited Sales Record</div>
  



  </div>

<div className='block-fourth-line'>
<button className='sub-btn'   onClick={()=>subscribe('outright')}>SUBSCRIBE</button>

</div>

<div className='block-fifth-line'>

<div  className='more-ft'>more features</div>
<div><FaCheck style={{color:'green'}}></FaCheck> Batch History Tracking</div>
  <div><FaCheck style={{color:'green'}}></FaCheck> Detail Financial Analysis</div>

  <div><FaCheck style={{color:'green'}}></FaCheck> Detail Product Analysis</div>

</div>



 </div>

























</section>


</main>

 
  </>
 )
}


export default Subscription;