         
     
import React, { useState, useEffect } from 'react'
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaCheck,FaTwitter,FaFacebook,FaLinkedin } from 'react-icons/fa'; 
import axios from 'axios'




//import {cloth} from './filter'
//import { cl } from './context'
import {LoadingSpinner} from './spinner'
























function App(){
  const {setIsSignInHidden,setIsSignUpHidden,setInstance,}= useGlobal()
const navigate=useNavigate()



const navigateToSignUp=()=>{

  navigate('/sign-up')
}

const navigateToSignIn=()=>{
 
  navigate('/log-in')
}


useEffect(()=>{

  const docWidth = document.documentElement.offsetWidth;

[].forEach.call(
  document.querySelectorAll('*'),
  function(el) {
    if (el.offsetWidth > docWidth) {
      console.log('Overflowing element:', el);
      el.style.border = '1px solid blue';
    }
  }
);


},[])




  return(
    <>
<main className='home-page-container'>

<section className='home-first-section'>
  <div className='first-logo-container'>iVy</div>
  <div className='second-home-first-section'>
<Link className='home-link' to={'/subscriptions'}>Subscription</Link>
<Link className='home-link'to={'/log-in'} >Log In</Link>
<button className='home-btn' onClick={navigateToSignUp}>Sign up</button>


  </div>


</section>


<section className='home-modal'>

  <button className='home-modal-btn'>
  Join others and save hours daily
  </button>
<div className='modal-first-statement'>Boost your business efficiency with our <span className='modal-span'>comprehensive POS and inventory</span>    management software
</div>

<div className='modal-second-statement' >Accelerate Your Sales and Inventory Processes with Ease
</div>

<button className='modal-btn' onClick={navigateToSignUp}>Get started now</button>

<article className='home-modal-img-container'>
  <LazyLoadImage src='localhost_5_19_2024_19_47_55.png' className='home-img'></LazyLoadImage>

</article>
</section>


<section className='second-home-modal'>
  <div className='second-home-heading'>Optimize Efficiency, Maximize Profitability</div>

  <div className='second-home-text' >Whatever your business needs, ivy empowers you to seamlessly manage your sales and inventory, tailored specifically for the Nigerian SME market. Gain comprehensive insights into your stock levels and sales trends, streamline your operations, and elevate your business efficiency and profitability.</div>

<section className='pitch-container'>
<article className='home-text-img-container'>
    <LazyLoadImage  className='home-text-img' src='pexels-tima-miroshnichenko-6169659.jpg'></LazyLoadImage>
    <div className='home-text-text'  style={{paddingLeft:'15px'}}>
      <div className='home-text-heading' >Sales Recording and Inventory Management</div>

      <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}> Experience seamless control over your inventory and sales operations with our meticulously crafted web-based software, meticulously tailored to cater to the unique needs of local SME shops. 
      </p>
      
      <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Our intuitive platform empowers you to effortlessly navigate the complexities of inventory management and sales tracking. From the moment a user signs up and initiates a sale, our advanced system seamlessly records every transaction, meticulously updating your inventory in real-time by automatically deducting the quantity sold. </p>
   
    </div>

  </article>

  <article className='home-text-img-container'>
   
    <div className='home-text-text'  style={{paddingRight:'15px'}}>
      <div className='home-text-heading' >Daily Sales Tracking</div>

      <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Unlock the power of data-driven insights and effortlessly track your daily sales performance with our innovative software solution. Seamlessly integrated into our platform is a dedicated page meticulously designed to empower users to delve into their sales metrics on a day-to-day basis.</p>

      <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Our  intuitive feature not only simplifies the process of monitoring sales but also provides a comprehensive overview of performance trends over time. Armed with this invaluable data, users can uncover hidden patterns, identify emerging opportunities, and pinpoint areas for growth with precision </p>
   
    </div>

    <LazyLoadImage  className='home-text-img' src='close-up-disabled-worker-with-protective-mask-immobilized-wheelchair-working-computer.jpg'></LazyLoadImage>

  </article>


  <article className='home-text-img-container'>
    <LazyLoadImage  className='home-text-img' src='pexels-tiger-lily-4483610.jpg'></LazyLoadImage>
    <div className='home-text-text' style={{paddingLeft:'15px'}}>
      <div className='home-text-heading' >Real-time Inventory Monitoring</div>

      <p  className='home-real-text' style={{fontSize:'1.2rem',textAlign:'justify'}}>Stay informed about your product availability at all times. With our software, users can conveniently check the quantity of each product left in their shop in real-time. Whether it's provisions, electronics, or clothing wears, monitor your inventory levels effortlessly</p>
      <p   style={{fontSize:'1.2rem',textAlign:'justify'}}>Access historical inventory data to make informed decisions. Our software allows users to view past inventory quantities, including quantities for specific dates. Whether it's yesterday's stock levels or inventory data from months ago, gain valuable insights into your product availability over time.</p>
   
   
    </div>

  </article>





  <article className='home-text-img-container'>
   
   <div className='home-text-text' style={{paddingRight:'15px'}}>
     <div className='home-text-heading' >Profitability Analysis</div>

     <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Harness the power of data to drive profitability. Our software enables users to analyze profitability by identifying the most profitable goods and accessing historical financial data. Dive deep into past financial records, track trends over time, and make data-driven decisions to optimize your business's financial performance</p>

     <p   style={{fontSize:'1.2rem',textAlign:'justify'}}> Our software provides detailed information about each product, including sales trends, quantity changes, and profitability analysis. Empower yourself with the data you need to optimize your product offerings and maximize revenue</p>
  
  
   </div>

   

   <LazyLoadImage  className='home-text-img' src='3543960.jpg'></LazyLoadImage>

 </article>


</section>



<section className='mobile-pitch-container'>
<article className='home-text-img-container'>
    <LazyLoadImage  className='home-text-img' src='pexels-tima-miroshnichenko-6169659.jpg'></LazyLoadImage>
    <div className='home-text-text'>
      <div className='home-text-heading' >Sales Recording and Inventory Management</div>

      <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}> Experience seamless control over your inventory and sales operations with our meticulously crafted web-based software, meticulously tailored to cater to the unique needs of local SME shops. 
      </p>
      
      <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Our intuitive platform empowers you to effortlessly navigate the complexities of inventory management and sales tracking. From the moment a user signs up and initiates a sale, our advanced system seamlessly records every transaction, meticulously updating your inventory in real-time by automatically deducting the quantity sold. </p>
   
    </div>
  </article>




  <article className='home-text-img-container'>
  <LazyLoadImage  className='home-text-img' src='close-up-disabled-worker-with-protective-mask-immobilized-wheelchair-working-computer.jpg'></LazyLoadImage>
   
   <div className='home-text-text'>
     <div className='home-text-heading' >Daily Sales Tracking</div>

     <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Unlock the power of data-driven insights and effortlessly track your daily sales performance with our innovative software solution. Seamlessly integrated into our platform is a dedicated page meticulously designed to empower users to delve into their sales metrics on a day-to-day basis.</p>

     <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Our  intuitive feature not only simplifies the process of monitoring sales but also provides a comprehensive overview of performance trends over time. Armed with this invaluable data, users can uncover hidden patterns, identify emerging opportunities, and pinpoint areas for growth with precision </p>
  
   </div>

  

 </article>


 <article className='home-text-img-container'>
    <LazyLoadImage  className='home-text-img' src='pexels-tiger-lily-4483610.jpg'></LazyLoadImage>
    <div className='home-text-text'>
      <div className='home-text-heading' >Real-time Inventory Monitoring</div>

      <p  className='home-real-text' style={{fontSize:'1.2rem',textAlign:'justify'}}>Stay informed about your product availability at all times. With our software, users can conveniently check the quantity of each product left in their shop in real-time. Whether it's provisions, electronics, or clothing wears, monitor your inventory levels effortlessly</p>
      <p   style={{fontSize:'1.2rem',textAlign:'justify'}}>Access historical inventory data to make informed decisions. Our software allows users to view past inventory quantities, including quantities for specific dates. Whether it's yesterday's stock levels or inventory data from months ago, gain valuable insights into your product availability over time.</p>
   
   
    </div>

  </article>

  <article className='home-text-img-container'>
  <LazyLoadImage  className='home-text-img' src='3543960.jpg'></LazyLoadImage>
   
   <div className='home-text-text' >
     <div className='home-text-heading' >Profitability Analysis</div>

     <p className='home-real-text'  style={{fontSize:'1.2rem',textAlign:'justify'}}>Harness the power of data to drive profitability. Our software enables users to analyze profitability by identifying the most profitable goods and accessing historical financial data. Dive deep into past financial records, track trends over time, and make data-driven decisions to optimize your business's financial performance</p>

     <p   style={{fontSize:'1.2rem',textAlign:'justify'}}> Our software provides detailed information about each product, including sales trends, quantity changes, and profitability analysis. Empower yourself with the data you need to optimize your product offerings and maximize revenue</p>
  
  
   </div>

   

 

 </article>




  
</section>
  

 <article className='brief-plan-info-container'>
  <div className='brief-partition text-partition'>
    <div><FaCheck  style={{color:'green'}} size={20}/> 2 Users</div>
    <div><FaCheck  style={{color:'green'}} size={20}/> 500 Sales Record/Month</div>
    
    <div><FaCheck  style={{color:'green'}} size={20}/> Receipt Generation</div>
    
  </div>
  <div className='brief-partition'>

    <strong className='brief-price-heading'>&#x20A6;3000/m</strong>
    <div style={{textAlign:'',width:'100%',backgroundColor:''}}> Starting Price</div>
    <div style={{textAlign:'',width:'100%',backgroundColor:'',display:'',justifyContent:'',alignItems:''}}>

      <button className='check-plan-btn'>Check all plans</button>  
    
    </div>
    
    </div>
    <div className='brief-partition text-partition'>
    <div><FaCheck  style={{color:'green'}} size={20}/> Basic Business Analysis</div>
    <div><FaCheck  style={{color:'green'}} size={20}/> Detail Product  Evaluation</div>
    <div><FaCheck  style={{color:'green'}} size={20}/> Basic Finacial Analysis</div>
    
    </div>

   
 </article>


</section>


<section className='footer-modal'>

  <div style={{textAlign:'center',fontSize:'1rem',color:'white',fontWeight:'500'}}>Why wait any longer?</div>
  <div style={{textAlign:'center',fontSize:'2rem',color:'white',fontWeight:'500',width:''}} className='streamline'>Streamline your inventory management
and boost your business efficiency</div>
<button className='footer-register-btn' onClick={navigateToSignUp}>Register</button>



<section className='mobile-footer-link-container'>

  
<div className='mobile-link-content-container'>

<div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column',}}>    
<div className='footer-logo' >iVy</div>
<div className='footer-statement' >Ivy empowers small businesses and retailers to streamline their inventory processes, providing insights that enhance stock management</div>
</div>
</div>




<div className='footer-link-container'>


<div className='mobile-link-content-container ' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{color:'yellow'}}>Quick links</div>


<Link className='quick-links'>About Us</Link>
<Link className='quick-links'>Refer & Win</Link>


  </div>


</div>
<div className='mobile-link-content-container quick-links-container' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{color:'yellow'}}>Legal</div>

<Link className='quick-links'>Pricing</Link>
<Link className='quick-links'>Terms & Conditions</Link>
<Link className='quick-links'>Privacy Policy</Link>

  </div>


</div>





</div>

<section  style={{width:'100%',backgroundColor:'',display:'flex',justifyContent:"flex-start",alignItems:'center',height:'auto'}}>
<div className='last-link' style={{backgroundColor:''}}>

<div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

<div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'yellow',}} >Contact Us</div>
<div style={{marginTop:"0px",display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'white',fontSize:'1.0rem'}} > ivy@support.com</div>
<div style={{marginTop:"0px",display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'white',fontSize:'1.0rem'}} >+2349037936473</div>



<section style={{width:'100%',}}>
<article className='footer-social-link-container'>

<FaTwitter className='social-link'></FaTwitter>
<FaFacebook className='social-link'></FaFacebook>
<FaLinkedin className='social-link'></FaLinkedin>

</article>
</section>

</div>


</div>


</section>




















</section>








<section className='whole-footer-container'>

<article className='footer-link-container'>






<div className='link-content-container'>

<div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column',}}>    
<div className='footer-logo' >iVy</div>
<div className='footer-statement' >Ivy empowers small businesses and retailers to streamline their inventory processes, providing insights that enhance stock management</div>





</div>



</div>

<div className='link-content-container ' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{color:'yellow'}}>Quick links</div>


<Link className='quick-links'>About Us</Link>
<Link className='quick-links'>Refer & Win</Link>


  </div>


</div>
<div className='link-content-container quick-links-container' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{color:'yellow'}}>Legal</div>

<Link className='quick-links'>Pricing</Link>
<Link className='quick-links'>Terms & Conditions</Link>
<Link className='quick-links'>Privacy Policy</Link>

  </div>


</div>


<div className='link-content-container quick-links-container' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'yellow',}} >Contact Us</div>
<div style={{marginTop:"0px",display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'white',fontSize:'1.0rem'}} >Email: ivy@support.com</div>
<div style={{marginTop:"0px",display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'white',fontSize:'1.0rem'}} >Telephone: +2349037936473</div>



<section style={{width:'100%',}}>
<article className='footer-social-link-container'>

  <FaTwitter className='social-link'></FaTwitter>
  <FaFacebook className='social-link'></FaFacebook>
  <FaLinkedin className='social-link'></FaLinkedin>

</article>
</section>

  </div>


</div>


</article>
</section>



<div className='font-text copy-right-section'  > &copy; Copyright Encoded Technology  2024 . All Rights Reserved.</div>
</section>


</main>
    </>
  )
}






export default App
// 