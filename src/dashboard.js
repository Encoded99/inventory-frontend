import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';
import { Chart,defaults } from 'chart.js/auto';
import { Bar, Pie,Doughnut } from 'react-chartjs-2';
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import {  FaFacebook, FaTwitter, FaLinkedin,  FaEye,FaUser , FaCloud, FaPlug,FaArrowUp,FaArrowDown, } from 'react-icons/fa'; 
import axios from 'axios'
import { Preloader } from './preloader';

import LayOut from './lay-out';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);
const formattedDate = dateValue.toLocaleString();
let tracker=false






defaults.plugins.title.color='black';
defaults.plugins.title.align='start';
defaults.plugins.title.font.size=12;

defaults.plugins.legend.position='bottom';
defaults.plugins.legend.display=false;

const Home=()=>{

  const {prefix,inventoryQuantity,setInventoryQuantity,setIsPreLoaderRunning,shopGroup,setError,error}= useGlobal()

  const navigate=useNavigate()

const [inventoryValue,setInventoryValue]= useState(0)
const [date, setSelectedDate]=useState(dateValue)
const [productSold,setProductSold]= useState(0)
const [salesTotal,setTotal] =useState([])
const [structuredInventoryData,setStructuredInventoryData]= useState([])

const [aboutToExpireProduct,setAboutToExpireProduct] =useState([])
const [lowQuantityProducts, setLowQuantityProducts]= useState([])
const [higQuantityProducts,setHighQuantityProducts]=useState([])

const [outOfstock,setOutOFstock]= useState([])



const [mostSold,setMostSold]= useState([])
const [lessSold,setLessSold]=useState([])


const [totalPopular,setTotalPopular]= useState(0)
const [unstruncturedArray,setUnstructuredArray] =useState([])

const [structuredSalesData,setStructuredSalesData]= useState([])
const [popularCategories,setPopularCategories]= useState([])

const [isLoading,setIsLoading]=useState(true)

const reportType='day'




const fetchSales= async(dates,report)=>{

  
 
  
  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   
   }
  
  
    try{
  
      const url=`${prefix}/products/fetch-sales/${dates}/${report}`
  
      const response=  await axios.get(url,{withCredentials:true})
setUnstructuredArray(response.data)


      const newStructuredArray=[]



      for (let i=0;i<response.data.length;i++){
  
      const element=response.data[i]
     const  doesDuplicateExist =newStructuredArray.some((item)=>item.product===element.product)
  
  
     if(!doesDuplicateExist){
      newStructuredArray.push(element)
     }
  
  
     else {
  
     const similarItem= newStructuredArray.find((item)=>item.product===element.product)
  
     similarItem.cost+=element.cost
  
    
  
     }
  
  
  
      }

      const salesData= newStructuredArray.map((item)=>{
        const margin=   item.cost-item.buyingCost/item.cost
       
           return {name:item.name, margin:margin}
         })
         




const bestPerforming= newStructuredArray.map((item)=>{
  const profitMargin= item.cost-item.buyingCost/item.cost
  return {name:item.name, margin:profitMargin}
}).sort((a,b)=>{
  return b.margin-a.margin;
}

).slice(0,3)

setMostSold(bestPerforming)




const worstPerforming= newStructuredArray.map((item)=>{
  const profitMargin= item.cost-item.buyingCost/item.cost
  return {name:item.name, margin:profitMargin}
}).sort((a,b)=>{
  return a.margin-b.margin;
}

).slice(0,3)

setLessSold([...worstPerforming])


console.log(newStructuredArray,'sales structured data')
      
  
  
      setStructuredSalesData(salesData)





  
      const tot= newStructuredArray.map((item)=>item.cost).reduce((acc,cv)=>{
        return acc + cv
      },0)


      console.log(newStructuredArray,'new-structuredArray');

      setTotal(tot)
  
     
    }
  
  
    catch(err){
  
      //console.log(err, 'error from fetching sales');
  
    }



    finally{
     // setIsPreLoaderRunning(false)
    }
  }
  





const fetchCategorySales= async(dates,report)=>{

 // setIsPreLoaderRunning(true)
 
  
  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   
   }
  
  
    try{
  
      const url=`${prefix}/products/fetch-category-sales/${dates}/${report}`
  
      const response=  await axios.get(url,{withCredentials:true})
console.log(response.data,'taki-taki')
setTotalPopular(response.data.map((item)=>item.sales).reduce((acc,it)=>{

  return acc + it

},0))


setPopularCategories(response.data)
     
    }
  
  
    catch(err){
  
      //console.log(err, 'error from fetching sales');
  
    }



    finally{
    //  setIsPreLoaderRunning(false)
    }
  }
  















  
  








  const fetchUnwindAllProducts=async()=>{


 


    const url=`${prefix}/products/unwind-verified`
  
  
        try {
  
          const response= await axios.get(url,{withCredentials:true})
          console.log(response.data.data.products,'invent-pro');
  
  
  
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

    const temp=unwindInventoryData.map((item)=>{
  
      const eachCost= (item.inventoryData.cpq)
      const quantity= item.inventoryData.quantity
    
      return quantity * eachCost
    })
  
   
  
    
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

    const highQuantity= newStructuredArray.sort((a,b)=>b.inventoryData.quantity-a.inventoryData.quantity).slice(0,3)
    
    setHighQuantityProducts(highQuantity)
    
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
    
    
    
  
  
  //setIsPreLoaderRunning(false)
  
         
        }
  
  
        catch(err){
          
        }



        finally{
       
        }
      }
  



























  
  
  const fetchAllDashboardData=async()=>{


    const source = axios.CancelToken.source();

    const timeOutId = setTimeout(() => {
     
        source.cancel('Request timed out');
    }, 180000);



    try{

      await Promise.all([fetchSales(date,reportType),fetchCategorySales(date,reportType),fetchUnwindAllProducts()])
    }

    catch(error){

      if  (error.request.status===500) {
        setError('Oops, something went wrong, try again.');
    }

    
    if (axios.isCancel(error)) {
      console.log('Axios canceled the request mccoy');
      setError('Request timed out. Please try again.');
      return;
  }

  if (error.message === 'Network Error') {
    setError('Oops, network error, check your internet.');
    return;
}



if (error.response) {
  if (error.response.data.message === 'unauthorized' && error.response.data) {
      navigate('/log-in');
      setError(error.response.data.message);
  }



} else if (error.request) {
  setError('Oops, something went wrong, try again.');
}




    }

    finally{

   
        clearTimeout(timeOutId);
        setIsLoading(false)


    }
  }
  
  
  
  
      useEffect(()=>{
       fetchAllDashboardData()
      },[])
  
  
 

const todaysDate= new Date()

const momentTime= todaysDate.toDateString()





















if(isLoading){
  return (
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











 return(
  <>
  
  <LayOut>






<main  className='
dashboard-partition-container'>

<section  className='dashboard-first-partition'>
  
  
<h4 className='font-heading dashboard-main-header'  style={{fontWeight:'700'}}>Dashboard</h4>
<p style={{fontSize:'0.8em',fontWeight:"400"}} className='font-text dashboard-timer' >{momentTime}</p>

   
<section className='all-partion-scrollable-container'>
<article className='all-partition-container'>
  
<div className='partition-block'>

<div   className='heading-today-container'>
  <div style={{fontWeight:'700'}} className='partition-main-heading'>Revenue</div>
  <div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
  </div>


</div>
<hr />

<h3 className='partition-header'>&#x20A6; {salesTotal.toLocaleString()}</h3>
<div style={{fontSize:'0.82em'}}>as of today <FaArrowUp style={{color:'green',marginLeft:'3px'}}></FaArrowUp></div>
</div>




<div className='partition-block'>

<div className='heading-today-container'>
  <div style={{fontWeight:'700'}} className='partition-main-heading'>Inventory Value</div>
  <div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
  </div>


</div>
<hr  />

<h3 className='partition-header'>&#x20A6; {inventoryValue.toLocaleString()}</h3>
<div style={{fontSize:'0.82em'}}>as of today       <FaArrowUp style={{color:'green',marginLeft:'3px'}}></FaArrowUp></div>
</div>




<div className='partition-block'>

<div className='heading-today-container'>
  <div style={{fontWeight:'700'}} className='partition-main-heading'>Turn Over Ratio</div>
  <div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
  </div>


</div>
<hr />

{
inventoryValue>0 ? (
  <>
 <h3 className='partition-header'>{((salesTotal/inventoryValue)*100).toFixed(5)}%</h3> 
  </>
):(
  <>
  <h3 className='partition-header'>0%</h3>

  </>
)

}

<div style={{fontSize:'0.82em'}}>week to date       <FaArrowUp style={{color:'green',marginLeft:'3px'}}></FaArrowUp></div>
</div>



<div className='partition-block'>

<div className='heading-today-container'>
  <div style={{fontWeight:'700'}} className='partition-main-heading'>Product Sold</div>
  <div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
  </div>


</div>
<hr />

<h3 className='partition-header'>{structuredSalesData.length}</h3>
<div style={{fontSize:'0.82em'}}>week to date       <FaArrowUp style={{color:'green',marginLeft:'3px'}}></FaArrowUp></div>
</div>








<div className='partition-block'>

<div className='heading-today-container'>
  <div style={{fontWeight:'700'}} className='partition-main-heading'>Total Product</div>
  <div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
  </div>


</div>
<hr />

<h3 className='partition-header'>{structuredInventoryData.length}</h3>
<div style={{fontSize:'0.82em'}}>as of today       <FaArrowUp style={{color:'green',marginLeft:'3px'}}></FaArrowUp></div>
</div>







</article>
</section>






</section>


<section className='dashboard-second-partition'>



  













  <div className='chart-block-container'>





  {
    popularCategories.length!==0 ?(
      <>
      <div className='chart-block'>
    <div className='heading-today-container'>
    <div style={{fontWeight:'700'}} className='font-heading dashboard-header'>Popular Categories</div>
    <div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>
  </div>
  <hr />
<div className='chart-holder'>
  
  <Doughnut
      data={{
        labels: popularCategories.map((item) => item._id),
        datasets: [
          {
            data: popularCategories.map((item) => (item.sales / totalPopular) * 100),
            backgroundColor: [ 'green', 'red', 'blue', 'yellow', 'blueviolet', 'maroon', 'greenyellow', 'palevioletred','orangered','blueviolet','teal','crimson','white'], 
            borderColor: [ 'green', 'red', 'blue', 'yellow', 'blueviolet', 'maroon', 'greenyellow', 'palevioletred','orangered','blueviolet','teal','crimson','white'],
          },
        ],
      }}

      
      options={{
        plugins: {
          title: {
            text: "",
            fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
          },
        },
        elements: {
          arc: {
            borderWidth: 0,
            // Reduce border width of the doughnut
          },
        },
   
       
          legend: {
             display: false
          },
          tooltips: {
             enabled: false
          
     }
      }}
    />
  </div>

  

    </div> 
      
      </>
    ):(
      <>
      <div className='chart-block' style={{position:'relative'}}>
      <div className='heading-today-container'>
    <div style={{fontWeight:'700'}} className='font-heading dashboard-header'>Popular Categories</div>
    <div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>
  </div>
 
       
  <div className='dashboard-no-record-container'>
<p>No record to be displayed as of now</p>


</div>
      </div>
      
      </>
    )
  }


   

















    
    <div className='chart-block special-chart-block'>
    <div className='heading-today-container'>
    <div style={{fontWeight:'700'}} className='font-heading dashboard-header'>Revenue vs. Inventory Value Chart</div>
    <div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>


 

  </div>
  <hr />
<div className='chart-holder'>

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
 







    </div>


  </div>



{
  structuredSalesData.length!==0 && (
    <>
    
    
    <div className='chart-block-container2'>




  <div className='chart-block-wide'       >

  <div className='partition-heading-today-container'>
<div style={{fontWeight:'700'}} className='font-sub-heading partition-info-header'>PROFIT MARGIN</div>
<div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>
  </div>
    <div className='' style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'0',height:'50px',width: `${structuredSalesData.length*100}px`,backgroundColor:""}}>
     
    </div>
    <hr />
    <div className="chart-holder-wide"   style={{ width: `${structuredSalesData.length*100}px`}}>

   
      <Bar
  data={{
    labels: structuredSalesData.map((item) => item.name),
    datasets: [{
      label: 'Percentage Gross Profit',
      data: structuredSalesData.map((item) => item.margin),
      backgroundColor: 'blue',
      borderColor: 'blue',
      font: {
        size: 12,
        family: 'source-serif-pro, Georgia, Cambria, "Times New Roman", Times, serif'
      }
    }]
  }}
  options={{
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "",
        color: 'black',
        align: 'start',
        font: {
          size: 12,
          family: 'source-serif-pro, Georgia, Cambria, "Times New Roman", Times, serif'
        }
      },
      legend: {
        position: 'bottom'
      }
    },
   
  }}
/>


    </div>
  </div>
</div>
    
    </>
  )
}















{
  structuredSalesData.length>=6 && (
    <>
    
    <section className='notification-card-container' style={{marginTop:"5px",backgroundColor:""}}>


  <div className='notification-card-block'  >

    <div style={{padding:'10px'}}>
    <div className='partition-heading-today-container'>
    <div className='font-sub-heading partition-info-header' style={{fontWeight:'700'}}>MOST PROFITABLE PRODUCTS   <FaArrowUp style={{color:"green"}} size={12}></FaArrowUp></div>
    <div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>
  </div>
  <div className='chart-line'>

  </div>

    </div>



<article style={{padding:"0 5px",marginBottom:"5px"}}>

<div className='chart-notification-container' style={{border:'solid 1px grey'}}>

<div className='chart-title'  style={{borderBottom:'solid 1px grey'}}>

<div style={{width:"60%"}}>Product</div>

<div style={{width:"40%"}}>Gross Profit (%)</div>

</div>

{
mostSold.map((item,index)=>{

const number=index+1;
const remainder=number%2

return(
<>

<div className={remainder==0?'chart-title':"chart-title white-body"} >

<div  className='first-text' style={{width:"60%"}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,20).toLowerCase() + '..'}</div>

<div style={{width:"40%"}}>{(item.margin/100).toFixed(2)}</div>

</div>

</>
)
})
}




</div>


</article>
 
  </div>





  <div className='notification-card-block'  >

<div style={{padding:'10px'}}>
<div className='partition-heading-today-container'>
<div className='font-sub-heaiding partition-info-header' style={{fontWeight:'700'}}>LOW GROSS PROFIT PRODUCTS  <FaArrowDown style={{color:"red"}} size={12}></FaArrowDown></div>
<div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
</div>
</div>
<div className='chart-line'>

</div>

</div>



<article className='whole-content' style={{padding:"0 5px",marginBottom:"5px",backgroundColor:""}}>

<div className='chart-notification-container' style={{border:'solid 1px grey'}}>

<div className='chart-title'  style={{borderBottom:'solid 1px grey'}}>

<div style={{width:"60%"}}>Product</div>

<div style={{width:"40%"}}>Gross Profit (%)</div>

</div>

{
lessSold.map((item,index)=>{

const number=index+1;
const remainder=number%2

return(
<>

<div className={remainder==0?'chart-title':"chart-title white-body"} >


<div  className='first-text' style={{width:"60%"}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,20).toLowerCase() + '..'}</div>

<div style={{width:"40%"}}>{(item.margin/100).toFixed(2)}</div>

</div>

</>
)
})
}




</div>


</article>

</div>




























</section>
    
    </>
  )
}






<section className='notification-card-container' style={{marginTop:"5px",backgroundColor:""}}>


  <div className='notification-card-block'   style={{backgroundColor:""}}>

    {
      structuredInventoryData.length>=6 ?(
        <>
        <div style={{padding:'10px'}}>
    <div className='partition-heading-today-container'>
<div style={{fontWeight:'700'}} className='font-sub-heading partition-info-header'>LOW QUANTITY PRODUCTS  <FaArrowDown style={{color:"red"}} size={12}></FaArrowDown></div>
<div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>
  </div>
  <div className='chart-line'>

  </div>

    </div>
    <article style={{padding:"0 5px",marginBottom:"5px"}}>

<div className='chart-notification-container' style={{border:'solid 1px grey'}}>

<div className='chart-title'  style={{borderBottom:'solid 1px grey'}}>

<div style={{width:"60%"}}>Product</div>

<div style={{width:"40%"}}>Quantity</div>

</div>

{
lowQuantityProducts.map((item,index)=>{

const number=index+1;
const remainder=number%2

return(
<>

<div className={remainder==0?'chart-title':"chart-title white-body"} >

<div  className='first-text' style={{width:"60%"}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,20).toLowerCase() + '..'}</div>

<div style={{width:"40%"}}>{(item.inventoryData.quantity/item.upb).toFixed(2)}</div>

</div>

</>
)
})
}




</div>


</article>




        </>
      ):(
        <>
         <div style={{padding:'10px'}}>
    <div className='heading-today-container'>
<div style={{fontWeight:'700'}} className='font-sub-heading partition-info-header'>LOW QUANTITY PRODUCTS  <FaArrowDown style={{color:"red"}} size={12}></FaArrowDown></div>
<div>
 <button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
    </div>
  </div>
  <div className='chart-line'>

  </div>

    </div>
        <div className='dashboard-no-record-container'>

          <p>No record to be displayed as of now</p>


        </div>
        
        
        </>
      )
    }

    




 
  </div>







    
    <div className='notification-card-block'  >

    {
   structuredInventoryData.length>=6 ? (
    <>
<div style={{padding:'10px'}}>
<div className='partition-heading-today-container'>
<div style={{fontWeight:'700'}} className='font-sub-heading partition-info-header'>HIGH QUANTITY PRODUCTS  <FaArrowUp style={{color:"green"}} size={12}></FaArrowUp></div>

<div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
</div>
</div>
<div className='chart-line'>

</div>

</div>

<article style={{padding:"0 5px",marginBottom:"5px"}}>

<div className='chart-notification-container' style={{border:'solid 1px grey'}}>

<div className='chart-title'  style={{borderBottom:'solid 1px grey'}}>

<div style={{width:"60%"}}>Product</div>

<div style={{width:"40%"}}>Quantity</div>

</div>

{
higQuantityProducts.map((item,index)=>{

const number=index+1;
const remainder=number%2

return(
<>

<div className={remainder==0?'chart-title':"chart-title white-body"} >

<div  className='first-text' style={{width:"60%"}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,20).toLowerCase() + '..'}</div>

<div style={{width:"40%"}}>{(item.inventoryData.quantity/item.upb).toFixed(2)}</div>

</div>

</>
)
})
}




</div>


</article>

    </>
   ):(
    <>
    <div style={{padding:'10px'}}>
<div className='heading-today-container'>
<div style={{fontWeight:'700'}} className='font-sub-heading partition-info-header'>HIGH QUANTITY PRODUCTS  <FaArrowUp style={{color:"green"}} size={12}></FaArrowUp></div>

<div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
</div>
</div>
<div className='chart-line'>

</div>

</div>

        <div className='dashboard-no-record-container'>

<p>No record to be displayed as of now</p>


</div>

    </>
   )
}









</div>
  




















</section>








<section className='last-notification-card-container' style={{marginTop:"5px",backgroundColor:""}}>


 





    
    <div className='notification-card-block'  >

    {
    outOfstock.length!==0 && (
    <>
<div style={{padding:'10px'}}>
<div className='partition-heading-today-container'>
<div style={{fontWeight:'700'}} className='font-sub-heading partition-info-header'>OUT OF STOCK PRODUCTS<FaArrowUp style={{color:"green"}} size={12}></FaArrowUp></div>

<div>
<button className=' btn  btn-primary spe' style={{fontSize:'0.6em',backgroundColor:'azure',border:'2px black solid'}}>TODAY</button>
</div>
</div>
<div className='chart-line'>

</div>

</div>

<article style={{padding:"0 5px",marginBottom:"5px"}}>

<div className='chart-notification-container' style={{border:'solid 1px grey'}}>

<div className='chart-title'  style={{borderBottom:'solid 1px grey'}}>

<div style={{width:"60%"}}>Product</div>

<div style={{width:"40%"}}>Quantity</div>

</div>

{
 outOfstock.map((item,index)=>{

const number=index+1;
const remainder=number%2

return(
<>

<div className={remainder==0?'chart-title':"chart-title white-body"} >

<div  className='first-text' style={{width:"60%"}}>{item.name.length<25 ?   item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase():item.name.charAt(0).toUpperCase() + item.name.slice(1,20).toLowerCase() + '..'}</div>

<div style={{width:"40%"}}>0</div>

</div>

</>
)
})
}




</div>


</article>

    </>
   )
}









</div>
  




















</section>



























  

</section>







</main>



<article className='dashboard-footer'>

<div style={{width:'100%',height:'auto',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:''}}>
<LazyLoadImage src='free-vector-building-clip-art-minimalistic-template_842152-542 (2).jpg' className='dashboard-image'></LazyLoadImage>
</div>


<section className='dashboard-footer-content-container'>
<article className='dashboard-footer-link-container'>


<div className='link-content-container ' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{color:'black',fontWeight:'700'}}>Quick links</div>


<Link className='quick-links' style={{color:'black'}}>About Us</Link>
<Link className='quick-links' style={{color:'black'}}>Refer & Win</Link>


  </div>


</div>
<div className='link-content-container quick-links-container' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div style={{color:'black',fontWeight:'700'}}>Legal</div>

<Link className='quick-links' style={{color:'black'}}>Pricing</Link>
<Link className='quick-links' style={{color:'black'}}>Terms & Conditions</Link>
<Link className='quick-links' style={{color:'black'}}>Privacy Policy</Link>

  </div>


</div>


<div className='link-content-container quick-links-container' style={{backgroundColor:''}}>

  <div style={{width:'100%',height:"100%",display:'flex',flexDirection:'column'}}>

  <div  style={{display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'black',fontWeight:'700'}} >Contact Us</div>
<div className='contact-info' style={{marginTop:"0px",display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'black',fontSize:'1.0rem'}} >Email: ivy@support.com</div>
<div  className='contact-info'  style={{marginTop:"0px",display:'flex',justifyContent:'flex-start',alignItems:'center',width:'100%',color:'black',fontSize:'1.0rem'}} >Telephone: +2349037936473</div>



<section style={{width:'100%',}}>
<article className='footer-social-link-container'>

  <FaTwitter className='social-link'></FaTwitter>
  <FaFacebook className='social-link'></FaFacebook>
  <FaLinkedin className='social-link'></FaLinkedin>

</article>
</section>

  </div>


</div>


</article>

<div className='font-text  dashboard-copyright' style={{fontSize:'1.0rem',color:'black',fontWeight:"700"}}> &copy; Copyright Encoded Technology  2024 . All Rights Reserved.</div>


</section>


</article>










  </LayOut>
  
  
  </>
 )
}




export default Home