import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';


export const  Preloader=()=> {






  return (
    <>
  
       
       <div className="loading-spinner">
  <LazyLoadImage src='forklift-logo.png' ></LazyLoadImage>
      
                </div>
        
       




    
    </>
   // <div className="loading-spinner">
   //   <div className="circle"></div>
   // </div>

  );
}



export const  miniPreloader=()=> {

 
  
  
  
  
    return (
      <>
    
         
         <div className="mini-loading-spinner">
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


export const SemiPreloader=()=>{
  return(
    <>
    <section className='inventory-delete-overlay'>

    </section>
<div class="loadingio-spinner-spinner-nq4q5u6dq7r"><div class="ldio-x2uulkbinbj">
<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
</div></div>

    
    
    </>
  )
}

