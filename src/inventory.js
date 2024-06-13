import React, { useState, useEffect, } from 'react'

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
import {useQuery,} from 'react-query'

import { useNavigate } from 'react-router-dom'

import { useGlobal, input } from './context'
import { FaShoppingCart,FaBoxes,FaFolder, FaClock,FaTimes,FaArrowLeft } from 'react-icons/fa'; 
import { faPlus,faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayOut from './lay-out';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

import { AddToInventory,DeleteProduct } from './item-info';

import { LinkNav } from './lay-out';


import { SemiPreloader,Preloader } from './preloader';





const Invetory=()=>{

const {fetchAllProducts,inventoryData,searchInput,         inventoryBatches,setInventoryData, expiryDateData, isSearching, setIsPreLoaderRunning,shopGroup,setProductToBeDeleted,   productToBeDeleted,setLink,isAddStockShown,setIsAdStockShown,setId,id,setUpb,isPreLoaderRunning,error,  setProductToBeDeletedID,}= useGlobal()

const [sortOption,setSortOption]= useState('')
const [isDeleteShown,setIsDeleteShown]=useState(false)

const [indicator,setIndicator]= useState('')
const [focusId,setFocusId]=useState('')

const navigate= useNavigate()

useEffect(()=>{
  setLink('')



if(!searchInput){

  fetchAllProducts()

}

 
},[])

useEffect(()=>{
  console.log(inventoryBatches,'lento')
})



const navigateToProductInfo=(e)=>{
  setIsPreLoaderRunning(true)
const data=e.target.dataset.id





  localStorage.setItem('product-id', data);

  navigate('/product-info')

}


const handleAction=(e,action)=>{
  const id= e.currentTarget.dataset.id
  const name= e.currentTarget.dataset.name
  setProductToBeDeleted(name)
  localStorage.setItem('product-id',id);
setId(id)

if(action==='stock'){
  setLink('inv')
  setIsAdStockShown(true)

  
}

else{
  setIsDeleteShown(true)

}


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

const handleNavigate = (e) => {
  e.preventDefault();
  console.log('Navigating to /inventory/history');
  navigate('/inventory/history');
};





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










if (inventoryData.length===0){
  return(
    <>
    <LayOut>

    <section className=' inventory-content-container' >
    <div className='inventory-first-line'>
      <div style={{ fontSize: '1.5em' }} className='font-heading'>
        Inventory
      </div>
      <button
        className='btn btn-primary stock-record-btn font-sub-heading'
        onClick={handleNavigate}
        style={{opacity:"0"}}
      >
        <FaClock style={{ marginRight: '5px', cursor: 'pointer' }} />
        Past Record
      </button>
    </div>

    <section className='inventory-summary-container'>
      
    <h5>No Product registered yet</h5>

    </section>


      </section>


    </LayOut>
    </>
  )
}






 return(

<>




{
  isDeleteShown && (
    <>
   <section className='inventory-delete-overlay'>

<div className='inventory-delete-container'> 
<div style={{width:'100%'}}>
<FaTimes  style={{float:'right',cursor:'pointer'}}  onClick={()=>{setIsDeleteShown(false);setId("")}} size={24}></FaTimes>
</div>
<DeleteProduct></DeleteProduct>
</div>


</section> 
    
    </>
  )
}


<LayOut>


{
  isDeleteShown && (
    <>
   <section className='mobile-inventory-delete-overlay'>

<div className='inventory-delete-container'> 
<div style={{width:'100%'}}>
<FaTimes  style={{float:'right',cursor:'pointer'}}  onClick={()=>{setIsDeleteShown(false);setId("")}} size={24}></FaTimes>
</div>
<DeleteProduct></DeleteProduct>
</div>


</section> 
    
    </>
  )
}









<main  className='main-inventory-container' style={{paddingBottom:isAddStockShown&&'0px'}}>




{
  isAddStockShown ? (
    <>
  <section className='action-overlay'>


 <div className='inv-name-container'>
 <FaTimes style={{cursor:'pointer',marginRight:"0px"}} size={22} onClick={()=>{setIsAdStockShown(false);setId('');setLink('')}}></FaTimes>
 </div>






    
 

<article className='action-second-line'>
  
<AddToInventory></AddToInventory>



</article>
</section>  
    </>
  ):(<>






  <section className=' inventory-content-container' >




  <div className='inventory-first-line'>
      <div  className='font-heading inventory-main-heading'>
        Inventory
      </div>
      <button
        className='btn btn-primary stock-record-btn font-sub-heading'
        onClick={handleNavigate}
      >
        <FaClock style={{ marginRight: '5px', cursor: 'pointer' }} />
        Past Record
      </button>
    </div>



<article className='inventory-summary-container-scollable'>

<section className='inventory-summary-container'>



<div className='inventory-summary-header' >



<div className=' col-sm-4 inventory-summary' >
<div className='inventory-summary-inner-holder'>

<div className='inv-logo-holder' style={{backgroundColor:'hsl(277, 70%, 88%)'}}>
  <FaShoppingCart className='inventory-logo-indicator' style={{color:'purple'}}></FaShoppingCart>
</div>
<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>

  <strong className='quick-numbers'>{inventoryData.length}</strong>
  <div className='quick-headings'  >Total Products</div>
</div>
</div>

 </div>



 
<div className=' col-sm-4 inventory-summary' >
<div className='inventory-summary-inner-holder'>

<div className='inv-logo-holder' style={{backgroundColor:'hsl(351, 53%, 93%)'}}>
  <FaBoxes className='inventory-logo-indicator' style={{color:'hsl(351, 89%, 67%)'}}></FaBoxes>
</div>
<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>

  <strong className='quick-numbers'>{inventoryBatches}</strong>
  <div className='quick-headings'  >Total Batches</div>
</div>
</div>

 </div>


   
<div className=' col-sm-4 inventory-summary' >
<div className='inventory-summary-inner-holder'>

<div className='inv-logo-holder' style={{backgroundColor:'hsl(38, 86%, 75%)'}}>
  <FaFolder className='inventory-logo-indicator' style={{color:'orange'}}></FaFolder>
</div>
<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>

  <strong className='quick-numbers'>{shopGroup==='group-1'?'3':shopGroup==='group-2'?'10':"10"}</strong>
  <div className='quick-headings'  >All Categories</div>
</div>
</div>

 </div>


 



</div>
</section>

</article>







<section className='inventory-container-table'>



<article className='sort-export-line'>


<select name="" id="" value={sortOption} className='form-select inventory-select font-sub-heading' style={{width:'auto'}} onChange={Sort}  >
  <option value="" className='form-select-option'>Sort</option>
  <option value="reset" className='form-select-option'>Reset</option>
  <option value="hq" className='form-select-option'>High Quantity</option>
  <option value="lq" className='form-select-option'>Low Quantity</option>
 
  <option value="id" className='form-select-option'>Product ID</option>
</select>




<select name="" id="" className='form-select inventory-select font-sub-heading' style={{width:'auto'}}>

<option value="" className='form-select-option'>Export</option>
  <option value="reset" className='form-select-option'>CSV</option>
  <option value="hq" className='form-select-option'>XLS 
</option>
<option value="">XLSX </option>
</select>


</article>




{
inventoryData.length!==0 && (
  <>
 <div className='inventory-table-container'>

<div className='invetory-table-header'>ID</div>
<div className='invetory-table-header'>Name</div>
<div className='invetory-table-header'>Quantity</div>
<div className='invetory-table-header'>Category</div>
<div className='invetory-table-header'>Actions</div>




</div> 
  
  
  
  </>
)
}





<div className='inventory-main-container' style={{backgroundColor:"white"}}>


{
inventoryData.map((item,index)=>{
  const {_id,name,sku,inventoryData,upb}=item

  const number=index+1;
  const remainder=number%2


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

const bulk= parseFloat( allQuantity/item.upb)


const piecesRemainder=(parseFloat(allQuantity)- parseInt(bulk)*item.upb)










  return(

    <>




 




    
    <div  className='inventory-container'      style={{cursor:'',backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)',}} data-id={_id}  key={index}>

<div className='inventory-properties'     onClick={(navigateToProductInfo)}  data-id={_id}  style={{cursor:'pointer'}}>{sku}</div>
<div  className='inventory-properties' data-id={_id}     style={{cursor:'pointer'}} onClick={(navigateToProductInfo)} >{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</div>

<div className='inventory-properties' data-id={_id}  style={{cursor:'pointer'}} onClick={(navigateToProductInfo)}  >
{piecesRemainder === 0 ? `${parseInt(parseFloat(allQuantity / upb).toFixed(1))} 📦` : (piecesRemainder !== 0 ? `${parseInt(allQuantity / item.upb).toFixed(1)} 📦 ${piecesRemainder.toFixed(1)} 🔵` : "OOS")}
</div>



<div  className='inventory-properties'   style={{cursor:'pointer'}}  onClick={(navigateToProductInfo)}  data-id={_id}>{item.category}</div>
<div  className='inventory-properties' data-id={_id}> 

<div className='action-container'>
<div className='action-btn-indicator-container'>

{

  (indicator==='inv' && focusId===_id) && (
    <>
    <div className='inventory-indicator'>
  <div className='inventory-indicator-chat'>
 Stock up
  </div>

  <div className='inventory-indicator-pointer'>

  </div>

</div>
    
    </>
  )

}





<button  className='btn btn-primary inventory-add-btn' 
 data-id={_id}  
 data-name={name}
 onClick={(e)=>{handleAction(e,'stock');setUpb(item.upb)}}
 onMouseEnter={()=>{setIndicator('inv');setFocusId(_id)}}  onMouseLeave={()=>{setIndicator('');setFocusId('')}} 
 
 
 >
<FontAwesomeIcon  icon={faPlus} className='action'  onMouseEnter={()=>{setIndicator('inv');setFocusId(_id)}} />
</button>


  </div>







<div className='action-btn-indicator-container'>

{

(indicator==='delete' && focusId===_id) && (
  <>
  <div className='inventory-indicator'>
<div className='inventory-indicator-chat'>
Delete
</div>

<div className='inventory-indicator-pointer'>

</div>

</div>
  
  </>
)

}

<button          className='btn btn-danger inventory-delete-btn'  onMouseEnter={()=>{setIndicator('delete');setFocusId(_id)}}  onMouseLeave={()=>{setIndicator('');setFocusId('')}}  data-id={_id} data-name={name} onClick={(e)=>{handleAction(e,'delete');setProductToBeDeletedID(item._id)}}>
<FontAwesomeIcon  icon={faTrash}  onMouseEnter={()=>{setIndicator('delete');setFocusId(_id)}}   className='action-delete-btn action' style={{cursor:"pointer"}}></FontAwesomeIcon>

</button>

</div>





</div>

</div>




</div>
    
    </>
  )
})
}










</div>




</section>


<section className='mobile-inventory-container-table'>



<article className='sort-export-line'>


<select name="" id="" value={sortOption} className='form-select inventory-select font-sub-heading' style={{width:'auto'}} onChange={Sort}  >
  <option value="" className='form-select-option'>Sort</option>
  <option value="reset" className='form-select-option'>Reset</option>
  <option value="hq" className='form-select-option'>High Quantity</option>
  <option value="lq" className='form-select-option'>Low Quantity</option>
 
  <option value="id" className='form-select-option'>Product ID</option>
</select>




<select name="" id="" className='form-select inventory-select font-sub-heading' style={{width:'auto'}}>

<option value="" className='form-select-option'>Export</option>
  <option value="reset" className='form-select-option'>CSV</option>
  <option value="hq" className='form-select-option'>XLS 
</option>
<option value="">XLSX </option>
</select>


</article>




{
inventoryData.length!==0 && (
  <>
 <div className='inventory-table-container'>

<div className='invetory-table-header'>ID</div>
<div className='invetory-table-header'>Name</div>
<div className='invetory-table-header'>Quantity</div>

<div className='invetory-table-header'>Actions</div>




</div> 
  
  
  
  </>
)
}





<div className='inventory-main-container' style={{backgroundColor:"white"}}>


{
inventoryData.map((item,index)=>{
  const {_id,name,sku,inventoryData,upb}=item

  const number=index+1;
  const remainder=number%2


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

const bulk= parseFloat( allQuantity/item.upb)


const piecesRemainder=(parseFloat(allQuantity)- parseInt(bulk)*item.upb)










  return(

    <>




 




    
    <div  className='inventory-container'      style={{cursor:'',backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)',}} data-id={_id}  key={index}>

<div className='inventory-properties'     onClick={(navigateToProductInfo)}  data-id={_id}  style={{cursor:'pointer'}}>{sku}</div>
<div  className='inventory-properties' data-id={_id}     style={{cursor:'pointer'}} onClick={(navigateToProductInfo)} >{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</div>

<div className='inventory-properties' data-id={_id}  style={{cursor:'pointer'}} onClick={(navigateToProductInfo)}  >
{piecesRemainder === 0 ? `${parseInt(parseFloat(allQuantity / upb).toFixed(1))} 📦` : (piecesRemainder !== 0 ? `${parseInt(allQuantity / item.upb).toFixed(1)} 📦 ${piecesRemainder.toFixed(1)} 🔵` : "OOS")}
</div>



<div  className='inventory-properties' data-id={_id}> 

<div className='action-container'>
<div className='action-btn-indicator-container'>

{

  (indicator==='inv' && focusId===_id) && (
    <>
    <div className='inventory-indicator'>
  <div className='inventory-indicator-chat'>
 Stock up
  </div>

  <div className='inventory-indicator-pointer'>

  </div>

</div>
    
    </>
  )

}





<button  className='btn btn-primary inventory-add-btn' 
 data-id={_id}  
 data-name={name}
 onClick={(e)=>{handleAction(e,'stock');setUpb(item.upb)}}
 onMouseEnter={()=>{setIndicator('inv');setFocusId(_id)}}  onMouseLeave={()=>{setIndicator('');setFocusId('')}} 
 
 
 >
<FontAwesomeIcon  icon={faPlus} className='action'  onMouseEnter={()=>{setIndicator('inv');setFocusId(_id)}} />
</button>


  </div>







<div className='action-btn-indicator-container'>

{

(indicator==='delete' && focusId===_id) && (
  <>
  <div className='inventory-indicator'>
<div className='inventory-indicator-chat'>
Delete
</div>

<div className='inventory-indicator-pointer'>

</div>

</div>
  
  </>
)

}

<button  className='btn btn-danger inventory-delete-btn'  onMouseEnter={()=>{setIndicator('delete');setFocusId(_id)}}  onMouseLeave={()=>{setIndicator('');setFocusId('')}}  data-id={_id} data-name={name} onClick={(e)=>{handleAction(e,'delete');setProductToBeDeletedID(item._id)}}>
<FontAwesomeIcon  icon={faTrash}  onMouseEnter={()=>{setIndicator('delete');setFocusId(_id)}}   className='action-delete-btn action' style={{cursor:"pointer"}}></FontAwesomeIcon>

</button>

</div>





</div>

</div>




</div>
    
    </>
  )
})
}










</div>




</section>








</section>
  
  </>)
}


</main>

 









</LayOut>





</>




 )
}


export default Invetory