     
import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, } from './context'
import { FaTimes,FaArrowLeft } from 'react-icons/fa'; 
import axios from 'axios'


import LayOut from './lay-out';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logDOM } from '@testing-library/react';






const AddToInventory = () => {

  const {prefix,upb,batchNo,loadingMessage,setLoadingMessage,specificData,fetchProductInfo,resetLoadingText,apiError,setApiError,}=useGlobal()

  const [expiryDate, setDate]=useState(null)
  const [bulkQuantity,setQuantity]=useState('')
  const [piecesQuantity,setPquantity]= useState('')
  const [bulkPrice,setSellingPriceBulk]= useState('')
  const [piecesPrice, setSellingPricePiece]=useState('')
  const [costPrice,setCostPrice]= useState('')
  const [hasSubmitButtonClicked,setHasSubmitButtonClicked]= useState(false)
  const [ doesEmptyFieldExist, setDoesEmptyFieldExist] =useState(false)
  const [isConfirmHidden, setIsConfirmHidden]=useState(true)
  const [transactionDate,setTransactionDate] =useState(null)
  const itemId= localStorage.getItem('product-id')
  const [userRole,setUserRole]= useState('')
const navigate=useNavigate()


const fetchProfile = async () => {

  
  
  try {
   



    const url = `${prefix}/users/my-profile`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    const response = await axios.get(url, config);
 

    

    const profileData = response.data.data.data;
  
       setUserRole(profileData.role)
  


    
  } catch (error) {
 







   
     


    
  } finally {

  }
};









 useEffect(()=>{
  fetchProfile()
  if(itemId){
   fetchProductInfo()
 }

 else{
  navigate('/inventory')
 }

 },[])







const batch=batchNo+1


const data={
 
 expiryDate,


 
 price:{
  bulkPrice: parseFloat(bulkPrice),
 piecesPrice: parseFloat (piecesPrice),
 },
 costPrice:(piecesQuantity && bulkQuantity)?parseFloat(costPrice) + (((parseFloat(costPrice)/ parseFloat(bulkQuantity))/parseFloat(upb))*parseFloat(piecesQuantity)).toFixed(2):parseFloat(costPrice),


 quantity:(piecesQuantity && bulkQuantity)?  parseFloat(bulkQuantity*upb)+ parseFloat(piecesQuantity):(piecesQuantity&& !bulkQuantity)?parseFloat(piecesQuantity): parseFloat(bulkQuantity* upb),
 batch


}










const  CheckValidation=()=>{



 

  

  if( !costPrice || ! piecesPrice || !bulkPrice  || !expiryDate  ||parseFloat(costPrice)<=0 || parseFloat(piecesPrice)<=0 ||  parseFloat(bulkPrice)<=0 || parseFloat(upb)<=0  ){
   
   setDoesEmptyFieldExist(true)
   
  }

  else{
   
    setDoesEmptyFieldExist(false)
  }
}











const handleConfirm=()=>{


  if (!piecesQuantity && !bulkQuantity){
    setApiError(true)
    setDoesEmptyFieldExist(true)
    setLoadingMessage('Quantity can not be empty, please fill up either quantity in bulk or in pieces')


  resetLoadingText()
    return
  }
  

  if ((piecesQuantity==0 && bulkQuantity==0)||(piecesQuantity==0 && !bulkQuantity)||(bulkQuantity==0 && !piecesQuantity)){
    setApiError(true)
    setDoesEmptyFieldExist(true)
  setLoadingMessage('both pieces quantity and bulk quantity can not be zero or empty')
  
  resetLoadingText()
  
  return
  }




  CheckValidation()
setHasSubmitButtonClicked(true)

if(doesEmptyFieldExist){
setApiError(true)
  setLoadingMessage('please fill up all required field')

resetLoadingText()
  return
}



setIsConfirmHidden(false)



}











useEffect(()=>{


  CheckValidation()

 

},[bulkPrice,piecesPrice,upb,expiryDate,costPrice,piecesQuantity])







const handleSubmit=async()=>{

  if (transactionDate){
    data.transactionDate=transactionDate
  }





 setLoadingMessage('please wait...')



CheckValidation()
setHasSubmitButtonClicked(true)

if(doesEmptyFieldExist){
setApiError(true)
  setLoadingMessage('please fill up all required field')

resetLoadingText()
  return
}





const config={
 headers:{
  'Content-Type': 'application/json',
},
withCredentials: true,
}

const url= `${prefix}/products/add-inventory/${itemId}`


try{

 const response= await axios.post(url,data,config)

 setLoadingMessage('Quantity sucessfully added to the inventory')
 setApiError(false)
 setSellingPricePiece('')
setSellingPriceBulk('')
setCostPrice('')

setQuantity('')
setPquantity('')
setTransactionDate(null)
setDate(null)


}


catch (error){

 


 if (error.request) {
  
  setLoadingMessage('Error connecting to the server')

}


  else {
    
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




   {
  !isConfirmHidden && (
    <>
    <section className='register-confirmation-overlay'>
 <div className='register-confirmation-container'>
  <div style={{width:'100%'}}>
    <FaTimes style={{float:'right',marginRight:"4%",marginTop:"3%",fontSize:"2.4em",cursor:'pointer'}}  onClick={()=>{setIsConfirmHidden(true); resetLoadingText()}}></FaTimes>
</div>
<p className='inventory-confirm'>InventoryHero</p> 

<p style={{fontSize:'1.0em',margin:'2%',fontWeight:"bold",color:"black",textAlign:'center'}}> kindly confirm below details before submitting</p> 


<p  style={{fontWeight:"500"}}>EXPIRY DATE: <strong className='reg-details'>{moment(expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}</strong></p>


<p  style={{fontWeight:"500"}}>COST PRICE IN BULK: <strong className='reg-details'>&#x20A6;{costPrice}</strong></p>
<p  style={{fontWeight:"500"}}>SELLING PRICE IN BULK: <strong className='reg-details'>&#x20A6;{bulkPrice}</strong></p>
<p  style={{fontWeight:"500"}}>SELLING PRICE IN PIECES: <strong className='reg-details'>&#x20A6;{piecesPrice}</strong></p>

<button className='btn btn-secondary confirm-registeration-btn' onClick={handleSubmit}>SUBMIT</button>



<div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700',margin:"2vh 0"}}>
  {loadingMessage}
</div>



 </div>



</section>

    
    
    </>
  )
}











   <section className='register-main'>

   <div className='back-container' style={{cursor:'pointer'}} onClick={()=>navigate('/product-info')}> <FaArrowLeft size={15}></FaArrowLeft> back </div>
   <p style={{fontSize:'3em',textAlign:'center',margin:'0.0em 0'}}>Add  Inventory </p>


   



{
 specificData && (
  <>
  
  <div style={{fontSize:"1.0em",fontWeight:''}} className='add-inventory-info-container'>

   <div  className='specific-data-container'>

   
  {specificData && specificData.length > 0 ? (
  <p>
    Product Name: <strong>{specificData[0].name.charAt(0).toUpperCase() + specificData[0].name.slice(1).toLowerCase() }</strong>
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





   <div className='specific-data-image-container'>
    
        
   {specificData && specificData.length > 0 ? (
  <div>

   <LazyLoadImage style={{width:'100%'}}    src={specificData?.[0]?.image?.[0]?.url ||'360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'}></LazyLoadImage>
    
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
    <p  className='register-text'>Quantity(bulk)</p>

    <input
  value={bulkQuantity}
  type='text'
  placeholder={
    
    '' 
  }
  className={
    'register-input form-control important'
  }
  //onChange={(e) => setQuantity(parseFloat(e.target.value))}
  min={0}
  onKeyDown={(e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }}

  inputmode="numeric"


 
 

  onChange={(e) => {
    const inputValue = e.target.value;
  
    // Allow only digits and a dot
    const sanitizedInput = inputValue.replace(/[^\d.]/g, '');
  
    // Ensure there's at most one dot
    const dotCount = sanitizedInput.split('.').length - 1;
  
    if (dotCount <= 1) {
      // Update state with the sanitized input
      setQuantity(() => sanitizedInput);
    }
  }}
  

/>

    </div> 




    <div className='register-data-container'>
    <p  className='register-text'>Quantity(pieces)</p>

    <input
  value={piecesQuantity}
  type='text'
  placeholder={
    hasSubmitButtonClicked && piecesQuantity && (
      isNaN(parseFloat(piecesQuantity)) || piecesQuantity < 0 
    ) ?
    'Please enter a valid quantity bought in bulk' : ''
  }
  
  className={
    hasSubmitButtonClicked && piecesQuantity && (isNaN(parseFloat(piecesQuantity)) || piecesQuantity < 0 ) ?
    'register-input form-control important unfilled' : 'register-input form-control important'
  }
  //onChange={(e) => setQuantity(parseFloat(e.target.value))}
  min={0}
  onKeyDown={(e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }}

  inputmode="numeric"


 
 

  onChange={(e) => {
    const inputValue = e.target.value;
  
    // Allow only digits and a dot
    const sanitizedInput = inputValue.replace(/[^\d.]/g, '');
  
    // Ensure there's at most one dot
    const dotCount = sanitizedInput.split('.').length - 1;
  
    if (dotCount <= 1) {
      // Update state with the sanitized input
      setPquantity(() => sanitizedInput);
    }
  }}
  

/>

    </div>











    

    <div className='register-data-container'>
    <p  className='register-text' style={{marginRight:''}}>Expiry Date*</p>


    


   
  
    <div  className='register-input date-container'>
<DatePicker
 selected={expiryDate}
 onChange={(expiryDate) => setDate(expiryDate)}
 dateFormat="dd/MM/yyyy" // You can customize the date format


 className={hasSubmitButtonClicked && expiryDate === null ? 'register-input-date important unfilled' : 'register-input-date important'} 
 placeholderText={hasSubmitButtonClicked && expiryDate === null ? 'Please select an expiry date' : ''}  
 />
</div>





    </div>



   

   

    
 

 


</div>



  



   

    
   
  

 






<p style={{fontSize:'2em',textAlign:'center',margin:'0.5em 0'}}>Cost and Sales Information</p>

{
  userRole==='admin' && (
    <>
   <h6 style={{color:'red',textAlign:"center"}}>select the delivery date  only if it's not today; otherwise, you can skip.</h6>
 
    </>
  )
}


<div className='first-register-section'>



<div className='register-data-container'>

    <p  className='register-text'>Cost Price(bulk)*</p>

    <input type="text"  value={costPrice}
 placeholder={
  hasSubmitButtonClicked && (
    isNaN(parseFloat(costPrice)) || costPrice <= 0 || costPrice === ''
  ) ?
  'Please enter a valid cost price' : ''
}
className={
  hasSubmitButtonClicked && (isNaN(parseFloat(costPrice)) || costPrice <= 0 || costPrice === '') ?
  'register-input form-control important unfilled' : 'register-input form-control important'
}


onChange={(e) => {
  const inputValue = e.target.value;

  // Allow only digits and a dot
  const sanitizedInput = inputValue.replace(/[^\d.]/g, '');

  // Ensure there's at most one dot
  const dotCount = sanitizedInput.split('.').length - 1;

  if (dotCount <= 1) {
    // Update state with the sanitized input
    setCostPrice(() => sanitizedInput);
  }
}}
    
    
inputmode="numeric"
    onKeyDown={(e) => {
   
   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
   }
 }}/>


</div>


    
<div className='register-data-container'>

    <p  className='register-text'>Selling Price(bulk)*</p>

    <input type="text" 
 placeholder={
  hasSubmitButtonClicked && (
    isNaN(parseFloat(bulkPrice)) || bulkPrice <= 0 || bulkPrice === ''
  ) ?
  'Please enter a valid bulk selling price' : ''
}
className={
  hasSubmitButtonClicked && (isNaN(parseFloat(bulkPrice)) || bulkPrice <= 0 || bulkPrice === '') ?
  'register-input form-control important unfilled' : 'register-input form-control important'
}
  value={bulkPrice}  


 


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
  onKeyDown={(e) => {
   
   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
   }
 }}/>


</div>

    


    <div className='register-data-container'>
    <p  className='register-text'>Selling Price (pieces)*</p>

<input type="text" 
 placeholder={
  hasSubmitButtonClicked && (
    isNaN(parseFloat(piecesPrice)) || piecesPrice <= 0 || piecesPrice === ''
  ) ?
  'Please enter a valid pieces selling price' : ''
}
className={
  hasSubmitButtonClicked && (isNaN(parseFloat(piecesPrice)) || piecesPrice <= 0 || piecesPrice === '') ?
  'register-input form-control important unfilled' : 'register-input form-control important'
}
value={piecesPrice}  






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
 onKeyDown={(e) => {
   
   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
   }
 }}/>

    </div>



{
  userRole==='admin' && (
    <>
      <div className='register-data-container'>
    <p  className='register-text' style={{marginRight:''}}>Delivery Date (optional)</p>


   
<div  className='register-input date-container'>
<DatePicker
 selected={transactionDate}
 onChange={(transactionDate) => setTransactionDate(transactionDate)}

 showTimeInput
 dateFormat="MMMM d, yyyy h:mm aa"

 className={'register-input-date important'} 

 />
</div>

    </div>
    </>
  )
}

  

  

 


</div>




<div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginBottom:"5em"}}>




<button className='register-submit-btn btn btn-primary'  onClick={handleConfirm}>SUBMIT</button>
<br />

{
 doesEmptyFieldExist && (
    <>
   <div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700',margin:"2vh 0"}}>
  {loadingMessage}
</div> 
    
    </>
  )
}

</div>




















   </section>






   
   
   
   </LayOut>
  
   </>
 );
};

export default AddToInventory;