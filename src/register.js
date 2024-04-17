     
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
import { faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import LayOut from './lay-out';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';









const Register = () => {

  const {prefix,setLoadingMessage,loadingMessage,resetLoadingText,apiError,setApiError,}=useGlobal()
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
  const [userRole,setUserRole]= useState('')
const available=true;
const status='verified'
const batch=1


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
  
  
  
  
  
  
  useEffect(()=>{
    fetchProfile()
  },[])
  





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






  

  if(!name || !costPrice || ! piecesPrice || !bulkPrice ||!category || !upb || !sku || !expiryDate   || !measurement ||parseFloat(costPrice)<=0 || parseFloat(piecesPrice)<=0 ||  parseFloat(bulkPrice)<=0  || parseFloat(upb)<=0 ){
   
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




const data={
  image,
  name,
  expiryDate,
  measurement,
  sku:sku.toUpperCase(),

  upb:parseFloat(upb),
  price:{
   bulkPrice: parseFloat(bulkPrice),
  piecesPrice: parseFloat (piecesPrice),
  },
  costPrice:(piecesQuantity && bulkQuantity)?parseFloat(costPrice) + (((parseFloat(costPrice)/ parseFloat(bulkQuantity))/parseFloat(upb))*parseFloat(piecesQuantity)).toFixed(2):parseFloat(costPrice),

 

  quantity:(piecesQuantity && bulkQuantity)?  parseFloat(bulkQuantity*upb)+ parseFloat(piecesQuantity):(piecesQuantity&& !bulkQuantity)?parseFloat(piecesQuantity): parseFloat(bulkQuantity* upb),
  brand,

 
  category,
  description,
  available,
  status,
  batch,
}











useEffect(()=>{


    CheckValidation()

   
  
},[name,measurement,bulkPrice,piecesPrice,upb,bulkQuantity,category,expiryDate,sku,costPrice,piecesQuantity])




const handleSubmit=async()=>{

  if (transactionDate){
    data.transactionDate=transactionDate
  }




setLoadingMessage('please wait...')







await handleImageSubmit()

const url= `${prefix}/products`

const config={
  headers:{
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}


try{


const response=await axios.post(url,data,config,)




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
setQuantity('')
setPquantity('')
setTransactionDate(null)
setHasSubmitButtonClicked(false)

}





}

catch(error){

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

<p style={{fontWeight:"500"}}>NAME: <strong className='reg-details'>{name}</strong></p>
<p  style={{fontWeight:"500"}}>EXPIRY DATE: <strong className='reg-details'>{moment(expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}</strong></p>
<p  style={{fontWeight:"500"}}>PRODUCT ID: <strong className='reg-details'>{sku}</strong></p>
<p  style={{fontWeight:"500"}}>UNIT PER BULK: <strong className='reg-details'>{upb}</strong></p>

<p  style={{fontWeight:"500"}}>COST PRICE IN BULK: <strong className='reg-details'>&#x20A6;{costPrice}</strong></p>
<p  style={{fontWeight:"500"}}>SELLING PRICE IN BULK: <strong className='reg-details'>&#x20A6;{bulkPrice}</strong></p>
<p  style={{fontWeight:"500"}}>SELLING PRICE IN PIECES: <strong className='reg-details'>&#x20A6;{piecesPrice}</strong></p>
<p  style={{fontWeight:"500"}}>CATEGORY: <strong className='reg-details'>{category}</strong></p>

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

   
   <p style={{fontSize:'3em',textAlign:'center',margin:' 0'}}>Register</p>

 
<div className='first-register-section'>


    <div className='register-data-container'>
    <p  className='register-text' type={'text'}   style={{marginRight:''}}  >Item Name*</p>

<input type="text"   placeholder={hasSubmitButtonClicked && name === '' ? 'Please enter a name' : ''}
   value={name} onChange={(e)=>setName(e.target.value)}   className={ hasSubmitButtonClicked && name === '' ? 'register-input form-control important unfilled' : 'register-input form-control important'}/>

    </div>

    <div className='register-data-container'>
    <p  className='register-text' style={{marginRight:''}}  >Item ID(SKU)*</p>

<input type="text" placeholder={hasSubmitButtonClicked && sku === '' ? 'Please enter a product ID' : ''}  value={sku} onChange={(e)=>setSku(e.target.value)}    className={hasSubmitButtonClicked && sku === '' ? 'register-input form-control important unfilled' : 'register-input form-control important'}/>

    </div>

    <div className='register-data-container '  type='text' style={{backgroundColor:''}}>
    <p  className='register-text' style={{marginRight:''}} >Unit of Measurement*</p>


  
    <div className='second-combo-box register-input register-combo-container' style={{width:'',border:'1px solid transparent',backgroundColor:'',marginRight:'',marginLeft:'0'}} >
 <input type="text" placeholder={hasSubmitButtonClicked && measurement === '' ? 'Please select a measurement type' : ''}      className= {hasSubmitButtonClicked && measurement ==='' ? 'unfilled register-part-input  form-control' : 'register-part-input form-control register-part-input-border'}  value={measurement} />


 <select name="" id="" className='combo-select  register-select'  style={{boxShadow:'none', border:'1px solid gray',borderRadius:'0%',borderLeft:"none",height:''}}   type='text'  value={measurement} onChange={(e)=>setMeasurement(e.target.value)}>


 <option value=""></option>

 <option value={'cartons'}>Cartons</option>
    <option value={'packs'}>Packs</option>
    <option value={'dozens'}>Dozens</option>
    <option value={'box'}>Box</option>
    <option value={'rolls'}>Rolls</option>


 </select>



    </div>
    



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

<br />
<div className='image-register-section'>



<strong className='image-heading'>Add a photo</strong>

<p style={{color:'green',fontWeight:'bolder'}}>please upload three images</p>

<div className='field-container'>
<div  >
<input type="file"  multiple  name='file' className='file-field' ref={fileInputRef}  onChange={handleFileUpload}  />
</div>

</div>   

{
  files.length>=1 ? (
    <>
    <div style={{margin:"2vh"}}>
  <strong  className='image-count'>{files.length===1 ?`${files.length} image selected`:`${files.length} images selected`} </strong> 
</div>
    </>
  ):(
    <>
    <div style={{margin:"2vh"}}>
  <strong  className='image-count'>no image selected</strong> 
</div>
    </>
  )
}



<div className='image-list-container'>




{

src.length!==0 &&(
  <>
  
  <figure className='row'>

{
src.map(({img,index})=>{
return(
  < >
 
 <div  className='col-sm-4'>


 <div class="item-container">
 <LazyLoadImage className='item-image' src={img}></LazyLoadImage>
        <div class="button-container">
        <div className='remove-btn-container'>
 <button onClick={(e)=>removeIndex(e,index)}  className='btn btn-secondary '>remove</button>
 </div>
        </div>
      </div>

</div>





 
  

  
  
  </>
)
})

}

</figure>
  
  </>
)
}







</div>



</div>


<div>

</div>




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
    <p  className='register-text'>Unit per Bulk*</p>

<input type="text"  value={upb}  

placeholder={
  hasSubmitButtonClicked && (
    isNaN(parseFloat(upb)) || upb <= 0 || upb === ''
  ) ?
  'Please enter a valid unit per bulk' : ''
}

id='lol'
className={
  hasSubmitButtonClicked && (isNaN(parseFloat(upb)) || upb <= 0 || upb === '') ?
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
    setUpb(() => sanitizedInput);
  }
}}

onKeyDown={(e) => {
   
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
  }
}}

inputmode="numeric"
/>

    </div>
    
    <div className='register-data-container'>
    <p  className='register-text'>Brand</p>

<input type="text"  value={brand}  className='register-input form-control' onChange={(e)=>setBrand(e.target.value)}/>

    </div>

    <div className='register-data-container'>
    <p  className='register-text'>Category*</p>



  
    <div className='second-combo-box register-input register-combo-container' style={{width:'',border:'1px solid transparent',backgroundColor:'',marginRight:'',marginLeft:'0'}} >
 <input type="text"      placeholder={hasSubmitButtonClicked && category ==='' ? 'Please select category' : ''} 
 className= {hasSubmitButtonClicked && category ==='' ? 'unfilled register-part-input  form-control' : 'register-part-input form-control register-part-input-border'}      value={category} />


 <select name="" id=""    className='combo-select  register-select'  style={{boxShadow:'none', border:'1px solid gray',borderRadius:'0%',borderLeft:"none",height:''}}   type='text'  value={category} onChange={(e)=>setCategory(e.target.value)}>


 <option value=""></option>

 <option value={'Groceries'}>Groceries</option>
    <option value={'Drinks'}>Drinks</option>
    <option value={'Biscuits/Snacks'}>Biscuits/Snacks</option>
    
   


 </select>



    </div>









    </div>

   



  

 


</div>



<p style={{fontSize:'2em',textAlign:'center',margin:'0.5em 0'}}>Cost and Sales Information</p>


   <h6 style={{color:'red',textAlign:"center"}}>select the delivery date  only if it's not today; otherwise, you can skip.</h6>
 

<div className='first-register-section'>


<div className='register-data-container'>
    <p  className='register-text'>Cost Price*</p>

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
    



    onKeyDown={(e) => {
   
   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
   }
 }}
 inputmode="numeric"
 
 />

    </div>
    
    <div className='register-data-container'>
    <p  className='register-text'>Selling Price (bulk)*</p>

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
  
  
  onKeyDown={(e) => {
   
   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
   }
 }}
 inputmode="numeric"
 
 
 />

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





onKeyDown={(e) => {
   
   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
   }
 }}
 
 inputmode="numeric"
 />

    </div>



<div className='register-data-container'>
    <p  className='register-text' style={{marginRight:''}}>Delivery Date(optional)</p>


   
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





 


</div>






   

    
 

 








<p style={{fontSize:'2em',textAlign:'center',margin:'0.5em 0'}}>Description</p>

<div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginBottom:"5em"}}>



<textarea rows="4" cols="50" type='text'  value={description}   className='description-input' onChange={(e)=>setDescription(e.target.value)} ></textarea>

<button className='register-submit-btn btn btn-primary' type='submit' onClick={handleConfirm}>SUBMIT</button>

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

export default Register;