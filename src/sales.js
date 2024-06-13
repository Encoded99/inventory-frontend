import React, { useState, useEffect,useRef, } from 'react';
import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineDelete } from 'react-icons/ai';
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { HiMenu } from 'react-icons/hi';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useGlobal, input } from './context'
import { FaSearch, FaTimes, FaPlus,FaDragon,FaClock  } from 'react-icons/fa'; 
import { IoMdPrint } from 'react-icons/io';
import { Response } from './lay-out';
import axios from 'axios'
import { Vortex,RotatingLines } from 'react-loader-spinner';

import LayOut from './lay-out';


let cot=true

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const date = new Date(timestampInSeconds * 1000);
const formattedDate = date.toLocaleString();






const Table=({index})=>{

 const {tables,setTables,setFinalCost,colate,setCollatedData,prefix,setLoadingMessage,loadingMessage,apiError,setApiError,resetLoadingText,shopGroup,shopDetails,isHelpShown,setIsHelpShown,}=useGlobal()
const [ID,setID]=useState('')
const [name,setName]=useState('')
const [packages, setPackages] = useState('');
const [quantity, setQuantity] = useState(0);
const [cost, setCost] = useState(0);

const [unitPerBulk,setUnitPerBulk]= useState(null)
const [ppu, setPpu] = useState(0);

const [searchData,setSearchData]= useState([])
const [price,setPrice]= useState({})
const [isSearchHidden, setIsSearchHidden]= useState(true)
const [isSearching,setIsSearching]= useState(false)
const [stockQuantityPieces,setStockQuantityPieces] =useState(0)
const [stockQuantityBulk,setStockQuantityBulk] =useState(0)
const [error, setError]= useState('')
const [help,setHelp] =useState(false)
const [isSearchButtonClicked,setIsSearchButtonClicked]=useState(false)













const  handleChangePackage=(e)=>{





  if (!name || !ID){
    setError('name')
  
    return
  }

  if(error){
    setError('')
  }

setPackages(e.target.value)


}



useEffect(()=>{

  if (packages==='bulks'){

      if (shopDetails.autoPrice===false){
  
        return
      }
    setPpu(price.bulkPrice);
  
}

else if (packages==='pieces'){
 
  if (shopDetails.autoPrice===false){
    return
  }

  setPpu(price.piecesPrice);

}

},[handleChangePackage])


const  handleChangeQuantity=(e)=>{


  if (!packages){
    setError('packages')
  
    return
  }


  if(error){
    setError('')
  }

  
  
  const inputValue = e.target.value;

  // Replace any characters other than digits and dot with an empty string
  let sanitizedInput = inputValue.replace(/[^\d.]/g, '');

  // Ensure there's at most one dot
  const dotCount = sanitizedInput.split('.').length - 1;

  // Check if the input value is empty or has only one dot
  if (dotCount <= 1) {
    // Convert the sanitized input to a float
    const quantity = parseFloat(sanitizedInput);
    
    // Check if the quantity is a number (not NaN) and non-negative
    if (!isNaN(quantity) && quantity >= 0) {
      // Update state with the sanitized input
      setQuantity(sanitizedInput);
    } else {
      // Handle case where input is not valid or empty
      setQuantity(''); // Set quantity to empty string
    }
  }



}



const calculate = () => {



if(quantity<=0 && packages){
  setError('zero')

 
}



if(cot===true){
  cot=false
}

else{
  cot=true
}


if (shopDetails.autoPrice===true){
  if ( packages === 'bulks') {



    let bulkCost = price.bulkPrice * quantity;
  






    setCost(bulkCost);
   
  } else if ( packages === 'pieces') {


    let piecesCost = price.piecesPrice * quantity;
  //  setPpu(specificData.price.pieces);

  if (shopGroup==='group-2'){
    piecesCost = price.piecesPrice * parseInt(quantity);
  }
    setCost(piecesCost);
   
  }

  else {
    return
  }

}

else{
  const cost =ppu*quantity
  setCost(cost);

}





 
};






const bodyGrey='hsl(0,0%,90%)'






const totalCalculate=()=>{

  


  
  const inputCost=document.querySelectorAll('.cost')

  const cost=   Array.from(inputCost).map((input)=>parseFloat(input.value)).filter((numbers)=>numbers!==0)



const sum=cost.reduce((accumulator,currentValue)=>{
  return accumulator+currentValue

},0)
setFinalCost(sum)



const inputPackages=document.querySelectorAll('.package')

  const packages=   Array.from(inputPackages).map((input)=>input.value).filter((text)=>text!=='')

  
  const inputPpu=document.querySelectorAll('.ppu')

  const ppu=   Array.from(inputPpu).map((input)=>parseFloat(input.value)).filter((numbers)=>numbers!==0)



  
  const inputQuantity=document.querySelectorAll('.quantity')

  let quantity=   Array.from(inputQuantity).map((input)=>parseFloat(input.value)).filter((numbers)=>numbers!==0)

  if(shopGroup==='group-2'){
    quantity=   Array.from(inputQuantity).map((input)=>parseInt(input.value)).filter((numbers)=>numbers!==0)
  }


  
  const inputID=document.querySelectorAll('.ID')

  const id=   Array.from(inputID).map((input)=>input.value).filter((text)=>text!=='')

  const inputName=document.querySelectorAll('.name')

  const name=   Array.from(inputName).map((input)=>input.value).filter((text)=>text!=='')



  const inputData= cost.concat(packages,ppu,quantity,id,name)


  setCollatedData(inputData)






  

}







const removeTable=(index)=>{

  if(cot===true){
    cot=false
  }
  
  else{
    cot=true
  }
  

  const updatedTable= [...tables]

  const removedTable = updatedTable.filter((table,id) => id !== index);
  setTables(removedTable);


 


}






useEffect(() => {

if (packages === 'bulks'){

  if(quantity>stockQuantityBulk){
  //  alert('the quantity selected is more than the quantity of item in stock')
  setCost(0)
  setFinalCost(0)
  setError('bulks')
    return
  }
  

}


else if ( packages === 'pieces'){

  if(quantity>stockQuantityPieces){
   // alert('the quantity selected is more than the quantity of item in stock')
  setCost(0)
  setFinalCost(0)
  setError('pieces')
    return
  }
  


}

if (quantity===0){
  return
}

 
  calculate();
 // totalCalculate()
}, [quantity,index,packages]);

useEffect(() => {


  



  if (packages === 'bulks'){

    if(quantity>stockQuantityBulk){
    //  alert('the quantity selected is more than the quantity of item in stock')
    setCost(0)
  setFinalCost(0)
  setError('bulks')
      return
    }
    
  
  }
  
  
  else if ( packages === 'pieces'){
  
    if(quantity>stockQuantityPieces){
     // alert('the quantity selected is more than the quantity of item in stock')
     setCost(0)
     setFinalCost(0)
     setError('pieces')
      return
    }
    
  
  
  }




  totalCalculate()



}, [cot]);







const handleSearch=async()=>{


  if (name===''){
    return
  }
  

setPackages('')
setPpu('')
setID('')
setName('')
setIsSearching(true)
setLoadingMessage('searching...')
setIsSearchHidden(true)

setIsSearchButtonClicked(true)
   const config = {
     headers: {
       'Content-Type': 'application/json',
     },
     withCredentials:true
   };
 
   const encodedSearchInput = encodeURIComponent(name);
   if(encodedSearchInput===''){
     return
   }
   
   try{
     const url=`${prefix}/products/search?query=${encodedSearchInput}`
     const response= await axios.get(url,config)
    
     if (response.status===200){

      if(response.data.data.products.length===0){
        setApiError(true)
        setLoadingMessage('No item Found')
        resetLoadingText()
        return
      }
      
    setApiError(false)
    
      setSearchData(response.data.data.products)
   
     
     
setIsSearching(false)
     setIsSearchHidden(false)
setLoadingMessage('')
      
     }
 
   }
 
   catch(error){

    setApiError(true)
    if(error.response){
     setLoadingMessage(error.response.data.message)
    }
  
  else if(error.request){
  
  setLoadingMessage('error processing request, try again')
  
  }
  
  
  else{
  setLoadingMessage(error.message)
  }



   }











 
 }

 const handlePPU= (e)=>{

  if(shopDetails.autoPrice===false){
    setPpu(e.target.value)
  }

 }











 return(
<>




    <main className='product-sales-table-container'>





<div  className={shopGroup!=='group-2'?'product-sales-table':'rem-product-sales-table'}>

 
 <div className='product-sales-title' >Product name</div>
 <div className='product-sales-title' >Product ID</div>

 {
  shopGroup!=='group-2' && (
    <>
     <div   className='product-sales-title'>Package</div>
    </>
  )
 }

 <div   className='product-sales-title'>Price per Unit  (&#x20A6;)</div>
 <div   className='product-sales-title'>Quantity</div>

 <div   className='product-sales-title'>Cost (&#x20A6;)</div>
 <div   className='product-sales-title'>Remove</div>


</div>






<div  style={{marginBottom:(isHelpShown && window.innerWidth<=550)?'50px':"5px"}}     className={shopGroup!=='group-2'?'product-sales':'rem-product-sales'}  >



<div style={{backgroundColor:'',}} className='name-container'>



<div className='second-combo-box position-name ' style={{width:'100%',border:'1px solid transparent',borderTopLeftRadius:"5px"}} >


  {
    name=='' && !isSearchButtonClicked && (
      <>
      <section className='name-chat-container'>
<div class="chat-box">
  <div class="pointer"></div>
  <div class="message">type for the item you want to sell in this input field and click on the blue button to search for it</div>
</div>

</section>
      
      </>
    )
  }



 <input type="text" placeholder='' className='combo-input typeahead name form-control' style={{boxShadow:'none',width:"80%", border:'1px solid gray',borderRadius:'0%',borderRight:"none",borderTopLeftRadius:"5px",borderBottomLeftRadius:'5px'}} value={name} onClick={()=>setError('')}  onChange={(e) => {
    setName(e.target.value);
    setError('');
    setIsHelpShown(false)
  }}/>




  <button className='btn btn-primary  combo-btn'   style={{boxShadow:'none',width:"20%",border:'1px solid transparent'}} onClick={handleSearch}>
    <div className='combo-search' >
      <FaSearch     className='main-combo-search'/>
    </div>
  </button>

  
</div>




</div>




<div className='product-sales-container'>
<input type="text"  className='combo-input typeahead  ID form-control' style={{boxShadow:'none',width:"95%"}} value={ID}  onChange={(e)=>setID(e.target.value)}/>

</div>

















{
    shopGroup!=='group-2' && (
    
    <>
    
    <div className='product-sales-container'>




{
    packages=='' && help  && (
      <>
 <section class="package-chat-container">
    <div class="chat-box">
      <div class="pointer"></div>
      <div class="message">Select the package you want to sell</div>
    </div>
  </section>
      </>
    )
  }







 






  <select

  
    name=""
    id=""
    className='combo-select form-select position-select package h-100'
    style={{ boxShadow: 'none', border: '', borderRadius: '5px', width: "100%", borderLeft: "none" }}
    value={packages}
    onChange={handleChangePackage}
  >


    <option value=""></option>
    <option value={'bulks'} onClick={()=>setPackages('bulks')}>Bulk</option>
    <option value={'pieces'} onClick={()=>setPackages('pieces')}>Pieces</option>
  </select>


</div>

    
    </>
  )
}






<div className='product-sales-container'>

{
    packages!=='' && ppu==='' && shopDetails.autoPrice===false  && (
      <>
 <section className='quantity-chat-container'>
<div class="chat-box">
  <div class="pointer"></div>
  <div class="message">Input price</div>
</div>

</section>
      </>
    )
  }




<input type="number"  className='combo-input typeahead  ppu form-control' style={{boxShadow:'none',width:"95%"}} value={ppu}  onChange={(e)=>handlePPU(e)}/>

</div>





<div className='product-sales-container  ' >

{
    packages!=='' && ppu!=='' && quantity===0  && (
      <>
 <section className='quantity-chat-container'>
<div class="chat-box">
  <div class="pointer"></div>
  <div class="message">Input quantity</div>
</div>

</section>
      </>
    )
  }



<input type="text"   className={quantity===''?"combo-input position-quantity typeahead quantity form-control hide-input-text":"combo-input position-quantity typeahead quantity form-control"}    style={{boxShadow:'none',width:"95%"}}   onChange={handleChangeQuantity}     value={shopGroup==='group-1'?`${quantity}`:`${parseInt(quantity)}`}/>




</div>





<div className='product-sales-container'>
<input type="number" min={0}  className='combo-input cost typeahead form-control' style={{boxShadow:'none',width:"95%"}} value={cost}/>

</div>

<div className='product-sales-container' style={{display:"flex",justifyContent:'center', alignItems:'center',marginRight:"0%"}}>
  
   <AiOutlineDelete style={{cursor:"pointer"}} size={35} onClick={()=>removeTable(index)}></AiOutlineDelete>

   

</div>






</div>


{

  isSearching && (
    <>
   <Response></Response>
    
    </>
  )
}




{
  !isSearchHidden && (

<>


<div className='sale-search-item-section  position-search'>

<section className='search-chat-container'>
<div class="chat-box">
  <div class="pointer"></div>
  <div class="message">click on the name of the item you want to sell</div>
</div>

</section>


{
  searchData.length!==0 ?(
    <>
   


  
    
    {

searchData.map((item,index)=>{
 const {name, sku,_id,currentPrice,inventoryData,upb}= item
 const availableQuantity= inventoryData.map((item)=>item.quantity).reduce((acc,cv)=>{
  return acc + cv
 },0)
 return (

 <>
<div   className={shopGroup!=='group-2'?"sale-search-container":"rem-sale-search-container"}    onClick={() => {
 setID(_id);
 setName(name);
 setPrice(currentPrice);
 setIsSearchHidden(true)
 setStockQuantityPieces(availableQuantity)
 setStockQuantityBulk(availableQuantity/upb)
 setUnitPerBulk(upb)
 setHelp(true)
 setIsHelpShown(true)
 if(shopGroup==='group-2'){
  setPackages('bulks')
 }
}}     key={index}>
 <div className='sale-table-block' >ID</div>

<div className='sale-table-block' >Item-Name</div>
<div className='sale-table-block'  >{shopGroup!=='group-2'?' Quantity in Stock (bulk)':' Quantity in Stock'}</div>
{
  shopGroup!=='group-2' && (
    <>
    <div className='sale-table-block' > Quantity in Stock (pieces)</div>
    
    </>
  )
}

<div style={{textAlign:'center',cursor:"pointer",fontWeight:'bold',fontSize:"0.8em"}} >{sku}</div>
<div style={{textAlign:'center',cursor:'pointer',fontWeight:'bold',fontSize:"0.8em",fontSize:"0.8em"}} >{name}</div>
<div style={{textAlign:'center',cursor:'pointer',fontWeight:'bold'}} >{(availableQuantity/upb).toFixed(1)}</div>



{
  shopGroup!=='group-2' && (
    <>
    <div style={{textAlign:'center',cursor:'pointer',fontWeight:'bold',fontSize:"0.8em"}} >{availableQuantity}</div>
    </>
  )
}




    

</div>
 

 
 </>
 )
})
}
    

    </>
  ):(
    <>
    
    <div className='' style={{textAlign:'center',margin:"1em 0",width:'25vw', backgroundColor:bodyGrey}}> <strong>  No Item Found </strong></div>
    
    
    
    </>
  )
}










</div>






</>





  )
}

{

error==='name' &&(
  <>
  
  <div className='alert-danger alert  alert-problem' style={{textAlign:'center',margin:'2vh 0'}}>

<strong>please select a product </strong>
</div>
  
  </>
)

}

{

error==='packages' &&(
  <>
  
  <div className='alert-danger  alert-problem' style={{textAlign:'center',margin:'2vh 0'}}>

    {
      shopGroup!=='group-2' ? (
        <>
      <strong>please select a package </strong>  
        </>
      ):(
        <>
    <strong>please select a product </strong>    
        </>
      )
    }


</div>
  
  </>
)

}


{

error==='zero' &&(
  <>
  
  <div className='alert-danger  alert-problem' style={{textAlign:'center',margin:'2vh 0'}}>

<strong>Quantity can not be less than or equal to zero</strong></div>
  
  </>
)

}





{

  error==='pieces' &&(
    <>
    
    <div className='alert-danger alert-problem' style={{textAlign:'center',margin:'2vh 0'}}>

<p>Warning!   the total quantity you inputed exceed the available of item in stock,you have <strong style={{fontSize:''}}>{stockQuantityPieces}</strong> quantity in pieces in the store </p></div>
    
    </>
  )

}

{

error==='bulks' &&(
  <>
  
  <div className='alert-danger   alert-problem' style={{textAlign:'center',margin:'2vh 0'}}>

<p>Warning!   the total quantity you inputed exceed the available of item in stock,you have <strong  style={{color:''}}>{stockQuantityBulk}  </strong>quantity in bulk in the store </p></div>
  
  </>
)

}






<br />




</main>



<br />
 
    
    </>
  )
}














const SalesOrder=()=>{

const {tables,setTables,finalCost,collatedData,arrangeCostData,costData,setCostData,prefix,apiError,setApiError,shopGroup,setLoadingMessage,loadingMessage,shopDetails,setIsHelpShown}=useGlobal()
const navigate= useNavigate()

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);



const [renderTables, setRenderTables] = useState(false);

const [lowFinalCost, setLowFinalCost]=useState(false)
const [transactionDate,setTransactionDate]=useState(null)
const [userRole,setUserRole]= useState('')
const [isRecordFailed,setIsRecordFailed]=useState(false)
const [errorData,setErrorData]=useState([])
const [successData,setSuccessData]= useState([])
const [totalSuccessCost, setTotalSuccessCost]= useState(0)
const [isFinish, setIsFinish]= useState(false)
const [isSpinning,setIsSpinning]=useState(false)
const addTable=()=>{
 setIsHelpShown(true)
  setRenderTables(true)
setTables([...tables,{id:tables.length+1}])
}

const resetFinalScore=()=>{
  const t=setTimeout(()=>{
setLowFinalCost(false)
  },3000)

  return ()=>clearTimeout(t)
}


const callArrangeCost=()=>{



if(finalCost<=0){

  setLowFinalCost(true)
resetFinalScore()
  return
}


 const data= arrangeCostData(collatedData)


console.log(data,'selena')



 setCostData(data)



}






























const recordSales=async(data,id,)=>{

  console.log('boosie about to be sent')
  if (transactionDate===null){

    const time= Date.now()
    const newDate= new Date(time)
   
    data.date=newDate

    setTransactionDate(newDate)
    
  }

  else{
    data.date=transactionDate
  }



  


  console.log('boosie passed transatcion date')
  const presentDate=Date.now() + (24*60*60*1000)


  const dateInMilliseconds= data.date.getTime()
if (dateInMilliseconds>presentDate){


  setLoadingMessage('Sales cannot be recorded more than 24 hours in advance.')

  

  setApiError(true)

  return
}
console.log('boosie passed  more than one day check')

if (shopGroup==='group-2'){
  data.packages='bulks'
}

console.log('boosie passed  set package to bulk in case of group 2')
 const config={
  headers:{
   'Content-Type': 'application/json',
 },
 withCredentials: true,
 }
 
 const url= `${prefix}/products/record-sales/${id}`


 console.log('boosie  on the door of async try')
 
 try{
  
  const response= await axios.post(url,data,config)
  

  setTransactionDate(null)

  return {status:true,message:'sent successfully'};
 
 }
 
 
 catch (error){





  if (error.response) {
    
}







  console.log('boosie  an error occured check error', error)
  console.log( error.response.data,'message');




  
  if (error.response && error.response.data ) {



    if (error.response.data.message === 'unauthorized') {
      navigate('/log-in');
     return
  }







    return { status: false, message: error.response.data };
} else {
    return { status: false, message: 'An error occurred while recording sales' };
}



 

 }


 
 finally{
 
 }
 
 
 }
 











const handleSubmit = async () => {
  
 
  setApiError(null)
  


setIsSpinning(true)



  
  
  let successfulSalesCount=0;

  let sentData=0

  try {
  
      for (let i = 0; i < costData.length; i++) {
          const element = costData[i];
          
   const {status,message}=   await recordSales(element, element.id, transactionDate);
   sentData++;


  

  if (status){

    const time= Date.now()
    const newDate= new Date(time)

    setLoadingMessage(`Sales recorded successfully for item  ${i+1}`);
          successfulSalesCount++;
          const data={
            name:element.name,
            package:element.packages,
            quantity:element.quantity,
           ppu:element.ppu,
           cost:element.cost,
           transactionDate:newDate,
            
          }


          setSuccessData((prev)=>[...prev,data])

  }

  else{




    const data={
      no:i+1,
      name:element.name,
      package:element.ppu,
      quantity:element.quantity,
      cost:element.cost,
      reason:message,
    }


    setErrorData((prev)=>[...prev,data])

    setLoadingMessage(`Error recording sales for item ${i+1}`);

 setApiError(null)
  }
         
          
          
          

          if (sentData===costData.length){
            setIsSpinning(false)


            if (successfulSalesCount===costData.length){

            
              setTimeout(()=>{
                setLoadingMessage('All sales recorded successfully');
              
              },[3000])
              setApiError(false)
            }


            else{

              setCostData([])
              const failedRequest= costData.length-successfulSalesCount
             setIsRecordFailed(true)
              setApiError(true)
              setTimeout(()=>{
                setLoadingMessage(`${failedRequest} uploads failed` );
              
              },[3000])

            }

//console.log(successData,'success');



     setIsFinish(true)
         
    
          }

        

      }


     

      
      
    console.log(apiError,'what is api err');
  } 

  catch (error) {


    
 
}
  
  
  finally {  
   
     
      setTables([]);
  }
};


useEffect(()=>{
  console.log(successData,'sosess')
})






const fetchProfile = async () => {



  try {
   



    const url = `${prefix}/users/my-profile`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    const response = await axios.get(url, config);
 
    if(response.status==400){
      navigate('/')
    }
    

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

  const allCost= successData.map((item)=>{
    return  item.cost
    }).reduce((item,acc)=>{
      return item+ acc
    },0)

setTotalSuccessCost(allCost)

},[recordSales])







const handlePrint=()=>{


  window.print()

}











useEffect(()=>{
setTables([])


},[])


let isDateRendered=false;
const tempDate= new Date()

const cdate= tempDate.toDateString()

 return(
  <>
  
  <LayOut>

<main className='sales-whole-container'>






<p style={{fontSize:'2.5rem',textAlign:'center',fontWeight:"bolder"}} className='font-heading'>Sales log</p>




<div>


{renderTables && // Conditionally render based on the state
        tables.map((table,index) => (
          <Table key={table.id} index={index}></Table>
        ))
      }
    </div>


<div className='main-sales-table'>


<div className='main-sales-title' >
<button className='btn btn-secondary add-sales-btn font-text' onClick={addTable}><FaPlus></FaPlus> CLICK TO SELL ITEM</button>
</div>


 <div   className='main-sales-title total-cost-holder'>
  
  {
    tables.length>0 &&(
      <>
      
      
    <span className='total-cost-heading'>Total Cost(NGN) </span>  

      <input
   
        value={finalCost}
        className='final-cost-input'
       
        readOnly
      />
      </>
    )
  }
  
  
 </div>



</div>





<br />


{
  lowFinalCost &&(
    <>
   <div className='alert alert-danger font-text' style={{textAlign:'center'}}> <strong>NOTE:</strong> Total cost can not be less than or equal to zero</div> 
    
    </>
  )
}


<div className='sales-record-container'>

 <div   className='main-sales-title-record'  style={{display:"flex",justifyContent:"flex-end"}}>
  
  {
    tables.length>0 &&(
      <>
    <button className='btn-primary btn record-sales-btn' onClick={callArrangeCost}>Record Sales</button>
      </>
    )
  }
  
  
 </div>





</div>

<br />

<section style={{width:'100%', display:"flex", justifyContent:'center',alignItems:'center',flexDirection:'column'}}>  







{
  isRecordFailed && (
    <>
      <div className='confirm-container-overlay' style={{ zIndex: '3' }}>

        <div className='confirmation-container error-container'>

          <div>
            <FaTimes style={{ float: 'right', margin: '2%', fontSize: '2em', cursor: 'pointer' }} onClick={() => { setIsRecordFailed(false); setErrorData([]) }}></FaTimes>
          </div>
            <h5 style={{textAlign:'center'}} className='font-sub-heading'>! WARNING</h5>
            
      
          <h6 className='' style={{ fontWeight: 'bold', fontSize: '1em', textAlign:'center' }}>{`  ${errorData.length} record failed`}</h6>

          {
            errorData.map((item, index) => {
              return (
                <div key={index} className='error-info font-text'>
                  <p><strong>Item No:</strong> {item.no}</p>
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Package:</strong> {item.package}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Cost:</strong> {item.cost}</p>
                  <p><strong>Reason:</strong> {item.reason}</p>
                </div>
              )
            })
          }

        </div>

      </div>
    </>
  )
}









{
  (isFinish && successData.length!==0 && shopDetails.receipt===true) && (
    <>
  <section className='confirm-container-overlay' style={{ zIndex: '2' }}>

<article className='receipt-confirmation-container'>
  

<div className='print-cancel-container'>
  <FaTimes className='print-cancel'  style={{float:'right',margin:'2%',fontSize:'2em',cursor:'pointer'}} onClick={()=>setSuccessData([])}></FaTimes>
  </div>
  <p className='font-sub-heading'  style={{fontSize:'1.0em',margin:'2%',fontWeight:"bold",color:"#777",textAlign:'center'}}>RECEIPT</p>

{
  shopDetails.address && (
    <>
     <div style={{fontSize:'0.7rem',color:'black',textAlign:'center'}}>{shopDetails.address}</div>
    </>
  )
}


{
  shopDetails.telephoneOne && (
    <>
     <div style={{fontSize:'0.7rem',color:"black",textAlign:'center'}}>{shopDetails.telephoneOne}, {shopDetails.telephoneTwo}</div>
    
    </>
  )
}

     
    
 

    

  {
    successData.map((item)=>{
      const date=moment.utc(item.transactionDate).tz('Africa/Lagos').format(' DD:MM:YYYY') 


      return(
        <>


{
  !isDateRendered && (
    <>
    
    <div className='receipt-date-line' style={{margin:'2% 0'}}>
        <div>Transaction Date</div>
<div  className='receipt-value'>{date}</div>


        </div>
        <div className='receipt-part'></div>

<div className='receipt-line' style={{fontWeight:"600",fontStyle:'normal'}} >
<div className='receipt-text'>Qty</div>
<div className='receipt-text'>Item</div>
<div className='receipt-text'>Price</div>

</div>
    
    </>
  )
}


{!isDateRendered && (isDateRendered = true)}

       
        
        <div className='receipt-line' >
          
        <div className='receipt-text'>{item.quantity}</div>
    <div className='receipt-text'>{item.name}</div>
    <div className='receipt-text'>&#x20A6;{item.cost}</div>
          
          
          </div> 
        
        
        
        </>
      )
    })
  }



<div className='receipt-line' style={{fontWeight:"600",fontStyle:'normal'}} >
<div className='receipt-text'>TOTAL</div>
<div className='receipt-text'>Item</div>
<div className='receipt-text'>&#x20A6; {totalSuccessCost}</div>

</div>
    






  
  <div className='receipt-part'></div>

  <div className='receipt-customer-part'>
    <div className='customer-info'>  Customer Name </div>
    <div className='customer-input'>.....................................................................</div>
    
  </div>

  <div className='receipt-customer-part'>
    <div className='customer-info'>  Telephone </div>
    <div className='customer-input'>.....................................................................</div>
    
  </div>
  <div className='receipt-customer-part'>
    <div className='customer-info'>  Signature </div>
    <div className='customer-input'>.....................................................................</div>
    
  </div>
  
  

<div style={{display:'flex',justifyContent:'center',alignItems:"center"}}>

<button onClick={handlePrint}  className='btn btn-print font-sub-heading'>
        <IoMdPrint /> Print Receipt
      </button>


</div>



</article>


</section> 
    
    
    
    
    </>
  )
}











   {
  costData.length!==0 && finalCost!==0 && (
    <>


<div className='confirm-container-overlay'>



    <div className='confirmation-container'>
      
      <div>
      <FaTimes  style={{float:'right',margin:'2%',fontSize:'2em',cursor:'pointer'}} onClick={()=>{setCostData([]);setIsSpinning(false)}}></FaTimes>
    
      </div>
     

     <p className='font-sub-heading' style={{fontSize:'1.2em',margin:'2%',fontWeight:"bold",color:"#777",textAlign:'center'}}>CONFIRM TRANSACTION</p> 


     
     
         <article>
     {

costData.map((item,index)=>{
  const {packages,ppu,quantity,cost,name,id}=item

  return(
    <>
  <strong style={{margin:'1% 2%',fontSize:'1.4em'}} className='font-sub-heading'>Item {index+1}</strong>
  <p style={{margin:'1% 2%',fontSize:'0.9em', color:'gray',fontWeight:"500", }} className='font-text'>Name <strong  style={{color:"black"}}>:  {name}  </strong>  </p>

  


{
  shopGroup==='group-1' && (
    <>
    <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Price per unit (&#x20A6;)<strong  style={{color:"black"}}>: {packages}</strong>   </p>
    </>
  )
}
   
   <p style={{margin:'1% 2%', color:'gray',fontWeight:"500", fontSize:'0.9em',fontWeight:"500", }} className='font-sub-heading'>Price per unit (&#x20A6;)<strong  style={{color:"black"}}>: {ppu}</strong>   </p>
  
   <p style={{margin:'1% 2%',fontSize:'0.9em', color:'gray',fontWeight:"500", }} className='font-sub-heading'>Quantity bought <strong  style={{color:"black"}}>: {quantity}  </strong>   </p>
  
 
   <p style={{margin:'1% 2%',fontSize:'0.9em',color:'gray',fontWeight:"500",}} className='font-sub-heading'>Cost(&#x20A6;)<strong style={{color:"black"}}>: {cost} </strong>  </p>
   

  
    
    </>
  )
})


   } 
     </article>
        
      
    

    
  


    <section >
    <div style={{margin:'1% 2%',fontSize:'0.9em',fontWeight:'700',display:'flex',color:'', justifyContent:'flex-start',alignItems:'center'}} className='font-sub-heading'>Transaction Date: <div style={{opacity:'0'}}>xx</div>  <div><DatePicker  

selected={transactionDate}
onChange={(transactionDate)=>setTransactionDate(transactionDate)}
showTimeInput
dateFormat="MMMM d, yyyy h:mm aa"

></DatePicker> </div>  </div>
  









   </section>
    
    



<hr />
   <strong style={{margin:'0 2%'}} className='font-sub-heading'>Total Cost(&#x20A6;) :{finalCost}  </strong>

   
   <hr /> 
   <div style={{display:'flex',justifyContent:'center'}}>
   <button className='btn btn-primary sales-submit-btn font-sub-heading' onClick={handleSubmit} >    
   
  
   
   {
    isSpinning ? (
      <>
      
    <Vortex
  visible={true}
  height="30"
  width="30"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['white', 'white', 'white', 'white', 'white', 'white']}
  /> 
      
      </>
    ):(
      <>
    SUBMIT   
      </>
    )
   }
    
   </button>

   
   </div>



   

  {
    loadingMessage!=='' && (
      <>
      <Response></Response>
      
      </>
    )
  }

  
   </div>



   </div>
    </>

 






  )





   }





</section>

































</main>
   
  </LayOut>
  
  </>
 )
}


export default SalesOrder