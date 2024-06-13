import React, { useState, useEffect, } from 'react'

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
import { FaArrowLeft,FaSearch,FaTimes} from 'react-icons/fa'; 

import { useNavigate } from 'react-router-dom'

import { useGlobal, input } from './context'

import { AddToInventory,DeleteProduct } from './item-info';
import { faPlus,faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AiOutlineDelete, } from 'react-icons/ai';
import LayOut from './lay-out';
import { SemiPreloader } from './preloader';


const Search=()=>{

  const {fetchAllProducts,inventoryData,inventoryBatches,setInventoryData, expiryDateData,  setIsPreLoaderRunning,shopGroup,setProductToBeDeleted,setLink,isAddStockShown,setIsAdStockShown,setId,searchInput,searchData,isSearching,setUpb,setProductToBeDeletedID,error,isPreLoaderRunning}= useGlobal()
  
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





  const handleBack=()=>{

   

    const previousLocation=sessionStorage.getItem('search-sub-location')
    console.log(previousLocation,'previous-location  pathname')
 
    if(previousLocation){
     navigate(previousLocation)
    }
 
 
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
  
  




  if (isPreLoaderRunning){
    return(
      <>
<LayOut>

<div style={{width:'100%',height:"100%",display:'flex',justifyContent:'center',alignItems:"center"}}>

<SemiPreloader></SemiPreloader>
</div>


</LayOut>

     
     
      
      </>
    )
  }

  if (searchData.length===0 && !isPreLoaderRunning){

    return(
      <>
      <LayOut>
      
  <h3 style={{textAlign:"center"}}>Search Result</h3>
  
  <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'center',alignItems:"center",flexDirection:'column',minHeight:"500px"}}>
 <div>
  <FaSearch size={150}></FaSearch>
 </div>
 <h4>No Item Found</h4>

</div>

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
  
  
  
  
  <main  className='main-inventory-container'>
  
  
  
  
  {
    isAddStockShown ? (
      <>
    <section className='action-overlay'>
  
      
  
  
  <article className='action-second-line'>
  <AddToInventory></AddToInventory>
  
  
  
  </article>
  </section>  
      </>
    ):(<>
    <section className=' inventory-content-container' >

      <div className='search-back-container'>    <FaArrowLeft onClick={handleBack} style={{cursor:'pointer'}}></FaArrowLeft> <strong>back</strong>
</div>






    {
  !isSearching ? (
  <>
  
<h5 style={{textAlign:"center"}}>please type for item to be search in the search box</h5>

  
  </>
 ):(
  <>
  <div className=''>
  <h3 style={{textAlign:"center"}}>Search Result</h3>
  </div>
  
  </>
 )
}
 





  
  
  
  
  {
    isSearching && (
      <>
      
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
  searchData.length!==0 && (
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
searchData.map((item,index)=>{
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
searchData.length!==0 && (
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
searchData.map((item,index)=>{
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

    
      
      </>
    )
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  </section>
    
    </>)
  }
  
  
  </main>
  
   
  
  
  
  
  
  
  
  
  
  </LayOut>
  
  
  
  
  
  </>
  
  
  
  
   )
  }
  










const Searchd=()=>{

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