

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



const Revenue=()=>{
 const {prefix,subType}=useGlobal()
 
 const [date, setSelectedDate]=useState(dateValue)
 
 const [reportType,setReportType]=useState('week')
 const [grossProfitData,setGrosProfitData]= useState([])
 const [highGross,setHighGross]=useState(0)
 const [lowGross,setLowGross]=useState(0)
 const [totalGross,setTotalGross]=useState(0)
 const [salesData,setSalesData]=useState([])
 const [costData,setCostData]=useState([])
 const [highSales,setHighSales]=useState(0)
 const [lowSales,setLowSales]=useState(0)
 const [highCost,setHighCost]=useState(0)
 const [lowCost,setLowCost]=useState(0)
 const [totalSales,setTotalSales]=useState(0)
 const [totalCost,setTotalCost]=useState(0)
 const [isPreLoaderRunning,setIsPreLoaderRunning]= useState(false)
 
 
 
 
 
 
 
 
 
 const ArrangeMonth = (month) => {
   switch (month) {
       case 1:
           return 'January';
       case 2:
           return 'February';
       case 3:
           return 'March';
       case 4:
           return 'April';
       case 5:
           return 'May';
       case 6:
           return 'June';
       case 7:
           return 'July';
       case 8:
           return 'August';
       case 9:
           return 'September';
       case 10:
           return 'October';
       case 11:
           return 'November';
       case 12:
           return 'December';
       default:
           return 'Invalid month';
   }
 }
 
 
 
 
 
 
   const fetchAllChartsData= async()=>{
 
 
     //setIsPreLoaderRunning(true)
     const config={
       headers:{
        'Content-Type': 'application/json',
      },
      
      }
 
     try{
 const url=`${prefix}/products/fetch-financial-data/${dateValue}/${reportType}`
 
 const response= await axios.get(url,{withCredentials:true})
 
 
 const sales= response.data.data.line.map((item)=>{
 
 return {time:item._id,sales:item.sales}
 }).sort((a,b)=>{
   const timeA= moment(a.time,'DD-MM-YYYY')
   const timeB= moment(b.time,'DD-MM-YYYY')
 
   return timeA -timeB;
 
 })
 console.log(sales,'waht is sales');
 console.log(response.data.data.line,'waht is sales line');
 
 setSalesData(sales)
 
 
 
 setTotalSales(response.data.data.line.map((item)=>{
   return item.sales
 }).reduce((it,acc)=>{
   return it + acc
 },0))
 
 
 const salesArranged=response.data.data.line.map((item)=>{
   return item.sales
 }).sort((a,b)=>{
   return a-b
 })
 console.log(salesArranged,'sales-arranged');
 setHighSales(parseFloat(salesArranged.slice(-1)))
 setLowSales(parseFloat(salesArranged.slice(0,1)))
 
 
 
 
 
 
 const costs= response.data.data.line.map((item)=>{
 
   return {time:item._id,cost:item.cost}
   }).sort((a,b)=>{
     const timeA= moment (a.time,'DD/MM/YYY')
     const timeB= moment (b.time,'DD/MM/YYY')
 
 
     return timeA-timeB;
 
   })
 
 setCostData(costs)
 
 setTotalCost(response.data.data.line.map((item)=>{
   return item.cost
 }).reduce((it,acc)=>{
   return it + acc
 },0))
 
 
 
 const costArranged=response.data.data.line.map((item)=>{
   return item.cost
 }).sort((a,b)=>{
   return a-b
 })
 
 setHighCost(parseFloat(costArranged.slice(-1)))
 setLowCost(parseFloat(costArranged.slice(0,1)))
 
 
 const gross= response.data.data.bar.map((item)=>{
 
   const month=ArrangeMonth(parseFloat(item._id))
 
   const percentage= parseFloat(item.sales-item.cost/item.sales)
 
 
   return {grossProfit:percentage*100,time:month}
 })
 setGrosProfitData(gross)
 
 
 setTotalGross( gross.map((item)=>item.grossProfit).reduce((it,acc)=>{
   return it + acc
 },0))
 
 setHighGross(parseFloat( gross.map((item)=>item.grossProfit).sort((a,b)=>{
    return a-b
 }).slice(-1)))
 
 
 setLowGross(parseFloat( gross.map((item)=>item.grossProfit).sort((a,b)=>{
   return a-b
 }).slice(1)))
 
 
 
 
 
 
 
 
 
     }
 
     catch(err){
 
 
 
     }
 
 
 
 
 
     
     finally{
    
      setIsPreLoaderRunning(false)
 
     }
 
   }
 
   
 
 
 
   useEffect(()=>{
     if (subType!=='outright' || subType!=='premium'  ){
       return
     }
   
 
     setIsPreLoaderRunning(true)
 
     if (subType==='premium' || subType==='outright'){
       fetchAllChartsData(date,reportType)
     }
       
   
  
   },[date,reportType])
   
   const handleReportChange=(e)=>{
 
     const report= e.target.value
   
     console.log(report,'report');
     setReportType(report)
   
   }
   
 
 if (isPreLoaderRunning){
   return(
   <>
 
 
   <div style={{width:'100%',height:"100%",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:''}}>
   <SemiPreloader></SemiPreloader>
 
   </div>
 
 
   
   </>)
 }
 
 
 
    
 
 
   return(
 
 <>
 
 
 {
   (subType==='premium' || subType==='outright')? (
     <>
     <section>
 
 <div className='financial-first-line'>
 
   <div style={{fontSize:'1.8rem',fontWeight:'600'}}>Revenue Charts</div>
 
 
 
   
 
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
   salesData.length!==0 ? (
     <>
 
 <article className='chart-summary-container'>
 
 <section  className='sales-chart-container'>
 
 <div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Revenue Versus Cost Chart</div>
 
 <Line
   data={
     {
       labels:salesData.map((item)=>item.time),
       datasets:[
         {
           label:'Revenue',
           data:salesData.map((item)=>item.sales),
           backgroundColor:'green',
           borderColor: 'green',
           lineTension: 0.4,
         },
 
         {
           label:'Cost',
           data:costData.map((item)=>item.cost),
           backgroundColor:'red',
           borderColor: 'red',
           lineTension: 0.4,
         },
       ]
     }
   }
 
 style={{width:"90vw",backgroundColor:''}}
 />
 
 
       
 
 </section>
 
 <section className='item-chart-summary-container'>
  <strong className='summary-text-block'>REVENUE</strong>
   <div className='item-chart-text-container'>
     <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Total</div>
   <div style={{fontWeight:'500'}}>{totalSales.toFixed(2)}</div>
     </div>
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>High  </div>
   <div style={{fontWeight:'500'}}>{highSales.toFixed(2)}</div>
     </div>
 
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Low</div>
   <div style={{fontWeight:'500'}}>{lowSales.toFixed(2)}</div>
     </div>
 
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Range</div>
   <div style={{fontWeight:'500'}}>{(highSales-lowSales).toFixed(2)}</div>
     </div>
   
 
 
 
   </div>
 
 
   
 
 
 
 
 </section>
 
 
 
 <br />
 
 
 <section className='item-chart-summary-container'>
  <strong style={{fontSize:'0.8em',}}>COST</strong>
   <div className='item-chart-text-container'>
     <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Total</div>
   <div style={{fontWeight:'500'}}>{totalCost.toFixed(2)}</div>
     </div>
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div  >High</div>
   <div style={{fontWeight:'500'}}>{highCost.toFixed(2)}</div>
     </div>
 
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Low</div>
   <div style={{fontWeight:'500'}}>{lowCost.toFixed(2)}</div>
     </div>
 
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Range</div>
   <div style={{fontWeight:'500'}}>{(highCost-lowCost).toFixed(2)}</div>
     </div>
   
 
 
 
   </div>
 
 
 
 
 </section>
 <br />
 
 
 
 <section className='item-chart-summary-container'>
  <strong style={{fontSize:'0.8em',}}>PROFIT</strong>
   <div className='item-chart-text-container'>
     <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div>Gross Profit</div>
   <div style={{fontWeight:'500'}}> {totalSales.toFixed(2)-totalCost.toFixed(2)}</div>
     </div>
 
     <div  className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div  >Gross Profit Margin</div>
   <div style={{fontWeight:'500'}}>{(((totalSales-totalCost)/(totalSales))*(100)).toFixed(2)}%</div>
     </div>
 
 
    
   
 
 
 
   </div>
 
 
 
 
 </section>
 
 
 </article>
 
     </>
   ):(
     <>
     <article className='chart-summary-container'>
 
 <section  className='sales-chart-container'>
 <div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Revenue Versus Cost Chartss</div>
 
   <div className='no-record-container'>
 
   <p style={{textAlign:'center'}}>No Record to be displayed at this time</p>
   </div>
 
 
 
       
 
 </section>
 
 
 
 
 
 
 
 
 
 
 
 
 
 </article>
 
     
     </>
   )
 }
 
 
 
 
 
 
 
 
 
 
 
 
 {
   grossProfitData.length>=2 ?(
     <>
 
 <article className='chart-summary-container' >
 <section  className='sales-bar-container'>
 <div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Gross Profit Data  Chart</div>
 
 
 
 <Bar
         data={{
           labels: grossProfitData.map((item) => item.time),
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
                 size: 12
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
 <div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Gross Profit Data  Chart</div>
 
 <div className='no-record-container'>
 
 <p style={{textAlign:'center'}}>No Record to be displayed at this time</p>
 </div>
 
 
 </section>
 
 
 
 
 
 
 
   
 </article>
 
     
     
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
 