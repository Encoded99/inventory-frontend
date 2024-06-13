import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';
import { Chart,defaults } from 'chart.js/auto';
import { Line, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiArrowLeft } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import {  useNavigate } from 'react-router-dom'
import { FaToggleOn, FaToggleOff,FaShoppingCart,FaFire, FaMoneyBillWave,FaBox,FaLockOpen,FaLock,FaTimes, FaSearch,  } from 'react-icons/fa';
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { faPlus,faTrash, faExpandAlt, faCompressAlt, faExpandArrowsAlt, faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios'
import { Response } from './lay-out';

import LayOut from './lay-out';
import { logDOM } from '@testing-library/react';
import { Preloader } from './preloader';





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

  const {prefix,loadingMessage,setLoadingMessage,userRole,shopGroup,setApiError,setError,error} = useGlobal()

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


const [sortOption,setSortOption]=useState('')
const [firstSalesdata,setFirstSalesData]= useState([])
const [summaryData,setSummaryData]=useState([])

const [instance,setInstance]= useState('record')
const [isCloseMarket,setIsCloseMarket]=useState(false)
const [isLoading,setIsLoading]= useState(false)
const [isFetching,setIsFetching]=useState(true)
const [isExpanded, setIsExpanded] = useState(true);
const [isSearchShown,setIsSearchShown]=useState(false)
const [searchInput, setSearchInput]=useState('')

const reportType='day'
const active='sales-record'
const navigate= useNavigate()
let first=[]

const fetchSales= async(date,report,)=>{






  const source = axios.CancelToken.source();

  const timeOutId = setTimeout(() => {
   
      source.cancel('Request timed out');
  }, 180000);
  
  
  
  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   
   }
  
  
    try{
  
      const url=`${prefix}/products/fetch-sales/${date}/${report}`
  
      const response=  await axios.get(url,{withCredentials:true})
  console.log(response.data,'shaggy')



       if(response.data.length!==0){
        setIsCloseMarket(response.data[0].isClosed)
       }
    
   




      setFirstSalesData([...response.data])
     
    //  console.log(response.data,'selena')
      setSalesRecordData(response.data)

      
  
      const structuredCostArray =response.data.map((item)=>{
        const newSalesData=[];
        let quantify;
         let structuredCost=null
        if(item.packages==='bulks'){
          quantify=item.quantity/item.upb
         structuredCost= quantify*item.ppu
         }
   
         else{
         structuredCost= item.quantity*item.ppu
         }

       

         newSalesData.push(item)
  
  return {...item,structuredCost,uniqueSales:newSalesData}
  
  
      })
  
    

      console.log(structuredCostArray,'djoo')
  
     
  
      const newStructuredArray=[]

  
  
  
      for (let i=0;i<structuredCostArray.length;i++){
  
      const element=structuredCostArray[i]
     const  doesDuplicateExist =newStructuredArray.some((item)=>item.product===element.product)
  
  
     if(!doesDuplicateExist){
      newStructuredArray.push(element)
     }
  
  
     else {
  
     const similarItem= newStructuredArray.find((item)=>item.product===element.product)

   
  
  
     similarItem.structuredCost+=element.structuredCost
      similarItem.uniqueSales.push(element)

   //   return {...similarItem, finalSalesData:newSalesData}
    
  
     }
  
  
  
      }
  
   console.log(newStructuredArray,'dj new tt');

   

 
    
  
      setStructuredData(newStructuredArray)
  
      const s= newStructuredArray.sort((a,b)=>b.structuredCost-a.structuredCost).slice(0,3)
  
  
  console.log(s,'drak');
  
      setMostSold(s)
  
  
   
     
      const tot= response.data.map((item)=>{
        let quantity=item.quantity
        if(item.packages==='bulks'){
         quantity=item.quantity/item.upb
          return quantity*item.ppu
        }
  
        else{
          return quantity*item.ppu
        }
      }).reduce((acc,cv)=>{
        return acc + cv
      },0)


      
  console.log(tot,'drak toosie');
  
  
      setTotal(tot)
  
      const costSold= response.data.map((item)=>{
        let quantity=item.quantity
        if(item.packages==='bulks'){
         quantity=item.quantity/item.upb
          return quantity*item.ppu
        }
  
        else{
          return quantity*item.ppu
        }
      })
  console.log(costSold,'cost-sold');
  
  const utc=response.data.map((item)=>item.createdAt)
  
      const createdAt= response.data.map((item)=>moment.utc(item.createdAt).tz('Africa/Lagos').format(' HH:mm:ss ')   )
      //const createdAts=moment.utc()
   
 
   
  
  
  
  
     setSalesXaxis(createdAt.reverse())
     setSalesYaxis(costSold.reverse())
  
 
  
  
    }
  
  
    catch(error){
console.log('selena err',error)

      if (axios.isCancel(error)) {
        console.log('Axios canceled the request mccoy');
        setError('Request timed out. Please try again.');
        return;
    }

    if (error.response) {
      if (error.response.data.message === 'unauthorized' && error.response.data) {
          navigate('/log-in');
          setError(error.response.data.message);
      }
    }



    if (error.request) {

        



      setError('Oops, something went wrong, try again.');
      return
  }


  setError('Oops, something went wrong, try again.');
    
  
    }



    finally{
      setIsFetching(false)
    
      setSortOption('')
    }
  }
  
  
  const Sort = (e) => {
    const selectedOption = e.target.value;
  
    setSortOption(selectedOption); 

if (instance==='record'){

  if (selectedOption === 'res') {
    

    setSalesRecordData([...firstSalesdata])

    
return
  
 }
 



   
   if (selectedOption === 'alph') {
     setSalesRecordData(salesRecordData.sort((a, b) => {
       const first = a.name.toUpperCase();
       const second = b.name.toUpperCase();
 
       return first.localeCompare(second);
     }));
   }
   

// Manually trigger sorting based on the selected option
if (selectedOption === 'sku') {
 setSalesRecordData(salesRecordData.sort((a, b) => {
   const first = a.sku.toUpperCase();
   const second = b.sku.toUpperCase();

   return first.localeCompare(second);
 }));
}

if (selectedOption === 'hc') {
 setSalesRecordData(salesRecordData.sort((a, b) => {
   const first = a.cost;
   const second = b.cost;

   return second-first;
 }));
}


if (selectedOption === 'lc') {
 setSalesRecordData(salesRecordData.sort((a, b) => {
   const first = a.cost;
   const second = b.cost;

   return first-second;
 }));
}





}

else{






   
   if (selectedOption === 'alph') {
     setSummaryData(summaryData.sort((a, b) => {
       const first = a.name.toUpperCase();
       const second = b.name.toUpperCase();
 
       return first.localeCompare(second);
     }));
   }
   

// Manually trigger sorting based on the selected option
if (selectedOption === 'sku') {
  setSummaryData(summaryData.sort((a, b) => {
   const first = a.sku.toUpperCase();
   const second = b.sku.toUpperCase();

   return first.localeCompare(second);
 }));
}

if (selectedOption === 'hc') {
  setSummaryData(summaryData.sort((a, b) => {
   const first = a.cost;
   const second = b.cost;

   return second-first;
 }));
}


if (selectedOption === 'lc') {
  setSummaryData(summaryData.sort((a, b) => {
   const first = a.cost;
   const second = b.cost;

   return first-second;
 }));
}


}
  






  };
  
























const deleteSales=(e)=>{
  const id = e.currentTarget.dataset.id;
  const pr = e.currentTarget.dataset.pr;

  setIsDeleteShown(true)
  setSalesId(id)
  setPrId(pr)
}





const handleDelete= async()=>{


  setLoadingMessage('Please wait...')





  if(isCloseMarket===true){
    setApiError(true)
    setLoadingMessage("Market is closed. Changes cannot be made at this time.")
    return
  }

if (prId===undefined || salesId===undefined){
  setApiError(true)
  setLoadingMessage('error deleting product please try again')
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
      setApiError(false)
      setSalesRecordData((prev)=>prev.filter((salesData)=>salesData._id!==salesId))
      setIsDeleteShown(false)
      setLoadingMessage('record deleted successfully')
    }
    


   }
 








catch(err){
  setApiError(true)
 

if (err.response.data){
  setLoadingMessage(err.response.data)
  return
}


  setLoadingMessage('Error deleting record, please try again')

}

}


const handleCloseMarket=async()=>{
  setIsCloseMarket(false)
setLoadingMessage('Processing....')
setIsLoading(true)

  try{

    const url=`${prefix}/products/close-market/${date}`

  const response= await axios.patch(url,{},{withCredentials:true})

  setIsCloseMarket(response.data.data)
  setLoadingMessage('Market is close')

  }

  catch(err){
    console.log(err)
  }

  
}



const handleOpenMarket=async()=>{
  setIsCloseMarket(true)
setLoadingMessage('Processing....')
setIsLoading(true)

  try{

    const url=`${prefix}/products/open-market/${date}`

  const response= await axios.patch(url,{},{withCredentials:true})
  setIsCloseMarket(response.data.data)
setLoadingMessage('Market is open')

  }

  catch(err){
    console.log(err)
  }

  
}


















const summarize=()=>{


 // console.log(instance,'what is instance');

  if (instance==='summary'){

    setInstance('record')

   return
  }


  const summary= structuredData.map((item)=>{

    const totalCost=item.uniqueSales.map((item)=>{
      return item.cost
    }).reduce((item,acc)=>{
      return item + acc
    },0)

    const totalQuantity=item.uniqueSales.map((item)=>{
      return item.quantity
    }).reduce((item,acc)=>{
      return item + acc
    },0)

    const quantityBefore= item.uniqueSales.map((item)=>{
      return item.quantityBefore
    }).sort((a,b)=>{
      return b-a
    })

const before= parseFloat(quantityBefore[0])
const after= before-totalQuantity


    return {sku:item.sku,name:item.name,upb:item.upb,cost:totalCost,bQuantity:parseFloat(before),aQuantity:parseFloat(after),quantity:parseFloat(totalQuantity)}
   })



setSummaryData(summary)

setInstance('summary')

}


const fetchAll=async()=>{
  try{
    
    await     fetchSales(date,reportType)

    if (instance==='summary'){
   console.log(summaryData,'jacko');
      summarize()
    }

  }

  catch(err){
    
  }
}


useEffect(()=>{




  fetchAll()
  
  
  
 
  
  
  },[date])



useEffect(()=>{

  const handleExpand= ()=>{
    
  if (window.innerWidth <= 550) {
    setIsExpanded(false);
  }

  else{
    setIsExpanded(true);
  }

  }
handleExpand()

  window.addEventListener('resize',handleExpand)

  return ()=>window.removeEventListener('resize',handleExpand)

},[])







const handleToggle=()=>{
  if(isExpanded){
    setIsExpanded(false)
  }

  else{
    setIsExpanded(true)
  }
}





const handleSearch=()=>{

  console.log(searchInput,'lily')

  if (searchInput!==''){

    const filteredProduct = firstSalesdata.filter((item) => item.name.includes(searchInput) || item.sku.includes(searchInput
      ||item.createdBy.firstName.includes(searchInput))
  
  
  );
   

setSalesRecordData(filteredProduct)
  }

}





const handleKeyPress=(event)=>{



  if (event.key==='Enter'){

    handleSearch()
  
  }

}


const handleBack=()=>{

  
  setIsSearchShown(false)
 
  setSalesRecordData([...firstSalesdata])
}






if (isFetching ){
  return(
    <>

    <Preloader></Preloader>
    
    
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







 return (
  <>







  <LayOut>

  <article  className='sales-page'>



    {
      isDeleteShown && (
        <>
        
        <section  className='delete-warning'>

<div  className='delete-container font-text'>

  <p>Are you sure you want to delete this sales record</p>


  <div className='delete-button-container'>

    <button className='btn btn-danger'   onClick={handleDelete}>Yes</button>
    <button className='btn btn-secondary'  onClick={()=>{setIsDeleteShown(false);setPrId('');setSalesId('')}}>No</button>


  </div>
<br />
{
  loadingMessage!=='' &&(
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






   <main className='main-sales-record'>
    
   <div style={{fontSize:'2rem', fontStyle:""}} className='font-heading '>Sales Record</div>
   <br />
   <div className='quick-information-main-container'>



   <section  className='quick-information '>







   <div className=' col-sm-4 sales-summary' >
  <div className='inventory-summary-inner-holder'>

  <div className='inv-logo-holder' style={{backgroundColor:' #b4c9df'}}>
    < FaMoneyBillWave size={24} style={{color:'#007bff'}}></ FaMoneyBillWave>
  </div>
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>

    <strong className='quick-numbers'>{total.toLocaleString()}</strong>
    <div className='quick-headings'  > Total Sales (&#x20A6;)</div>
  </div>
  </div>

   </div>





   <div className=' col-sm-4 sales-summary' >
  <div className='inventory-summary-inner-holder'>

  <div className='inv-logo-holder' style={{backgroundColor:'rgb(225, 194, 194)'}}>
    <FaFire  size={24} style={{color:'red'}}></FaFire >
  </div>
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',textAlign:"center",backgroundColor:""}}>


  {
   mostSold.map((item,index)=>{
     return(
      <>
      
      
    <div className='quick-numbers-special'>{item.name.length<16?    item.name.toLowerCase():`${item.name.slice(0,15).toLowerCase()}...`}</div>
      
      </>
     
     )
   })
 }










    <div className='quick-headings'  > Best Sellers</div>
  </div>
  </div>

   </div>






   <div className=' col-sm-4 sales-summary' >
  <div className='inventory-summary-inner-holder'>

  <div className='inv-logo-holder' style={{backgroundColor:'hsl(277, 70%, 88%)'}}>
    <FaBox size={24} style={{color:'purple'}}></FaBox>
  </div>
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>

    <strong className='quick-numbers'>{structuredData.length}</strong>
    <div className='quick-headings'  > Product sold</div>
  </div>
  </div>

   </div>







</section>










   </div>




{
  instance==='record' ? (
    <>
       
<div className='sales-chart-main-container'>
{
  salesRecordData.length!=0 &&(
    <>


     <section  className='sales-chart-container'>

      <div  className='sales-inner-scrollable'>

        <article  className='sales-inner-container'style={{width:`${salesRecordData.length*100}px`}}>

        <Line
  data={
    {
      labels:salesXaxis,
      datasets:[
        {
          label:'sales',
          data:salesYaxis,
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

          text:"Sales Trend",
          font: {
            family: 'source-serif-pro, Georgia, Cambria, "Times New Roman", Times, serif', // Specify the desired font family
            size: 24, // Optionally, set font size
            weight: 'bold', // Optionally, set font weight
             // Optionally, set font style
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

    
    </>
  )
}

</div>
   
    
    </>
  ):(
    <>

<div className='sales-chart-main-container'> 
<section  className='sales-chart-container'>


  <div  className='sales-inner-scrollable'>
    <article className='sales-inner-container'  style={{width:`${summaryData.length*100}px`}}>
    <Bar

data={{

  labels:summaryData.map((item)=>item.name),

datasets:[

{

  label:'Revenue Generated',
  data:summaryData.map((item)=>item.cost),
  backgroundColor:'blue',
  borderColor:'blue',

  

},
 
]


}}

options={
  {
    plugins:{
      title:{

        text:"Revenue per Product"

      },

      font:{
        family:'medium-content-sans-serif-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
      }
    }
  }
}



/>

    </article>


  </div>
    
  


     
   

     </section>

</div>
     
  
    
    </>
  )
}





{
  isExpanded && (
    <>
    <article className='sale-list-scrollable-container'>

{
  salesRecordData.length!==0 ? (
    <>



{
  instance==='record'  ? (
    <>
    
    
    <section className='sale-list-container'>


    {
      isDeleteShown && (
        <>
        
        <section  className='mobile-delete-warning'>

<div  className='delete-container font-text'>

  <p>Are you sure you want to delete this sales record</p>


  <div className='delete-button-container'>

    <button className='btn btn-danger'   onClick={handleDelete}>Yes</button>
    <button className='btn btn-secondary'  onClick={()=>{setIsDeleteShown(false);setPrId('');setSalesId('')}}>No</button>


  </div>
<br />
{
  loadingMessage!=='' &&(
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
  isSearchShown && (
    <>
      <div className='sale-list-first-section-normal'>
      <div className='sale-back-input-container'>
      <strong className=''>
        
        
        
        
        <FiArrowLeft style={{cursor:'pointer'}} size={24} 
        
        onClick={handleBack}
        ></FiArrowLeft></strong>
      <input type="text" placeholder='search'   className='sale-search-input'
         value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
      onKeyPress={handleKeyPress}
      />
      </div>
     </div>
    
    </>
  )
}


{
  !isSearchShown && (
    <>
   <div className='sale-list-first-section-normal'>
      <div className='sale-title-container'>
      <strong className=''>Sales Records</strong>
      </div>
     

      <div className='search-icon-container'>

        <div className='sale-search-holder'><FaSearch style={{cursor:'pointer'}} onClick={()=>setIsSearchShown(true)}></FaSearch></div>

      <button  onClick={handleToggle} style={{width:''}} className='sale-expand-contract-btn' data-tip={isExpanded ? "Collapse" : "Expand"}>
   <FontAwesomeIcon icon={isExpanded ? faCompressArrowsAlt : faExpandArrowsAlt} />
 </button>

      </div>

     
     </div>
    
    </>
  )
}




     


     
   
 

     <div style={{ width: '96%', margin: '1em auto', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
  {!isCloseMarket ? (
    <>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleCloseMarket}>
        <FaLock style={{ color: 'green', marginRight: '0.5em' }} />
        <div className='font-text' style={{ fontWeight: '500', fontSize: '0.8em' }}>Market is Open! Click to Close</div>
      </div>
    </>
  ) : (
    <>
      {(userRole === 'admin' || userRole === 'super-admin') ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleOpenMarket}>
            <FaLockOpen style={{ color: 'red', marginRight: '0.5em' }} />
            <div className='font-text' style={{ fontWeight: '500', fontSize: '0.8em' }}>Market is Closed. Click to Open</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: '500', fontSize: '0.8em', color: '#888' }}>Market is Closed. Please wait for it to reopen.</div>
        </>
      )}
    </>
  )}
</div>

{
  isLoading && (
    <>
    <div  style={{width:'96%',margin:'1em auto',height:"35px",backgroundColor:'blue',color:'white',padding:'10px',display:'block',alignItems:'center',}}>

  
<FaTimes  style={{float:'right',cursor:'pointer'}} size={12}  onClick={()=>setIsLoading(false)}></FaTimes>
  <strong className='font-text' >{loadingMessage}</strong>

</div>
    </>
  )
}



<section style={{width:'100%', display:'flex',justifyContent:'space-between',alignItems:'center',}}>



<select name="" id=""  className='form-select sale-select  inventory-select font-text' style={{width:'auto',border:'',margin:'1em'}}  value={sortOption}  onChange={Sort} >

<option value="" className='form-select-option font-text' >SORT</option>
<option value="res"   className='form-select-option'>RESET</option>
<option value="alph"   className='form-select-option'> ALPHABETICAL ORDER</option>
<option value="sku"  className='form-select-option'>PRODUCT ID</option>
<option value="hc"   className='form-select-option'>HIGHEST COST</option>
<option value="lc"  className='form-select-option'> LOWEST  COST</option>



</select>








<div className='switch-container'>
<button className='toggle-holder' style={{margin:'',backgroundColor:'white',color:'',}}  onClick={summarize}>


<FaToggleOff size={50} style={{width:""}}></FaToggleOff>

</button>
<div>
switch  to sales summary
</div>


</div>
 



</section>










     <div className='sale-list-second-section'>
      <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
        onClick={()=>setInstance('record')}
        selected={date}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy" 
        
        className='form-select'
        // You can customize the date format
      />

       </div>
    

      </div>
     </div>
    



    <div className='sales-table-container'>

     <div  className={shopGroup==='group-1'?'sales-table-header-container':'sub-sales-table-header-container'}  >
      <div className='sales-header'>SKU</div>
      <div className='sales-header'> Name</div>

      {
        shopGroup==="group-1" && (
          <>
          <div className='sales-header'> Package</div>
          </>
        )
      }
      
      <div className='sales-header'> Qty Before</div> 
      <div className='sales-header'> Qty Sold</div>
      <div className='sales-header'> Qty After</div>
      <div className='sales-header'>Price/Unit(&#x20A6;)</div>
      <div className='sales-header'>Cost(&#x20A6;)</div>
      <div className='sales-header'> Time</div>
      
      <div className='sales-header'>Closed By</div>
      <div className='sales-header'>Delete</div>
     </div>


     <div className='sales-info-table'>

     {
salesRecordData.map((item,keys,)=>{

  const {packages}= item


  
  

 let   quantity=parseFloat  (item.quantity/item.upb)
 let   quantityBefore= parseFloat ( item.quantityBefore/item.upb)
 let   quantityAfter= parseFloat  (quantityBefore-quantity)
  

  const momentTime= moment.utc(item.createdAt).tz('Africa/Lagos').format('HH:mm:ss');



const beforePiecesRemainder= ((quantityBefore-parseInt(quantityBefore))*parseFloat(item.upb)).toFixed(1)
  
const piecesRemainder= ((quantity-parseInt(quantity))*parseFloat(item.upb)).toFixed(1)
 
const afterRemainder=((quantityAfter-parseInt(quantityAfter))*parseFloat(item.upb)).toFixed(1)















  

  

 return(
  <>

  <div   className={shopGroup==='group-1'?'sales-info':'sub-sales-info'}    key={keys}  style={{border:item._id===salesId?'solid red 2px':''}} data-id={item._id} data-pr={item.product}>
   
  <div className='sales-element' data-id={item._id} data-pr={item.product}>{item.sku}</div>
  <div  className='sales-element sales-name' data-id={item._id} data-pr={item.product}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,25).toLowerCase() + '..'}</div>

  {
        shopGroup==="group-1" && (
          <>
        <div  className='sales-element' data-id={item._id} data-pr={item.product}>{item.packages.charAt(0).toUpperCase() + item.packages.slice(1).toLowerCase()}</div>
          </>
        )
      }



  

     <div  className='sales-element'>{beforePiecesRemainder>0?`${parseInt(quantityBefore)}📦 ${beforePiecesRemainder}🔵`:`${quantityBefore}📦`}</div>
 


  

{
  packages==='bulks' ? (
    <>
{
  piecesRemainder> 0?(
    <>
<div  className='sales-element'>{`${parseInt(quantity)}📦 ${piecesRemainder}🔵`}</div>

    </>
  ):(
    <><div  className='sales-element'>{`${parseInt(quantity)}📦`}</div>
    </>
  )
}
   
    </>
  ):(
    <>
     <div  className='sales-element'>{`${item.quantity}🔵`}</div>
    </>
  )
}


     
  

  









     <div  className='sales-element'>{afterRemainder>0?`${parseInt(quantityAfter)}📦 ${afterRemainder}🔵`:`${quantityAfter}📦`}</div>
   
  



  




  <div  className='sales-element' data-id={item._id} data-pr={item.product}>{item.ppu.toFixed(2)}</div>
  
  <div  className='sales-element'  data-id={item._id} data-pr={item.product}>{(item.cost).toFixed(2)}</div>
  <div  className='sales-element sale-date' style={{fontWeight:'bolder'}} data-id={item._id} data-pr={item.product}>{momentTime}</div>

  <div  className='sales-element '   data-id={item._id} data-pr={item.product}>{item.createdBy?item.createdBy.firstName.charAt(0).toUpperCase() + item.createdBy.firstName.slice(1).toLowerCase():"N/A"}</div>

 
  

      <div  className='sales-element sale-date' data-id={item._id} data-pr={item.product}   style={{fontWeight:'bolder'}}> 

      

      <FontAwesomeIcon  icon={faTrash} data-id={item._id} data-pr={item.product} onClick={deleteSales} className='action-delete-btn action' style={{cursor:"pointer"}}></FontAwesomeIcon>




  </div>
      
     

  
  
  
 

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
    
    <section className='sale-list-container'>
     <div className='sale-list-first-section'>
     <strong className='sale-list-heading'>Sale Summary</strong>

 


     </div>





<section style={{width:'100%', display:'flex',justifyContent:'space-between',alignItems:'center',}}>



<select name="" id=""  className='form-select sale-select inventory-select font-text' style={{width:'',margin:'1em'}}  value={sortOption}  onChange={Sort} >

<option value="" className='form-select-option font-text'>SORT</option>

<option value="alph"   className='form-select-option'>ALPHABETICAL ORDER</option>
<option value="sku"  className='form-select-option'>PRODUCT ID</option>
<option value="hc"   className='form-select-option'>HIGHEST COST</option>
<option value="lc"  className='form-select-option'>LOWEST  COST</option>



</select>






<div className='switch-container'>
<button className='toggle-holder' style={{margin:'',backgroundColor:'white',color:'',}}  onClick={summarize}>



<FaToggleOn size={50} style={{width:""}}></FaToggleOn>

</button>
<div>
switch back  to sales record
</div>


</div>
 






</section>







    

     <div className='sale-list-second-section'>
      <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
        onClick={()=>setInstance('summary')}
        selected={date}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy" 
        
        className='form-select'
        // You can customize the date format
      />

       </div>
    

      </div>
     </div>
    



    



    <div className='sales-table-container'>

     <div className='sales-table-header-container'  style={{display:"grid",gridTemplateColumns:"repeat(6, 1fr)"}}>
     <div className='sales-header'> SKU </div>

      <div className='sales-header'> Name</div>
      <div className='sales-header'> Quantity Day Start(Bulk)</div> 
      <div className='sales-header'> Quantity Sold (Bulk)</div>
      <div className='sales-header'> Quantity Day End(Bulk)</div>
     
      <div className='sales-header'>Revenue Generated(&#x20A6;)</div>
     </div>


     <div className='sales-info-table'>

      {
summaryData.map((item,keys,)=>{

  const bBulk= parseFloat( item.bQuantity/item.upb).toFixed(1)


const bPiecesRemainder=parseFloat((parseFloat(item.bQuantity)- parseInt(bBulk)*item.upb)).toFixed(1)

const bulk= parseFloat( item.quantity/item.upb).toFixed(1)


const piecesRemainder=parseFloat((parseFloat(item.quantity)- parseInt(bulk)*item.upb)).toFixed(1)


const aBulk= parseFloat( item.aQuantity/item.upb).toFixed(1)


const aPiecesRemainder=parseFloat(parseFloat(item.aQuantity)- parseInt(aBulk)*item.upb).toFixed(1)




 return(
  <>

  <div className='sales-info' key={keys}  style={{display:"grid",gridTemplateColumns:"repeat(6, 1fr)"}}>
   
  <div className='sales-element' >{item.sku}</div>
  <div className='sales-element' >{item.name}</div>
 
  <div className='sales-element' >{(item.quantity && bPiecesRemainder===0)?`${bBulk} 📦`:(item.quantity && bPiecesRemainder!==0)?`${parseInt(bBulk)} 📦 ${bPiecesRemainder} 🔵`:'NA'}</div>
  
  <div className='sales-element' >{(item.quantity && piecesRemainder===0)?`${bulk} 📦`:(item.quantity && piecesRemainder!==0)?`${parseInt(bulk)} 📦 ${piecesRemainder} 🔵`:'NA'}</div>






  <div className='sales-element' >{(item.quantity && aPiecesRemainder===0)?`${aBulk} 📦`:(item.quantity && aPiecesRemainder!==0)?`${parseInt(aBulk)} 📦 ${aPiecesRemainder} 🔵`:'NA'}</div>




 
  <div className='sales-element' >{item.cost}</div>

 
  

    
      
     

  
  
  
 

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
  )
}




   
    
    </>
  ):(
    <>



{
   !isSearchShown ? (
    <>
       <br />
    
    
       <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
        className='sale-select '
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
   ):(
    <>
    <section className='sale-list-container'>



  <div className='sale-list-first-section-normal'>
  <div className='sale-back-input-container'>
  <strong className=''><FiArrowLeft style={{cursor:'pointer'}} size={24} onClick={handleBack}></FiArrowLeft></strong>
  <input type="text" placeholder='search'   className='sale-search-input'
     value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
  onKeyPress={handleKeyPress}
  />
  </div>
 </div>







 


 
<section style={{width:'100%',height:'450px',display:'flex',justifyContent:"center",alignItems:'center',backgroundColor:"",flexDirection:"column"}}>

<div><FaSearch size={64}></FaSearch></div>
<h3>No Item Found</h3>


</section>


 























</section>
    
    
    
    
    </>
   )
}









 
  
     
    </>
  )
}






</article>

    </>
  )
}








    




{
  !isExpanded && (
    <>
  <article className='sale-list-scrollable-container'>

{
  salesRecordData.length!==0 ? (
    <>



{
  instance==='record'  ? (
    <>
    
    
    <section className='sale-list-container' style={{width:'100%'}}>


    {
      isDeleteShown && (
        <>
        
        <section  className='mobile-delete-warning'>

<div  className='delete-container font-text'>

  <p>Are you sure you want to delete this sales record</p>


  <div className='delete-button-container'>

    <button className='btn btn-danger'   onClick={handleDelete}>Yes</button>
    <button className='btn btn-secondary'  onClick={()=>{setIsDeleteShown(false);setPrId('');setSalesId('')}}>No</button>


  </div>
<br />
{
  loadingMessage!=='' &&(
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
  isSearchShown && (
    <>
      <div className='sale-list-first-section-normal'>
      <div className='sale-back-input-container'>
      <strong className=''><FiArrowLeft style={{cursor:'pointer'}} size={24} onClick={handleBack}></FiArrowLeft></strong>
      <input type="text" placeholder='search'   className='sale-search-input'
         value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
      onKeyPress={handleKeyPress}
      />
      </div>
     </div>
    
    </>
  )
}


{
  !isSearchShown && (
    <>
   <div className='sale-list-first-section-normal'>
      <div className='sale-title-container'>
      <strong className=''>Sales Records</strong>
      </div>
     

      <div className='search-icon-container'>

        <div className='sale-search-holder'><FaSearch style={{cursor:'pointer'}} onClick={()=>setIsSearchShown(true)}></FaSearch></div>

      <button  onClick={handleToggle} style={{width:''}} className='sale-expand-contract-btn' data-tip={isExpanded ? "Collapse" : "Expand"}>
   <FontAwesomeIcon icon={isExpanded ? faCompressArrowsAlt : faExpandArrowsAlt} />
 </button>

      </div>

     
     </div>
    
    </>
  )
}






     
    

     <div style={{ width: '96%', margin: '1em auto', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
  {!isCloseMarket ? (
    <>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleCloseMarket}>
        <FaLock style={{ color: 'green', marginRight: '0.5em' }} />
        <div className='font-text' style={{ fontWeight: '500', fontSize: '0.8em' }}>Market is Open! Click to Close</div>
      </div>
    </>
  ) : (
    <>
      {(userRole === 'admin' || userRole === 'super-admin') ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleOpenMarket}>
            <FaLockOpen style={{ color: 'red', marginRight: '0.5em' }} />
            <div className='font-text' style={{ fontWeight: '500', fontSize: '0.8em' }}>Market is Closed. Click to Open</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: '500', fontSize: '0.8em', color: '#888' }}>Market is Closed. Please wait for it to reopen.</div>
        </>
      )}
    </>
  )}
</div>

{
  isLoading && (
    <>
    <div  style={{width:'96%',margin:'1em auto',height:"35px",backgroundColor:'blue',color:'white',padding:'10px',display:'block',alignItems:'center',}}>

  
<FaTimes  style={{float:'right',cursor:'pointer'}} size={12}  onClick={()=>setIsLoading(false)}></FaTimes>
  <strong className='font-text' >{loadingMessage}</strong>

</div>
    </>
  )
}



<section style={{width:'100%', display:'flex',justifyContent:'space-between',alignItems:'center',}}>



<select name="" id=""  className='form-select sale-select  inventory-select font-text' style={{width:'',   border:'',margin:'1em'}}  value={sortOption}  onChange={Sort} >

<option value="" className='form-select-option font-text' >SORT</option>
<option value="res"   className='form-select-option'>RESET</option>
<option value="alph"   className='form-select-option'> ALPHABETICAL ORDER</option>
<option value="sku"  className='form-select-option'>PRODUCT ID</option>
<option value="hc"   className='form-select-option'>HIGHEST COST</option>
<option value="lc"  className='form-select-option'> LOWEST  COST</option>



</select>









 



</section>










     <div className='sale-list-second-section'>
      <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
        onClick={()=>setInstance('record')}
        selected={date}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy" 
        
        className='form-select mobile-sale-date'
        // You can customize the date format

      />

       </div>
    

      </div>
     </div>
    



    <div className='sales-table-container'>

     <div  className={'sales-table-header-container'}  style={{gridTemplateColumns:'repeat(4,1fr)',width:"100%"}} >
    
      <div className='sales-header'> Name</div>

    
      
      
      <div className='sales-header'> Qty Sold</div>
     
      <div className='sales-header'>Price/Unit(&#x20A6;)</div>
      <div className='sales-header'>Cost(&#x20A6;)</div>
    
     </div>


     <div className='sales-info-table'>

     {
salesRecordData.map((item,keys,)=>{

  const {packages}= item


 let   quantity=parseFloat  (item.quantity/item.upb)

  
const piecesRemainder= ((quantity-parseInt(quantity))*parseFloat(item.upb)).toFixed(1)
 
 return(
  <>

  <div   className={'sales-info'}    key={keys}  style={{border:item._id===salesId?'solid red 2px':'',gridTemplateColumns:'repeat(4,1fr)',width:"100%"}} data-id={item._id} data-pr={item.product}>

  
  <div  className='sales-element sales-name' data-id={item._id} data-pr={item.product}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,25).toLowerCase() + '..'}</div>

  


  

   
  

{
  packages==='bulks' ? (
    <>
{
  piecesRemainder> 0?(
    <>
<div  className='sales-element'>{`${parseInt(quantity)}📦 ${piecesRemainder}🔵`}</div>

    </>
  ):(
    <><div  className='sales-element'>{`${parseInt(quantity)}📦`}</div>
    </>
  )
}
   
    </>
  ):(
    <>
     <div  className='sales-element'>{`${item.quantity}🔵`}</div>
    </>
  )
}


  <div  className='sales-element' data-id={item._id} data-pr={item.product}>{item.ppu.toFixed(2)}</div>
  
  <div  className='sales-element'  data-id={item._id} data-pr={item.product}>{(item.cost).toFixed(2)}</div>
 

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
    
    <section className='sale-list-container' style={{width:'100%'}}>
     <div className='sale-list-first-section'>
     <strong className='sale-list-heading'>Sale Summary</strong>

 


     </div>





<section style={{width:'100%', display:'flex',justifyContent:'space-between',alignItems:'center',}}>



<select name="" id=""  className='form-select sale-select inventory-select font-text' style={{width:'',margin:'1em'}}  value={sortOption}  onChange={Sort} >

<option value="" className='form-select-option font-text'>SORT</option>

<option value="alph"   className='form-select-option'>ALPHABETICAL ORDER</option>
<option value="sku"  className='form-select-option'>PRODUCT ID</option>
<option value="hc"   className='form-select-option'>HIGHEST COST</option>
<option value="lc"  className='form-select-option'>LOWEST  COST</option>



</select>







 






</section>







    

     <div className='sale-list-second-section'>
      <div className='sale-date-container'>
       <p className='sale-header'>Sale Date</p>
       <div className='date' >

       <DatePicker 
        onClick={()=>setInstance('summary')}
        selected={date}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy" 
        
        className='form-select'
        // You can customize the date format
      />

       </div>
    

      </div>
     </div>
    



    



    <div className='sales-table-container'>

     <div className='sales-table-header-container'  style={{display:"grid",gridTemplateColumns:"repeat(6, 1fr)"}}>
     <div className='sales-header'> SKU </div>

      <div className='sales-header'> Name</div>
      <div className='sales-header'> Quantity Day Start(Bulk)</div> 
      <div className='sales-header'> Quantity Sold (Bulk)</div>
      <div className='sales-header'> Quantity Day End(Bulk)</div>
     
      <div className='sales-header'>Revenue Generated(&#x20A6;)</div>
     </div>


     <div className='sales-info-table'>

      {
summaryData.map((item,keys,)=>{

  const bBulk= parseFloat( item.bQuantity/item.upb).toFixed(1)


const bPiecesRemainder=parseFloat((parseFloat(item.bQuantity)- parseInt(bBulk)*item.upb)).toFixed(1)

const bulk= parseFloat( item.quantity/item.upb).toFixed(1)


const piecesRemainder=parseFloat((parseFloat(item.quantity)- parseInt(bulk)*item.upb)).toFixed(1)


const aBulk= parseFloat( item.aQuantity/item.upb).toFixed(1)


const aPiecesRemainder=parseFloat(parseFloat(item.aQuantity)- parseInt(aBulk)*item.upb).toFixed(1)




 return(
  <>

  <div className='sales-info' key={keys}  style={{display:"grid",gridTemplateColumns:"repeat(6, 1fr)"}}>
   
  <div className='sales-element' >{item.sku}</div>
  <div className='sales-element' >{item.name}</div>
 
  <div className='sales-element' >{(item.quantity && bPiecesRemainder===0)?`${bBulk} 📦`:(item.quantity && bPiecesRemainder!==0)?`${parseInt(bBulk)} 📦 ${bPiecesRemainder} 🔵`:'NA'}</div>
  
  <div className='sales-element' >{(item.quantity && piecesRemainder===0)?`${bulk} 📦`:(item.quantity && piecesRemainder!==0)?`${parseInt(bulk)} 📦 ${piecesRemainder} 🔵`:'NA'}</div>






  <div className='sales-element' >{(item.quantity && aPiecesRemainder===0)?`${aBulk} 📦`:(item.quantity && aPiecesRemainder!==0)?`${parseInt(aBulk)} 📦 ${aPiecesRemainder} 🔵`:'NA'}</div>




 
  <div className='sales-element' >{item.cost}</div>

 
  

    
      
     

  
  
  
 

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
  )
}




   
    
    </>
  ):(
    <>



    {
       !isSearchShown ? (
        <>
           <br />
        
        
           <div className='sale-date-container'>
           <p className='sale-header'>Sale Date</p>
           <div className='date' >
    
           <DatePicker 
            className='sale-select '
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
       ):(
        <>
        <section className='sale-list-container' style={{width:'100%'}}>
    
    
    {
      isDeleteShown && (
        <>
        
        <section  className='mobile-delete-warning'>
    
    <div  className='delete-container font-text'>
    
    <p>Are you sure you want to delete this sales record</p>
    
    
    <div className='delete-button-container'>
    
    <button className='btn btn-danger'   onClick={handleDelete}>Yes</button>
    <button className='btn btn-secondary'  onClick={()=>{setIsDeleteShown(false);setPrId('');setSalesId('')}}>No</button>
    
    
    </div>
    <br />
    {
    loadingMessage!=='' &&(
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
    
    
    
    
    
    
   
      <div className='sale-list-first-section-normal'>
      <div className='sale-back-input-container'>
      <strong className=''><FiArrowLeft style={{cursor:'pointer'}} size={24} onClick={handleBack}></FiArrowLeft></strong>
      <input type="text" placeholder='search'   className='sale-search-input'
         value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
      onKeyPress={handleKeyPress}
      />
      </div>
     </div>
    
   
    
    
   
    
    
    
     
    
    
     
    <section style={{width:'100%',height:'450px',display:'flex',justifyContent:"center",alignItems:'center',backgroundColor:"",flexDirection:"column"}}>
    
    <div><FaSearch size={64}></FaSearch></div>
    <h3>No Item Found</h3>
    
    
    </section>
    
    
    </section>
        
        
        
        
        </>
       )
    }
    
    
    
    
    
    
    
    
    
     
      
         
        </>
  )
}






</article>  
    
    </>
  )
}





























  



   </main>

   </article>

  </LayOut>

 
  </>
 )
}


export default SalesRecord