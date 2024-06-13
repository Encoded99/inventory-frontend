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


const Financials=()=>{


 const {prefix, setIsPreLoaderRunning}= useGlobal()


 const [date, setSelectedDate]=useState(dateValue)
 const [salesTotal,setSalesTotal] =useState(0)


 const  [costOfGoodsSold,setCostofGoodsSold] =useState(0)

 const [operatingExpenses, setOperatingExpenses] = useState('');

 const [reportType,setReportType]=useState('month')

 const [netProfit, setNetProfit] = useState(null);

 const fetchSales= async(date,report)=>{

  // setIsPreLoaderRunning(true)
 
   
   const config={
     headers:{
      'Content-Type': 'application/json',
    },
    
    }
   
   
     try{
   
       const url=`${prefix}/products/fetch-revenue-monthly/${date}/${report}`
   
       const response=  await axios.get(url,{withCredentials:true})
   
       const t= response.data.revenue[0]
   
     
 
      
      
      
      setSalesTotal(t.sales)
 
 
 
      setCostofGoodsSold(t.cost)
 
 
     }
   
   
     catch(err){
   
       
   
     }
 
 
     finally{
    
     //  setIsPreLoaderRunning(false)
 
     }
   }
   
   
 
 
 
 
   
  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
     useEffect(()=>{
       
       fetchSales(date,reportType)
    
     },[reportType,date])
     
 
 
 
 
 
 
 
 
 
 
 
 const grossProfit = salesTotal - costOfGoodsSold;
 
 
 
 
 
 const calculateNetProfit=()=>{
   setNetProfit(salesTotal-costOfGoodsSold-operatingExpenses)
 }
 
 
return(
 <>
 
 <section className='report-main-section'>


<div className='financial-first-line'>

<div style={{fontSize:'1.8rem',fontWeight:'600'}}>Financials</div>




<div className='check-box-container'>
<div style={{fontSize:'0.9em',fontWeight:'400'}}>TOTALS</div>
<div style={{height:'1px',width:'100%',}} className='line'></div>

<div>
<input type="checkBox" name='report' onChange={()=>setReportType('month')}  checked={reportType==='month'} />  Monthly
</div>
<div>
<input type="checkBox" name='report'  onChange={()=>setReportType('quarter')} checked={reportType==='quarter'} /> Quarterly
</div>
<div>
<input type="checkBox" name='report' onChange={()=>setReportType('year')}  checked={reportType==='year'} />  Yearly
</div>



</div>




</div>









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

 {
   salesTotal!==0 ? (
     <>
 <div className="result">Percentage Profit: <strong>  {   ((grossProfit/salesTotal)*100).toFixed(2)}% </strong>  </div>
     </>
   ):(
     <>
       <div className="result">Percentage Profit: <strong> No sales record at this time </strong>  </div>
     </>
   )
 }



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







</section>

 
 
 
 </>
)



}
