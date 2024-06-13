     
import React, { useState, useEffect } from 'react'
import { Preloader } from './preloader';
import { Link,  useNavigate,useLocation } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi';
import { useGlobal, } from './context'
import { FaSearch,  FaShoppingCart, FaHome, FaCog,FaUserShield, FaShoppingBag ,FaPencilAlt,FaChartBar,FaCoins,FaBars,FaTimes,FaUser,FaCashRegister,FaUserFriends,FaTags,FaFileContract,FaSignOutAlt } from 'react-icons/fa'; 
import { HiMenu } from 'react-icons/hi';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faBell, faCog, faTachometerAlt, faBoxes, faHistory, faClipboardList, faChartLine,faChartPie,faChartBar,faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';



export const Response=()=>{

  const {apiError,loadingMessage,setLoadingMessage,setApiError}=useGlobal()
  return(
    <>
    {
      apiError===true && (
        <>
        <div className='alert alert-danger'>
        <div style={{width:'100%'}}>
          <FaTimes style={{float:'right',cursor:"pointer"}} onClick={()=>{
            setLoadingMessage('')
            setApiError(null)
          }}></FaTimes>
          </div>
<p>{loadingMessage}</p>
        </div>
        </>
      )
    }
        {
      apiError===false && (
        <>
        <div className='alert alert-success'>
          <div style={{width:'100%'}}>
          <FaTimes style={{float:'right',cursor:"pointer"}} onClick={()=>{
            setLoadingMessage('')
            setApiError(null)
          }}></FaTimes>
          </div>
      
<p>{loadingMessage}</p>
        </div>
        </>
      )
    }

{
      apiError===null && (
        <>
        <div className='alert ' style={{border:"1px solid transparent"}}>
        <div style={{width:'100%'}}>
          
          </div>
<p>{loadingMessage}</p>
        </div>
        </>
      )
    }

    
    </>
  )
}







 export const LinkNav=()=>{

}







 const LayOut=({children})=>{

  const {prefix,setSearchInput,searchInput,setSearchData, setIsSearching,setIsPreLoaderRunning,isPreLoaderRunning,setShop,userName,userRole,setUserName,setUserEmail,userEmail,setUserRole,setSubType,setShopGroup,setShopDetails,link,setLink,setIsAdStockShown,shopGroup,setError,error,setIsSearchShown,isSearchShown} =useGlobal()


  const [isAsideHidden,setIsAsideHidden]=useState(true)
 
  
  const [notification,setNotification]=useState([])
const [isWhite,setWhite]=useState(false)

  const navigate= useNavigate()
const location=useLocation()







const fetchProfile = async () => {


  console.log('kate shpg fetched ')
  const source = axios.CancelToken.source();

  const timeOutId = setTimeout(() => {
   
      source.cancel('Request timed out');
  }, 180000);

  try {
      const url = `${prefix}/users/my-profile`;
      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
          withCredentials: true,
          cancelToken: source.token,
      };

      const response = await axios.get(url, config);

      console.log(response,'cylian')

      clearTimeout(timeOutId);

      console.log(response.data.data.shopFound, 'big-response');
      const shopFound = response.data.data.shopFound;
      const profileData = response.data.data.data;

      if (response.status === 200) {
          if (profileData.role !== 'admin' && profileData.role !== 'super-admin' && !profileData.isVerified) {
              navigate('/');
          }

          if (profileData.role !== 'admin' && profileData.role !== 'super-admin' && location.pathname === '/admin') {
              navigate('/');
          }

          const activeSub = response.data.data.subData;
          setSubType(activeSub.name);
          console.log(activeSub.name, 'beyond active from context');
          setUserName(profileData.firstName);
          setUserEmail(profileData.email)
          setShopGroup(shopFound.group);
          setShopDetails(shopFound);
          setUserRole(profileData.role);
      }
  } catch (error) {





      

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
          }} 
      
      
      
     if (error.request) {

        


          setError('Oops, something went wrong, try again.');
      }

      setError('Oops, something went wrong, try again.');
  } 
  
  
  finally {
      clearTimeout(timeOutId);
      setIsPreLoaderRunning(false);
  }
};








 
 
 





  
  

  useEffect(() => {
console.log(shopGroup,'kate shpg')
  
if(shopGroup===''){
  
 fetchProfile()
}
   
  }, []);

  




const handleMobileSearch=async()=>{
setIsSearchShown(false)
setIsPreLoaderRunning(true)
const source = axios.CancelToken.source();

  const timeOutId = setTimeout(() => {
   
      source.cancel('Request timed out');
  }, 180000);

  if (searchInput===''){
    return
  }
  
  setIsSearching(true)
  
   
     const config = {
       headers: {
         'Content-Type': 'application/json',
       },
       withCredentials:true
     };
   
     const encodedSearchInput = encodeURIComponent(searchInput);
     if(encodedSearchInput===''){
       return
     }
     
     try{
 const url=`${prefix}/products/search?query=${encodedSearchInput}`
       const response= await axios.get(url,config)
      
       if (response.status===200){
        

      setSearchData(response.data.data.products)
      
  navigate('/search')
  //setIsSearching(false)
  
       }
   
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
      setIsPreLoaderRunning(false)
     
   }
   }





   const handleSearch=async(e)=>{

    e.preventDefault()
  
    if (searchInput===''){
      return
    }

    const source = axios.CancelToken.source();

  const timeOutId = setTimeout(() => {
   
      source.cancel('Request timed out');
  }, 180000);
    
    setIsSearching(true)
    setIsPreLoaderRunning(true)
     
       const config = {
         headers: {
           'Content-Type': 'application/json',
         },
         withCredentials:true
       };
     
       const encodedSearchInput = encodeURIComponent(searchInput);
       if(encodedSearchInput===''){
         return
       }
       
       try{
         const url=`${prefix}/products/search?query=${encodedSearchInput}`
         const response= await axios.get(url,config)
        
         if (response.status===200){
          
  
        setSearchData(response.data.data.products)
        
    navigate('/search')
    //setIsSearching(false)
  
         }
     
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
        setIsPreLoaderRunning(false)
       }
     
     }














  
  const handleBack=()=>{

   

   const previousLocation=sessionStorage.getItem('search-sub-location')
   console.log(previousLocation,'previous-location  pathname')

   if(previousLocation){
    navigate(previousLocation)
   }


    setIsSearchShown(true)
  }


  useEffect(()=>{
 
    if (window.location.pathname!='/search'){
      sessionStorage.setItem('search-sub-location',window.location.pathname)
     }
  
  },[])











const toggle=()=>{
  //alert('now')
  if(isAsideHidden){
    setIsAsideHidden(false)
  }

  else {
    setIsAsideHidden(true)
  }
}












useEffect(() => {
  let eventSource = null;

  // Function to establish SSE connection
  const connectToSSE = () => {
    
    eventSource = new EventSource(`${prefix}/shops/get-notifications`, { withCredentials: true });

    // Event listener for incoming SSE messages
    eventSource.onmessage = (event) => {
      // Check if the message is the initial connection message
      if (event.data === 'Connected') {
        console.log('SSE connection established');
      } else {
        // Parse the incoming data (assuming it's JSON)
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
      
        setNotification((prev) => [...prev, data]);
        // Handle the incoming data as needed
        // For example, update component state, trigger actions, etc.
      }
    };

    // Event listener for SSE close connection
    eventSource.onclose = () => {
      console.log('SSE connection closed');
      // Attempt reconnection after a delay
      setTimeout(connectToSSE, 1000); // Adjust the delay as needed
    };
  };

  // Initial connection
  connectToSSE();

  // Clean up function
  return () => {
    // Close the SSE connection when component unmounts
    if (eventSource) {
      eventSource.close();
    }
  };
}, [setNotification])








useEffect(() => {
  let eventSource = null;

  // Function to establish SSE connection
  const connectToSSE = () => {
    
    eventSource = new EventSource(`${prefix}/shops/get-sub-notifications`, { withCredentials: true });

    // Event listener for incoming SSE messages
    eventSource.onmessage = (event) => {
      // Check if the message is the initial connection message
      if (event.data === 'Connected') {
        console.log('SSE connection established');
      } else {
        // Parse the incoming data (assuming it's JSON)
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
      
        setNotification((prev) => [...prev, data]);
        // Handle the incoming data as needed
        // For example, update component state, trigger actions, etc.
      }
    };

    // Event listener for SSE close connection
    eventSource.onclose = () => {
      console.log('SSE connection closed');
      // Attempt reconnection after a delay
      setTimeout(connectToSSE, 1000); // Adjust the delay as needed
    };
  };

  // Initial connection
  connectToSSE();

  // Clean up function
  return () => {
    // Close the SSE connection when component unmounts
    if (eventSource) {
      eventSource.close();
    }
  };
}, [setNotification])




useEffect(()=>{

  


  const addWhite=()=>{

   
    if (window.innerWidth<=1019  && window.location.pathname==='/settings'){
    
     setWhite(true)
     
   
     }

     else{
      setWhite(false)
     }
    
  }

  addWhite();

  


  

},[])




const handleLink=()=>{
  setLink('')
  setIsAdStockShown(false)
}





const handleKeyPress=(event)=>{
  if (event.key==='Enter'){
handleMobileSearch()
  }

}


const handlePageclick=(e)=>{



  if (e.target.className==='mobile-aside'){
   setIsAsideHidden(true)
  }
}




const logOut=async()=>{

  //alert('about to log out')
  
   // setIsPreLoaderRunning(true)
     const url=`${prefix}/users/log-out`;
  
     const config = {
      headers: {
      'Content-Type': 'application/json',
      },
    
    
      
    
    };
    
    
    
    
    
      try{
    
    
    
         const response= await axios.post(url,config,{  withCredentials: true,})
       //  setIsPreLoaderRunning(false)
  
      console.log(response,'log out response')
    if (response.status===200){
    
    navigate('/')
      
    }
     
      }
    
      catch(err){
        console.log(err)
      }
   
  
  
  
  
    
  
  
  
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


   
    
    <main>

  

<section className='mobile-container'>

<div className='section2-mobile-upper' id='mobile-upper' style={{backgroundColor:isWhite?'white':''}}>
  

 



{
  isSearchShown ? (
    <>
     <div className='section2-second-upper'>

<div className='toggle-btn-container'>
  {
    isAsideHidden ? (
      <>
      <HiMenu fontSize={30} style={{marginLeft:'3vw',cursor:"pointer"}} onClick={toggle}></HiMenu>
      </>
    ):(
      <>
      <FaTimes  fontSize={30} style={{marginLeft:'3vw'}} onClick={toggle} ></FaTimes>
      </>
    )
  }
   
    </div>
   

   <div className='mobile-heading-logo-container'>
   <div className='font-text  ivy-main-search-logo'>Ivy</div>
   <FaSearch fontSize={20} onClick={()=>setIsSearchShown(false)}></FaSearch>


   </div>
   

<div>
<strong style={{marginRight:'3vw'}}></strong>
</div>
</div>
    </>
  ):(
    <>
     <div className='section2-second-upper-search'>

<div className='mobile-search-back-container'>
<FiArrowLeft size={20}   onClick={handleBack} ></FiArrowLeft>
</div>

<input type="text" className='font-text mobile-input-field'  value={searchInput} placeholder='search'   onChange={(e)=>setSearchInput(e.target.value)}

onKeyPress={handleKeyPress}
/>



</div>
    </>
  )
}


 




  

  {
    link!=='' && (
      <>
      <article className='section2-inv-container'>
  <LinkNav></LinkNav>


</article>
 
      </>
    )
  }




<section className='mobile-content-container'>



  



<aside className={isAsideHidden ? 'hide-mobile-aside' : 'mobile-aside'}  onClick={(e)=>handlePageclick(e)}>
  <article className="mobile-aside-main-content">
    <div className="scrollable-content">
      <section className="mobile-side-first-section">
        <h2 className="mobile-ivy-aside-logo font-text">Ivy</h2>
        <div>{userName.toUpperCase()}</div>
        <div style={{ overflow: 'hidden' }}>{userEmail}</div>
        <div style={{ color: 'green' }}>powered by Encoded</div>
      </section>



      <div className='link-container'>
            
            <FaHome className='nav-icon'></FaHome>
            <Link onClick={handleLink}  className='nav-link' to={'/dashboard'}>Home</Link>
            </div>
            
            <div className='link-container'>
            <FaCoins className='nav-icon'></FaCoins>
            <Link  onClick={handleLink} className='nav-link' to={'/sales'}>Sell Item</Link>
            </div>
    
            
            
           
            
            
            <div className='link-container'>
            <FaShoppingCart className='nav-icon'></FaShoppingCart>
            <Link onClick={handleLink}  className='nav-link' to={'/inventory'}>Inventory</Link>
            </div>
            
            
            <div className='link-container'>
            <FaPencilAlt className='nav-icon'></FaPencilAlt>
            <Link  onClick={handleLink} className='nav-link' to={'/register'}>Register</Link>
            </div>
            
            
            <div className='link-container'>
            <FaShoppingBag className='nav-icon'></FaShoppingBag>
            <Link  onClick={handleLink} className='nav-link' to={'/sales-record'}>Sales record</Link>
            </div>
            
            <div className='link-container'>
            <FaChartBar className='nav-icon'></FaChartBar>
            <Link onClick={handleLink}  className='nav-link' to={'/financials'}>Financials</Link>
            </div>
            
            
            
            <div className='link-container'>
            <FaUser className='nav-icon'></FaUser>
            <Link onClick={handleLink} className='nav-link' to={'/profile'}>Profile</Link>
            </div>
            
            {
             ( userRole==='admin' || userRole==='super-admin') && (
                <>
                
                <div className='link-container'>
                <FaCog className='nav-icon'></FaCog>
            <Link  onClick={handleLink} className='nav-link' to={'/settings'}>Settings</Link>
            </div> 
                </>
              )
            }













    
  
            <div style={{width:'100%',paddingLeft:"5%",backgroundColor:'',marginTop:"10px"}}>More link</div>
            <div className='link-container'>
  <FaFileContract className='nav-icon'></FaFileContract>
  <Link onClick={handleLink} className='nav-link' to={'/terms-conditions'}>Terms & Conditions</Link>
</div>

<div className='link-container'>
  <FaTags className='nav-icon'></FaTags>
  <Link onClick={handleLink} className='nav-link' to={'/pricing'}>Pricing</Link>
</div>

<div className='link-container'>
  <FaUserFriends className='nav-icon'></FaUserFriends>
  <Link onClick={handleLink} className='nav-link' to={'/referral'}>Referral</Link>
</div>
       

<div  className='last-mobile-link-container'>
    <div className='link-container'>
    <FaSignOutAlt className='nav-icon' ></FaSignOutAlt>
  <Link onClick={logOut} className='nav-link' >Sign Out</Link>
   
          </div>
    </div>
  
    </div>

    
  
  </article>
</aside>

    
 


    <div  className='holder' style={{backgroundColor:''}}>
{children}

</div>
    
   



</section>


</div>


<div className='mobile-footer'>


<FaCashRegister  onClick={()=>{navigate('/sales');handleLink()}}></FaCashRegister>
<FaUser onClick={()=>{navigate('/profile');handleLink()}}></FaUser>

<div className='notification-icon'  onClick={()=>{navigate('/notifications');handleLink()}}> <FontAwesomeIcon icon={faBell} /> {
  
  notification.length!==0 &&(
    <>
    <div className='notification-number'>{notification.length}</div>
    </>
  )
}</div >
<FaCog onClick={()=>{navigate('/settings');handleLink()}}></FaCog>
</div>



</section>








  
  <main className='input-container container-fluid'>

  








  <div className='row main-section'>
    <section className='section1'>
      <div className='section1-upper'>
        <strong style={{fontStyle:'italic'}} className='lay-out-ivy-heading'>iVy</strong>
      </div>
      <aside className='aside'>
      <div className='link-container'>
<FaHome className='nav-icon'></FaHome>
<Link  className='nav-link' to={'/dashboard'} onClick={handleLink}>HOME</Link>
</div>

<div className='link-container'>
<FaCoins className='nav-icon'></FaCoins>
<Link  className='nav-link' to={'/sales'}   onClick={handleLink}>SELL ITEM</Link>
</div>

<div className='link-container'>
<FaShoppingCart className='nav-icon'></FaShoppingCart>
<Link  className='nav-link' to={'/inventory'}  onClick={handleLink}> INVENTORY</Link>
</div>


<div className='link-container'>
<FaPencilAlt className='nav-icon'></FaPencilAlt>
<Link  className='nav-link' to={'/register'}  onClick={handleLink}>REGISTER</Link>
</div>


<div className='link-container'>
<FaShoppingBag className='nav-icon'></FaShoppingBag>
<Link  className='nav-link' to={'/sales-record'}  onClick={handleLink}>SALES RECORD</Link>
</div>

<div className='link-container'>
<FaChartBar className='nav-icon'></FaChartBar>
<Link  className='nav-link' to={'/financials'}  onClick={handleLink}>FINANCIALS</Link>
</div>



<div className='link-container'>

<FaUser className='nav-icon'></FaUser>
<Link  className='nav-link' to={'/profile'}  onClick={handleLink}>PROFILE</Link>
</div>

{ ( userRole==='admin' || userRole==='super-admin') && (
    <>
    
    <div className='link-container'>
    <FaCog className='nav-icon'></FaCog>
<Link  className='nav-link' to={'/settings'}  onClick={handleLink}>SETTINGS</Link>
</div> 
    </>
  )
}


    </aside>

      <div className='section1-lower'>
       
      </div>
    </section>

    

    <section className='section2'>






<section className='section2-upper'>

  <article className='section2-search-container'>
  <div style={{color:'green'}} className='font-sub-heading'>powered by Encoded </div>
   <form action="" className='main-page-search-input'>
          <div className='left-block'></div>
        <input type="text" className='input-field ' value={searchInput} placeholder='search'  onChange={(e)=>setSearchInput(e.target.value)}/>
        <div className='right-block  '></div>
      <button   onClick={handleSearch} className='btn btn-primary nav-search-btn' type='submit' ><FaSearch></FaSearch></button>
      </form>

      <button style={{display:'flex',justifyContent:'space-between',}} className="btn btn-primary d-flex align-items-center justify-content-space-between quick-sales-navigator" onClick={()=>navigate('/sales')}>
      
      <FontAwesomeIcon icon={faPlus} />
      <span className="mr-2 font-text">New</span>
    </button>


<div className='divider'> 

<div style={{height:'50%'}} className='user-name font-text'>{userName.length>9?userName.slice(0,9).toUpperCase()+'...':userName.toUpperCase()}</div>


</div>

<div   ><FontAwesomeIcon icon={faUserCircle}  onClick={()=>navigate('/profile')}  style={{cursor:'pointer'}}   size="2x" /></div>
<div className='notification-icon'  onClick={()=>navigate('/notifications')}> <FontAwesomeIcon icon={faBell} /> {
  
    notification.length!==0 &&(
      <>
      <div className='notification-number'>{notification.length}</div>
      </>
    )
  }</div >
<div className='settings-icon'><FontAwesomeIcon icon={faCog}  onClick={()=>navigate('/settings')} style={{cursor:'pointer'}}/></div>
  </article>


  {
    link!=='' && (
      <>
      <article className='section2-inv-container'>
  <LinkNav></LinkNav>


</article>
 
      </>
    )
  }






</section>



<section   className={link===''?'holder':'add-holder'}>
 
{children}
  
</section>








    
    </section>
  </div>

  
</main>

</main>
    
    
    
    
  
  
  </>
 )
}

export default LayOut

































