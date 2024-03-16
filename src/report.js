import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


//import {shoes, } from './context'
import { useGlobal, input } from './context'

import axios from 'axios'


import LayOut from './lay-out';
const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);



const Report =()=>{

 const {prefix,inventoryQuantity,setInventoryQuantity,       setIsPreLoaderRunning}= useGlobal()
 

 const [date, setSelectedDate]=useState(dateValue)
 const [salesTotal,setSalesTotal] =useState(0)
 const [salesQuantity,setSalesQuantity]=useState(0)
 const [costTotal,setCostsTotal]= useState(0)

 const [operatingExpenses, setOperatingExpenses] = useState('');
 const [netProfit, setNetProfit] = useState(null);

 const reportType='month'





 const fetchSales= async(date,report)=>{

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
  
    
  
      const tot= response.data.map((item)=>item.salesData.cost).reduce((acc,cv)=>{
       return acc + cv
     },0)
     
     setSalesTotal(tot)

     const quantity= response.data.map((item)=>item.salesData.quantity).reduce((acc,cv)=>{
      return acc + cv
    },0)

    setSalesQuantity(quantity)
    setIsPreLoaderRunning(false)

    }
  
  
    catch(err){
  
      
  
    }
  }
  
  




  
 const fetchCosts= async(date,report)=>{



  
  const config={
    headers:{
     'Content-Type': 'application/json',
   },
   
   }
  
  
    try{
  
      const url=`${prefix}/products/fetch-costs/${date}/${report}`
  
      const response=  await axios.get(url,{withCredentials:true})
  
      const t= response.data
  
  
 
     // setSalesRecordData(response.data)
  
      const tot= response.data.map((item)=>item.costsData.cost).reduce((acc,cv)=>{
       return acc + cv
     },0)

   
     setCostsTotal(tot)

    }
  
  
    catch(err){
  
     
  
    }
  }
  


















const fetchUnwindAllProducts=async()=>{


  


  const url=`${prefix}/products/unwind-verified`


      try {

        const response= await axios.get(url,{withCredentials:true})
   



const unwindInventoryData=response.data.data.products






    
  
  
  
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
  
  
  
  const totalQuantity= newStructuredArray.map((item)=>item.inventoryData.quantity).reduce((acc,cv)=>{
  return acc+cv
  },0)
  

  
  
  
  setInventoryQuantity(totalQuantity)
  
  
 
  
  
  

  setIsPreLoaderRunning(false)


       
      }


      catch(err){
      
      }
    }







    useEffect(()=>{
      
      fetchSales(date,reportType)
      fetchCosts(date,reportType)
      fetchUnwindAllProducts()
    },[])
    









const averageCostPerUnit = costTotal / (inventoryQuantity + salesQuantity);


const costOfGoodsSold = averageCostPerUnit * salesQuantity;
const grossProfit = salesTotal - costOfGoodsSold;





const calculateNetProfit=()=>{
  setNetProfit(salesTotal-costOfGoodsSold-operatingExpenses)
}



 return(
  <>
  
  <LayOut>

<main className='financials-container'>


<p style={{fontSize:'3em',textAlign:'center',margin:'0.0em 0'}}>Monthly Financial Report</p>


<div className="gross-profit-calculator">
          <h2>Gross Profit Calculator</h2>

          <label htmlFor="totalRevenue">Total Revenue(&#x20A6;):</label>
          <input type="number" id="totalRevenue" placeholder="Enter total revenue" style={{marginLeft:'0%'}} className='form-control financials-input' required  value={salesTotal.toFixed(2)}/>
               <br />
          <label htmlFor="cogs" style={{marginLeft:'0%'}}>Cost of Goods Sold (COGS)(&#x20A6;):</label>
          <input type="number" id="cogs" placeholder="Enter cost of goods sold" required className='form-control financials-input' value={costOfGoodsSold.toFixed(2)} style={{marginLeft:'0%'}}/>
            <br />
          <div className="result">Gross Profit:   <strong>&#x20A6;{grossProfit.toFixed(2)} </strong>   </div>

          <div className="formula">Formula: Gross Profit = Total Revenue - COGS</div>
        </div>

        <div className="profit-margin-indicator">
      <h2>Percent Profit Indicator</h2>

      <div className="result">Percentage Profit: <strong> {((grossProfit/salesTotal)*100).toFixed(2)}% </strong>  </div>

      <div className="formula">Formula: Percentage Profit = (Gross Profit / Total Revenue) * 100</div>
    </div>






        <div className="net-profit-calculator">
      <h2>Net Profit Calculator</h2>

      <label htmlFor="operatingExpenses">Operating Expenses(&#x20A6;):</label>
      <input
      className='form-control financials-input operating-cost-input'
        type="number"
        id="operatingExpenses"
        placeholder="Enter operating expenses"
        value={operatingExpenses}
        onChange={(e)=>setOperatingExpenses(e.target.value)}
        required
      />
   <br />
      <button  className='btn btn-secondary' style={{marginLeft:'0%'}}    onClick={calculateNetProfit}>Calculate Net Profit</button>
       
      {netProfit !== null && (
        <div className="result">Net Profit:  <strong> &#x20A6;{netProfit.toFixed(2)} </strong></div>
      )}
       
      <div className="formula">
        Formula: Net Profit = (Total Revenue - COGS) - Operating Expenses
      </div>
    </div>






        <div className="profit-margin-indicator">
      <h2>Profit Margin Indicator</h2>
{
  netProfit && (
    <>
      <div className="result">Profit Margin: <strong>{((netProfit/salesTotal)*100).toFixed(2)}%  </strong>   </div> 
    
    </>
  )
}
   

      <div className="formula">Formula: Profit Margin = (Net Profit / Total Revenue) * 100</div>
    </div>








</main>





  </LayOut>
  
  
  </>
 )





}


export default Report