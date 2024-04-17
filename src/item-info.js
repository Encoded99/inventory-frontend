import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaTimes } from 'react-icons/fa'; 


import LayOut from './lay-out';




const ProductInfo=()=>{

const {specificData,fetchProductInfo,prefix,loadingMessage,setLoadingMessage,resetLoadingText,apiError,setApiError, }= useGlobal()
const navigate= useNavigate()
const  [bulkQuantity,setQuantity]=useState('')
const [expiryDate, setDate]=useState(null)
const [transactionDate,setTransactionDate] =useState(null)
const [isEditShown,setIsEditShown]= useState(false)
const [isExpiryDateShown,setIsExpiryDateShown] =useState(false)
const [isCreatedDateShown,setIsCreatedDateShown] =useState(false)
const [costPrice,setCostPrice]= useState('')
const [batchNo,setBatchNo]=useState('')
const [batchID,setBatchId] =useState('')
const [isDeleteShown,setIsDeleteShown] =useState(false)
const [userRole,setUserRole]= useState('')



useEffect(()=>{
  //setIsPreLoaderRunning(true)
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











const data={
  
}


const handleSubmit=async()=>{
setLoadingMessage('please wait...')

  if (transactionDate){

    data.transactionDate=transactionDate

  }


  if (expiryDate){

    data.expiryDate=expiryDate

  }


  if (costPrice){

    data.costPrice=costPrice
   

  }


  if (bulkQuantity){

    data.quantity=bulkQuantity*parseFloat(specificData[0].upb)

  }





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

    resetLoadingText()

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
    setLoadingMessage('Error deleting batch,try again')
  }


  finally{
    resetLoadingText()
  }

}



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
  



  







return(
  <>
  
  {

    specificData.length!==0 && (
  
  
  

      


        specificData.map((item, index)=>{
        
        const {name,sku,upb,measurement,currentPrice,inventoryData,createdAt,image}=item
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
     






        const fetchProfile = async () => {



          try {
           
        
         //   setIsPreLoaderRunning(true);
        
            const url = `${prefix}/users/my-profile`;
        
            const config = {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            };
        
            const response = await axios.get(url, config);
         
        
            
        
            const profileData = response.data.data.data;
           
               
            if (response.status === 200) {
              
              if(profileData.role!=='admin' && profileData.isVerified!==true ){
        
          
                navigate('/')
              }
        
        
            
         
        
           
        
              
              setUserRole(profileData.role)
           
            
            
            } else {
              
            }
          } catch (error) {
         
        
        
        
        
        
        
        
           
              //setNoApiError(false);
        
        
            
          } finally {
            // Code here will run whether there was an error or not
        //setIsPreLoaderRunning(false)
        
        
            // ... any other cleanup code ...
          }
        };
        
        
        
      





        
        
        return(
        
        <>
        
        
        <LayOut>
        
        
        <main style={{backgroundColor:''}}>
        
        
        <div className='header-container'>
        <p style={{fontSize:'2em',textAlign:'',margin:'0.5em 0'}}>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</p>
        
        

         
        <button className='btn btn-primary add-inventory-btn'  onClick={()=>navigate('/add-inventory')}>Add To Inventory</button>
        
        <button className='btn btn-primary' onClick={()=>navigate('/edit-product')}>Edit Stock</button>
        </div>
        
        
        <p style={{fontSize:'1.8em',textAlign:'center',margin:'0.5em 0',backgroundColor:''}}>Overview</p>
        
        <section className='info-first-section'>
        
        <div className='info-first-section-right'>
        
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>SKU</div>
         <strong>{sku}</strong>
        </div>
        <br />
        
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Unit per bulk</div>
         <strong>{upb}</strong>
        </div>
        <br />
        
        
        
        
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Quantity(bulk)</div>
        
        
        
        
        
         <strong className={inventoryData.length!==0?'normal':"danger"}>{inventoryData.length!==0?(quantity/upb).toFixed(1):"OUT OF STOCK"}</strong>
        </div>
        <br />
        
        
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Quantity(pieces)</div>
         <strong className={inventoryData.length!==0?'normal':"danger"}>{inventoryData.length!==0?quantity:"OUT OF STOCK"}</strong>
        </div>
        <br />
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Number of Batches</div>
         <strong className={inventoryData.length!==0?'normal':"danger"}>{inventoryData.length!==0?inventoryData.length:'OUT OF STOCK'}</strong>
        </div>
        <br />
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Minimum Expiry Date</div>
         <strong>{inventoryData.length!==0?  moment.utc(minimumExpirydate).tz('Africa/Lagos').format('DD-MM-YYYY'):"N/A"}</strong>
        </div>
         
         <br />
        
        
        <br />
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Last Selling Cost (bulk)</div>
         <strong>&#x20A6;{currentPrice.bulkPrice}</strong>
        </div>
        
        
        <br />
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Last Selling Cost(pieces)</div>
         <strong>&#x20A6;{currentPrice.piecesPrice}</strong>(NGN)
        </div>
        
        
        
        
        
        
        
       
        
        
        <br />
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Measurement</div>
         <strong>{measurement.charAt(0).toUpperCase() + measurement.slice(1).toLowerCase()}</strong>
        </div>
        <br />
        <div style={{width:"100%",display:'grid',gridTemplateColumns:"2fr 1fr",gridGap:'4%'}}>
         <div>Date Created</div>
         <strong>{moment.utc(createdAt).tz('Africa/Lagos').format('DD/MM/YYYY')}</strong>
        </div>
        
        
        
        
        
        
        
        </div>
        
        
        
        
        
        
        
        
        
        
        
        
        <div className='info-second-section-left'>
        <LazyLoadImage 
       src={imageSrc ? imageSrc : ""}
          
        
        className='info-img'/>
        </div>
        
        
        
        </section>
        
        
        <section className='info-second-section' style={{backgroundColor:''}}>
        
        
        
        
        
        
        <section class="inventory-info-container">

          {
            rInventory.length!==0 && (
              <>
            <h2 className='batch-heading'> Batch History and Information</h2>   
              
              </>
            )
          }

       

{
  rInventory.map((item)=>{
    return(
      <>
      
    <div class="batch-info"  style={{border:batchID===item._id?'solid 3px red':""}}>
        <label for="batch-id">Batch ID:</label>
        <p id="batch-id">{item.batch}</p>
        
        
        <label for="quantity-produced">Quantity Added(bulk):</label>
        <p id="quantity-produced">{(item.initialQuantity/upb).toFixed(1)}</p>
        <label for="quantity-produced">Quantity left(bulk):</label>
        <p id="quantity-produced">{(item.quantity/upb).toFixed(1)}</p>

        <label for="quantity-produced">Quantity Sold(bulk):</label>
        <p id="quantity-produced">{(item?.initialQuantity/upb-item?.quantity/upb).toFixed(1)}</p>


        <label for="quantity-produced">Cost (NGN):</label>
        <p id="quantity-produced">{item.costPrice}</p>
        <label for="quantity-produced">Created By:</label>
        <p id="quantity-produced">{item.createdBy.firstName} {item.createdBy.lastName}</p>
        <label for="expiry-date">Expiry Date:</label>
        <p id="expiry-date">{moment.utc(item.expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}</p>
        <label for="production-date">Date Added:</label>
        <p id="production-date">{moment.utc(item.createdAt).tz('Africa/Lagos').format('DD/MM/YYYY')}</p>
{
  userRole==='admin'  && (
    <>
    
    <div class="actions-btn-container">
        <button className='btn btn-secondary' data-id={item._id} data-batch={item.batch} onClick={handleEditBatch}>Edit Batch</button>
        <button className='btn btn-danger'   data-id={item._id} data-batch={item.batch} onClick={handleDelete}>Delete Batch</button>
       
    </div>
    
    </>
  )
}
       

  
    </div>





{
  isEditShown && batchID===item._id  && (
    <>
    
    
    <section  className='batch-edit-overlay'>

<div className='batch-edit-container'  >
<div style={{width:'100%'}}>
<FaTimes  style={{float:"right",fontSize:"200%"}}  onClick={()=>{setIsEditShown(false);setBatchId('')}}></FaTimes>

</div>
<h4>BATCH NO:  {batchNo}</h4>





<div className='batch-data-container'>
    <p  className='register-text'>Quantity (bulk)</p>
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


    <div className='batch-data-container batch-edit-date'>    <span className='batch-edit-date'   onClick={()=>setIsExpiryDateShown(true)}>Edit expiry date </span>  <span style={{color:'black',fontWeight:"400"}}>
    {moment.utc(item.expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}
      </span>  </div>



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
<button className='btn btn-primary  batch-edit-button'  onClick={handleSubmit}>SUBMIT </button>


</div>


<div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700',margin:"2vh 0",maxWidth:'100%'}}>
  {loadingMessage}
</div>


   

  


   
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
<h6>BATCH NO: {batchNo}</h6>

<div class="actions-btn-container-del" >
       
        <button className='btn btn-danger' onClick={deleteItem}>Yes</button>
        <button className='btn btn-secondary' data-id={item._id} data-batch={item.batch} onClick={()=>{
          setIsDeleteShown(false);
          setBatchId('')
        }}>No</button>
       
    </div>

    
<div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700',margin:"2vh 0"}}>
  {loadingMessage}
</div>
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