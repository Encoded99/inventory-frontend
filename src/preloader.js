import React, { useEffect, useState } from 'react';


export const  Preloader=()=> {

const [six,setSix]= useState(true)


useEffect(()=>{
  const t=setTimeout(()=>{
setSix(false)
  },4000)
//return clearTimeout(t)
},[])




  return (
    <>
  
       
       <div className="loading-spinner">
     <div className="circle"></div>
                </div>
        
       




    
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

