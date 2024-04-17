import React, { useEffect, useState } from 'react';


export const  LoadingSpinner=()=> {

const [six,setSix]= useState(true)


useEffect(()=>{
  const t=setTimeout(()=>{
setSix(false)
  },4000)
//return clearTimeout(t)
},[])




  return (
    <>
    {
      six ? (
        <>
        
    <div className="loading-spinner" style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100vw',backgroundColor:''}}>
    <h1 className='six-spinner' s>6</h1>
    </div>
        
        </>
      ):(
        <>
       <div className="loading-spinner">
     <div className="circle"></div>
   </div>
        
        </>
      )
    }




    
    </>
   // <div className="loading-spinner">
   //   <div className="circle"></div>
   // </div>

  );
}

 

export  const LoadingDot = () => {
  return (
    <div class="loading-container">
  
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
  );
};

