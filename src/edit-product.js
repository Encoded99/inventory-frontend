     
import React, { useState, useEffect,useRef, } from 'react'

import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { useGlobal,  } from './context'
import { FaArrowLeft  } from 'react-icons/fa'; 
import axios from 'axios'




import LayOut from './lay-out';


import 'react-datepicker/dist/react-datepicker.css';









const EditProduct = () => {

  const {prefix,specificData,fetchProductInfo,setLoadingMessage,loadingMessage,resetLoadingText,setApiError,apiError,userRole,fetchProfile}=useGlobal()


  const [bulkPrice,setSellingPriceBulk]= useState('')
const [piecesPrice, setSellingPricePiece]=useState('')
const [name,setName] =useState('')
const [message,setMessage]= useState('')
const available=true;
const status='verified'
const [consentChecked, setConsentChecked] = useState(false);

const handleCheckboxChange = (event) => {
  setConsentChecked(event.target.checked);
};


const itemId= localStorage.getItem('product-id')

const navigate=useNavigate()


useEffect(()=>{

  fetchProfile()
 

  if(itemId){
    fetchProductInfo()
  }

  else{
    navigate('/inventory')
  }

  
},[])


const resetText=()=>{
  const t= setTimeout(()=>{

    setMessage('')

  },5000)


  return ()=>clearTimeout(t)
}



const editBody={
 name,
  currentPrice:{
    bulkPrice: parseFloat(bulkPrice),
    piecesPrice: parseFloat (piecesPrice),
    
  },
  available,
    status,
  
}
  
 
 
 const editInfo=async()=>{




 
 
  







  

  setMessage('please wait...')




  const entries = Object.entries(editBody);
  const data = Object.fromEntries(entries.filter(([key, value]) => value !== '' && value!==undefined && value!==0));


  if (isNaN(data.currentPrice.bulkPrice) || data.currentPrice.bulkPrice === 0) {
    delete data.currentPrice.bulkPrice;
  }
  
  if (isNaN(data.currentPrice.piecesPrice) || data.currentPrice.piecesPrice === 0) {
    delete data.currentPrice.piecesPrice;
  }






if(Object.keys(data.currentPrice).length===0){
  delete data.currentPrice
}




if(Object.keys(data).length===0){
  
  setMessage('empty input, no changes made')
  return
}





   const url= `${prefix}/products/edit-product/${itemId}`;
 
   const config={
    headers:{
     'Content-Type': 'application/json',
   },
   withCredentials: true,
   }

   try{

   const response = await axios.patch(url,data,config)

    
    setApiError(false)
 setMessage('product information updated')

setName('')
setSellingPriceBulk('')
setSellingPricePiece('')
   }


   catch(error){

    setApiError(true)
    if (error.request) {
      
      setMessage('Error connecting to the server')
  
    } 

    else {
   
      setMessage(error.message)
    }
    


   }






finally{
  resetText()
}





 }


 const storedID= localStorage.getItem('product-id')
 const deleteProduct=async()=>{


  setLoadingMessage('please wait')



 
  const url= `${prefix}/products/${itemId}`;
  try{


    if (!consentChecked){
      setApiError(true)
      setLoadingMessage('Please confirm your consent by checking the box above before proceeding with the deletion')
    
      return
    }
  

    const response = await axios.delete(url,{withCredentials:true})

    if(storedID){
      localStorage.removeItem('product-id');

    }

    setApiError(false)
    
    setLoadingMessage('product deleted sucessfully')

  }

  catch(error){
    setApiError(true)
    if (error.request) {
     
      setLoadingMessage('Error connecting to the server')
  
    } else {
      
      setLoadingMessage(error.message)
    }

  }

  finally{
    resetLoadingText()
  }
  
  


 }
  









 





 return (
   <>
   
   <LayOut>
   <section className='register-main'>

   <div className='back-container' style={{cursor:'pointer'}} onClick={()=>navigate('/product-info')}> <FaArrowLeft size={15}></FaArrowLeft> back </div>
   <p style={{fontSize:'3em',textAlign:'center',margin:'0.0em 0'}}>Edit Product </p>


  




   {
 specificData && (
  <>
  
  <div style={{fontSize:"1.0em",}} className='add-inventory-info-container'>

   <div  className='specific-data-container'>

   
  {specificData && specificData.length > 0 ? (
  <p>
    Product name: <strong >{specificData[0].name.charAt(0).toUpperCase() + specificData[0].name.slice(1).toLowerCase()}</strong>
  </p>
) : (
  <p></p>
)}

{specificData && specificData.length > 0 ? (
  <p>
    Product ID: <strong >{specificData[0].sku}</strong>
  </p>
) : (
  <p></p>
)}

{specificData && specificData.length > 0 ? (
  <p>
    Unit per Bulk: <strong >{specificData[0].upb}</strong>
  </p>
) : (
  <p></p>
)}

{specificData && specificData.length > 0 ? (
  <p>
    Current Price Bulk: <strong >&#x20A6;{specificData[0].currentPrice.bulkPrice}</strong>
  </p>
) : (
  <p></p>
)}

{specificData && specificData.length > 0 ? (
  <p>
    Current Price Pieces: <strong >&#x20A6;{specificData[0].currentPrice.piecesPrice}</strong>
  </p>
) : (
  <p></p>
)}
   
  
   </div>





   <div  className='specific-data-image-container'>
    
        
   {specificData && specificData.length > 0 ? (
  <div>

   <LazyLoadImage style={{width:'100%'}} 
   src={specificData?.[0]?.image?.[0]
    ?.url || '360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'}
   
   ></LazyLoadImage>
    
  </div>
) : (
  <div></div>
)}




        </div>





</div>
  
  
  </>
 )
}




 
<div className='first-register-section'>


   
<div className='register-data-container'>
    <p  className='register-text'>Name</p>

<input type="text"  className='register-input form-control' value={name}  onChange={(e)=>setName(e.target.value)}/>

    </div>



    <div className='register-data-container'>
    <p  className='register-text'>Selling Price (bulk)*</p>

<input type="text"  value={bulkPrice}  className='register-input form-control' 

onChange={(e) => {
  const inputValue = e.target.value;

  // Allow only digits and a dot
  const sanitizedInput = inputValue.replace(/[^\d.]/g, '');

  // Ensure there's at most one dot
  const dotCount = sanitizedInput.split('.').length - 1;

  if (dotCount <= 1) {
    // Update state with the sanitized input
    setSellingPriceBulk(() => sanitizedInput);
  }
}}




  inputmode="numeric"

  />

    </div>





    <div className='register-data-container'>
    <p  className='register-text'>Selling Price (pieces)*</p>

<input type="text"  value={piecesPrice}  className='register-input form-control'  


onChange={(e) => {
  const inputValue = e.target.value;

  // Allow only digits and a dot
  const sanitizedInput = inputValue.replace(/[^\d.]/g, '');

  // Ensure there's at most one dot
  const dotCount = sanitizedInput.split('.').length - 1;

  if (dotCount <= 1) {
    // Update state with the sanitized input
    setSellingPricePiece(() => sanitizedInput);
  }
}}




inputmode="numeric"


/>

    </div>








</div>



<div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginBottom:"5em"}}>


<button className='register-submit-btn btn btn-primary' onClick={editInfo}>SUBMIT</button>

<br />

<div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700'}}>
  {message}
</div>


</div>


{
  userRole==='admin' && (
    <>
    <p style={{fontSize:'2em',textAlign:'center',margin:'0.5em 0', color:'red'}}>Delete Product</p>

<div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginBottom:"5em"}}>

<div  style={{width:'90%',textAlign:'justify',fontWeight:"bolder"}}>
<strong  style={{color:'red'}}> Warning: </strong>   
<br />
Caution: Deleting products is an irreversible action. This will permanently remove the product and associated data, including sales history. Consider potential data loss, audit trail logging, dependencies on active processes, and your user permissions.



</div>

<div style={{fontWeight:'bold',color:'red',margin:'1em 0',textAlign:'center'}}>Are you sure you want to proceed with deleting this product?</div>
  
  <div>

    <div>
  
  <input type="checkbox"   checked={consentChecked}  onChange={handleCheckboxChange}/> I confirm that I understand and consent to the above warning

    </div>
    
  </div>
   <div className='delete-product-btn-container'>
   <button className=' btn btn-danger delete-product-btn' onClick={deleteProduct}>Delete</button>
 

   </div>

   <div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700'}}>
  {loadingMessage}
</div>

</div>
    
    
    </>
  )
}
















   </section>






   
   
   
   </LayOut>
  
   </>
 );
};

export default EditProduct;