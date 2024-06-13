




import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import { Line,Bar,Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Link } from 'react-router-dom';
//import {shoes, } from './context'
import { useGlobal, input } from './context';
import { SemiPreloader } from './preloader';

import axios from 'axios';

import Upgrade from './upgrade';
import LayOut from './lay-out';
const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);



const Product=()=>{
 const {prefix,subType,}=useGlobal()

const [date, setSelectedDate]=useState(dateValue)

const [reportType,setReportType]=useState('week')
const [grossProfitData,setGrosProfitData]= useState([])
const [highGross,setHighGross]=useState(0)
const [lowGross,setLowGross]=useState(0)
const [totalGross,setTotalGross]=useState(0)

const [total,setTotal]=useState(0)
const [sortOption,setSortOption]=useState('')
const [pieData,setPieData]=useState([])
const [rawData,setRawData]=useState([])
const [isPreLoaderRunning,setIsPreLoaderRunning]= useState(false)


useEffect(()=>{

 if (subType!=='outright' || subType!=='premium'  ){
   return
 }


 setIsPreLoaderRunning(true)
},[])


 const fetchAllChartsData= async()=>{


   //setIsPreLoaderRunning(true)
   const config={
     headers:{
      'Content-Type': 'application/json',
    },
    
    }

   try{
const url=`${prefix}/products/fetch-product-data/${dateValue}/${reportType}`

const response= await axios.get(url,{withCredentials:true})




console.log(response.data.data.bar,'law-bar');

const gross= response.data.data.bar.map((item)=>{

 const percentage= parseFloat(item.sales-item.cost/item.sales)
const cost=parseFloat( item.cost)
const sales=parseFloat( item.sales)
const margin=  sales-cost



 return {grossProfit:percentage/100,product:item._id.toLowerCase(),sku:item.sku,margin: parseFloat( margin),sales:sales,cost:cost}
})



setGrosProfitData(gross.sort((a,b)=>{
 const productA= a.grossProfit;
 const productB= b.grossProfit;
 return productB-productA
}))
console.log(gross,'gross from pr');
setRawData(gross)

setTotalGross( gross.map((item)=>item.grossProfit).reduce((it,acc)=>{
 return it + acc
},0))

setHighGross(parseFloat( gross.map((item)=>item.grossProfit).sort((a,b)=>{
  return a-b
}).slice(-1)))


setLowGross(parseFloat( gross.map((item)=>item.grossProfit).sort((a,b)=>{
 return a-b
}).slice(1)))

const pieTotal=response.data.data.pie.map((item)=>{
 return item.sales
}).reduce((it,acc)=>{
 return it + acc
})


setTotal(pieTotal)




setPieData(response.data.data.pie)


   }

   catch(err){



   }





   
   finally{
  
     setIsPreLoaderRunning(false)

   }

 }



 useEffect(()=>{

   if (subType==='outright' || subType==='premium'){
     fetchAllChartsData(date,reportType)
   }
     
 

 },[date,reportType])
 
 const handleReportChange=(e)=>{

   const report= e.target.value
 
   console.log(report,'report');
   setReportType(report)
 
 }




 const Sort=(e)=>{

   const option= e.target.value





   if (option==='alph'){
     setGrosProfitData([...grossProfitData.sort((a,b)=>{
       const nameA=a.product
       const nameB=b.product
       return nameA.localeCompare(nameB)
     })])
   }


   if (option==='sku'){
     setGrosProfitData([...grossProfitData.sort((a,b)=>{
       const nameA=a.sku
       const nameB=b.sku
       return nameA.localeCompare(nameB)
     })])
   }


   if (option==='hs'){
     setGrosProfitData([...rawData.sort((a,b)=>{
       const nameA=a.sales;
       const nameB=b.sales;
       return nameB-nameA
     })])
   }


   if (option==='ls'){
     setGrosProfitData([...rawData.sort((a,b)=>{
       const nameA=a.sales;
       const nameB=b.sales;
       return nameA-nameB
     })])
   }




   if (option==='hc'){
     setGrosProfitData([...rawData.sort((a,b)=>{
       const nameA=a.cost;
       const nameB=b.cost;
       return nameB-nameA
     })])
   }


   if (option==='lc'){
     setGrosProfitData([...rawData.sort((a,b)=>{
       const nameA=a.cost;
       const nameB=b.cost;
       return nameA-nameB
     })])
   }


   if (option==='res'){
     setGrosProfitData([...rawData.sort((a,b)=>{
       const nameA=a.grossProfit;
       const nameB=b.grossProfit;
       return nameB-nameA
     })])
   }

   
 }

 if (isPreLoaderRunning){
   return(
     <>

<div style={{width:'100%',height:"100%",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:''}}>
 <SemiPreloader></SemiPreloader>

 </div>




     </>
   )
 }
 


 return(

<>



{
  (subType==='outright' || subType==='premium'  )  ? (
   <>

<section>

<div className='financial-first-line'>

 <div  style={{fontSize:'1.8rem',fontWeight:'600'}}>Product Analysis</div>



 

</div>


<section className='financial-chart-container' style={{margin:'28px auto'}}>

<div className='sales-report-first-line'>
 



<select name="" id="" value={reportType}  onChange={handleReportChange} className='revenue-select'>
<option value="week">Past week</option>
 
<option value="month">Past month</option>

<option value="six-month">Past 6 months</option>
<option value="ytd">Year to date</option>
 <option value="year">Past Year</option>
</select>




</div>





{
 grossProfitData.length>=2 ?(
   <>
   <article className='chart-summary-container' >
<section  className='sales-bar-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Gross Profit per product</div>
<Bar
       data={{
         labels: grossProfitData.map((item) => item.product),
         datasets: [{
           label: 'Percentage Gross Profit',
           data: grossProfitData.map((item) => item.grossProfit),
           backgroundColor: 'blue',
           borderColor: 'blue'
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
               size: 14
             }
           },
           legend: {
             position: 'bottom'
           }
         }
       }}
     />
 
</section>



<section className='item-chart-summary-container'>

 <div className='item-chart-text-container'>
   <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
 <div>High</div>
 <div style={{fontWeight:'500'}}>{parseFloat(highGross).toFixed(2)}</div>
   </div>

   <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
 <div>Low</div>
 <div style={{fontWeight:'500'}}>{parseFloat(lowGross).toFixed(2)}</div>
   </div>


   <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
 <div>Mean</div>
 <div style={{fontWeight:'500'}}>{(totalGross/grossProfitData.length).toFixed(2)}</div>
   </div>


   <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
 <div>Range</div>
 <div style={{fontWeight:'500'}}>{(highGross-lowGross).toFixed(2)}</div>
   </div>
 



 </div>




</section>




 
</article>
   </>
 ):(
   <>
   <article className='chart-summary-container' >
<section  className='sales-bar-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Gross Profit per product</div>
<div className='no-record-container'>

 <p style={{textAlign:'center'}}>No Record to be displayed at this time</p>
 </div>
 
</section>




 
</article>
   
   </>
 )
}






<h5 style={{marginTop:'-50px'}}>Sale Overview </h5>



{
 grossProfitData.length!==0 ?(
   <>
   <select name="" id=""  className='form-select inventory-select' style={{width:'auto',border:'',margin:'1em 0'}}  value={sortOption}  onChange={Sort} >

<option value="" className='form-select-option'>SORT</option>
<option value="res"   className='form-select-option'>RESET</option>
<option value="alph"   className='form-select-option'>SORT BY ALPHABETICAL ORDER</option>
<option value="sku"  className='form-select-option'>SORT BY PRODUCT ID</option>
<option value="hs"   className='form-select-option'>SORT BY HIGHEST SALES</option>
<option value="ls"  className='form-select-option'>SORT BY LOWEST SALES</option>


<option value="hc"   className='form-select-option'>SORT BY HIGHEST COST</option>
<option value="lc"  className='form-select-option'>SORT BY LOWEST  COST</option>



</select>
<section className='sales-table-container'>

    <div className='sales-table-header-container'  style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',backgroundColor:''}}>
     <div className='sales-header'  style={{backgroundColor:''}}>SKU</div>
     <div className='sales-header'> Name</div>
     <div className='sales-header'> Revenue(&#x20A6;)</div>
     <div className='sales-header'>Cost(&#x20A6;)</div> 
     <div className='sales-header'>Profit Margin(&#x20A6;)</div>
     <div className='sales-header'> Gross Profit %</div>
     
    </div>


    <div className='sales-info-table'  >

     {
grossProfitData.map((item,keys,)=>{



return(
 <>

 <div className='sales-info' key={keys}  style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)'}}>
  
 <div className='sales-element'>{item.sku}</div>
 <div  className='sales-element sales-name' >
{item.product.length<25 ?   item.product.charAt(0).toUpperCase() + item.product.slice(1).toLowerCase():item.product.charAt(0).toUpperCase() + item.product.slice(1,25).toLowerCase() + '..'}</div>
 <div  className='sales-element'>{item.sales.toFixed(2)} </div>
 <div  className='sales-element'>{item.cost.toFixed(2)} </div>
 <div  className='sales-element'>{item.margin.toFixed(2)} </div>
 <div  className='sales-element'>{item.grossProfit.toFixed(2)} </div>
 
 


 </div>





 
 
 </>
)

})
     }


    </div>





   </section>



   </>
 ):(
   <>
    <article className='chart-summary-container' style={{marginBottom:'0'}}>
<section  className='sales-bar-container'>


<div className='no-record-container'>

<p style={{textAlign:'center'}}>No Record to be displayed at this time</p>
</div>

</section>






 
</article>

   
   </>
 )
}




{
 pieData.length!=0?(
   <>

   
<article className='chart-summary-container' style={{marginBottom:'0'}}>
<section  className='sales-pie-container'>

<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600',textAlign:'center'}}>Revenue Per Category</div>
<Doughnut
 data={{
   labels: pieData.map((item)=>item._id),
   datasets: [
     {
       data:pieData.map((item)=>((item.sales/total)*100).toFixed(2)) ,
       backgroundColor: ['red', 'blue', 'green'], // Cool tones
       borderColor: ['red', 'blue', 'green'],
     },
   ],
 }}
 options={{
   plugins: {
     title: {
       text: "",
       font: {
         size: 14
       }
       
     },
     
   },elements: {
     arc: {
       borderWidth: 0, // Reduce border width of the doughnut
     },
   },
   
 }}
 
/>
</section>






 
</article>
   </>
 ):(
   <>
      <article className='chart-summary-container' style={{marginBottom:'0'}}>
<section  className='sales-pie-container'>


<div className='no-record-container'>

<p style={{textAlign:'center'}}>No Record to be displayed at this time</p>
</div>

</section>






 
</article>

   
   </>
 )
}






















<h5 style={{marginTop:''}}>Category Overview </h5>


{
 pieData.length!==0 ? (
   <>

<section className='sales-table-container'>

    <div className='sales-table-header-container'  style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',backgroundColor:''}}>
     
     <div className='sales-header'>Category</div>
     <div className='sales-header'> Revenue(&#x20A6;)</div>
     <div className='sales-header'>Cost(&#x20A6;)</div> 
     <div className='sales-header'>Profit Margin(&#x20A6;)</div>
     
     
    </div>


    <div className='sales-info-table'  >

     {
pieData.map((item,keys,)=>{



return(
 <>

 <div className='sales-info' key={keys}  style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)'}}>
  

 <div  className='sales-element sales-name' >
{item._id}</div>
 <div  className='sales-element'>{item.sales.toFixed(2)} </div>
 <div  className='sales-element'>{item.cost.toFixed(2)} </div>
 <div  className='sales-element'>{(item.sales-item.cost).toFixed(2)} </div>
 
 


 </div>






 
 
 </>
)

})
     }


    </div>





   </section>

   </>
 ):(
   <>
   <div className='sales-info-table'  >


   <div className='no-record-container' style={{borderRadius:"8px", boxShadow:"0px 0px 10px rgba(0, 0, 0, 0.3)"}}>

<p style={{textAlign:'center'}}>No Record to be displayed at this time</p>
</div>


</div>
   </>
 )
}















</section>
   











</section>



   
   </>
  ):(
   <>
   
   
   <Upgrade></Upgrade>
   
   
   </>
  )
}




</>



 )





}
