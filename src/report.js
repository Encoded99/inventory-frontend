






import React, { useState, useEffect,useRef, } from 'react'
import moment from 'moment-timezone';

import { Line,Bar,Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Link, useNavigate } from 'react-router-dom';
//import {shoes, } from './context'
import { useGlobal, input } from './context';
import { SemiPreloader } from './preloader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faBell, faCog, faTachometerAlt, faBoxes, faHistory, faClipboardList, faChartLine,faChartPie,faChartBar,faBoxOpen } from '@fortawesome/free-solid-svg-icons';





import axios from 'axios';

import Upgrade from './upgrade';
import LayOut from './lay-out';
const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);




const Product=()=>{
  const {prefix,subType,isPreLoaderRunning,setError,error}=useGlobal()

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
const [isLoading,setIsLoading]=useState(true)
const navigate=useNavigate()




  const fetchAllChartsData= async()=>{


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
const url=`${prefix}/products/fetch-product-data/${dateValue}/${reportType}`

const response= await axios.get(url,{withCredentials:true})






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

    catch(error){

      if (axios.isCancel(error)) {
        console.log('Axios canceled the request mccoy');
        setError('Request timed out. Please try again.');
        return;
    }

       if (error.response) {
          if (error.response.data.message === 'unauthorized' && error.response.data) {
              navigate('/log-in');
              setError(error.response.data.message);
          }}

          if (error.request) {

      

            setError('Oops, something went wrong, try again.');
            return
        }
  
        setError('Oops, something went wrong, try again.');
    

    }





    
    finally{
      clearTimeout(timeOutId);
 setIsLoading(false)

    }

  }



  useEffect(()=>{

    if (subType==='outright' || subType==='premium'){
      fetchAllChartsData(date,reportType)

      
    }

  
      
  
 
  },[date,reportType,isPreLoaderRunning])
  
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








  if (isLoading || isPreLoaderRunning){
    return(
      <>

<div style={{width:'100%',height:"100%",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:''}}>
  <SemiPreloader></SemiPreloader>

  </div>

      </>
    )
  }








  if(subType!=='outright' && subType!=='premium' && subType!==''){
    return (
      <>
    
     
   <Upgrade></Upgrade>
    
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




  
<section className='whole-financial-container'>

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
<section  className='sales-chart-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Gross Profit per product</div>

<div className='sales-inner-scrollable' style={{backgroundColor:""}}>

<article className='sales-inner-container'  style={{width:`${grossProfitData.length*100}px`,backgroundColor:""}}>
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


</article>

</div>

  
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


<select name="" id=""  className='form-select inventory-select 
 sale-select' style={{width:'auto',border:'',margin:'1em 0'}}  value={sortOption}  onChange={Sort} >

<option value="" className='form-select-option'>SORT</option>
<option value="res"   className='form-select-option'>RESET</option>
<option value="alph"   className='form-select-option'>NAME</option>
<option value="sku"  className='form-select-option'>PRODUCT ID</option>
<option value="hs"   className='form-select-option'>HIGHEST SALES</option>
<option value="ls"  className='form-select-option'>LOWEST SALES</option>


<option value="hc"   className='form-select-option'>HIGHEST COST</option>
<option value="lc"  className='form-select-option'>LOWEST  COST</option>



</select>

<article className='financial-sales-overview-container'>
<article className='report-prduct-main-sales-container'>

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



</article>
   









</article>





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

<div className='report-pie-holder'>
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

</div>

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

<article className='financial-category-overview-container'>
<article className='report-category-overview-sales-container'>

<section className='sales-table-container'>

     <div className='sales-table-header-container'  style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',backgroundColor:''}}>
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

  <div className='sales-info' key={keys}  style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)'}}>
   
  <div className='sales-element'> {item._id}  </div>
  <div  className='sales-element' >{item.sales.toFixed(2)} </div>
  <div  className='sales-element'>{item.cost.toFixed(2)}  </div>
  
  <div  className='sales-element'>{(item.sales-item.cost).toFixed(2)} </div>
  
  
  
 

  </div>





  
  
  </>
 )

})
      }


     </div>





    </section>



</article>
   









</article>















</section>
    











</section>



    
    </>
   









  )





}










const Charts=()=>{
const {prefix,subType,isPreLoaderRunning,error,setError}=useGlobal()

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
const [isLoading,setIsLoading]=useState(true)


const navigate= useNavigate()








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






    const source = axios.CancelToken.source();

    const timeOutId = setTimeout(() => {
     
        source.cancel('Request timed out');
    }, 180000);











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

    catch(error){
      

      if (axios.isCancel(error)) {
        console.log('Axios canceled the request mccoy');
        setError('Request timed out. Please try again.');
        return;
    }

       if (error.response) {
          if (error.response.data.message === 'unauthorized' && error.response.data) {
              navigate('/log-in');
              setError(error.response.data.message);
          }}

          if (error.request) {

      

            setError('Oops, something went wrong, try again.');
            return
        }
  
        setError('Oops, something went wrong, try again.');











    }





    
    finally{
      clearTimeout(timeOutId);
   
   setIsLoading(false)

    }

  }

  



  useEffect(()=>{
  
   
    console.log('use effect passed  start',isPreLoaderRunning,'is preloader running anyway')

   

    if ((subType==='premium' || subType==='outright') && (!isPreLoaderRunning)){
      fetchAllChartsData(date,reportType)
    }

    else{
      console.log('use effect you passed the retrun but wwe cant fetch ubtype is worng', subType)
    }
      

 
  },[date,reportType,isPreLoaderRunning])
  
  const handleReportChange=(e)=>{

    const report= e.target.value
  
    setReportType(report)
  
  }
  

if (isLoading || isPreLoaderRunning){
  return(
  <>


  <div style={{width:'100%',height:"100%",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:''}}>
  <SemiPreloader></SemiPreloader>

  </div>


  
  </>)
}

if(subType!=='outright' && subType!=='premium' && subType!==''){
  return (
    <>
  
   
 <Upgrade></Upgrade>
  
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
    <section style={{backgroundColor:""}}>

<div className='financial-first-line'>

  <div style={{fontSize:'1.8rem',fontWeight:'600'}}>Revenue Charts</div>



  

</div>


<section className='financial-chart-container' style={{margin:'28px auto',backgroundColor:""}}>

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
<div className='sales-inner-scrollable'>
<article className='sales-inner-container'  style={{width:`${salesData.length*100}px`}}>
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

style={{width:"",backgroundColor:''}}
/>

  </article>

</div>



      

</section>

<section className='item-chart-summary-container'>
 <strong className='summary-text-block item-chart-header'>REVENUE</strong>
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
 <strong className='item-chart-header' style={{fontSize:'0.8em',}}>COST</strong>
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
 <strong className='item-chart-header' style={{fontSize:'0.8em',}}>PROFIT</strong>
  <div className='item-chart-text-container'>
    <div className='summary-text-block' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <div>Gross Profit</div>
  <div style={{fontWeight:'500'}}> {(totalSales-totalCost).toFixed(2)}




</div>
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
<section  className='sales-chart-container'>
<div className='font-sub-heading' style={{fontSize:'1.2rem',fontWeight:'600'}}>Gross Profit Data  Chart</div>

<div className='sales-inner-scrollable'>
<article className='sales-inner-container'  style={{width:`${grossProfitData.length*100}px`}}>

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
  



</article>

</div>

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
  


  )




}








const Financials=()=>{


  const {prefix,minstance,setMinstance}= useGlobal()
 

  
  const [salesTotal,setSalesTotal] =useState(0)
 
 
  const  [costOfGoodsSold,setCostofGoodsSold] =useState(0)
 const [allData,setAllData]=useState([])
  const [operatingExpenses, setOperatingExpenses] = useState('');

  const [reportType,setReportType]=useState('month')

  const [netProfit, setNetProfit] = useState(null);
 const [isPreLoaderRunning,setIsPreLoaderRunning] =useState(false)
  const fetchSales= async(report)=>{

   // setIsPreLoaderRunning(true)
   const presentTime= Date.now()
   const presentDate= new Date(presentTime)

  
    
    const config={
      headers:{
       'Content-Type': 'application/json',
     },
     
     }
    
    
      try{
    
        const url=`${prefix}/products/fetch-revenue-monthly/${presentDate}/${report}`
    console.log(report,'statham')
    
    
        const response=  await axios.get(url,{withCredentials:true})
    
        const t= response.data.revenue[0]
    
  
       setAllData(response.data.revenue)
       
       
       setSalesTotal(t.sales)
  
  
  
       setCostofGoodsSold(t.cost)
  
  
      }
    
    
      catch(err){
    
        
    
      }
  
  
      finally{
     
     setIsPreLoaderRunning(false)
  
      }
    }
    
    
  
  
  
  
    
   
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
      useEffect(()=>{
        setIsPreLoaderRunning(true)
        
        fetchSales(reportType)
     
      },[reportType])
      
  
  
  
  
  
  
  
  
  
  
  
  const grossProfit = salesTotal - costOfGoodsSold;
  
  
  
  
  
  const calculateNetProfit=()=>{
    setNetProfit(salesTotal-costOfGoodsSold-operatingExpenses)
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






{
  allData.length!==0 ? (
  
  <>
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
  
  
  </>
  
):(
  <>
 <div className="gross-profit-calculator">
<h6  style={{textAlign:'center'}}>No sales records available for the selected time period, please check another time</h6>   
    </div> 
  
  </>
)
}






















</section>

  
  
  
  </>
)



}









const Report =()=>{

  const {minstance,  setMinstance,setLink} =useGlobal()








useEffect(()=>{

  const storedMinstance= sessionStorage.getItem('m-instance')
  if (storedMinstance){
    console.log('stored-minstance-not-found   yes',storedMinstance)
    setMinstance(storedMinstance)
  }

  else{

    console.log('stored-minstance-not-found   no')
    setMinstance('financials')

     sessionStorage.setItem('m-instance','financials')

  }
  setLink("report")

},[setMinstance, setLink])























 

 return(
  <>
  
  <LayOut>

<main className='financials-container'>

<div className='inv-name-container'>
  <section className='report-product-item-container'>
<button  className={minstance==='financials'?'onfocus btn btn-primary report-pr':'btn btn-primary product-item-btn report-pr'}   onClick={()=>{setMinstance('financials');sessionStorage.setItem('m-instance','financials')}}>Revenue Analysis</button>
<button  className={minstance==='chart'?'onfocus btn btn-primary report-pr':'btn btn-primary product-item-btn report-pr'}   onClick={()=>{setMinstance('chart');sessionStorage.setItem('m-instance','chart')}}>Revenue Charts</button>
<button  className={minstance==='product'?'onfocus btn btn-primary report-pr':'btn btn-primary product-item-btn report-pr'}  onClick={()=>{setMinstance('product');sessionStorage.setItem('m-instance','product')}}>Product Analysis And Charts</button>
  


   </section>

   <section className='mobile-report-product-item-container'>
      <button
        className={minstance === 'financials' ? 'onfocus btn btn-primary report-pr' : 'btn btn-primary product-item-btn report-pr'}
        onClick={() => { setMinstance('financials'); sessionStorage.setItem('m-instance', 'financials'); }}
      >
        <FontAwesomeIcon icon={faChartPie} />
      </button>
      
      <button
        className={minstance === 'chart' ? 'onfocus btn btn-primary report-pr' : 'btn btn-primary product-item-btn report-pr'}
        onClick={() => { setMinstance('chart'); sessionStorage.setItem('m-instance', 'chart'); }}
      >
        <FontAwesomeIcon icon={faChartBar} />
      </button>
      
      <button
        className={minstance === 'product' ? 'onfocus btn btn-primary report-pr' : 'btn btn-primary product-item-btn report-pr'}
        onClick={() => { setMinstance('product'); sessionStorage.setItem('m-instance', 'product'); }}
      >
        <FontAwesomeIcon icon={faBoxOpen} />
      </button>
    </section>
  
  
  </div>





<section>


{
  minstance==='chart' &&(
    <>
    
    <Charts></Charts>
    </>
  )
}

{
  minstance==='product' &&(
    <>
    
<Product></Product>
    </>
  )
}




{
  minstance==='financials'  && (
    <>
    
   <Financials></Financials>
    
    </>
  )
}



  
</section>














</main>





  </LayOut>
  
  
  </>
 )





}


export default Report