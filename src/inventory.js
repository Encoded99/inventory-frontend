import React, { useState, useEffect, } from 'react'

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';

import {useQuery,} from 'react-query'

import { useNavigate } from 'react-router-dom'

import { useGlobal, input } from './context'

import axios from 'axios'


import LayOut from './lay-out';












const Invetory=()=>{

const {fetchAllProducts,inventoryData,searchInput,         inventoryBatches,setInventoryData, expiryDateData, isSearching, setIsPreLoaderRunning,}= useGlobal()

const [sortOption,setSortOption]= useState('')

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










const Sort= (e)=>{


setSortOption(e.target.value)

 
}


useEffect(()=>{



  const newInventory=expiryDateData.map((item)=>{
  return{
    ...item,
    totalQuantity:item.inventoryData.reduce((acc,item)=>acc+item.quantity,0)
  }
  })

  if(sortOption==='reset'){
    const reset= newInventory.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  
    setInventoryData(reset)
  }
  
  
  if(sortOption==='hq'){
    const highestToLowest= newInventory.sort((a,b)=>b.totalQuantity-a.totalQuantity)
  
    setInventoryData(highestToLowest)
  }

  if(sortOption==='lq'){
    const lowestToHighest= newInventory.sort((a,b)=>a.totalQuantity-b.totalQuantity)

    setInventoryData(lowestToHighest)
  
  }

  if(sortOption==='id'){


    const lowestToHighest=  newInventory.sort((a, b) =>
    a.sku.toLowerCase().localeCompare(b.sku.toLowerCase())
  );
    setInventoryData(lowestToHighest)
  
  }











  const lowestExpiry= expiryDateData.filter((item)=>item.inventoryData.length!==0).map((item)=>{
    
let minExpiry=item.inventoryData[0].expiryDate


for (let i=0;i<item.inventoryData.length;i++){
  const element=item.inventoryData[i]
  if (element.expiryDate<minExpiry){
    minExpiry=element.expiryDate
  }
}



    return{
      ...item,
      minExpiry
      
    }
  })



  if(sortOption==='le'){
    const newArray=lowestExpiry.sort((a,b)=>{
      const dateA =Date.parse(a.minExpiry)
      const dateB =  Date.parse(b.minExpiry)
    
      return dateA - dateB;
    })

    setInventoryData(newArray)
  }



  


 
},[sortOption])










 return(

<>

<LayOut>
 <main className='main-sales-record'>

{
  !isSearching ? (
  <>
  <div  className='inventory-first-line'>

<div style={{fontSize:'1.5em', fontStyle:""}}>Inventory</div>

<select name="" id="" value={sortOption} className='form-select inventory-select' style={{width:'auto'}} onChange={Sort}  >

<option value="" className='form-select-option'>SORT</option>
<option value="reset"   className='form-select-option'>RESET</option>
<option value="hq"   className='form-select-option'>SORT FROM HIGHEST  QUANTITY</option>
<option value="lq"  className='form-select-option'>SORT FROM LOWEST QUANTITY</option>

<option value="le"  className='form-select-option'>SORT BY MINIMUM EXPIRY DATE</option>
<option value="id"  className='form-select-option'>SORT BY PRODUCT ID</option>
</select>

</div>

<section className='inventory-summary-container'>



<div className='inventory-summary-header' >

<div className=' col-sm-4 inventory-summary' >
    <strong className='quick-headings'  >Total Goods</strong>
    <strong className='quick-numbers'>{inventoryData.length}</strong>

   </div>


  

   <div className=' col-sm-4 inventory-summary' >
    <strong className='quick-headings'  >Total (batches) </strong>
    <strong className='quick-numbers'>{inventoryBatches}</strong>

   </div>

  
   <div className=' col-sm-4 inventory-summary' >
    <strong className='quick-headings'  >Total Categories</strong>
    <strong className='quick-numbers'>3</strong>

   </div>
</div>
</section>

  
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
  inventoryData.length!==0 && (
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
  inventoryData.map((item,index)=>{
    const {_id,name,sku,inventoryData,upb}=item



 
 const allQuantity=inventoryData.map((item)=>{
  return item.quantity
 }).reduce((acc,cv)=>{
   return acc + cv
 },0)


 let minimumExpirydate= inventoryData.length !== 0 ? inventoryData[0].expiryDate : 'N/A';

if(inventoryData.length!==0){

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
  isSearching && inventoryData.length===0 &&(
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


export default Invetory
