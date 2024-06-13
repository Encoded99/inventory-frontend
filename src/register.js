     
import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaTimes } from 'react-icons/fa'; 
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Vortex } from 'react-loader-spinner';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Response } from './lay-out';
import LayOut from './lay-out';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);







const Register = () => {

  const {prefix,setLoadingMessage,loadingMessage,resetLoadingText,apiError,setApiError,shopGroup,shopDetails,subType}=useGlobal()
const [isConfirmHidden, setIsConfirmHidden]=useState(true)
  const [files, setFiles] = useState([]);
  const [src,setSrc]=useState([])
  const [expiryDate, setDate]=useState(null)
  const [name,setName]=useState('')
  const [measurement,setMeasurement] =useState('')
  const [sku,setSku]= useState('')
  const [bulkQuantity,setQuantity]=useState('')
  const [piecesQuantity,setPquantity]= useState('')
  const [upb,setUpb]= useState('')
  const [bulkPrice,setSellingPriceBulk]= useState('')
  const [piecesPrice, setSellingPricePiece]=useState('')
  const [costPrice,setCostPrice]= useState('')
  const [brand,setBrand] = useState('')
 
  const [category,setCategory] =useState('')
  const [description,setDescription]= useState('')
  const [hasSubmitButtonClicked,setHasSubmitButtonClicked]= useState(false)
  const [ doesEmptyFieldExist, setDoesEmptyFieldExist] =useState(false)
  const [transactionDate,setTransactionDate] =useState(null)
  const [isSpinning,setIsSpinning]=useState(false)
  const [condition,setCondition]= useState('')
  const [upc,setUpc]=useState("")
  const [isbn,setIsbn]=useState("")
  const [ean,setEan]=useState("")
  const [mpn,setMpn]=useState("")
const [batch,setBatch]= useState('')
const [location,setLocation]=useState('')

  const [seller,setSeller]= useState({name:'',address:'',telephone:""})

  const [userRole,setUserRole]= useState('')
const [chatId,setChatId]=useState("")



  let image=[];



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
  
  
  
  
  
  
 




  const fileInputRef=useRef(null)

  let selectedFiles=[]

  const handleFileUpload =  (event) => {

  
  
      selectedFiles = event.target.files;
     

     if(files.length>2){
       alert('you cant select more than 3 images')
       return
     }
 
     if(selectedFiles.length>3){
       alert('you cant select more than 3 images')
       return
     }
 
 
     setFiles([...files, ...selectedFiles]); 
 
 for (let i=0;i<selectedFiles.length;i++){
   const element=selectedFiles[i]
  if (element){
   const reader=new FileReader()
   reader.onloadend=  ()=>{
   
      setSrc((prevSrc) => [...prevSrc, { img: reader.result }])
   }
 
   reader.readAsDataURL(element)
  }
 
 }
 

     fileInputRef.current.value = ''; //
   
   
       
   
     
   };
 
 
   const removeIndex=(e,index)=>{
   e.preventDefault()
     const newSrc=[...src]
     newSrc.splice(index,1)
 
     setSrc(newSrc)
 
     const newFiles=[...files]
 
     newFiles.splice(index,1)
 
     setFiles(newFiles)
     
   }
 
 
 
   const uploadToCloudinary=async(file)=>{

     const formData = new FormData();

     formData.append('file',file)
 
    
  
     const config={
       headers:{
      // Authorization:`Bearer ${token}`,
       'Content-Type': 'multipart/form-data',
     },
     withCredentials: true,
   }
 
     try{
     const url=`${prefix}/products/upload-cloudinary`
 
       const response = await axios.post(url,formData,config);
    
       const imageUrl=response.data.url
       const imageType=response.data.type
       const imageID=response.data.cloudId
     
       if(response.status===200){
         image.push({url:imageUrl,type:imageType,cloudId:imageID})
 
 
 
       }
 
       
     
      
 
       
 
     }
 
     catch(err){
       
 
     }
   }
   




   const handleImageSubmit=async()=>{

  

    for(let i=0; i<files.length;i++){
   
      const file=files[i]
    await  uploadToCloudinary(file)
    // setIsImageUploaded(true)
      
     }
      
   
   
   }



 
 




const  CheckValidation=()=>{





if (shopGroup==='group-1'){

  if(!name || !costPrice || ! piecesPrice || !bulkPrice ||!category || !upb || !sku   ||parseFloat(costPrice)<=0 || parseFloat(piecesPrice)<=0 ||  parseFloat(bulkPrice)<=0  || parseFloat(upb)<=0 ){
   
    setDoesEmptyFieldExist(true)
    
   }
 
   else{
    
     setDoesEmptyFieldExist(false)
   }

}


if (shopGroup==='group-2'){

  if(!name || !costPrice  || !bulkPrice ||!category  || !sku  ||parseFloat(costPrice)<=0  ||  parseFloat(bulkPrice)<=0   ){
   
    setDoesEmptyFieldExist(true)
    
   }
 
   else{
    
     setDoesEmptyFieldExist(false)
   }

}






  

 
}





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




  CheckValidation()
 
setHasSubmitButtonClicked(true)









if(doesEmptyFieldExist){
setApiError(true)

  setLoadingMessage('please fill up all required field')



  return
}

if(shopGroup==='group-2'){
  setUpb(1)
}





setIsConfirmHidden(false)



}




const SourceData={


  upc,
  ean,
  mpn,
  isbn,

  image,
 name: name.trim(),
  expiryDate,
  
  condition,
  location,
 
 
  sku:sku.toUpperCase(),

  
  upb:shopGroup!=='group-2'?parseFloat(upb):1,
  price:{
   bulkPrice: parseFloat(bulkPrice),

  
  piecesPrice:shopGroup!=='group-2'?parseFloat (piecesPrice):parseFloat(bulkPrice),
  },
  costPrice:(piecesQuantity && bulkQuantity)?parseFloat(costPrice) + (((parseFloat(costPrice)/ parseFloat(bulkQuantity))/parseFloat(upb))*parseFloat(piecesQuantity)).toFixed(2):parseFloat(costPrice),

 

  quantity:(piecesQuantity && bulkQuantity)?  parseFloat(bulkQuantity*upb)+ parseFloat(piecesQuantity):(piecesQuantity&& !bulkQuantity)?parseFloat(piecesQuantity): parseFloat(bulkQuantity* upb),
  brand,
  transactionDate,
 
  category:category.trim(),
  description,
  batch,
  seller,
}











useEffect(()=>{


    CheckValidation()

   
  
},[name,bulkPrice,piecesPrice,upb,bulkQuantity,category,sku,costPrice,piecesQuantity,])




const handleSubmit=async()=>{

  const data= Object.fromEntries(Object.entries(SourceData).filter(([_,value])=>value!=='' && value!==null && value))


  console.log(data,'post-malone')

  for(const keys in data.seller){
    if (data.seller[keys]==''){
      delete data.seller[keys]
    }
  }


if (Object.entries(data.seller).length===0){
  delete data.seller
}


if (shopGroup==='group-2'){
  delete data.price.piecesPrice
}

  console.log(data,'post-malone after')


  if (transactionDate===null){

    const time= Date.now()
    const newDate= new Date(time)
   
    data.transactionDate=newDate
    
  }

  

  
 
  console.log(data,'fini')
setIsSpinning(true)




//  await handleImageSubmit()

const url= `${prefix}/products`

const config={
  headers:{
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}


try{

  console.log('thailand  about to be it sent')
const response=await axios.post(url,data,config,)


console.log('thailand it sent')

if(response.status===201){
  setApiError(false)

  setLoadingMessage('product registered successfully')
  setName('')
  
  setBrand('')
setSellingPricePiece('')
setSellingPriceBulk('')
setCostPrice('')
setCategory('')
setUpb('')
setSku('')
setDescription('')
setDate(null)
setMeasurement('')
setFiles([])
setSrc([])
image=[]
setLocation("")
setQuantity('')
setPquantity('')
setTransactionDate(null)
setHasSubmitButtonClicked(false)
setSeller({name:'',address:'',telephone:""})
}





}

catch(error){


  console.log(error, 'thailand')
  setApiError(true)
  if (error.response) {
   
    if(error.response.data.message.includes('E11000 duplicate key error collection: inventoryHero.products index: sku_1 dup key:')){
      setLoadingMessage('product with similar product ID(sku) has already been registered in the inventory, kindly choose another product ID ')
   return
    }

    else if(error.response.data.message.includes('E11000 duplicate key error collection: inventoryHero.products index: name_1 dup key:')){

      setLoadingMessage('product with similar product Name has already been registered in the inventory, kindly choose another product Name ')
      return

    }


   
    setLoadingMessage(error.response.data.message)
  } else if (error.request) {
    
    setLoadingMessage('error processing request,please try again')

  } else {
  
    setLoadingMessage(error.message)
  }
  

}



finally{
  setIsSpinning(false)
}


}











 return (
   <>
   
   <LayOut>

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
  <p style={{margin:'1% 2%',fontSize:'0.9em', color:'gray',fontWeight:"500", }} className='font-text'>Name <strong  style={{color:"black"}}> :{name}  </strong>  </p>

  
  <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Product ID (&#x20A6;)<strong  style={{color:"black"}}> :{sku}</strong>   </p>


{
  shopGroup==='group-1' && (
    <>
    <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Unit per bulk <strong  style={{color:"black"}}> :{upb}</strong>   </p>
    </>
  )
}
   
   <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Cost price<strong  style={{color:"black"}}> :(&#x20A6;){costPrice} </strong>   </p>
  
   <p style={{margin:'1% 2%',fontSize:'0.9em', color:'gray',fontWeight:"500", }} className='font-sub-heading'>Selling price (bulk) <strong  style={{color:"black"}}> :(&#x20A6;){bulkPrice}  </strong>   </p>
  
   {
  shopGroup==='group-1' && (
    <>
    <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Selling price (pieces) <strong  style={{color:"black"}}> :(&#x20A6;){piecesPrice}</strong>   </p>
    </>
  )
}

<p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Category<strong  style={{color:"black"}}> :{category} </strong>   </p>
  
    
    

   
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




<section className=' register-margin'>

<div style={{width:'98%'}}>
        <h1 className='font-heading register-main-heading'   style={{fontWeight:'700'}}>Register</h1>

        </div>

        <section className='register-whole-container'>


<article className='register-content-container'>

<h5 className='font-sub-heading register-sub-heading special-first-heading' style={{textAlign:''}}> Product Details</h5>

<section className='register-info-grid'>
<article className='register-each-partition'  style={{backgroundColor:''}}>
<div  className='management-register-text'>Name*</div>
      <input type="text"    className={ hasSubmitButtonClicked && name === '' ? 'management-input  form-control important unfilled' : 'management-input  form-control important'}
       value={name}  onChange={(e)=>setName(e.target.value)}
       
       placeholder={hasSubmitButtonClicked && name === '' ? 'Please enter a name' : ''}
       />
    
</article>

<article className='register-each-partition' >
<div  className='management-register-text'  >Product ID(SKU)* 
 <div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('sku')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='sku' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The SKU (Stock Keeping Unit) is a unique identifier assigned to each product. It should be unique and not coincide with any other SKU in your inventory</div>
</div>
    </>
  )
}





 </div> 

</div>





      <input type="text"
className={hasSubmitButtonClicked && sku === '' ? 'management-input form-control important unfilled' : 'management-input form-control important'}

placeholder={hasSubmitButtonClicked && sku === '' ? 'Please enter a product ID' : ''} 
      value={sku} 
      
      onChange={(e)=>setSku(e.target.value)} 
      
      
      />
    
</article>
{
  shopGroup==='group-1' && (
    <>
    <article className='register-each-partition'>
    <div  className='management-register-text'>Unit per bulk*
    <div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('upb')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='upb' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">Unit per bulk UPB represents the number of individual units or items contained within a bulk package.  <span> {  shopDetails.industry==='Provision/Drinks/Pharmaceuticals'?"For example,a crate of coke can have 12 bottles of coke in it,making it UPB to be 12":  shopDetails.industry === 'Books and Stationaries'?"For example,a pack of pencil can  have 12 pencils in it,making it UPB to be 12":"For example,a  bale  of t-shirt can  have 20 t-shirts in it,making it UPB to be 20"}</span> this information is neccessary for user who sell in seocndary unit, i.e in pieces.</div>
</div>
    </>
  )
}





 </div> 
    
    
    
    
    </div>
      <input type="text"  


className={
  hasSubmitButtonClicked && (isNaN(parseFloat(upb)) || upb <= 0 || upb === '') ?
  'management-input form-control important unfilled' : 'management-input form-control important'
}

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
      placeholder={
        hasSubmitButtonClicked && (
          isNaN(parseFloat(upb)) || upb <= 0 || upb === ''
        ) ?
        'Please enter a valid unit per bulk' : ''
      }
      
      />
        <div className='management-commentary' >This field can not be zero or less than zero </div>
    </article>
   
    </>
  )
}




<article className='register-each-partition'>
<div  className='management-register-text'>Category*</div>
        <select name="" id="" type='text'  value={category} onChange={(e)=>setCategory(e.target.value)}
        
        
        
        className= {hasSubmitButtonClicked && category ==='' ? ' management-input unfilled ' : 'management-input '}
        
        
        >


{
   shopDetails.industry === 'Provision/Drinks/Pharmaceuticals' && (
    <>
    <option value=""></option>

<option value={'Groceries'}>Groceries</option>
<option value={'Drinks'}>Drinks</option>
<option value={'Biscuits/Snacks'}>Biscuits/Snacks</option>
<option value={'Biscuits/Snacks'}>Drugs/Pharmaceuticals</option>
    
    </>
  )
}

{
  shopDetails.industry === 'Electronics/Phones/Computers' && (
    <>
      <option value=""></option>
      <option value={'Smartphones'}>Smartphones</option>
      <option value={'Phones/Tablets'}>Phones & Tablet</option>
      <option value={'Computers'}>Computers</option>
      <option value={'Gaming Consoles'}>Gaming Consoles</option>
      <option value={'Smartwatches and Fitness Trackers'}>Smartwatches and Fitness Trackers</option>
      <option value={'Televisions'}>Televisions</option>
      <option value={'Audio Devices'}>Audio Devices</option>
      <option value={'Cameras and Photography Equipment'}>Cameras and Photography Equipment</option>
      <option value={'Home Appliances'}>Home Appliances</option>
      <option value={'Others'}>Others</option>
    </>
  )
}

{
 shopDetails.industry === 'Fashion,Clothing,Accesories and Jewelries' && (
    <>
      <option value=""></option>
      <option value={'Men\'s Clothing'}>Men's Clothing</option>
      <option value={'Women\'s Clothing'}>Women's Clothing</option>
      <option value={'Children\'s Clothing'}>Children's Clothing</option>
      <option value={'Shoes'}>Shoes</option>
      <option value={'Bags'}>Bags</option>
      <option value={'Caps'}>Caps</option>
      <option value={'Accessories'}>Accessories</option>
      <option value={'Underwear'}>Underwear</option>
      <option value={'Sportswear'}>Sportswear</option>
      <option value={'Fabrics'}>Fabrics</option>
      
    </>
  )
}

        

        </select>



</article>



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













<h5 className='font-sub-heading register-sub-heading' style={{textAlign:''}}>Product Specifications</h5>


<section className='register-info-grid'>

<article className='register-each-partition'>
<div  className='management-register-text'>EAN


<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('ean')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='ean' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The EAN (European Article Number),is commonly a 13 digit unique numerical identifier assigned to products for identification in European markets.You'll often find it printed on labels, stickers, or directly on the product packaging itself</div>
</div>
    </>
  )
}





 </div> 




</div>
            
            <input type="text"    className={ 'management-input  form-control important'}
             value={ean}  onChange={(e)=>setEan(e.target.value)}
             
             />
      
</article>

<article className='register-each-partition'>
<div  className='management-register-text'>UPC 

<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('upc')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='upc' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The UPC (Universal Product Code), is a barcode symbology widely used in North America for tracking trade items in stores. It consists of a unique 12-digit number assigned to each product. UPCs are found on product packaging as barcodes</div>
</div>
    </>
  )
}





 </div> 





</div>
            
            <input type="text"    className={ 'management-input  form-control important'}
             value={upc}  onChange={(e)=>setUpc(e.target.value)}
             
             />






                
          

</article>


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
    />

   
    
             
       

            </article>




               
               
               </>)
            }





{
      ( shopDetails.industry === 'Electronics/Phones/Computers'  ||  shopDetails.industry === 'Automobile Parts' )  && (
          <>

          

<article className='register-each-partition'>
<div  className='management-register-text'>MPN

<div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('mpn')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='mpn' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The MPN (Manufacturer Part Number)  are used to uniquely identify specific parts or products manufactured by a company.   The MPN is usually provided by the manufacturer.</div>
</div>
    </>
  )
}





 </div> 





</div>
            
            <input type="text"    className={ 'management-input  form-control important'}
             value={mpn}  onChange={(e)=>setMpn(e.target.value)}
             
             
             />
</article>
         
          
          
          </>
        )
      }


{
      shopDetails.industry === 'Books and Stationaries'  && (
          <>
          <article className='register-each-partition'>
          <div  className='management-register-text'>ISBN 
          
          
          <div className='indicator-span'> <FontAwesomeIcon  onMouseEnter={()=>{
  setChatId('isbn')
}}

onMouseLeave={()=>{
  setChatId('')
}}

style={{color:'grey',cursor:'pointer'}} icon={faQuestionCircle} />
{
  chatId==='isbn' && (
    <>
    <div class="reg-chat-box">
  <div class="reg-pointer"></div>
  <div class="reg-message">The ISBN (International Standard Book Number) is a unique numeric commercial book identifier used to identify books and related products internationally.</div>
</div>
    </>
  )
}





 </div> 
          
          
          
          
          
          
          
          
          
          
          
          </div>
            
            <input type="text"    className={ 'management-input  form-control important'}
             value={isbn}  onChange={(e)=>setIsbn(e.target.value)}
             
             
             />

          </article>
           
          
          
          </>
        )
      }

























</section>




<h5 className='font-sub-heading register-sub-heading' style={{textAlign:''}}>Quantity Information</h5>

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
     



<article className='register-each-partition'>

<div  className='management-register-text'>Description</div>

<textarea rows="4" cols="50" type='text'  value={description}   className='management-input-description  font-text' onChange={(e)=>setDescription(e.target.value)} ></textarea>
<div className='management-commentary' >description must not exceed 300 characters or less than 10 characters</div>

</article>


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

<section className='register-btn-section'>

<button className='btn btn-primary font-text register-btn-submit' style={{marginTop:"8px",}}  onClick={handleConfirm}>Submit</button>

<br />
<br />

{
(doesEmptyFieldExist &&  isConfirmHidden) && (
<>
{
  loadingMessage!=='' && (
    <>
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




     
       </section>


</section>









   
   
   </LayOut>
  
   </>
 );
};

export default Register;