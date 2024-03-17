import React, { useState, useEffect,useRef, } from 'react'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineDelete } from 'react-icons/ai';
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { HiMenu } from 'react-icons/hi';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaSearch, FaPhone, FaTimes, FaEnvelope, FaFacebook, FaTwitter, FaInstagram,  FaEye,FaUser , FaCloud, FaPlug, FaShoppingCart, FaHome, FaCog,FaUserShield, FaShoppingBag ,FaPencilAlt,FaChartBar,FaCashRegister,FaCoins, FaRegFileArchive, FaPlus  } from 'react-icons/fa'; 
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import LayOut from './lay-out';


let cot=true

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const date = new Date(timestampInSeconds * 1000);
const formattedDate = date.toLocaleString();






const Table=({index})=>{

 const {tables,setTables,setFinalCost,colate,setCollatedData,prefix,setLoadingMessage,loadingMessage,apiError,setApiError,resetLoadingText}=useGlobal()
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
    setPpu(price.bulkPrice);
  
}

else if (packages==='pieces'){

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

const sanitizedInput = inputValue.replace(/[^\d.]/g, '');
  
// Ensure there's at most one dot
const dotCount = sanitizedInput.split('.').length - 1;

if (dotCount <= 1) {
  // Update state with the sanitized input
  setQuantity(() => sanitizedInput);
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


  if ( packages === 'bulks') {
    const bulkCost = price.bulkPrice * quantity;
  //  setPpu(specificData.price.bulk);






    setCost(bulkCost);
   
  } else if ( packages === 'pieces') {


  


    const piecesCost = price.piecesPrice * quantity;
  //  setPpu(specificData.price.pieces);
    setCost(piecesCost);
   
  }

  else {
    return
  }
};






const bodyGrey='hsl(0,0%,90%)'






const totalCalculate=()=>{

  


  
  const inputCost=document.querySelectorAll('.cost')

  const cost=   Array.from(inputCost).map((input)=>parseInt(input.value)).filter((numbers)=>numbers!==0)



const sum=cost.reduce((accumulator,currentValue)=>{
  return accumulator+currentValue

},0)
setFinalCost(sum)



const inputPackages=document.querySelectorAll('.package')

  const packages=   Array.from(inputPackages).map((input)=>input.value).filter((text)=>text!=='')

  
  const inputPpu=document.querySelectorAll('.ppu')

  const ppu=   Array.from(inputPpu).map((input)=>parseInt(input.value)).filter((numbers)=>numbers!==0)



  
  const inputQuantity=document.querySelectorAll('.quantity')

  const quantity=   Array.from(inputQuantity).map((input)=>parseInt(input.value)).filter((numbers)=>numbers!==0)


  
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



 
  calculate();
 // totalCalculate()
}, [quantity,index]);

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
  

setPackages('')
setPpu('')
setID('')
setName('')
setIsSearching(true)
setLoadingMessage('searching...')
setIsSearchHidden(true)
 
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
  
  setLoadingMessage('Error connecting to the server')
  
  }
  
  
  else{
  setLoadingMessage(error.message)
  }



   }




finally{
  resetLoadingText()
}






 
 }












 return(
<>
<main className='product-sales-table-container'>




<div className='product-sales-table'>

 <div className='product-sales-title' >Product ID</div>
 <div className='product-sales-title' >Product name</div>
 <div   className='product-sales-title'>Package</div>
 <div   className='product-sales-title'>Price per Unit  (&#x20A6;)</div>
 <div   className='product-sales-title'>Quantity</div>

 <div   className='product-sales-title'>Cost (&#x20A6;)</div>
 <div   className='product-sales-title'>Remove</div>


</div>






<div className='product-sales' >

<div className='product-sales-container'>
<input type="text"  className='combo-input typeahead  ID form-control' style={{boxShadow:'none',width:"95%"}} value={ID}  onChange={(e)=>setID(e.target.value)}/>

</div>








<div style={{backgroundColor:''}}>

<div className='second-combo-box' style={{width:'100%',border:'1px solid transparent'}} >
 <input type="text"  className='combo-input typeahead name form-control' style={{boxShadow:'none',width:"80%", border:'1px solid gray',borderRadius:'0%',borderRight:"none"}} value={name} onClick={()=>setError('')}  onChange={(e) => {
    setName(e.target.value);
    setError('');
  }}/>


  <button className='btn btn-primary  combo-btn'   style={{boxShadow:'none',width:"20%",border:'1px solid transparent'}} onClick={handleSearch}>
    <div className='combo-search' >
      <FaSearch size={14}  />
    </div>
  </button>
</div>

</div>






<div className='product-sales-container'>
  <select
    name=""
    id=""
    className='combo-select form-select  package   h-100'
    style={{ boxShadow: 'none', border: '1px solid gray', borderRadius: '0%', width: "100%", borderLeft: "none" }}
    value={packages}
    onChange={handleChangePackage}
      >
    <option value=""></option>
    <option value={'bulks'}  onClick={()=>setPackages('bulks')}>Bulk</option>
    <option value={'pieces'}  onClick={()=>setPackages('pieces')}>Pieces</option>
  </select>
</div>








<div className='product-sales-container'>
<input type="number"  className='combo-input typeahead  ppu form-control' style={{boxShadow:'none',width:"95%"}} value={ppu}/>

</div>





<div className='product-sales-container'>
<input type="text"  className='combo-input typeahead  quantity form-control' style={{boxShadow:'none',width:"95%"}}   onChange={handleChangeQuantity}  value={quantity}/>

</div>





<div className='product-sales-container'>
<input type="number" min={0}  className='combo-input cost typeahead form-control' style={{boxShadow:'none',width:"95%"}} value={cost}/>

</div>

<div className='product-sales-container' style={{display:"flex",justifyContent:'center', alignItems:'center',marginRight:"0%"}}>
  
   <AiOutlineDelete size={35} onClick={()=>removeTable(index)}></AiOutlineDelete>

   

</div>






</div>


{

  isSearching && (
    <>
    <div className='loading-message-container' >  <div className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''} style={{fontWeight:'700'}}>
  {loadingMessage}
</div>   </div>
    
    </>
  )
}




{
  !isSearchHidden && (

<>


<div className='sale-search-item-section  '>




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
<div  className='sale-search-container' onClick={() => {
 setID(_id);
 setName(name);
 setPrice(currentPrice);
 setIsSearchHidden(true)
 setStockQuantityPieces(availableQuantity)
 setStockQuantityBulk(availableQuantity/upb)
 setUnitPerBulk(upb)
}}     key={index}>
 <div style={{borderBottom:'solid 2px black',backgroundColor:"grey",color:'white',textAlign:'center',fontSize:"0.8em"}}>ID</div>

<div style={{borderBottom:'solid 2px black',backgroundColor:"grey",color:'white',textAlign:'center',fontSize:"0.8em"}}>Item-Name</div>
<div style={{borderBottom:'solid 2px black',backgroundColor:"grey",color:'white',textAlign:'center',fontSize:"0.8em"}}> Quantity in Stock (bulk)</div>

<div style={{borderBottom:'solid 2px black',backgroundColor:"grey",color:'white',textAlign:'center',fontSize:"0.8em"}}> Quantity in Stock (pieces)</div>
<div style={{textAlign:'center',cursor:"pointer",fontWeight:'bold',fontSize:"0.8em"}} >{sku}</div>
<div style={{textAlign:'center',cursor:'pointer',fontWeight:'bold',fontSize:"0.8em",fontSize:"0.8em"}} >{name}</div>
<div style={{textAlign:'center',cursor:'pointer',fontWeight:'bold'}} >{(availableQuantity/upb).toFixed(1)}</div>


<div style={{textAlign:'center',cursor:'pointer',fontWeight:'bold',fontSize:"0.8em"}} >{availableQuantity}</div>


    

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

<strong>please select a package </strong></div>
  
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

const {tables,setTables,finalCost,collatedData,arrangeCostData,costData,setCostData,prefix,apiError,setApiError}=useGlobal()
const navigate= useNavigate()

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);



const [renderTables, setRenderTables] = useState(false);

const [message,setMessage] =useState('')
const [lowFinalCost, setLowFinalCost]=useState(false)
const [transactionDate,setTransactionDate]=useState(dateValue)
const [userRole,setUserRole]= useState('')


const addTable=()=>{

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

 setCostData(data)



}

























const resetLoadingText=()=>{

  const t= setTimeout(()=>{

    setMessage('')

  },5000)


  return ()=>clearTimeout(t)

}





const recordSales=async(data,id,)=>{






  
 
 if (transactionDate){
  data.date= transactionDate
 }
 
else{
  setMessage('Please choose a transaction date')

  return
}
 
 const config={
  headers:{
   'Content-Type': 'application/json',
 },
 withCredentials: true,
 }
 
 const url= `${prefix}/products/record-sales/${id}`
 
 
 try{
 
  const response= await axios.post(url,data,config)
 
 }
 
 
 catch (err){


 

 }


 
 
 
 
 }
 






const handleSubmit=async()=>{
  const promises=[]

  
  setMessage('Processing...')

  
for (let i=0;i<costData.length;i++){

   const element=costData[i]


   const promise=   recordSales(element, element.id,transactionDate).catch((err)=>{
  
    setMessage(`Error recording sales for ID ${element.name}:`)
  })

  promises.push(promise)


  



}



try{
  await  Promise.all(promises)
 setApiError(false)
  setMessage('Sales recorded successfully')
  setTables([])

 }

 catch(error){
  setApiError(true)


  if(error.requset){
    setMessage('Error connecting to the server')
  }
  setMessage(error)


 }


 finally{
  resetLoadingText()
 }
 





}








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
setTables([])
fetchProfile()

},[])




 return(
  <>
  
  <LayOut>

<main>








<p style={{fontSize:'3em',textAlign:'center',}}>Sales log</p>



<div>
<p style={{fontSize:'2em',textAlign:'center',margin:'0.5em 0'}}>Cost Information</p>

{renderTables && // Conditionally render based on the state
        tables.map((table,index) => (
          <Table key={table.id} index={index}></Table>
        ))
      }
    </div>


<div className='main-sales-table'>

<div className='main-sales-title' ></div>
 <div className='main-sales-title' ></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'>
  
  {
    tables.length>0 &&(
      <>
      
      
      Total Cost(NGN)
      </>
    )
  }
  
  
 </div>
 <div   className='main-sales-title'></div>


</div>



<div className='main-sales-table'>

<div className='main-sales-title' >
<button className='btn btn-secondary add-sales-btn' onClick={addTable}><FaPlus></FaPlus>   Add Sales</button>



</div>
 <div className='main-sales-title' ></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'>
  
 </div>
 <div   className='product-sales-title' >

  

  {
    tables.length>0 && (
      <>



<input
       // Adjust the number of rows
        value={finalCost}
        className='final-cost-input'
       
        readOnly
      />




      </>
    )
  }






 </div>
 <div   className='main-sales-title'></div>


</div>

<br />


{
  lowFinalCost &&(
    <>
   <div className='alert alert-danger' style={{textAlign:'center'}}> <strong>NOTE:</strong> Total cost can not be less than or equal to zero</div> 
    
    </>
  )
}


<div className='main-sales-table'>

<div className='main-sales-title' ></div>
 <div className='main-sales-title' ></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'></div>
 <div   className='main-sales-title'>
  
  {
    tables.length>0 &&(
      <>
    <button className='btn-primary btn record-sales-btn' onClick={callArrangeCost}>Record Sales</button>
      </>
    )
  }
  
  
 </div>
 <div   className='main-sales-title'></div>




</div>

<br />

<section style={{width:'100%', display:"flex", justifyContent:'center',alignItems:'center',flexDirection:'column'}}>  





   {
  costData.length!==0 && finalCost!==0 && (
    <>


<div className='confirm-container-overlay'>



    <div className='confirmation-container'>
      
      <div>
      <FaTimes  style={{float:'right',margin:'2%',fontSize:'2em',cursor:'pointer'}} onClick={()=>setCostData([])}></FaTimes>
    
      </div>
      <p className='inventory-confirm'>InventoryHero</p> 

     <p style={{fontSize:'1.2em',margin:'2%',fontWeight:"bold",color:"#777",textAlign:'center'}}>CONFIRM TRANSACTION</p> 
   {

costData.map((item,index)=>{
  const {packages,ppu,quantity,cost,name, id}=item

  return(
    <>
  <strong style={{margin:'1% 2%',fontSize:'1.4em'}}>Item {index+1}</strong>
  <p style={{margin:'1% 2%',fontSize:'0.9em'}}>Name: <strong>  {name}  </strong>  </p>



   <p style={{margin:'1% 2%',fontSize:'0.9em'}}>Packages: <strong>  {packages}  </strong>  </p>
   
   <p style={{margin:'1% 2%',fontSize:'0.9em'}}>Price of each Unit of product bought(&#x20A6;): <strong>{ppu}</strong>   </p>
  
   <p style={{margin:'1% 2%',fontSize:'0.9em'}}>Quantity bought:  <strong> {quantity}  </strong>   </p>
  
 
   <p style={{margin:'1% 2%',fontSize:'0.9em'}}>Cost(&#x20A6;): <strong>{cost} </strong>  </p>
   

 
    
    </>
  )
})


   } 





{
  userRole==='admin'  && (
    <>
    
    <section >
    <p style={{textAlign:"center",fontWeight:'700',fontSize:"0.8em",color:'',marginBottom:"-0.8%"}} className='text-primary'>Select the sale date if it's not today; otherwise, you can skip.</p>

<div htmlFor="" style={{textAlign:'center'}}>Sales date</div>



<div  style={{display:'flex',justifyContent:"center",alignItems:'center',width:'100%'}}>

<DatePicker  

selected={transactionDate}
onChange={(transactionDate)=>setTransactionDate(transactionDate)}
showTimeInput
dateFormat="MMMM d, yyyy h:mm aa"

></DatePicker>
</div>



   </section>
    
    
    </>
  )
}




<hr />
   <strong style={{margin:'0 2%'}}>Total Cost(&#x20A6;) :{finalCost}  </strong>

   
   <hr /> 
   <div style={{display:'flex',justifyContent:'center'}}>
   <button className='btn btn-primary sales-submit-btn' onClick={handleSubmit} >SUBMIT</button>
   </div>



   

  

   <div style={{margin:'2vh 0',textAlign:"center", fontWeight:'700'}} className={apiError === true ? 'alert alert-danger' : apiError === false ? 'alert alert-success' : ''}>{message}</div>
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
