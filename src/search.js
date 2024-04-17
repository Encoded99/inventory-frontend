import React, { useState, useEffect, } from 'react'

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
import { FaArrowLeft } from 'react-icons/fa'; 

import { useNavigate } from 'react-router-dom'

import { useGlobal, input } from './context'



import LayOut from './lay-out';












const Search=()=>{

const {fetchAllProducts,searchData,searchInput,  isSearching, setIsPreLoaderRunning,}= useGlobal()



const navigate= useNavigate()

useEffect(()=>{

if(!searchInput){

  fetchAllProducts()

}

 
},[])



const navigateToProductInfo=(e)=>{
  setIsPreLoaderRunning(true)
const data=e.target.dataset.id



  localStorage.setItem('product-id', data);

  navigate('/product-info')

}
















useEffect(()=>{
 if(!isSearching){
  navigate('/inventory')
 }
},[])






 return(

<>

<LayOut>
 <main className='main-sales-record'>
 <div className='back-container' style={{cursor:'pointer'}} onClick={()=>navigate('/inventory')}> <FaArrowLeft size={15}></FaArrowLeft> back </div>


{
  !isSearching ? (
  <>
  
<h1 style={{textAlign:"center"}}>please type for item to be search in the search box</h1>

  
  </>
 ):(
  <>
  <div className=''>
  <h3 style={{textAlign:"center"}}>Search Result</h3>
  </div>
  
  </>
 )
}
 


<section className='inventory-container-table'>




{
  searchData.length!==0 && (
    <>
   <div className='inventory-table-container'>

<div className='invetory-table-header'>ID</div>
<div className='invetory-table-header'>Name</div>
<div className='invetory-table-header'>Quantity

(bulk)</div>
<div className='invetory-table-header'>Quantity

(pieces)</div>
<div className='invetory-table-header'>Expiry date</div>




</div> 
    
    
    
    </>
  )
}





<div className='inventory-main-container' style={{backgroundColor:"white"}}>


{
  searchData.map((item,index)=>{
    const {_id,name,sku,inventoryData,upb}=item



 
 const allQuantity=inventoryData.map((item)=>{
  return item.quantity
 }).reduce((acc,cv)=>{
   return acc + cv
 },0)


 let minimumExpirydate= searchData.length !== 0 ? searchData[0].expiryDate : 'N/A';

if(searchData.length!==0){

  const allExpiryDate= searchData.map((item)=>item.expiryDate)




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
      
      <div  className='inventory-container'  onClick={(navigateToProductInfo)}  style={{cursor:'pointer'}} data-id={_id}  key={index}>

<div className='inventory-properties'  data-id={_id}>{sku}</div>
<div  className='inventory-properties' data-id={_id}>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</div>
<div  className='inventory-properties' data-id={_id}>{inventoryData?(allQuantity/upb).toFixed(2):"OOS"}</div>
<div  className='inventory-properties' data-id={_id}>{inventoryData?allQuantity.toFixed(2):'OOS'}</div>
<div  className='inventory-properties' data-id={_id}>{inventoryData.length!==0?   moment.utc(minimumExpirydate).tz('Africa/Lagos').format('DD/MM/YYYY'):'N/A'  }</div>





</div>
      
      </>
    )
  })
}










</div>




</section>




{
  isSearching && searchData.length===0 &&(
    <>
     <div className=''>
      <br />
  <h4 style={{textAlign:"center"}}>No Item Found</h4>
  </div>
  
    </>
  )
}






 </main>










</LayOut>





</>




 )
}


export default Search