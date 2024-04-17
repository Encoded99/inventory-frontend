import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';
import { Chart,defaults } from 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'

import axios from 'axios'


import LayOut from './lay-out';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);
const formattedDate = dateValue.toLocaleString();
let tracker=false





defaults.maintainAspectRatio=false;
defaults.responsive=true
defaults.plugins.title.display=true
defaults.plugins.title.color='black'
defaults.plugins.title.align='start'
defaults.plugins.title.font.size=30


const Home=()=>{

  const {prefix,inventoryQuantity,setInventoryQuantity,setIsPreLoaderRunning}= useGlobal()

  const navigate=useNavigate()

const [inventoryValue,setInventoryValue]= useState(0)
const [date, setSelectedDate]=useState(dateValue)
const [structuredSalesData,setStructuredSalesData]= useState([])
const [salesTotal,setTotal] =useState([])
const [structuredInventoryData,setStructuredInventoryData]= useState([])

const [aboutToExpireProduct,setAboutToExpireProduct] =useState([])
const [lowQuantityProducts, setLowQuantityProducts]= useState([])
const [groceries,setGroceries]= useState([])
const [cookies,setCookies] =useState([])
const [drinks,setDrinks]= useState([])
const [totalPopular,setTotalPopular]= useState(0)
const [unstruncturedArray,setUnstructuredArray] =useState([])
const [outOfstock,setOutOFstock]= useState([])











const total= groceries.length+cookies.length+drinks.length
const reportType='day'

const fetchSales= async(dates,report)=>{

  setIsPreLoaderRunning(true)
 
  
  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   
   }
  
  
    try{
  
      const url=`${prefix}/products/fetch-sales/${dates}/${report}`
  
      const response=  await axios.get(url,{withCredentials:true})
setUnstructuredArray(response.data)
setCookies(response.data.filter((item)=>item.category==='Biscuits/Snacks'))
setDrinks(response.data.filter((item)=>item.category==='Drinks'))
setGroceries(response.data.filter((item)=>item.category==='Groceries'))
   //console.log(response,'sales response');
   setTotalPopular( groceries.length+cookies.length+drinks.length)

      const newStructuredArray=[]



      for (let i=0;i<response.data.length;i++){
  
      const element=response.data[i]
     const  doesDuplicateExist =newStructuredArray.some((item)=>item._id===element._id)
  
  
     if(!doesDuplicateExist){
      newStructuredArray.push(element)
     }
  
  
     else {
  
     const similarItem= newStructuredArray.find((item)=>item._id===element._id)
  
     similarItem.salesData.cost+=element.salesData.cost
  
    
  
     }
  
  
  
      }


      
  
  
      setStructuredSalesData(newStructuredArray)





  
      const tot= newStructuredArray.map((item)=>item.salesData.cost).reduce((acc,cv)=>{
        return acc + cv
      },0)

      setTotal(tot)
  
     
    }
  
  
    catch(err){
  
      //console.log(err, 'error from fetching sales');
  
    }
  }
  














useEffect(()=>{
  fetchSales(date,reportType)
},[date])








const fetchUnwindAllProducts=async()=>{


 


  const url=`${prefix}/products/unwind-verified`


      try {

        const response= await axios.get(url,{withCredentials:true})
      //  console.log(response,'invent');



const unwindInventoryData=response.data.data.products.filter((products)=>products.inventoryData)
const outOfStockInventoryData=response.data.data.products.filter((products)=>!products.inventoryData)

setOutOFstock(outOfStockInventoryData)




    


const totalCostData= unwindInventoryData.map((item)=>{

  const eachCost= (item.inventoryData.cpq)
  const quantity= item.inventoryData.quantity

  return quantity * eachCost
}).reduce((acc,cv)=>{
  return acc + cv
  },0)




  
    setInventoryValue(totalCostData)
  
  
  
    const newStructuredArray=[]
  
  
  
    for (let i=0;i<unwindInventoryData.length;i++){
  
    const element=unwindInventoryData[i]
   const  doesDuplicateExist =newStructuredArray.some((item)=>item._id===element._id)
  
  
   if(!doesDuplicateExist){
    newStructuredArray.push(element)
   }
  
  
   else {
  
   const similarItem= newStructuredArray.find((item)=>item._id===element._id)
  
   similarItem.inventoryData.quantity+=element.inventoryData.quantity
   if(element.inventoryData.expiryDate<similarItem.inventoryData.expiryDate){
  
    similarItem.inventoryData.expiryDate=element.inventoryData.expiryDate
  
   }
  
  
  
   }
  
  
  
  }


  
  setStructuredInventoryData(newStructuredArray)


  
  const lowQuantity= newStructuredArray.sort((a,b)=>a.inventoryData.quantity-b.inventoryData.quantity).slice(0,3)
  
  setLowQuantityProducts(lowQuantity)
  
  const totalQuantity= newStructuredArray.map((item)=>item.inventoryData.quantity).reduce((acc,cv)=>{
  return acc+cv
  },0)
  
  
  
  setInventoryQuantity(totalQuantity)
  
  
  const aboutToExpire = newStructuredArray.sort((a, b) => {
    const dateA =Date.parse(a.inventoryData.expiryDate)
    const dateB =  Date.parse(b.inventoryData.expiryDate)
  
    return dateA - dateB;
  }).slice(0,3);
  setAboutToExpireProduct(aboutToExpire)
  
  
  


setIsPreLoaderRunning(false)

       
      }


      catch(err){
        
      }
    }

















useEffect(() => {

fetchUnwindAllProducts()

 
}, []);






 return(
  <>
  
  <LayOut>

<main>
<p style={{fontSize:'3em',textAlign:'center',margin:'0.0em 0'}}>Dashboard</p>

<section  className='dashboard-first-line'>

 

<div className='dashboard-first-block'>

 <div style={{textAlign:"",margin:"2vh",fontWeight:"500"}}>Inventories</div>
<hr  style={{width:'95%',margin:'0 auto'}}/>

<div className='block-info'>

 

 <div style={{display:'flex',width:"100%",}}>
 <p style={{color:'red',fontWeight:"500"}}>Inventory Value (&#x20A6;)</p>
 <p style={{color:'',fontWeight:"500",marginLeft:"8%"}}>{inventoryValue.toFixed(2)}</p>
 </div>


 <div style={{display:'flex',width:"100%",}}>
 <p style={{color:'red',fontWeight:"500"}}>Total Quantity (pieces)</p>
 <p style={{color:'',fontWeight:"500",marginLeft:"8%"}}>{inventoryQuantity.toFixed(2)}</p>
 </div>


 <div style={{display:'flex',width:"100%",}}>
 <p style={{color:'red',fontWeight:"500"}}>Total Product </p>
 <p style={{color:'',fontWeight:"500",marginLeft:"8%"}}>{structuredInventoryData.length}</p>
 </div>


 


</div>
</div>


<div className='dashboard-first-block'>

<div style={{textAlign:"",margin:"2vh",fontWeight:"500"}}>Sales</div>
<hr  style={{width:'95%',margin:'0 auto'}}/>

<div className='block-info'>

 

 <div style={{display:'flex',width:"100%",}}>
 <p style={{color:'red',fontWeight:"500"}}>Total Sales (&#x20A6;)</p>
 <p style={{color:'',fontWeight:"500",marginLeft:"8%"}}>{salesTotal}</p>
 </div>


 <div style={{display:'flex',width:"100%",}}>
 <p style={{color:'red',fontWeight:"500"}}>Sales Turn Over Ratio</p>
 <p style={{color:'',fontWeight:"500",marginLeft:"8%"}}>{(salesTotal/inventoryValue).toFixed(5)}%</p>
 </div>


 <div style={{display:'flex',width:"100%",}}>
 <p style={{color:'red',fontWeight:"500"}}>Total Item Sold </p>
 <p style={{color:'',fontWeight:"500",marginLeft:"8%"}}>{structuredSalesData.length}</p>
 </div>





 


</div>









 

</div>

    <div  className='dashboard-first-chart'>



<section className='chart-container'>


<Pie

 data = {{
  labels: ['Groceries', 'Drinks', 'Biscuits/Snacks'],
  datasets: [
    {
      data: [
        (groceries.length / total) * 100,
        (drinks.length / total) * 100,
        (cookies.length / total) * 100,
      ],
      backgroundColor: ['#3498db', '#2ecc71', '#9b59b6'], // Cool tones
      borderColor: ['#3498db', '#2ecc71', '#9b59b6'],
    },
  ],
}}

options={
  {
    plugins:{
      title:{

        text:"Popular Categories"

      }
    }
  }
}



/>


</section>



</div>
    
    
  




</section>









<strong style={{marginLeft:"5%"}} className='notifications-headline'>Notifications</strong>
<section className='alert-container'>




{
  aboutToExpireProduct.length!==0 && (
    <>
    
    

<div className='first-alert-block'>
 <div style={{marginTop:"0%",marginLeft:'0%',color:'red',fontWeight:'500'}} className='alert-header'> About to Expire Products </div>
 
<div className='expire-headline'>
  <strong  style={{textAlign:'center'}}>PRODUCT NAME</strong>
  <strong  style={{textAlign:'center'}}>EXPIRY DATE</strong>
 
</div>
<div className='expire-content'>
  {
    aboutToExpireProduct.map((item)=>{
      return(
        <>
        <strong style={{textAlign:'center'}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,25).toLowerCase() + '..'}</strong>
  <div  style={{textAlign:'center',fontWeight:"500"}}>{moment.utc(item.inventoryData.expiryDate).tz('Africa/Lagos').format('DD/MM/YYYY')}</div>
        
        </>
      )
    })
  }

</div>



 </div>
    
    
    </>
  )
}









{
  lowQuantityProducts.length!==0 && (
    <>
     <div className='first-alert-block'>
 <div style={{marginTop:"0%",marginLeft:'0%',color:'red',fontWeight:'500'}} className='alert-header'> Low Quantity Products </div>
 
 
<div className='expire-headline'>
  <strong  style={{textAlign:'center'}}>PRODUCT NAME</strong>
  <strong  style={{textAlign:'center'}}>QUANTITY(BULK)</strong>
 
</div>
<div className='expire-content'>
  {
    lowQuantityProducts.map((item)=>{
      return(
        <>
        <strong style={{textAlign:'center'}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,25).toLowerCase() + '..'}</strong>
  <div  style={{textAlign:'center',fontWeight:"500"}}>{(item.inventoryData.quantity/item.upb).toFixed(2)}</div>
        
        </>
      )
    })
  }

</div>



 </div>
    
    </>
  )
}










{
  outOfstock.length!==0 && (
    <>
    
    <div className='first-alert-block'>
 <div style={{marginTop:"0%",marginLeft:'0%',color:'red',fontWeight:'500'}} className='alert-header'> Out of Stock products </div>
 
<div className='expire-headline'>
  <strong  style={{textAlign:'center'}}>PRODUCT NAME</strong>
  <strong  style={{textAlign:'center'}}>QUANTITY</strong>
 
</div>
<div className='expire-content'>
  {
    outOfstock.map((item)=>{
      return(
        <>
        <strong style={{textAlign:'center'}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,25).toLowerCase() + '..'}</strong>
  <div  style={{textAlign:'center',fontWeight:"500"}}>0</div>
        
        </>
      )
    })
  }

</div>



 </div>
    
    
    
    </>
  )
}
 
 











</section>














<p style={{fontSize:'2em',textAlign:'center',margin:'0.5em 0'}}>Revenue vs. Inventory Value Chart</p>


<div className='revenue-inventory-container'>

<Bar

data={{

  labels:['Today'],

datasets:[{

  label:'Inventory Value',
  data:[inventoryValue],
  backgroundColor:'green',
  borderColor:'green'
  

},

{

  label:'Total Sales',
  data:[salesTotal],
  backgroundColor:'blue',
  borderColor:'green'
  

},
 
]


}}



/>




</div>


<section>







</section>




</main>

  </LayOut>
  
  
  </>
 )
}




export default Home