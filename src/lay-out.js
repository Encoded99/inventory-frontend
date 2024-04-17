     
import React, { useState, useEffect } from 'react'
import { Preloader } from './preloader';
import { Link,  useNavigate,useLocation } from 'react-router-dom'


import { useGlobal, } from './context'
import { FaSearch,  FaShoppingCart, FaHome, FaCog,FaUserShield, FaShoppingBag ,FaPencilAlt,FaChartBar,FaCoins,FaBars  } from 'react-icons/fa'; 
import { HiMenu } from 'react-icons/hi';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';




 const LayOut=({children})=>{

  const {prefix,setSearchInput,searchInput,setSearchData, setIsSearching,setIsPreLoaderRunning,isPreLoaderRunning,} =useGlobal()

  const [userName,setUserName]=useState('')
  
  const [userRole,setUserRole]= useState('')
  const [error,setError]=useState('')

  const navigate= useNavigate()
const location=useLocation()









  const fetchProfile = async () => {



    try {
     
  
   //   setIsPreLoaderRunning(true);
  
      const url = `${prefix}/users/my-profile`;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
  
      const response = await axios.get(url, config);
   
  
      
  
      const profileData = response.data.data.data;
     
         
      if (response.status === 200) {
        
        if(profileData.role!=='admin' && profileData.isVerified!==true ){

    
          navigate('/')
        }


        if(profileData.role!=='admin' && location.pathname==='/admin' ){

     
    
          navigate('/')
        }
  
   
  
        setUserName(profileData.firstName);
     

        
        setUserRole(profileData.role)
     
      
      
      } else {
        
      }
    } catch (error) {
   




      if (error.response.data.message==='unauthorized '){
        navigate('/')

    
      setError(error.response.data.message)
       
      }

     else if (error.request){
        setError('Error connecting to the Server')
      }



     
        //setNoApiError(false);
  
  
      
    } finally {
      // Code here will run whether there was an error or not
//setIsPreLoaderRunning(false)

  
      // ... any other cleanup code ...
    }
  };
  







 
 
  
  useEffect(() => {

 fetchProfile()


   
   
  }, []);




const handleSearch=async(e)=>{

  e.preventDefault()

  if (searchInput===''){
    return
  }
  
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
  setIsPreLoaderRunning(false)
       }
   
     }
   
     catch(err){
      
      
     }
   
   }
  
  










const [isAsideHidden,setIsAsideHidden]=useState(true)
const toggle=()=>{
  //alert('now')
  if(isAsideHidden){
    setIsAsideHidden(false)
  }

  else {
    setIsAsideHidden(true)
  }
}



if(isPreLoaderRunning){
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
    <h4>{error}</h4>
    </div>
  
    </>
  )
}












 return(
  <>


   
    
    <main>

  

<section className='mobile-container'>

<div className='section2-mobile-upper'>
  <div className='section2-first-upper'>
    
  <strong>InventoryHero</strong>
  </div>

  <div className='section2-second-upper'>

  <div className='toggle-btn-container'>
  <HiMenu fontSize={30} style={{marginLeft:'3vw'}} onClick={toggle}></HiMenu>   
      </div>
      <form action="" className='main-page-search-input'>
          <div className='left-block'></div>
        <input type="text" className='input-field ' value={searchInput} placeholder='search'  onChange={(e)=>setSearchInput(e.target.value)}/>
        <div className='right-block  '></div>
      <button   onClick={handleSearch} className='btn btn-primary nav-search-btn' type='submit' ><FaSearch></FaSearch></button>
      </form>
      <div>

      </div>

<div>
  <strong style={{marginRight:'3vw'}}></strong>
</div>
  </div>
<section className='mobile-content-container'>



    <aside className={isAsideHidden?'hide-mobile-aside':'mobile-aside'} >
      <div className='link-container'>
<FaHome className='nav-icon'></FaHome>
<Link  className='nav-link' to={'/dashboard'}>HOME</Link>
</div>

<div className='link-container'>
<FaCoins className='nav-icon'></FaCoins>
<Link  className='nav-link' to={'/sales'}>SALES LOG</Link>
</div>

<div className='link-container'>
<FaShoppingCart className='nav-icon'></FaShoppingCart>
<Link  className='nav-link' to={'/inventory'}>INVENTORY</Link>
</div>


<div className='link-container'>
<FaPencilAlt className='nav-icon'></FaPencilAlt>
<Link  className='nav-link' to={'/register'}>REGISTER</Link>
</div>


<div className='link-container'>
<FaShoppingBag className='nav-icon'></FaShoppingBag>
<Link  className='nav-link' to={'/sales-record'}>SALES RECORD</Link>
</div>

<div className='link-container'>
<FaChartBar className='nav-icon'></FaChartBar>
<Link  className='nav-link' to={'/financials'}>FINANCIALS</Link>
</div>



<div className='link-container'>
<FaCog className='nav-icon'></FaCog>
<Link  className='nav-link' to={'/settings'}>SETTINGS</Link>
</div>

{
  userRole==='admin' && (
    <>
    
    <div className='link-container'>
<FaUserShield className='nav-icon'></FaUserShield>
<Link  className='nav-link' to={'/admin'}>ADMIN</Link>
</div> 
    </>
  )
}

    </aside>
    
 


    <div  className='holder' style={{backgroundColor:''}}>
{children}

</div>
    
   



</section>


</div>


<div className='mobile-footer'><strong >&copy; 2024 Encoded Enterprise</strong></div>
</section>








  
  <main className='input-container container-fluid'>

  








  <div className='row main-section'>
    <section className='section1'>
      <div className='section1-upper'>
        <strong>InventoryHero</strong>
      </div>
      <aside className='aside'>
      <div className='link-container'>
<FaHome className='nav-icon'></FaHome>
<Link  className='nav-link' to={'/dashboard'}>HOME</Link>
</div>

<div className='link-container'>
<FaCoins className='nav-icon'></FaCoins>
<Link  className='nav-link' to={'/sales'}>SALES LOG</Link>
</div>

<div className='link-container'>
<FaShoppingCart className='nav-icon'></FaShoppingCart>
<Link  className='nav-link' to={'/inventory'}>INVENTORY</Link>
</div>


<div className='link-container'>
<FaPencilAlt className='nav-icon'></FaPencilAlt>
<Link  className='nav-link' to={'/register'}>REGISTER</Link>
</div>


<div className='link-container'>
<FaShoppingBag className='nav-icon'></FaShoppingBag>
<Link  className='nav-link' to={'/sales-record'}>SALES RECORD</Link>
</div>

<div className='link-container'>
<FaChartBar className='nav-icon'></FaChartBar>
<Link  className='nav-link' to={'/financials'}>FINANCIALS</Link>
</div>



<div className='link-container'>
<FaCog className='nav-icon'></FaCog>
<Link  className='nav-link' to={'/settings'}>SETTINGS</Link>
</div>

{
  userRole==='admin' && (
    <>
    
    <div className='link-container'>
<FaUserShield className='nav-icon'></FaUserShield>
<Link  className='nav-link' to={'/admin'}>ADMIN</Link>
</div> 
    </>
  )
}


    </aside>

      <div className='section1-lower'>
       
      </div>
    </section>

    

    <section className='section2'>






<div className='section2-upper'>

<div style={{color:'green'}}>powered by Encoded </div>
   <form action="" className='main-page-search-input'>
          <div className='left-block'></div>
        <input type="text" className='input-field ' value={searchInput} placeholder='search'  onChange={(e)=>setSearchInput(e.target.value)}/>
        <div className='right-block  '></div>
      <button   onClick={handleSearch} className='btn btn-primary nav-search-btn' type='submit' ><FaSearch></FaSearch></button>
      </form>

      <button style={{display:'flex',justifyContent:'space-between',}} className="btn btn-primary d-flex align-items-center justify-content-space-between quick-sales-navigator" onClick={()=>navigate('/sales')}>
      
      <FontAwesomeIcon icon={faPlus} />
      <span className="mr-2">New</span>
    </button>


<div className='divider'> </div>
<div style={{height:'50%'}} className='user-name'>{userName.toUpperCase()}</div>
<div className='divider'> </div>
<div><FontAwesomeIcon icon={faUserCircle} size="2x" /></div>
<div className='notification-icon'> <FontAwesomeIcon icon={faBell} /></div >
<div className='settings-icon'><FontAwesomeIcon icon={faCog}  onClick={()=>navigate('/settings')} style={{cursor:'pointer'}}/></div>


</div>


<div className='holder'>
 
{children}
  
</div>








    
    </section>
  </div>

  
</main>

</main>
    
    
    
    
  
  
  </>
 )
}

export default LayOut

































