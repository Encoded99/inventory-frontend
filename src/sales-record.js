import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';
import { Chart,defaults } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { AiOutlineDelete } from 'react-icons/ai';
import {  useNavigate } from 'react-router-dom'

//import {shoes, } from './context'
import { useGlobal, input } from './context'

import axios from 'axios'


import LayOut from './lay-out';
import { logDOM } from '@testing-library/react';





defaults.maintainAspectRatio=false;
defaults.responsive=true
defaults.plugins.title.display=true
defaults.plugins.title.color='black'
defaults.plugins.title.align='start'
defaults.plugins.title.font.size=30

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);



const SalesRecord=()=>{

  const {prefix,setIsPreLoaderRunning,} = useGlobal()

const [date, setSelectedDate]=useState(dateValue)

const [isAsideHidden,setIsAsideHidden]=useState(true)
const [salesRecordData,setSalesRecordData]= useState([])
const [total,setTotal] =useState([])
const [mostSold, setMostSold]= useState([])
const [structuredData,setStructuredData]= useState([])
const [salesXaxis,setSalesXaxis]= useState([])
const [salesYaxis,setSalesYaxis]= useState([])
const [isDeleteShown,setIsDeleteShown]= useState(false)
const [salesId,setSalesId] =useState('')
const [prId,setPrId] =useState('')
const [message,setMessage] =useState('')
const [userRole,setUserRole]= useState('')

const reportType='day'






const fetchSales= async(date,report,)=>{
  setIsPreLoaderRunning(true)
  
  
  
  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   
   }
  
  
    try{
  
      const url=`${prefix}/products/fetch-sales/${date}/${report}`
  
      const response=  await axios.get(url,{withCredentials:true})
  
      const t= response.data
  
      
  
      setSalesRecordData(response.data)
  
      const structuredCostArray =response.data.map((item)=>{
        let quantify;
         let structuredCost=null
        if(item.salesData.packages==='bulks'){
          quantify=item.salesData.quantity/item.upb
         structuredCost= quantify*item.salesData.ppu
         }
   
         else{
         structuredCost= item.salesData.quantity*item.salesData.ppu
         }
  
  return {...item,structuredCost}
  
  
      })
  
    
  
     
  
      const newStructuredArray=[]
  
  
  
      for (let i=0;i<structuredCostArray.length;i++){
  
      const element=structuredCostArray[i]
     const  doesDuplicateExist =newStructuredArray.some((item)=>item._id===element._id)
  
  
     if(!doesDuplicateExist){
      newStructuredArray.push(element)
     }
  
  
     else {
  
     const similarItem= newStructuredArray.find((item)=>item._id===element._id)
  
  
     similarItem.structuredCost+=element.structuredCost
  
    
  
     }
  
  
  
      }
  
    
    
  
      setStructuredData(newStructuredArray)
  
      const s= newStructuredArray.sort((a,b)=>b.structuredCost-a.structuredCost).slice(0,3)
  
     
  
  
      setMostSold(s)
  
  
   
     
      const tot= response.data.map((item)=>{
        let quantity=item.salesData.quantity
        if(item.salesData.packages==='bulks'){
         quantity=item.salesData.quantity/item.upb
          return quantity*item.salesData.ppu
        }
  
        else{
          return quantity*item.salesData.ppu
        }
      }).reduce((acc,cv)=>{
        return acc + cv
      },0)
  
      setTotal(tot)
  
      const costSold= response.data.map((item)=>{
        let quantity=item.salesData.quantity
        if(item.salesData.packages==='bulks'){
         quantity=item.salesData.quantity/item.upb
          return quantity*item.salesData.ppu
        }
  
        else{
          return quantity*item.salesData.ppu
        }
      })
  
  
  const utc=response.data.map((item)=>item.salesData.createdAt)
  
      const createdAt= response.data.map((item)=>moment.utc(item.salesData.createdAt).tz('Africa/Lagos').format(' HH:mm:ss ')   )
      //const createdAts=moment.utc()
   
  
  const reversedCreatedAt=createdAt.reverse()
  const reversedCostSold= costSold.reverse()
   
  
  
  
  
     setSalesXaxis(createdAt)
     setSalesYaxis(costSold)
  
  setIsPreLoaderRunning(false)
  
  
    }
  
  
    catch(err){
  
    
  
    }
  }
  
  
  
  








useEffect(()=>{




// Now send `utcDate` to the backend


  fetchSales(date,reportType)




},[date])















const deleteSales=(e)=>{
  const id = e.currentTarget.dataset.id;
  const pr = e.currentTarget.dataset.pr;

  setIsDeleteShown(true)
  setSalesId(id)
  setPrId(pr)
}





const handleDelete= async()=>{


  setMessage('Please wait...')

if (prId===undefined || salesId===undefined){
  setMessage('error deleting product please try again')
  return
}



  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   withCredentials: true,
   }


   try{
    const url =`${prefix}/products/delete-sales/${salesId}/${prId}`
    const response= await axios.delete(url,config)
    
    if(response.status===200){
      setSalesRecordData((prev)=>prev.filter(({salesData})=>salesData._id!==salesId))
      setIsDeleteShown(false)
      setMessage('')
    }
    


   }
 








catch(err){
  setMessage('Error deleting record, please try again')

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
   
    setUserRole(profileData.role)
  
  } catch (error) {
 







   
      //setNoApiError(false);


    
  } finally {
    // Code here will run whether there was an error or not
//setIsPreLoaderRunning(false)


    // ... any other cleanup code ...
  }
};

useEffect(()=>{
fetchProfile()
},[])




 return (
  <>















 <article  className='sales-page'>



  <LayOut>



    {
      isDeleteShown && (
        <>
        
        <section  className='delete-warning'>

<div  className='delete-container'>

  <p>Are you sure you want to delete this sales record</p>


  <div className='delete-button-container'>

    <button className='btn btn-danger'   onClick={handleDelete}>Yes</button>
    <button className='btn btn-secondary'  onClick={()=>{setIsDeleteShown(false);setPrId('');setSalesId('')}}>No</button>


  </div>
<br />
<div>{message}</div>
</div>

</section>

        
        
        </>
      )
    }






   <main className='main-sales-record'>
    
   <p style={{fontSize:'3em',textAlign:'center',margin:'0'}}>Sales Record</p>
   <br />
   <div className='quick-information-main-container'>



   <section  className='quick-information '>

<div className='quick-information-container col-sm-4'>
 <strong className='quick-headings'>Total Sales (&#x20A6;)</strong>
 <strong className='quick-numbers'>{total}</strong>

</div>

<div className='quick-information-container col-sm-4'>
 <strong className='quick-headings'> Top Selling Products</strong>

 <ul>

 {
   mostSold.map((item,index)=>{
     return(
       <li style={{fontSize:'0.8',color:"red",fontWeight:"bold"}} className='most-sold-list'> {item.name}</li>
     )
   })
 }



 </ul>


</div>
<div className='quick-information-container col-sm-4'>
 <strong className='quick-headings'>Product sold</strong>
 <strong className='quick-numbers' style={{color:"blue"}}>{structuredData.length}</strong>

</div>


</section>










   </div>
   
<div className='sales-chart-main-container'>
{
  salesRecordData.length!=0 &&(
    <>
     <section  className='sales-chart-container'>

<Line
  data={
    {
      labels:salesXaxis,
      datasets:[
        {
          label:'sales',
          data:salesYaxis,
          backgroundColor:'green',
          borderColor:'green'
        }
      ]
    }
  }

  options={
    {
      plugins:{
        title:{

          text:"Sales Trend"

        }
      }
    }
  }
style={{width:"90vw",backgroundColor:''}}
/>


      

</section>

    
    </>
  )
}

</div>
   



{
  salesRecordData.length!==0 ? (
    <>

<section className='sale-list-container'>
     <div className='sale-list-first-section'>
     <strong className='sale-list-heading'>Sales List</strong>
     </div>
     <div className='sale-list-second-section'>
      <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
     
        selected={date}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy" // You can customize the date format
      />

       </div>
    

      </div>
     </div>
    



    <div className='sales-table-container'>

     <div className='sales-table-header-container'>
      <div className='sales-header'>SKU</div>
      <div className='sales-header'> Name</div>
      <div className='sales-header'> Package</div>
      <div className='sales-header'> Quantity</div>
      <div className='sales-header'>Price/Unit(&#x20A6;)</div>
      <div className='sales-header'>Cost(&#x20A6;)</div>
      <div className='sales-header'> Time</div>
      
      <div className='sales-header'>Closed By</div>
      <div className='sales-header'>Delete</div>
     </div>


     <div className='sales-info-table'>

      {
salesRecordData.map((item,keys,)=>{

  const {salesData} =item
let quantity=salesData.quantity
  if(salesData.packages==='bulks'){
    quantity=salesData.quantity/item.upb
  }

  const momentTime= moment.utc(salesData.createdAt).tz('Africa/Lagos').format('HH:mm:ss');

 return(
  <>

  <div className='sales-info' key={keys}  style={{border:salesData._id===salesId?'solid red 2px':''}} data-id={salesData._id} data-pr={salesData.product}>
   
  <div className='sales-element' data-id={salesData._id} data-pr={salesData.product}>{item.sku}</div>
  <div  className='sales-element sales-name' data-id={salesData._id} data-pr={salesData.product}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,25).toLowerCase() + '..'}</div>
  <div  className='sales-element' data-id={salesData._id} data-pr={salesData.product}>{item.salesData.packages.charAt(0).toUpperCase() + item.salesData.packages.slice(1).toLowerCase()}</div>
  <div  className='sales-element'>{quantity.toFixed(2)}</div>
  <div  className='sales-element' data-id={salesData._id} data-pr={salesData.product}>{item.salesData.ppu.toFixed(2)}</div>
  <div  className='sales-element'  data-id={salesData._id} data-pr={salesData.product}>{(quantity*item.salesData.ppu).toFixed(2)}</div>
  <div  className='sales-element sale-date' style={{fontWeight:'bolder'}} data-id={salesData._id} data-pr={salesData.product}>{momentTime}</div>

  <div  className='sales-element '   data-id={salesData._id} data-pr={salesData.product}>{salesData.createdBy?salesData.createdBy.firstName.charAt(0).toUpperCase() + salesData.createdBy.firstName.slice(1).toLowerCase():"N/A"}</div>

 
  
  {
     userRole==='admin' ? (
      <>
      <div  className='sales-element sale-date' data-id={salesData._id} data-pr={salesData.product}   style={{fontWeight:'bolder'}}> 

      <AiOutlineDelete  size={24}  data-id={salesData._id} data-pr={salesData.product} onClick={deleteSales} style={{cursor:"pointer"}}></AiOutlineDelete>
  </div>
      
      </>
     ):(
      <>
    <div className='sales-element'   data-id={salesData._id} data-pr={salesData.product}>

      N/A

    </div>
      </>
     )
  }

  
  
  
 

  </div>






  
  
  </>
 )

})
      }


     </div>





    </div>



    <div className='sales-last-section'>

    <button className='btn btn-primary move-btn' style={{marginRight:'1vw'}}>Next</button>
    
    <button className='btn btn-primary move-btn'>2</button>
    <button className='btn btn-primary move-btn' >1</button>

    <button className='btn btn-primary move-btn'>Previous</button>


</div>


    </section>

   
    
    </>
  ):(
    <>
    <br />
  
    <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
     
        selected={date}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
      />

       </div>
    

      </div>
      <div className='alert alert-danger'>
      <p style={{textAlign:'center',fontSize:'1.2em'}}>no record for the day please select another day</p>
      </div>
     
    </>
  )
}

    
  



   </main>



  </LayOut>

  </article>
  </>
 )
}


export default SalesRecord
