import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaTimes, FaAngleLeft,FaAngleRight, FaBolt, FaChartLine,  } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import { Line,Bar } from 'react-chartjs-2';
import { Chart,defaults } from 'chart.js/auto';
import LayOut from './lay-out';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';
import { miniPreloader } from './preloader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faBell, faCog, faTachometerAlt, faBoxes, faHistory, faClipboardList, faChartLine,faChartPie,faChartBar,faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Upgrade from './upgrade';
import { SemiPreloader, } from './preloader';
import { Preloader } from './preloader';
import { Vortex,} from 'react-loader-spinner';
import { Response } from './lay-out';




defaults.maintainAspectRatio=false;
defaults.responsive=true
defaults.plugins.title.display=true
defaults.plugins.title.color='black'
defaults.plugins.title.align='start'
defaults.plugins.title.font.size=30
defaults.elements.line.borderWidth=1

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);









export    const AddToInventory=()=>{
  
  const {prefix,upb,batchNo,loadingMessage,setLoadingMessage,specificData,fetchProductInfo,resetLoadingText,apiError,setApiError,shopGroup,shopDetails,subType,productToBeDeleted}=useGlobal()





  


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
 
  const [condition,setCondition]= useState('')
 const [location,setLocation]=useState('')
  const [batch,setBatch]= useState('')
  const [seller,setSeller]= useState({name:'',address:'',telephone:""})
  const [chatId,setChatId]=useState("")
  const [isSpinning,setIsSpinning]=useState(false)

  const sourceData={
 
    expiryDate,
   transactionDate,
   condition,
location,
    
   price:{
    bulkPrice: parseFloat(bulkPrice),
 
   
   piecesPrice:shopGroup==='group-1'?parseFloat (piecesPrice):parseFloat(bulkPrice),
   },
    costPrice:(piecesQuantity && bulkQuantity)?parseFloat(costPrice) + (((parseFloat(costPrice)/ parseFloat(bulkQuantity))/parseFloat(upb))*parseFloat(piecesQuantity)).toFixed(2):parseFloat(costPrice),
   
   
    quantity:(piecesQuantity && bulkQuantity)?  parseFloat(bulkQuantity*upb)+ parseFloat(piecesQuantity):(piecesQuantity&& !bulkQuantity)?parseFloat(piecesQuantity): parseFloat(bulkQuantity* upb),
    batch,
    seller,
   
   
   }




   const  CheckValidation=()=>{
 
     if (shopGroup==='group-1'){

      if( !costPrice || ! piecesPrice || !bulkPrice    ||parseFloat(costPrice)<=0 || parseFloat(piecesPrice)<=0 ||  parseFloat(bulkPrice)<=0   ){

        
     
        setDoesEmptyFieldExist(true)

      console.log('r-kelly caught from check validation',doesEmptyFieldExist)
        
       }
     
       else{
        
         setDoesEmptyFieldExist(false)
       }

     }


    




     if (shopGroup==='group-2'){

      if( !costPrice  || !bulkPrice  ||parseFloat(costPrice)<=0 ||  parseFloat(bulkPrice)<=0   ){
     
        setDoesEmptyFieldExist(true)
        
       }
     
       else{
        
         setDoesEmptyFieldExist(false)
       }

     }
    
    
    



  }



  useEffect(()=>{


    CheckValidation()

   
  
},[bulkPrice,piecesPrice,bulkQuantity,costPrice,piecesQuantity,])

  
  
  
  
  const handleConfirm=()=>{
    setLoadingMessage('')




    if (subType==='inactive' || !subType){
  
     
      return
    }

    


   





    if (!piecesQuantity && !bulkQuantity){
      setApiError(true)
      setDoesEmptyFieldExist(true)
      setLoadingMessage('Quantity can not be empty, please fill up either quantity in bulk or in pieces')
  
  
    
      return
    }
    
  
    if ((piecesQuantity==0 && bulkQuantity==0)||(piecesQuantity==0 && !bulkQuantity)||(bulkQuantity==0 && !piecesQuantity)){
      setApiError(true)
      setDoesEmptyFieldExist(true)
    setLoadingMessage('both pieces quantity and bulk quantity can not be zero or empty')
    
    
    
    return
    }
  
  
  
  setHasSubmitButtonClicked(true)
  
  


  if (doesEmptyFieldExist){
    setLoadingMessage('Please fill up all required information')
    setApiError(true)

    return
  }




  

  
  setIsConfirmHidden(false)
  
  
  
  }


  


  const handleSubmit=async()=>{



  //  CheckValidation()



   
    


const data= Object.fromEntries(Object.entries(sourceData).filter(([_,value])=>value!==null && value!=='' && value ))


const lastSeller= Object.fromEntries(Object.entries(data.seller).filter(([_,value])=>value!==null && value!=='' && value ))


data.seller= lastSeller


if (Object.entries(data.seller).length===0){
  delete data.seller
}




    if (transactionDate===null){

      const time= Date.now()
      const newDate= new Date(time)
     
      data.transactionDate=newDate
      
    }
  



  
  
  
  
  
  setHasSubmitButtonClicked(true)
  
  if(doesEmptyFieldExist){
  setApiError(true)
    setLoadingMessage('please fill up all required field')
  
 
    return
  }
  

  
  console.log('validation has been checked   keanu 1')  
  const config={
   headers:{
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  }
  
  const url= `${prefix}/products/add-inventory/${itemId}`
  
  
  setIsSpinning(true)
  try{

    console.log('response about to be sent  keanu 1')
  
   const response= await axios.post(url,data,config)
   console.log('response sent reply should be shown  keanu 1')
   setLoadingMessage('Quantity sucessfully added to the inventory')
   setApiError(false)
   setSellingPricePiece('')
  setSellingPriceBulk('')
  setCostPrice('')
  
  setQuantity('')
  setPquantity('')
  setTransactionDate(null)
  setDate(null)
  setDoesEmptyFieldExist(false)
  setSeller({name:'',address:'',telephone:""})
  
  
  }
  
  
  catch (error){
    console.log('an error occured check out what happend  keanu 1')
   setApiError(true)
  console.log(error,'grid')
  
   if (error.request) {
    
    setLoadingMessage('error processing request, please try again')
  
  }
  
  
    else {

      console.log('end of operation  keanu 1')

      
      setLoadingMessage(error.message)
    }
    
  
  
  }
  
  
  finally{
    setIsSpinning(false)
  }
  
  
  
  }
  
  
  
  












return(
  <>


{
  !isConfirmHidden && (
    <>
    <section className='register-confirmation-overlay'>



    <div className='confirmation-container'>
      
      <div>
      <FaTimes style={{float:'right',marginRight:"4%",marginTop:"3%",fontSize:"2.4em",cursor:'pointer'}}  onClick={()=>{setIsConfirmHidden(true); resetLoadingText()}}></FaTimes>
    
      </div>
     

     <p className='font-sub-heading' style={{fontSize:'1.2em',margin:'2%',fontWeight:"bold",color:"#777",textAlign:'center'}}>CONFIRM INFORMATION</p> 


     
     
         <article>
   <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Cost price<strong  style={{color:"black"}}> :(&#x20A6;){costPrice} </strong>   </p>
  
   <p style={{margin:'1% 2%',fontSize:'0.9em', color:'gray',fontWeight:"500", }} className='font-sub-heading'>Selling price (bulk) <strong  style={{color:"black"}}> :(&#x20A6;){bulkPrice}  </strong>   </p>
  
   {
  shopGroup==='group-1' && (
    <>
    <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Selling price (pieces) <strong  style={{color:"black"}}> :(&#x20A6;){piecesPrice}</strong>   </p>
    </>
  )
}


    
    

   
     </article>
        
      
    

    
  


    <section >
    
  









   </section>
    
     
   <div style={{display:'flex',justifyContent:'center'}}>
   <button className='btn btn-primary sales-submit-btn font-sub-heading' onClick={handleSubmit} >    
   
  
   
   {
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SUBMIT   
      </>
    )
   }
    
   </button>

   
   </div>



   

  {
    loadingMessage!=='' && (
      <>
      <Response></Response>
      
      </>
    )
  }

  
   </div>










      



</section>

    
    
    </>
  )
}








  
 

  <div style={{width:'100%',paddingTop:"25px"}}>
        <h3 className='font-sub-heading'   style={{fontWeight:'700'}}>{productToBeDeleted.toUpperCase()}</h3>
        <h5 className='font-sub-heading'   style={{fontWeight:'00'}}>Add to Quantity</h5>
        </div>


      
       

  
        <article className='register-content-container' style={{marginTop:'0%'}}>



        <h5 className='font-sub-heading register-sub-heading' style={{textAlign:'',marginTop:"0"}}>General Information</h5>


<section className='register-info-grid'> 
<article className='register-each-partition' >
<div  className='management-register-text'  >Location 
<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
setChatId('location')
}}

onMouseLeave={()=>{
setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
chatId=='location' && (
<>
<div class="reg-chat-box">
<div class="reg-pointer"></div>
<div class="reg-message">The location describes where an item is stored within your shop. Please specify the aisle, shelf, or section for easy retrieval and inventory management.</div>
</div>
</>
)
}





</div> 

</div>





<input type="text"
className={'management-input form-control important'}


value={location} 

onChange={(e)=>setLocation(e.target.value)} 


/>

</article>


</section>




{
  shopDetails.industry === 'Provision/Drinks/Pharmaceuticals'  && (
    <>
    <h5 className='font-sub-heading register-sub-heading' style={{textAlign:''}}>Product Specifications</h5>
    
    </>
  )
}


{
    shopDetails.industry === 'Provision/Drinks/Pharmaceuticals'  &&(<>
    <section className='register-info-grid'>





{
        shopDetails.industry === 'Provision/Drinks/Pharmaceuticals'  && (
          <>
          <article className='register-each-partition'>
          <div  className='management-register-text'>Batch No
<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('batch')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='batch' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The batch number is a unique identifier assigned to a group of products manufactured or processed together.The batch number is usually printed on product packaging, labels, or directly on the product itself</div>
</div>
    </>
  )
}





 </div> 





          
          
          
          
          
          
          </div>
            
            <input type="text"    className={ 'management-input  form-control important'}
             value={batch}  onChange={(e)=>setBatch(e.target.value)} />

            </article>


            



           

          
          
          </>
        )
      }




{
               shopDetails.industry==='Provision/Drinks/Pharmaceuticals' && (
               
               <>

<article className='register-each-partition'>
          <div  className='management-register-text'>Expiry Date
<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('expiry')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='expiry' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message"> The expiry date indicates the date until which a product remains usable or fit for consumption</div>
</div>
    </>
  )
}





 </div> 
         
          </div>
            
          <DatePicker  
    selected={expiryDate}
    onChange={(expiryDate) => setDate(expiryDate)}
    dateFormat="dd/MM/yyyy"
    className="management-input form-control important"
      wrapperClassName="date-picker-wrapper" // Custom wrapper class

  
   ></DatePicker>

            </article>




               
               
               </>)
            }



</section>
    
    
    </>)
}







<h5  className={shopDetails.industry === 'Provision/Drinks/Pharmaceuticals'?'font-sub-heading register-sub-heading':'font-sub-heading sub-register-sub-heading'}   >Quantity Information</h5>

<section className='register-info-grid'>

<article className='register-each-partition'  >
<div  className='management-register-text'>{shopGroup!=='group-2'?"Quantity(bulk)":'Quantity*'}






{

shopGroup==='group-2' && (
  <>
  
  <div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('qb')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='qb' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">
    {
      shopGroup!=='group-2' ?(
        <>
        This is the quantity of item you are adding to the inventory in bulk.  <span> {  shopDetails.industry==='Provision/Drinks/Pharmaceuticals'?"For example,if you are adding 12 crates of coke you can put 12 ":  shopDetails.industry === 'Books and Stationaries'?"For example,if you are adding 5 packs of books you can put 5":"For example,if you are adding 5 bale of shirts  you can put 5"}</span> 
        
        </>
      ):(
        <>
        
        This is the quantity of item you are adding to the inventory 
        </>
      )
    }
    
    
    
    
   
  
  
  
  
  </div>
</div>
    </>
  )
}





 </div> 
  
  
  
  </>
)

}



          












</div>
      <input type="text"  className='management-input  form-control'
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
        value={bulkQuantity}
    
      />
<div className='management-commentary' >This field can not be zero or less than zero </div>

</article>


{
        shopGroup!=='group-2'  && (
          <>
        <article className='register-each-partition'>

        <div  className='management-register-text'>Quantity(pieces)
        
        <div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('qp')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='qp' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">Here, you specify the quantity of items being added to the inventory individually or in smaller units. This is particularly useful when dealing with products that are sold in smaller quantities or as individual items. <span> {  shopDetails.industry==='Provision/Drinks/Pharmaceuticals'?"For example, if 12  bottles of coke make one cartons, and you have 6 bottles which is not up to one full carton, you can put that 6 here  to make up for that":  shopDetails.industry === 'Books and Stationaries'?"For example, if 12  pens make one full pack, and you have 6 pens which is not up to one full pack, you can put that 6 here to make up for that":"For example, if 12  t-shirts   make one full bale, and you have 6 t-shirts which is not up to one full bale, you can put that 6 here to make up for that"}</span>
  
  
  
  
  </div>
</div>
    </>
  )
}





 </div> 
        
        
        
        
        
        </div>
      <input type="text"  className='management-input  form-control'
      
      
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
      
      value={piecesQuantity}
    
      
      
      
      />
       
        </article>
      
          </>
        )
      }



</section>
     


<h5 className='font-sub-heading register-sub-heading'>Pricing and Cost Information</h5>

<section className='register-info-grid'>
<article className='register-each-partition'>

<div  className='management-register-text'>Cost Price*

<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('cost')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='cost' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The amount you purchased this item.</div>
</div>
    </>
  )
}





 </div> 
          




</div>
      <input type="text" 
      
      
      
      value={costPrice}
      placeholder={
       hasSubmitButtonClicked && (
         isNaN(parseFloat(costPrice)) || costPrice <= 0 || costPrice === ''
       ) ?
       'Please enter a valid cost price' : ''
     }
     className={
       hasSubmitButtonClicked && (isNaN(parseFloat(costPrice)) || costPrice <= 0 || costPrice === '') ?
       'management-input  form-control important unfilled' : 'management-input  form-control important'
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
        
      
      
      
      
      />
      <div className='management-commentary'>This field can not be zero or less than zero</div>

</article>
<article className='register-each-partition'>
<div  className='management-register-text'>{shopGroup!=='group-2'?"Selling Price(bulk)*":'Selling Price*'}






<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('sq')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='sq' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message"> 
  
  {
    shopGroup!=='group-2' ? (
      <>

The selling price is the amount at which  you intend  to sell to customers in bulk <span> {  shopDetails.industry==='Provision/Drinks/Pharmaceuticals'?"For example,you can set the price of  one crate  of coke at 3500 naira":  shopDetails.industry === 'Books and Stationaries'?"For example,you can set the price of  one pack  of pencils at 1000 naira":"For example,you can set the price of  one bale of t-shirts at 35000 naira"}</span>
  
  

      </>
    ) :<>
    The selling price is the amount at which  you intend  to sell to customers 
    
    </>

  }
  
  
  
  
  
  </div>
</div>
    </>
  )
}





 </div> 

    
  
   
  











</div>
      <input type="text" 


placeholder={
  hasSubmitButtonClicked && (
    isNaN(parseFloat(piecesPrice)) || piecesPrice <= 0 || piecesPrice === ''
  ) ?
  'Please enter a valid pieces selling price' : ''
}
      
      value={bulkPrice}  
      className={
        hasSubmitButtonClicked && (isNaN(parseFloat(bulkPrice)) || bulkPrice <= 0 || bulkPrice === '') ?
        'management-input form-control important unfilled' : 'management-input form-control important'
      }
      
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
      />


</article>



{
   shopGroup!=='group-2'  && (
    <>
    <article className='register-each-partition'>
    <div  className='management-register-text'>Selling Price(pieces)*
    
    <div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('sp')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='sp' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The selling price is the amount at which  you intend  to sell to customers in pieces <span> {  shopDetails.industry==='Provision/Drinks/Pharmaceuticals'?"For example,you can set the price of  one bottle of coke at 350 naira":  shopDetails.industry === 'Books and Stationaries'?"For example,you can set the price of  one single pencil at 50 naira":"For example,you can set the price of one t-shirt at 3500 naira"}</span>
  
  
  
  
  </div>
</div>
    </>
  )
}





 </div> 
    
    
    
    </div>
     
     <input type="text"
     
     placeholder={
       hasSubmitButtonClicked && (
         isNaN(parseFloat(piecesPrice)) || piecesPrice <= 0 || piecesPrice === ''
       ) ?
       'Please enter a valid pieces selling price' : ''
     }




     className={
       hasSubmitButtonClicked && (isNaN(parseFloat(piecesPrice)) || piecesPrice <= 0 || piecesPrice === '') ?
       'management-input form-control important unfilled' : 'management-input form-control important'
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
     }}/>
    
    </article>
  
    </>
   )
}




</section>




<h5 className='font-sub-heading register-sub-heading'>Supplier Details</h5>

<section className='register-info-grid'>
<article className='register-each-partition'>
<div  className='management-register-text'>Supplier Name</div>
      <input type="text"    className={ 'management-input  form-control important'}
       value={seller.name}  onChange={(e)=>  setSeller((prev)=>({...prev,name:e.target.value}))}
    
       />
       </article>


       <article className='register-each-partition'>

       <div  className='management-register-text'>Supplier Address</div>
      <input type="text"    className={ 'management-input  form-control important'}
       value={seller.address}  onChange={(e)=>  setSeller((prev)=>({...prev,address:e.target.value}))}
    
       />

</article>


<article className='register-each-partition'>

<div  className='management-register-text'>Supplier Telephone</div>
      <input type="text"    className={ 'management-input  form-control important'}
       value={seller.telephone}  onChange={(e)=>  setSeller((prev)=>({...prev,telephone:e.target.value}))}
    
       />

</article>





</section>






<h5 className='font-sub-heading register-sub-heading'>Additional Information
</h5>

<section className='register-info-grid'>
  
{
      ( shopDetails.industry === 'Electronics/Phones/Computers' ||shopDetails.industry === 'Fashion,Clothing,Accesories and Jewelries' )  && (
          <>


<article className='register-each-partition'>
<div  className='management-register-text'>Condition</div>
            <select name="" id="" type='text' className='management-input' value={condition} onChange={(e)=>setCondition(e.target.value)}>

            {
  shopDetails.industry === 'Electronics/Phones/Computers' && (
    <>
      <option value=""></option>
      <option value={'New'}>New</option>
      <option value={'Refurbished'}>Refurbished</option>
      <option value={'Used'}>Used</option>


      
    </>
  )
}

{
  shopDetails.industry === 'Fashion,Clothing,Accesories and Jewelries' && (
    <>
      <option value=""></option>
      <option value={'New'}>New</option>
      <option value={'Used'}>Used</option>


      
    </>
  )
}


            </select>
          
  </article>
           
          
          </>
        )
      }
     





</section>


     <h5 className='font-sub-heading register-sub-heading'> Order Information</h5>
     <section className='register-info-grid'> 
     <article className='register-each-partition'>
     <div  className='management-register-text'>Order Receive Date</div>
   <DatePicker 
   
   selected={transactionDate}
   onChange={(transactionDate) => setTransactionDate(transactionDate)}
   dateFormat="dd/MM/yyyy"
   showTimeInput
   className="management-input form-control important"
      wrapperClassName="date-picker-wrapper"

   
   
   
   
   ></DatePicker>
      <div className='management-commentary' >The system automatically captures the present date as the order received date if left unspecified. However, users have the option to manually select a different date if necessary.</div>


     </article>
  
     
</section>




    










   

<br />
<section className='register-btn-section' >
<button className='btn btn-primary font-text register-btn-submit' style={{marginTop:"8px",marginBottom:'0px'}}  onClick={handleConfirm}>Submit</button>

<br />
{
doesEmptyFieldExist && (
<>
{
  resetLoadingText && (
    <>
    <div style={{width:'100%',marginTop:"18px"}}>


    </div>
    <Response></Response>
    
    
    </>
  )
}

</>
)
}

{
(subType==='inactive' ) && (
<>
<div className={ 'alert alert-danger'  } style={{fontWeight:'700',margin:"2vh 0"}}>
You dont have active subscription
</div> 

</>
)
}


</section>






















</article>







 
  













    
      
  
  
  
  
  
  </>
)








}










const EditProduct=()=>{
  const {prefix,specificData,fetchProductInfo,setLoadingMessage,loadingMessage,resetLoadingText,setApiError,apiError,userRole,fetchProfile,shopGroup}=useGlobal()


  const [bulkPrice,setSellingPriceBulk]= useState('')
const [piecesPrice, setSellingPricePiece]=useState('')
const [name,setName] =useState('')
const [message,setMessage]= useState('')
const [sku,setSku] =useState('')
const [upb,setUpb]=useState('')


const itemId= localStorage.getItem('product-id')
const [invOn,setInvOn]=useState(false)
const [isSpinning,setIsSpinning] =useState(false)
const [restockLevel,setRestockLevel]=useState('')


const editBody={
  name: name.trim(),
   currentPrice:{
     bulkPrice: parseFloat(bulkPrice),
     piecesPrice: parseFloat (piecesPrice),
     
   },
  
     upb,
     sku:sku.trim(),
     restockLevel,
   
 }


 const editInfo=async()=>{







  const entries = Object.entries(editBody);
  const data = Object.fromEntries(entries.filter(([key, value]) => value !== '' && value!==undefined && value!==0));


  if (isNaN(data.currentPrice.bulkPrice) || data.currentPrice.bulkPrice === 0) {
   data.currentPrice.bulkPrice= specificData[0].currentPrice.bulkPrice
  }
  
  if (isNaN(data.currentPrice.piecesPrice) || data.currentPrice.piecesPrice === 0) {
    data.currentPrice.piecesPrice=specificData[0].currentPrice.piecesPrice
  
  }






if(Object.keys(data.currentPrice).length===0){
  delete data.currentPrice
}




if(Object.keys(data).length===0){
  
  setLoadingMessage('empty input, no changes made')
  setApiError(true)
  resetLoadingText()
  return
}


console.log(data,'george of');


   const url= `${prefix}/products/edit-product/${itemId}`;
 
   const config={
    headers:{
     'Content-Type': 'application/json',
   },
   withCredentials: true,
   }
   setIsSpinning(true)

   try{

   const response = await axios.patch(url,data,config)

    
    setApiError(false)
 setLoadingMessage('product information updated')

setName('')
setSellingPriceBulk('')
setSellingPricePiece('')
   }


   catch(error){

    setApiError(true)
    if (error.request) {
      
      setLoadingMessage('error processing request, please try again')
  
    } 

    else {
   
      setLoadingMessage(error.message)
    }

   }


finally{
setIsSpinning(false)
}





 }

   




  return(
    <>



    
    <div style={{width:'100%'}}>
        <h3 className='font-sub-heading'  >Adjust Price</h3>

        </div>

       

      <section className='management-partition'>

      <div className='management-commentary' >This feature allows you to make adjustments to the pricing of your products. Whether you're responding to changes in market conditions, implementing promotional offers, or fine-tuning your pricing strategy, the ability to change prices gives you flexibility and control over your product pricing. </div>
      
     
     
      <div  className='management-register-text'>{shopGroup!=='group-2'?"Selling Price(bulk)*":'Selling Price*'}</div>
      <input type="text"  className='management-input  form-control'
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
      
      placeholder={specificData[0].currentPrice.bulkPrice}
      
      
      
      
      
      />
     



       {
       (shopGroup==='group-1' || shopGroup==='group-3')  && (
        <>
           <div  className='management-register-text'>Selling Price(Pieces)</div>
      <input type="text"className='management-input  form-control'
      
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
      
      placeholder={specificData[0].currentPrice.piecesPrice}
      
      
      />
        
        </>
       )
       }
      
   
     

      <button className='btn btn-primary font-text' style={{marginTop:"8px",width:"100px"}} onClick={()=>{setInvOn(true);editInfo()}}>
      {
     (isSpinning && invOn)    ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SAVE
      </>
    )
   }




      </button>
      <br />
    {
      invOn && (
        <>
      
      {
        loadingMessage!=='' && (
          <>
          <br />
         <Response></Response> 
          </>
        )
      }
        
        </>
      )
    }
      

      </section>

<br />
<br />
     





      <div style={{width:'100%',marginTop:'5vh'}} >
       
        <h3 className='font-sub-heading'  >General</h3>

        </div>


      <section className='management-partition'>

      
      
     
      <div  className='management-register-text'>Name</div>
      <input type="text" placeholder={specificData[0].name.charAt(0).toUpperCase() + specificData[0].name.slice(1).toLowerCase()}  className='management-input  form-control'
       value={name}  onChange={(e)=>setName(e.target.value)}/>
      
      <div className='management-commentary' >You can change the product name, but please ensure it is unique to avoid any confusion in your inventory management system.</div>
      <div  className='management-register-text' >SKU</div>
      <input placeholder={specificData[0].sku} type="text"className='management-input  form-control'
      
      value={sku} 
      
      onChange={(e)=>setSku(e.target.value)} 
      
      
      />
      <div className='management-commentary' >The SKU (Stock Keeping Unit) must also be unique and should not coincide with any other SKU in your inventory. This helps maintain consistency and accuracy in tracking your products.

</div>
    {
      shopGroup==='group-1' && (
        <>
        
        <div  className='management-register-text'>Unit per bulk</div>
      <input type="text" placeholder={specificData[0].upb} className='management-input  form-control'
      value={upb} 
      
      onChange={(e) => {
        const inputValue = e.target.value;
      
        // Allow only digits and a dot
        const sanitizedInput = inputValue.replace(/[^\d.]/g, '');
      
        // Ensure there's at most one dot
        const dotCount = sanitizedInput.split('.').length - 1;
      
        if (dotCount <= 1) {
          // Update state with the sanitized input
          setUpb(() => sanitizedInput);
        }
      }}
      
      
      />

      <div className='management-commentary' > Changing the unit per bulk will affect calculations for sales and inventory management. Please review and ensure the accuracy of this information before saving your changes.</div>
        
        </>
      )
    }


           <div  className='management-register-text'>Restock Level{shopGroup==='group-2' && '(bulk)'}</div>
      <input type="text"className='management-input  form-control'
      
      value={restockLevel} 
      onChange={(e) => {
        const inputValue = e.target.value;
      
        // Allow only digits and a dot
        const sanitizedInput = inputValue.replace(/[^\d.]/g, '');
      
        // Ensure there's at most one dot
        const dotCount = sanitizedInput.split('.').length - 1;
      
        if (dotCount <= 1) {
          // Update state with the sanitized input
          setRestockLevel(() => sanitizedInput);
        }
      }}
      
      placeholder={specificData[0].restockLevel>0?`${specificData[0].restockLevel}`:'0'}
      
      
      />
        
    









      <button className='btn btn-primary font-text' style={{marginTop:"8px",width:"100px"}} onClick={()=>{setInvOn(false);editInfo();}}>

      {
    (isSpinning && !invOn) ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SAVE
      </>
    )
   }



      </button>

      <br />

      {
        !invOn && (
          <>
         {
          loadingMessage!=='' && (
            <>
            <br />
            <Response></Response>
            
            </>
          )
         }
          
          </>
        )
      }
      
      </section>

<br />
<br />
    
    
    </>
  )
}










export  const DeleteProduct=()=>{
  const {prefix,productToBeDeleted,apiError,setApiError,loadingMessage,setLoadingMessage,productToBeDeletedID,}=useGlobal()

  const [consentChecked, setConsentChecked] = useState(false);
  const [message,setMessage]=useState('')
  const [sApiError, setSapiError] =useState(null)
  const [isSpinning,setIsSpinning]=useState(false)

  const handleCheckboxChange = (event) => {
    setConsentChecked(event.target.checked);
  };


  
  





 const deleteProduct=async()=>{






 
  const url= `${prefix}/products/${productToBeDeletedID}`;
  try{


    if (!consentChecked){
     setApiError(true)
      setLoadingMessage('Please confirm your consent by checking the box above before proceeding with the deletion')
    
      return
    }
    setIsSpinning(true)
  
    const response = await axios.delete(url,{withCredentials:true})

  

    setApiError(false)
    setLoadingMessage('Product deleted successfully')

  }

  catch(error){
    console.log(error,'asap')
    setApiError(true)
    if (error.request) {
     
      setLoadingMessage('error processing request, please try again')
  
    } else {
      
      setLoadingMessage(error.message)
    }

  }

  finally{
    setIsSpinning(false)
  }
  
  


 }
  



  return(
    <>
    <div style={{width:'100%'}} >
        <h3 className='font-sub-heading'>Delete Product</h3>
        

        </div>


      <section className='management-partition' style={{border:'1px solid red'}}>

      
      <div className='management-commentary' style={{color:'red',fontWeight:'500'}}>Caution: Deleting this  product   <strong style={{color:'black',}}>{productToBeDeleted.toUpperCase()}</strong>   is an irreversible action. This will permanently remove the product and associated data, including sales history. Consider potential data loss, audit trail logging, dependencies on active processes, and your user permissions. </div>
    
      <div  className='confirm-understand-container'>
      <input type="checkbox"   checked={consentChecked}  onChange={handleCheckboxChange}/>
      <div style={{fontSize:""}}  className='management-commentary'> I confirm that I understand and consent to the above warning </div>

      </div>
      
     

      <button className='btn btn-danger item-info-delete-btn font-sub-heading' style={{border:"",backgroundColor:'',marginTop:"8px",minWidth:"15%"}}onClick={()=>{deleteProduct()}}>

      {
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
     Delete Product 
      </>
    )
   }

        

        
        
       
        
        
        </button>
      <br />
      {
        loadingMessage!=='' && (
          <>
          <br />
          <Response></Response>
          
          </>
        )
      }
      </section>

<br />
<br />
     

    
    
    </>
  )
}




const Report=()=>{


const {prefix,setMinstance,subType,shopGroup}= useGlobal()

const [revenue,setRevenue]=useState([])
const [reportType, setReportType]= useState('one-month')
const [grossProfitData,setGrosProfitData]= useState([])
const [retailPrice,setRetailPrice]=useState([])
const [wholeSalePrice,setWholeSalePrice]=useState([])
const [totalRevenue,setTotalRevenue]= useState(0)
const [highRevenue,setHighRevenue]=useState(0)
const [lowRevenue,setLowRevenue]=useState(0)
const [highBulk,setHighBulk]=useState(0)
const [lowBulk,setLowBulk]=useState(0)
const [highPieces,setHighPieces]=useState(0)
const [lowPieces,setLowPieces]=useState(0)
const [totalPieces,setTotalPieces]=useState(0)
const [totalBulk,setTotalBulk]=useState(0)
const [highGross,setHighGross]=useState(0)
const [lowGross,setLowGross]=useState(0)
const [totalGross,setTotalGross]=useState(0)
const [isPreLoaderRunning,setIsPreloaderRunning] =useState(false)






const itemId= localStorage.getItem('product-id')









function getMonthName(monthNumber) {
  switch (monthNumber) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    default:
      return "Unknown";
  }
}







useEffect(()=>{

  setIsPreloaderRunning(true)

},[])






const handleReportChange=(e)=>{

  const report= e.target.value

  console.log(report,'report');
  setReportType(report)

}





const FetchSales=async(id,report)=>{

 try{



const config={
  headers:{
   'Content-Type': 'application/json',
 },
 
 }

  const url= `${prefix}/products/fetch-revenue/${id}/${report}`
  const response=  await axios.get(url,{withCredentials:true})

  console.log(response.data.data.retail,'retailer');


  const array= response.data.data.revenue.map((sales)=>{
    const times=  moment.utc(sales._id).tz('Africa/Lagos').format('DD-MM-YYYY')

    

    return {time:times,cost:sales.sales,buyingCost:sales.buyingCost}
  }).sort((a,b)=>{
    const timeA = moment(a.time, 'DD-MM-YYYY');
    const timeB = moment(b.time, 'DD-MM-YYYY');
    return timeA - timeB;

    
  })



 const sales= response.data.data.revenue.map((sale)=>{
  return sale.sales
 })

 setTotalRevenue(sales.reduce((it,acc)=>{
  return it + acc
  },0))

  setHighRevenue(sales.sort((a,b)=>{
  return  b-a
  }).slice(0,1))

  setLowRevenue(sales.sort((a,b)=>{
    return  a-b
    }).slice(0,1))


  

  setRevenue(array)

  

  const thirdArray= response.data.data.retail.map((sales)=>{
   
    return {time:sales._id,ppu:sales.ppu}
  }).sort((a,b)=>{
    const timeA = moment(a.time, 'DD-MM-YYYY');
    const timeB = moment(b.time, 'DD-MM-YYYY');
    return timeA - timeB;

    
  })

  setRetailPrice(thirdArray)

  const pieces= response.data.data.retail.map((sale)=>{
    return sale.ppu
   })


   console.log(pieces,'3 days to kill')

   setTotalPieces(pieces.reduce((it,acc)=>{
    return it + acc
   },0))


   setHighPieces(pieces.sort((a,b)=>{
    return  b-a
    }).slice(0,1))
  
    setLowPieces(pieces.sort((a,b)=>{
      return  a-b
      }).slice(0,1))
  
  


  const fourthArray= response.data.data.wholeSale.map((sales)=>{
   
    return {time:sales._id,ppu:sales.ppu}
  }).sort((a,b)=>{
    const timeA = moment(a.time, 'DD-MM-YYYY');
    const timeB = moment(b.time, 'DD-MM-YYYY');
    return timeA - timeB;

    
  })


setWholeSalePrice(fourthArray)

const bulks=response.data.data.wholeSale.map((sale)=>{
  return sale.ppu
 })



 setTotalBulk(bulks.reduce((it,acc)=>{
  return it + acc
 },0))


 setHighBulk(bulks.sort((a,b)=>{
  return  b-a
  }).slice(0,1))

  setLowBulk(bulks.sort((a,b)=>{
    return  a-b
    }).slice(0,1))


    const secondArray= response.data.data.grouped.map((sales)=>{
   
      return {time:sales._id,cost:sales.sales,buyingCost:sales.buyingCost}
    }).sort((a,b)=>{
      const timeA = a.time
      const timeB = b.time
      return timeA - timeB;
  
      
    })
  
    const rearranged= secondArray.map((item)=>{
      const monthGotten= getMonthName(item.time)
  
      const gross= item.cost-item.buyingCost/item.cost
  
      return {time:monthGotten,grossProfit:gross/100}
    })
  


    setGrosProfitData(rearranged)

    const gross= rearranged.map((sale)=>{
      return sale.grossProfit
    })

    setTotalGross(gross.reduce((it,acc)=>{
      return it + acc
     },0))
    
    
     setHighGross(gross.sort((a,b)=>{
      return  b-a
      }).slice(0,1))
    
      setLowGross(gross.sort((a,b)=>{
        return  a-b
        }).slice(0,1))


       // setMinstance('report')

 }

 catch(err){

  console.log(err)

 }

finally{
  setIsPreloaderRunning(false)
}



}


useEffect(()=>{
if(subType==='outright' || subType==='premium'){
  //    FetchSales(itemId,reportType)
}
  
FetchSales(itemId,reportType)
},[reportType])




if (isPreLoaderRunning || subType===''){
  return(
    <>
   <SemiPreloader></SemiPreloader>
    
    </>
  )
}





  return(
    <>

{
  (subType==='outright' || subType==='premium') ? (
    <>
    <section className='item-report-container'>

<div className='sales-report-first-line'>
  <div className='font-sub-heading' style={{fontSize:'1.5rem',fontWeight:'600'}}>Product Chart</div>



<select name="" id="" value={reportType}  onChange={handleReportChange} className='revenue-select font-text'>
<option value="one-week">Past week</option>
  
<option value="one-month">Past month</option>
<option value="three-months">Past quarter</option>
<option value="six-months">Past two quarters</option>
  <option value="one-year">Past Year</option>
</select>




</div>







<article  className='chart-summary-container'>


  {
    revenue.length!==0 ?(
      <>
      <section  className='sales-chart-container'>




      <div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Sales Chart</div>




     <div className='sales-inner-scrollable'>

      <article className='sales-inner-container'  style={{width:`${revenue.length*100}px`}}>

      <Line
  data={
    {
      labels:revenue.map((item)=>item.time),
      datasets:[
        {
          label:'sales',
          data:revenue.map((item)=>item.cost),
          backgroundColor:'black',
          borderColor: 'grey',
          lineTension: 0.4,
        }
      ]
    }
  }

  options={
    {
      
      plugins:{
        title:{

          display: true,
          text: "Revenue",
          color: 'black',
          align: 'start',
          font: {
            size: 12
          }

        }
      }
    }
  }

/>




      </article>



     </div>








      

</section>

<section className='item-chart-summary-container'>
 
  <div className='item-chart-text-container'>
    <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Total</div>
  <div style={{fontWeight:'500'}}>{totalRevenue}</div>
    </div>

    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div  >High</div>
  <div style={{fontWeight:'500'}}>{highRevenue}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Low</div>
  <div style={{fontWeight:'500'}}>{lowRevenue}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Mean</div>
  <div style={{fontWeight:'500'}}>{(totalRevenue/revenue.length).toFixed(2)}</div>
    </div>
  



  </div>




</section>
      </>
    ):(
      <>
      
      <section  className='sales-chart-container'>

      <div style={{display:'flex',justifyContent:'center',alignItems:"center",width:'100%',height:'100%',backgroundColor:''}}>
  <h5 className='font-text'>There are no records to display for the selected date range</h5>
      </div>
      </section>
      </>
    )
  }






</article>











{
  (shopGroup==='group-1' || shopGroup==='group-3') && (
    <>



    {
      (retailPrice.length!==0 || wholeSalePrice.length!==0)?(
        <>
        
         <article className='chart-summary-container'>

<section  className='sales-chart-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Wholesale Versus Retail Price Change</div>


<div className='sales-inner-scrollable'>

      <article className='sales-inner-container'  style={{width:`${retailPrice.length*100}px`}}>
      <Line
  data={
    {
      labels:retailPrice.map((item)=>item.time),
      datasets:[
        {
          label:'Retail Price',
          data:retailPrice.map((item)=>item.ppu),
          backgroundColor:'red',
          borderColor: 'red',
          lineTension: 0.4,
        },

        {
          label:'Wholesale Price',
          data:wholeSalePrice.map((item)=>item.ppu),
          backgroundColor:'green',
          borderColor: 'green',
          lineTension: 0.4,
        },
      ]
    }
  }

  options={
    {
      
      plugins:{
        title:{

          display: true,
          text: "",
          color: 'black',
          align: 'start',
          font: {
            size: 12
          }

        }
      }
    }
  }
style={{width:"90vw",backgroundColor:''}}
/>




      </article>

</div>






      

</section>






{
  totalPieces>0 && (
    <>
    <section className='item-chart-summary-container'>
 <div    className='item-chart-header'   style={{fontSize:'1.0rem',fontWeight:'700'}}>Retail</div>
  <div className='item-chart-text-container'>
    <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>High</div>
  <div style={{fontWeight:'500'}}>{highPieces}</div>
    </div>

    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div  >Low</div>
  <div style={{fontWeight:'500'}}>{lowPieces}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Mean</div>
  <div style={{fontWeight:'500'}}>{(totalPieces/retailPrice.length).toFixed(2)}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Range</div>
  <div style={{fontWeight:'500'}}>{(highPieces-lowPieces).toFixed(2)}</div>
    </div>
  



  </div>




</section>
    </>
  )
}




{
  totalBulk>0 && (
    <>
    <section className='item-chart-summary-container wholesale-special'>
 <div  className='item-chart-header'    style={{fontSize:'1.0rem',fontWeight:'700'}}>Wholesale</div>
  <div className='item-chart-text-container'>
    <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>High</div>
  <div style={{fontWeight:'500'}}>{highBulk}</div>
    </div>

    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div  >Low</div>
  <div style={{fontWeight:'500'}}>{lowBulk}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Mean</div>
  <div style={{fontWeight:'500'}}>{(totalBulk/wholeSalePrice.length).toFixed(2)}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Range</div>
  <div style={{fontWeight:'500'}}>{(highBulk-lowBulk).toFixed(2)}</div>
    </div>
  



  </div>




</section>
    
    </>
  )
}






</article>
        </>
      ):(
        <>
         <section  className='sales-chart-container'>

<div style={{display:'flex',justifyContent:'center',alignItems:"center",width:'100%',height:'100%',backgroundColor:''}}>
<h5 className='font-text'>There are no records to display for the selected date range</h5>
</div>
</section>
        
        </>
      )
    }
    
   


    
    </>
  )
}











{
  shopGroup==='group-2' && (
    <>



    {
      (retailPrice.length!==0 || wholeSalePrice.length!==0)?(
        <>
       
         <article className='chart-summary-container'>
       
<section  className='sales-chart-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Price Change</div>



<div className='sales-inner-scrollable'>

      <article className='sales-inner-container'  style={{width:`${wholeSalePrice.length*100}px`}}>

      <Line
  data={
    {
      labels:wholeSalePrice.map((item)=>item.time),
      datasets:[
        

        {
          label:'Price',
          data:wholeSalePrice.map((item)=>item.ppu),
          backgroundColor:'green',
          borderColor: 'green',
          lineTension: 0.4,
        },
      ]
    }
  }

  options={
    {
      
      plugins:{
        title:{

          display: true,
          text: "",
          color: 'black',
          align: 'start',
          font: {
            size: 12
          }

        }
      }
    }
  }
style={{width:"90vw",backgroundColor:''}}
/>

      </article>
</div>






      

</section>



<section className='item-chart-summary-container'>
 <div  className='item-chart-header' style={{fontSize:'1.0rem',fontWeight:'700'}}>Price</div>
  <div className='item-chart-text-container'>
    <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>High</div>
  <div style={{fontWeight:'500'}}>{highBulk}</div>
    </div>

    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div  >Low</div>
  <div style={{fontWeight:'500'}}>{lowBulk}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Mean</div>
  <div style={{fontWeight:'500'}}>{(totalBulk/wholeSalePrice.length).toFixed(2)}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Range</div>
  <div style={{fontWeight:'500'}}>{(highBulk-lowBulk).toFixed(2)}</div>
    </div>
  



  </div>




</section>



</article>
        </>
      ):(
        <>
         <section  className='sales-chart-container'>

<div style={{display:'flex',justifyContent:'center',alignItems:"center",width:'100%',height:'100%',backgroundColor:''}}>
<h5 className='font-text'>There are no records to display for the selected date range</h5>
</div>
</section>
        
        </>
      )
    }
    
   


    
    </>
  )
}










{
  grossProfitData.length!==0 ?(
    <>
   
    <article className='chart-summary-container' >
<section  className='sales-bar-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Profit Margin</div>


<div className='sales-inner-scrollable'>

      <article className='sales-inner-container'  style={{width:`${grossProfitData.length*100}px`}}>
      <Bar
        data={{
          labels: grossProfitData.map((item) => item.time),
          datasets: [{
            label: 'Percentage Gross Profit',
            data: grossProfitData.map((item) => item.grossProfit),
            backgroundColor: 'blue',
            borderColor: 'blue'
          }]
        }}
        options={{
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "",
              color: 'black',
              align: 'start',
              font: {
                size: 12
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }}
      />

    </article>

</div>




  
</section>



<section className='item-chart-summary-container'>
 
  <div className='item-chart-text-container'>
    <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>High</div>
  <div style={{fontWeight:'500'}}>{parseFloat(highGross).toFixed(2)}</div>
    </div>

    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Low</div>
  <div style={{fontWeight:'500'}}>{parseFloat(lowGross).toFixed(2)}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Mean</div>
  <div style={{fontWeight:'500'}}>{(totalGross/grossProfitData.length).toFixed(2)}</div>
    </div>


    <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Range</div>
  <div style={{fontWeight:'500'}}>{(highGross-lowGross).toFixed(2)}</div>
    </div>
  



  </div>




</section>




  
</article>

    
    </>
  ):(
    <>
    
    <section  className='sales-chart-container'>

<div style={{display:'flex',justifyContent:'center',alignItems:"center",width:'100%',height:'100%',backgroundColor:''}}>
<h5 className='font-text'>There are no records to display for the selected date range</h5>
</div>
</section>
    </>
  )
}



















</section>
    </>
  ):(
    <>
    
   <Upgrade></Upgrade> 
    </>
  )
}


    
    
    </>
  )
}












const Management=()=>{

 










  return(
    <>
    

    <section  className='management-whole-container'>

  


      <article className='management-container'>


 

<EditProduct></EditProduct>


    

     




    

      </article>





    </section>
    
    
    </>
  )
}


const HistoryReport=()=>{
  const itemId= localStorage.getItem('product-id')
  const {prefix,setIsChartShown}=useGlobal()

  const [chartData,setChartData]= useState([])
  const [reportType,setReportType]=useState('week')
let date=null





const fetchReport= async()=>{

  const newDate= Date.now()
 const dateString= new Date(newDate)



   date=dateString



   console.log(date,'datosa');
  try{
    const url= `${prefix}/products/report-changes/${date}/${itemId}/${reportType}`
    const response = await axios.get(url,{withCredentials:true})


    setChartData(response.data.data.history.reverse())

  }

  catch(err){

    console.log(err)

  }
}





  
const handleReportChange=(e)=>{
  const t=e.target.value
  setReportType(t)

}

useEffect(()=>{

  fetchReport()

},[reportType])


  return(
    <>

<section  className='item-history-chart-container'>

<select name="" id="" value={reportType}  onChange={handleReportChange} className='revenue-select font-sub-heading'>
<option value="week">Past week</option>
  
<option value="month">Past month</option>

<option value="six-month">Past 6 months</option>
<option value="ytd">Year to date</option>
  <option value="year">Past Year</option>
</select>

 <FaTimes size={34}onClick={()=>setIsChartShown(false)}  style={{float:'right',cursor:'pointer'}}></FaTimes>
 <h3 className='stock-change-header'>Stock Change</h3>
 <section className='item-chart-scrollable'>
 <article className='item-chart-holder'  style={{width:`${chartData.length*100}px`}}>
  
  <Line
    data={
      {
        labels:chartData.map((item)=> moment.utc(item.createdAt).tz('Africa/Lagos').format('DD/MM/YYYY HH:mm')),
        datasets:[
          {
            label:'quantity',
            data:chartData.map((item)=>item.quantityAfter),
            backgroundColor:'black',
            borderColor:'gray',
            borderWidth:1,
            lineTension:0.4
          }
        ]
      }
    }
  
    options={
      {
        plugins:{
          title:{
  
            text:""
  
          }
        }
      }
    }
  style={{width:"90vw",backgroundColor:''}}
  />
  
  
  </article>

 </section>


</section>
    
    </>
  )
}





const History=()=>{

  const {prefix,isChartShown, setIsChartShown}= useGlobal()
  const itemId= localStorage.getItem('product-id')
  const [historyData,setHistoryData] =useState([])
  const [infoProduct,setInfoProduct]=useState({})
  const [page,setPage]=useState(1)
  const [isPageLoading,setIsPageLoading] =useState(false)
  const [hasNextPage,setHasNextPage]=useState(true)


useEffect(()=>{

  setIsPageLoading(true)

},[])


  const fetchChanges=async()=>{

    //setIsPageLoading(true)

    try{

      const url= `${prefix}/products/product-changes/${itemId}/${page}`
      const response= await axios.get(url,{withCredentials:true})

      console.log(response.data.data.history,'tata');






      setInfoProduct(response.data.data.product)
      setHasNextPage(response.data.data.more)

      setHistoryData(response.data.data.history)

   
      

    }

    catch(err){

      console.log(err);

    }

    finally{
      setIsPageLoading(false)

    }

  }










useEffect(()=>{

  fetchChanges()
 

},[page])


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

if (isPageLoading){
  return(
    <>
    <SemiPreloader></SemiPreloader> 
    </>
  )
}
  





  return(
    <>
      <section    className={!isChartShown?"history-whole-container low-margin":'history-whole-container high-margin'}       id='container'>

        <button className='btn btn-primary history-chart-btn font-text'    onClick={()=>setIsChartShown(true)}><FaChartLine></FaChartLine>  Chart</button>
        <br />

<h6 style={{marginLeft:"5%"}} className='font-sub-heading stock-track-heading'>Stock Track</h6>

<div className='history-first-line font-sub-heading'>

  
    <div className='history-title'>Name: <span style={{fontWeight:'bold'}}>{infoProduct.name}</span></div>
    <div className='history-title'>Product Id: <span style={{fontWeight:'bold'}}>{infoProduct.sku}</span></div>
    <div className='history-title'>Quantity At Hand: <span style={{fontWeight:'bold'}}>{infoProduct.total}</span></div>
  

</div>

<div  className='history-header font-sub-heading'>
  <div className='history-titles'>Transaction ID</div>
  <div className='history-titles'>Date</div>
 
  <div className='history-titles'>Inflow</div>
  <div className='history-titles'>Outflow</div>
  <div className='history-titles'>Balance</div>
  <div className='history-titles'>Created By</div>

</div>


<div className='history-content'>
  {
    historyData.map((item,index)=>{

      const number=index+1;
      const remainder=number%2
      
      return(
        <>
       <div className='history-text-content' style={{backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)'}}>{item._id.slice(-4)}</div>
       <div className='history-text-content' style={{backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)'}}>{moment.utc(item.createdAt).tz('Africa/Lagos').format('DD/MM/YYYY HH:mm')}</div>

       
       <div className='history-text-content' style={{backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)'}}>{Math.sign(item.quantity)===1?item.quantity:''}</div>
       <div className='history-text-content' style={{backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)'}}>{Math.sign(item.quantity)===-1?item.quantity:''}</div>
       <div className='history-text-content' style={{backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)'}}>{item.quantityAfter}</div>

       <div className='history-text-content' style={{backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)'}}>{item.createdBy.firstName}</div>
  
        
        </>
      )
    })
  }


</div>


{
  isPageLoading && (
    <>
    
    <div className='font-text' style={{width:'100%',textAlign:'center',height:'30px',backgroundColor:'blue',color:'white',display:'flex',justifyContent:'center',alignItems:'center',margin:'8px',fontWeight:'500'}}>Loading Documents...</div> 
    
    </>
  )
}



<div className='load-more-container'>
  <div className='load-more-button-text'>
   <button className={page>1?' loadmore-btn':'  dead-btn'} onClick={()=>handlePage('prev')}>
    <FaAngleLeft size={20}></FaAngleLeft>
   </button> 
   <div style={{marginLeft:'8%'}}>Previous</div>
  </div>

  <div className='load-more-button-text'>
  <div style={{marginRight:'8%'}}>Next</div>
   <button className={hasNextPage?'loadmore-btn':'  dead-btn'}  onClick={()=>handlePage('next')}>
    <FaAngleRight size={20}></FaAngleRight>
   </button>
   

  </div>


</div>
    
    
    {
      isChartShown && (
      <>
  

      <HistoryReport></HistoryReport>

    

      </>
      )
    }
      </section>










      
    </>
  )
}













const ProductInfo=()=>{

const {specificData,fetchProductInfo,prefix,loadingMessage,setLoadingMessage,resetLoadingText,apiError,setApiError,minstance,setMinstance,shopGroup,shopDetails ,setLink,setis,error,isPreLoaderRunning}= useGlobal()
const navigate= useNavigate()
const  [bulkQuantity,setQuantity]=useState('')
const [expiryDate, setDate]=useState(null)
const [transactionDate,setTransactionDate] =useState(dateValue)
const [isEditShown,setIsEditShown]= useState(false)
const [isExpiryDateShown,setIsExpiryDateShown] =useState(false)
const [isCreatedDateShown,setIsCreatedDateShown] =useState(false)
const [costPrice,setCostPrice]= useState('')
const [batchNo,setBatchNo]=useState('')
const [batchID,setBatchId] =useState('')
const [isDeleteShown,setIsDeleteShown] =useState(false)
const [userRole,setUserRole]= useState('')
const [serialNo,setSerialNo] =useState('')


const [isSpinning,setIsSpinning] =useState(false)

useEffect(()=>{
  
  const itemId= localStorage.getItem('product-id')

  if(itemId){
    fetchProductInfo()
  }

  else{
    navigate('/inventory')
  }

  
},[])




const handleEditBatch=(e)=>{
  const id= e.target.dataset.id
  const  batch= e.target.dataset.batch

  
  
  setIsEditShown(true)
  setBatchId(id)
  setBatchNo(batch)
}











const sourceData={

  expiryDate,
  serialNo,
  costPrice,

  
}


const handleSubmit=async()=>{


  if (transactionDate){

    sourceData.transactionDate=transactionDate

  }


  
  if (bulkQuantity){

    sourceData.quantity=bulkQuantity*parseFloat(specificData[0].upb)

  }

const data= Object.fromEntries(Object.entries(sourceData).filter(([_,value])=> value!=='' && value!==null && value))
  
console.log(data,'batch-data')

setIsSpinning(true)

  try{

    if (Object.keys(data).length === 0){

      setApiError(true)
      setLoadingMessage('no changes made')
  
      return
    }

    const url= `${prefix}/products/edit-inventory/${batchID}`
    
    const config={
      headers:{
       'Content-Type': 'application/json',
     },
     withCredentials: true,
     }
  

  const response=    await axios.patch(url,data,config)

  setApiError(false)
  setLoadingMessage('batch updated successfully')


  }


  catch(err){

    setApiError(true)

    if (err.response) {
      setLoadingMessage (err.response.data);
      
      return
    } 




    setLoadingMessage('Error updating batch')


  }


  finally{

  setIsSpinning(false)
  }




}



const handleDelete=(e)=>{
 
  const id= e.target.dataset.id
  const  batch= e.target.dataset.batch

  
  
  setIsDeleteShown(true)
  setBatchId(id)
  setBatchNo(batch)

}


const deleteItem=async()=>{

setLoadingMessage('please wait...')

  try{
    const config={
      headers:{
       'Content-Type': 'application/json',
     },
     withCredentials: true,
     }
  
   
  const url=  `${prefix}/products/delete-inventory/${batchID}`

    const response= await axios.delete(url,config)

    if(response.status===200){
      setApiError(false)
      setLoadingMessage('Batch Deleted Sucessfully')
      
    }

  }

  catch(err){
    setApiError(true)
    console.log(err,'error from deleting batch')
    setLoadingMessage('Error deleting batch,try again')
  }


  finally{
   setIsSpinning(false)
  }

}




  
  
  
  
  
 
  




  


  useEffect(()=>{

    const storedProductInstance= sessionStorage.getItem('p-instance')
if(storedProductInstance){
setMinstance(storedProductInstance)
}

else{
setMinstance('overview')
sessionStorage.setItem('p-instance','overview')
}
  },[])



  if (isPreLoaderRunning){
    return(
      <>
      
  
      <Preloader></Preloader>
      
      </>
    )
  }




 
  if(error==='session expired log in'){
    return (
      <>
    
      <div style={{width:'100vw',height:"100vh",display:'flex',justifyContent:'center',alignItems:'center'}} className='alert'>
      <div style={{marginBottom:"1%"}}>Your session has expired please log in</div>
      <button  className='btn btn-primary retry-btn'  onClick={()=>{navigate('/log-in')}}>click log in</button>
      </div>
    
      </>
    )
  }
  
  
  
  if(error){
    return (
      <>
    
      <div style={{width:'100vw',height:"100vh",display:'flex',justifyContent:'center',alignItems:'center'}} className='alert'>
      <div style={{marginBottom:"1%"}}>{error}</div>
      <button  className='btn btn-primary retry-btn'  onClick={()=>{window.location.reload()}}>Retry</button>
      </div>
    
      </>
    )
  }
  
  





return(
  <>
  
  {

    specificData.length!==0 && (
  
  
  

      


        specificData.map((item, index)=>{
        
        const {name,sku,upb,measurement,currentPrice,inventoryData,createdAt,image,category}=item
        const rInventory= inventoryData.sort((a,b)=>{
          const dateA =Date.parse(a.createdAt)
          const dateB =  Date.parse(b.createdAt)
        
          return dateB- dateA;
        })
        
        const imageSrc = image?.[0]?.url || '360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'
        const quantity= inventoryData.map((item)=>item.quantity).reduce((acc,cv)=>{
        return acc + cv
        },0)

        let minimumExpirydate= inventoryData.length!==0? inventoryData[0].expiryDate:'N/A'

        if (inventoryData.length!==0){


          const allExpiryDate= inventoryData.map((item)=>item.expiryDate)




          for (let i=0;i<allExpiryDate.length;i++){
           const element=allExpiryDate[i]
         
           const parsedElement=Date.parse(element)
         
           const parsedMinimumExpiryDate=Date.parse(minimumExpirydate)
         
         
           if (parsedElement<parsedMinimumExpiryDate){
         
             
         
             minimumExpirydate =element
         
          
         
           }
          }




        }


       
        
        


        
        
        return(
        
        <>
        
        
        <LayOut>
       
        
        <main className='all-item-info-container'>
          
 <div className='inv-name-container'>
 <section className='layout-product-item-container'>
<button  className={minstance==='overview'?'onfocus btn btn-primary':'btn btn-primary product-item-btn'}   onClick={()=>{setMinstance('overview');sessionStorage.setItem('p-instance','overview')}}>Overview</button>
    
    <button className={minstance==='management'?'onfocus btn btn-primary':'btn btn-primary product-item-btn'} onClick={()=>{setMinstance('management');sessionStorage.setItem('p-instance','management')}}>Product Management</button>
    <button  className={minstance==='batch'?'onfocus btn btn-primary':'btn btn-primary product-item-btn'}  onClick={()=>{setMinstance('batch');sessionStorage.setItem('p-instance','batch')}}>Batch History</button>
    <button  className={minstance==='track'?'onfocus btn btn-primary':'btn btn-primary product-item-btn'}  onClick={()=>{setMinstance('track');sessionStorage.setItem('p-instance','track')}}>Stock Track</button>
    <button  className={minstance==='report'?'onfocus btn btn-primary':'btn btn-primary product-item-btn'}  onClick={()=>{setMinstance('report');sessionStorage.setItem('p-instance','report')}}>Sales</button>
<FaTimes style={{cursor:'pointer',marginRight:"0px"}} size={22} onClick={()=>{navigate('/inventory')}}></FaTimes>

</section>



<section className='mobile-layout-product-item-container'>
      <button
        className={minstance === 'overview' ? 'onfocus btn btn-primary mobile-link-btn' : 'btn btn-primary product-item-btn mobile-link-btn'}
        onClick={() => { setMinstance('overview'); sessionStorage.setItem('p-instance', 'overview'); }}
      >
        <FontAwesomeIcon icon={faTachometerAlt} />
      </button>
      
      <button
        className={minstance === 'management' ? 'onfocus btn btn-primary mobile-link-btn' : 'btn btn-primary product-item-btn mobile-link-btn'}
        onClick={() => { setMinstance('management'); sessionStorage.setItem('p-instance', 'management'); }}
      >
        <FontAwesomeIcon icon={faBoxes} />
      </button>
      
      <button
        className={minstance === 'batch' ? 'onfocus btn btn-primary mobile-link-btn' : 'btn btn-primary product-item-btn mobile-link-btn'}
        onClick={() => { setMinstance('batch'); sessionStorage.setItem('p-instance', 'batch'); }}
      >
        <FontAwesomeIcon icon={faHistory} />
      </button>
      
      <button
        className={minstance === 'track' ? 'onfocus btn btn-primary mobile-link-btn' : 'btn btn-primary product-item-btn mobile-link-btn'}
        onClick={() => { setMinstance('track'); sessionStorage.setItem('p-instance', 'track'); }}
      >

       

        <FontAwesomeIcon icon={faClipboardList} />
      </button>
      
      <button
        className={minstance === 'report' ? 'onfocus btn btn-primary mobile-link-btn' : 'btn btn-primary product-item-btn mobile-link-btn'}
        onClick={() => { setMinstance('report'); sessionStorage.setItem('p-instance', 'report'); }}
      >
        <FontAwesomeIcon icon={faChartLine} />
      </button>
      
      <FaTimes
        style={{ cursor: 'pointer', marginRight: "0px" }}
        size={22}
        onClick={() => { navigate('/inventory'); setLink(''); }}
      />
    </section>






 </div>

      
      <div className='item-header'>
<h1 className='font-heading '>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</h1>

</div>

      
{
  minstance==='overview'&&(
    <>

<section>




        <div className='product-info-intro'>

  <h5 className='font-sub-heading overview-heading'>Overview</h5>

<p className='overview-text'>

This section provides quick summary about the product, including its name, SKU (Stock Keeping Unit), unit per bulk, quantity in bulk, quantity in pieces, selling price (bulk and pieces), measurement unit, number of batches, and minimum expiry date. Each subsection offers insights into different aspects of the product's attributes and inventory status, aiding in effective management and decision-making.</p>

</div>
    
      
      <section className='info-first-section'>

        <div className='info-img-container'>

          <LazyLoadImage src='600px-Cartoon_Female_Shipping_Employee_Doing_An_Inventory_Of_Boxes.svg.png' className='item-info-img'></LazyLoadImage>
           
  <p className='font-sub-heading' style={{fontSize:'1.5rem'}}>Inventory Summary</p>

        </div>

<div className='info-divider-line'></div>


   
<div className='info-section-text-container'>



<div className='info-first-section-right' style={{backgroundColor:""}}>


<div  className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px' ,}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Name</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</div>
</div>


<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>SKU</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{sku}</div>
</div>








</div>
<div className='info-first-section-right'>


<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Unit per bulk</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{upb}</div>
</div>




<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Quantity</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{inventoryData.length!==0?(quantity/upb).toFixed(1):"OUT OF STOCK"}</div>
</div>








</div>

<div className='info-first-section-right'>

<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Category</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{category}</div>
</div>



<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>{shopGroup==='group-2'?"Selling Price":'Selling Price(bulk)'}</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>&#x20A6;{currentPrice.bulkPrice}
</div>
</div>







</div>

{
shopGroup==='group-1'  && (
  <>
  
<div  className='info-first-section-right'>

<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Selling Price(pieces)</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>&#x20A6;{currentPrice.piecesPrice}
</div>
</div>



{
shopGroup ==="***" && (
  <>
  <div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Measurement</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{quantity}</div>
</div>
  
  </>
)
}




</div>
  </>
)
}

<div className='info-first-section-right'>








<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>No of Batches</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{inventoryData.length!==0?inventoryData.length:'OUT OF STOCK'}</div>
</div>







</div>

<div className='info-first-section-right'>
<div className='item-props' style={{display:"flex",justifyContent:'space-between',width:'100%',backgroundColor:"",padding:'0 12px'}}>
<div style={{height:'100%',display:"flex",justifyContent:'flex-start',alignItems:'center',color:'gray'}}>Date Created</div>
<div style={{height:'100%',display:"flex",justifyContent:'center',alignItems:'center',fontWeight:"600"}}>{moment.utc(createdAt).tz('Africa/Lagos').format('DD/MM/YYYY')}</div>
</div>

</div>


</div>
      

    
      
      
      </section>


     

      </section>  
    
    </>
  )
}
















  
      
    
     <section className='link-content-container'>

   
  
  


{
minstance==='management' && (
  <>
   <Management></Management>
  
  </>
)
}

{
minstance==='report' && (
  <>
   <Report></Report>
  
  </>
)
}




{
minstance==='track' && (
  <>
   <History></History>
  
  </>
)
}























      

     { rInventory.length!==0 && minstance==='batch'     && (
      <>
      
       
      <article>


      <h3 className='batch-heading font-sub-heading'> Batch History and Information</h3>  

<section class="inventory-info-container">  
<p className='batch-intro'>This table provides a detailed overview of the batch history for the product, including information on batch ID, quantity added, quantity left, quantity sold, cost, creator, expiry date, and date added. Each entry represents a batch of the product and includes essential details about its production, consumption, and management.</p>

{
rInventory.map((item)=>{
return(
<>



<div class="batch-info"  style={{border:batchID===item._id?'solid 3px red':""}}>

<section className='batch-text-container'>


<div className='batch-holder'> 
<label for="batch-id">Batch ID:</label>
<p id="batch-id">{item.batch}</p>


</div>
<div className='batch-holder'>
<label for="quantity-produced">Quantity Added:</label>
<p id="quantity-produced">{(item.initialQuantity/upb).toFixed(1)}</p>
</div>

<div className='batch-holder'>

<label for="quantity-produced">Quantity left:</label>
<p id="quantity-produced">{(item.quantity/upb).toFixed(1)}</p>
</div>


<div className='batch-holder'>
<label for="quantity-produced">Quantity Sold:</label>
<p id="quantity-produced">{(item?.initialQuantity/upb-item?.quantity/upb).toFixed(1)}</p>

</div>


<div className='batch-holder'>
<label for="quantity-produced">Cost (NGN):</label>
<p id="quantity-produced">{item.costPrice}</p>

</div>



<div className='batch-holder'>
<label for="quantity-produced">Created By:</label>
<p id="quantity-produced">{item.createdBy.firstName} {item.createdBy.lastName}</p>

</div>

{
( shopDetails.industry==='Provision/Drinks/Pharmaceuticals' && item.expiryDate ) && (
  <>
<div className='batch-holder'>
<label for="expiry-date">Expiry Date:</label>
<p id="expiry-date">{moment.utc(item.expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}</p>

</div>  
  </>
)
}




{
  ( shopDetails.industry === 'Electronics/Phones/Computers' ||shopDetails.industry === 'Books and Stationaries' ||  shopDetails.industry === 'Automobile Parts' && item.condition ) && (
  <>
<div className='batch-holder'>
<label for="expiry-date">Condition:</label>
<p id="expiry-date">{item.condition}</p>

</div>  
  </>
)
}



{
  ( shopDetails.industry === 'Electronics/Phones/Computers' ||shopDetails.industry === 'Books and Stationaries' ||  shopDetails.industry === 'Automobile Parts' && item.serialNo )   && (
  <>
<div className='batch-holder'>
<label for="expiry-date">{ shopDetails.industry === 'Electronics/Phones/Computers'?'Serial Number':shopDetails.industry === 'Automobile Parts'?'Manufacturing Part Number':'ISBN' }</label>
<p id="expiry-date">{item.serialNo}</p>

</div>  
  </>
)
}







<div className='batch-holder'>

<label for="production-date">Date Added:</label>
<p id="production-date">{moment.utc(item.createdAt).tz('Africa/Lagos').format('DD/MM/YYYY')}</p>

</div>

<div className='batch-holder'>

</div>








</section>






<div class="actions-btn-container">
<button className='btn ' style={{backgroundColor:"green",border:"solid 1px green",color:'white'}} data-id={item._id} data-batch={item.batch} onClick={handleEditBatch}>Edit Batch</button>
<button className='btn btn-danger'   data-id={item._id} data-batch={item.batch} onClick={handleDelete}>Delete</button>

</div>





</div>





{
isEditShown && batchID===item._id  && (
<>


<section  className='batch-edit-overlay'>

<div className='batch-edit-container'  >
<div style={{width:'100%'}}>
<FaTimes  style={{float:"right",fontSize:"200%"}}  onClick={()=>{setIsEditShown(false);setBatchId('')}}></FaTimes>

</div>






<div className='batch-data-container'>
<p  className='register-text'>Quantity </p>
<input
value={bulkQuantity}
type='text'
placeholder={
(
isNaN(parseFloat(bulkQuantity)) || bulkQuantity <= 0 || bulkQuantity === ''
) ?
`${(item.quantity/upb).toFixed(1)}` : ''
}
className={
'register-input form-control '
}



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





min={0}
onKeyDown={(e) => {
if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
e.preventDefault();
}
}}
/>

</div>

<div className='batch-data-container'>
<p  className='register-text'>Cost Price (&#x20A6;)</p>
<input
value={costPrice}
type='text'
placeholder={
(
isNaN(parseFloat(costPrice)) || costPrice <= 0 || costPrice === ''
) ?
`${(item.costPrice).toFixed(1)}` : ''
}
className={
'register-input form-control '
}


inputmode="numeric"


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





min={0}
onKeyDown={(e) => {
if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
e.preventDefault();
}
}}
/>

</div>





{ ( shopDetails.industry === 'Electronics/Phones/Computers' ||shopDetails.industry === 'Books and Stationaries' ||  shopDetails.industry === 'Automobile Parts' ) && (
  <>
  
  <div className='batch-data-container'>
<p  className='register-text'>{ shopDetails.industry === 'Electronics/Phones/Computers'?'Serial Number':shopDetails.industry === 'Automobile Parts'?'Manufacturing Part Number':'ISBN' } </p>
<input
value={serialNo}
type='text'
placeholder={item.serialNo?`${item.serialNo}`:''}
className={
'register-input form-control '
}


inputmode="numeric"

onChange={(e)=>setSerialNo(e.target.value)}

/>

</div>
  
  </>
)
}









{
  shopDetails.industry==='Provision/Drinks/Pharmaceuticals'  && (
    <>
    
    <div className='batch-data-container batch-edit-date'>    <span className='batch-edit-date'   onClick={()=>setIsExpiryDateShown(true)}>Edit expiry date </span>  <span style={{color:'black',fontWeight:"400"}}>
{moment.utc(item.expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}
</span>  </div>

    </>
  )
}





{
isExpiryDateShown && (
<>


<div  className='batch-data-container'>
<DatePicker
selected={expiryDate}
onChange={(expiryDate) => setDate(expiryDate)}
dateFormat="dd/MM/yyyy" // You can customize the date format


className={'batch-data-date'} 

/>
</div>

</>
)
}





<div className='batch-data-container batch-edit-date'>    <span className='batch-edit-date'  onClick={()=>setIsCreatedDateShown(true)}>Edit date added </span>  <span style={{color:'black',fontWeight:"400"}}>
{moment.utc(item.createdAt).tz('Africa/Lagos').format('DD/MM/YYYY')}
</span>  </div>





{
isCreatedDateShown && (
<>


<div  className='batch-data-container  '>
<DatePicker
selected={transactionDate}
onChange={(transactionDate) => setTransactionDate(transactionDate)}
dateFormat="dd/MM/yyyy" // You can customize the date format


className={'batch-data-date'} 

/>
</div>

</>
)
}


<div className='batch-edit-button-container'>
<button className='btn btn-primary  batch-edit-button'  onClick={handleSubmit}>

{
  isSpinning ? (
    <>
    
  <Vortex
visible={true}
height="30"
width="30"
ariaLabel="vortex-loading"
wrapperStyle={{}}
wrapperClass="vortex-wrapper"
colors={['white', 'white', 'white', 'white', 'white', 'white']}
/> 
    
    </>
  ):(
    <>
  SUBMIT   
    </>
  )
 }



 </button>


</div>


{
loadingMessage!=='' && (
  <>

  <Response></Response>
  
  </>
)
}







</div>







</section>




</>
)
}





{
isDeleteShown && batchID===item._id  && (
<>


<section  className='batch-edit-overlay'>


<div className='batch-edit-container' style={{border:"red solid 3px"}}>
<p>Are you sure you want to delete this batch?</p>


<div class="actions-btn-container-del" >

<button className='btn btn-danger' onClick={deleteItem}>Yes</button>
<button className='btn btn-secondary' data-id={item._id} data-batch={item.batch} onClick={()=>{
setIsDeleteShown(false);
setBatchId('')
}}>No</button>

</div>


{
loadingMessage==!''&&(
  <>

  <Response></Response>
  
  </>
)
}
</div>





</section>




</>
)
}















</>
)
})
}





</section>






    

</article> 



     





 
      
      
      </>
     )
    }

{ rInventory.length===0 && minstance==='batch'  && (
  <>
     <article>


<h3 className='batch-heading font-sub-heading'> Batch History and Information</h3>  

<section class="inventory-info-container" style={{width:"100%"}}>  
<div className='' style={{minWidth:"100%"}}>You are currently out of stock, no record to show as of now</div>

</section>

</article> 
  
  </>
) }





      
        

    
      
      </section> 
      
    
      
    
      
      
      
      
  






    
      
      
      
      </main>
      
       
        </LayOut>
        
        
        
        
        
        
        
        
        
        
        </>
        
        
        
        
        
        
        
        
        
        
        
        
        
        )
        
        
          
        })
        
        
        
        
        
        
  
  
  
  
  
  
  
  
  
  
  
  
  




    )











  }
  
  
  
  
  </>
)









}


export default ProductInfo