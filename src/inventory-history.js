import React, { useState, useEffect, } from 'react'

import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import ReactDatePicker from 'react-datepicker';
import axios from 'axios';
import { useGlobal } from './context';
import LayOut from './lay-out';
import {  FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { SemiPreloader } from './preloader';

import Upgrade from './upgrade';
const milliDate= Date.now()

const dateValue= new Date(milliDate)

 const History=()=>{

  const navigate= useNavigate()



  const {prefix,subType,setLink,setIsAdStockShown,setId}=useGlobal()
const [date,setDate]=useState(dateValue)
const [inventoryData,setInventoryData] =useState([])
  const [sortOption,setSortOption]= useState('')

const [isLoading,setIsLoading]=useState(true)











const Sort=(e)=>{
  const option=e.target.value

  switch(option){
    case 'hq':
    setInventoryData([...inventoryData.sort((a,b)=>{
      return b.quantity-a.quantity
    })])
    break;
    case 'lq':
      setInventoryData([...inventoryData.sort((a,b)=>{
        return a.quantity-b.quantity
      })])
      break;

      case 'id':
      setInventoryData([...inventoryData.sort((a,b)=>{
        return  a.sku.toLowerCase().localeCompare(b.sku.toLowerCase())
      })])
      break;

      case 'reset':
        setInventoryData([...inventoryData.sort((a,b)=>{
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())

        })])
  }

}



const navigateToProductInfo=(e)=>{
 // setIsPreLoaderRunning(true)
const data=e.target.dataset.id



  localStorage.setItem('product-id', data);

  navigate('/product-info')

}









const fetchInventoryHistory= async()=>{


 try{

  const url = `${prefix}/products/get-inv-history/:${date}`

  const response= await axios.get(url,{withCredentials:true})
  console.log('what is response',response.data.data.inventory);
  setInventoryData(response.data.data.inventory.sort((a,b)=>{
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())

  }))

 }

 catch(err){
  console.log(err);
 }


 finally{
  setIsLoading(false)
 }
}



useEffect(()=>{

  if (subType==='outright' || subType==='premium'){
 //   fetchInventoryHistory()
  }

  fetchInventoryHistory()
},[date])








useEffect(()=>{
setLink('stock-history')
},[])









if (isLoading){
  return(
    <>
    

    <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:""}}>
    <SemiPreloader></SemiPreloader>
    </div>
    
    </>
  )
}









 return(
  <>
<LayOut>


{
(subType==='premium' || subType==='outright')?(
  <>
  
  <main className=' inventory-history-container'>
 

  <div className='inventory-first-line' style={{marginTop:''}}>
      <div style={{ fontSize: '1.5em' }} className='font-heading'>
        Inventory History
      </div>
      <button
        className='btn btn-primary stock-record-btn font-sub-heading'
        style={{opacity:'0'}}
      >
        Past Record
      </button>
    </div>





<section className='inventory-history-container-table'>



<div className='inv-name-container'>
<FaTimes style={{cursor:'pointer',marginRight:"0px"}} size={22} onClick={()=>{setIsAdStockShown(false);setId('');setLink('');navigate('/inventory')}}></FaTimes>
 </div>





<article className='sort-export-line'>  

<select name="" id="" value={sortOption} className='form-select inventory-select font-sub-heading' style={{width:'auto'}} onChange={Sort}  >
    <option value="" className='form-select-option'>Sort</option>
    <option value="reset" className='form-select-option'>Reset</option>
    <option value="hq" className='form-select-option'>High Quantity</option>
    <option value="lq" className='form-select-option'>Low Quantity</option>
    <option value="id" className='form-select-option'>Product ID</option>
</select>

<article className='date-export-container'>








<div className='font-text date-h'>
<DatePicker
 className='inventory-history-date form-select'
selected={date}
dateFormat="dd/MM/yyyy"
showTimeInput
onChange={(date)=>setDate(date)}
>


</DatePicker>


</div>

</article>






</article>

{
  inventoryData.length!==0 && (
    <>
   <div className='inventory-table-container'  style={{display:'grid',gridTemplateColumns:" 1fr 1fr 1fr 1fr"}}>

<div className='invetory-table-header'>ID</div>
<div className='invetory-table-header'>Name</div>
<div className='invetory-table-header'>Quantity
</div>
<div className='invetory-table-header'>Category</div>





</div> 
    
    
    
    </>
  )
}


<div className='inventory-main-container' style={{backgroundColor:"white",}}>


{
  inventoryData.map((item,index)=>{
    const {_id,name,sku,quantity,upb,category}=item

    const number=index+1;
    const remainder=number%2

    const bulk= quantity/upb

 const piecesRemainder=(quantity- parseInt(bulk)*upb)




 










    return(

      <>

 


      
      <div  className='inventory-container'       onClick={(navigateToProductInfo)}  style={{cursor:'pointer',backgroundColor:remainder!==0?'white':'hsl(0,0%,95%)',display:'grid',gridTemplateColumns:" 1fr 1fr 1fr 1fr"}} data-id={_id}  key={index}>

<div className='inventory-properties'  data-id={_id}>{sku}</div>
<div  className='inventory-properties' data-id={_id}>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</div>
<div className='inventory-properties' data-id={_id}>
  {parseInt(quantity / upb).toFixed(1)} 📦{piecesRemainder !== 0 ? ` / ${piecesRemainder.toFixed(1)} 🔵` : ''}
</div>

<div  className='inventory-properties' data-id={_id}>{category}</div>






</div>
      
      </>
    )
  })
}










</div>






</section>









</main>
  </>

):(
  <>
  <Upgrade></Upgrade>
  </>
)
}











</LayOut>










  
  </>
 )
}


export default History