import React,{useContext, useEffect, useReducer, useState} from "react";



import axios from 'axios'










const AppContext=React.createContext()

export const AppProvider=({children})=>{
   // const [state,dispatch]=useReducer(reducer,initialState)
    //sigcoIn state//
    const local='http://localhost:8080'
    const hosted='https://hero-s1n5.onrender.com'
    
    const prefix=hosted
    const [count, setCount]= useState(1)
    const [tables,setTables]= useState([])
    const [finalCost,setFinalCost]=useState(0)
    const [collatedData,setCollatedData]=useState([])
    const [costData,setCostData]= useState([])

    const [colate, setColate]=useState(true)
    const [loadingMessage,setLoadingMessage]= useState('')
  const [inventoryData,setInventoryData]= useState([])
  const [inventoryBatches,setInventoryBatches] =useState(0)
  const [upb,setUpb]= useState(null)
  const [batchNo, setBatchNo]= useState(0)
  const [specificData, setSpecificData]=useState([])
  const [salesRecordData,setSalesRecordData]= useState([])
  const [salesTotal,setTotal] =useState([])
  const [unwindInventoryData,setUnwindInventoryData]= useState([])
  const [inventoryQuantity,setInventoryQuantity]=useState(0)

  const [userName,setUserName]=useState('')
  const [secondName,setLastName]=useState('')
  const [userEmail,setUserEmail]=useState('')
  const [userNo,setUserNo]=useState('')
  const [userRole,setUserRole]= useState('')
  const [userVerified,setUserVerified]=useState(null)
  const [searchInput,setSearchInput]= useState('')
  const [apiError, setApiError]=useState(null)
const [expiryDateData,setExpiryDateData]= useState([])
const [isPreLoaderRunning,setIsPreLoaderRunning] =useState(false)
const [isSearching,setIsSearching]=useState(false)

    const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const date = new Date(timestampInSeconds * 1000);
const formattedDate = date.toLocaleString();







  
    function arrangeCostData(data) {
        const result = [];

        const tableCount = data.length / 6;
      
        for (let i = 0; i < tableCount; i++) {
          const costIndex = i;
          const packageIndex = i + tableCount;
          const ppuIndex = i + 2 * tableCount;
          const quantityIndex = i + 3 * tableCount;
          const idIndex = i + 4 * tableCount;
          const nameIndex = i + 5 * tableCount;

      
          const costType = data[costIndex];
          const packageType = data[packageIndex];
          const ppuType = data[ppuIndex];
          const quantity = data[quantityIndex];
          const idType=data[idIndex]
          const nameType=data[nameIndex]
      
          const currentObject = {
            cost: costType,
            packages: packageType,
            ppu: ppuType,
            quantity: quantity,
            id:idType,
            name:nameType,
           
          };
      
          result.push(currentObject);
        }
      
        return result;
      }



      const fetchAllProducts=async()=>{
        setIsPreLoaderRunning(true)

    const url=`${prefix}/products/verified`


        try {
 
          const response= await axios.get(url,{withCredentials:true})
        //  console.log(response,'invent');

          const sortedInventory = response.data.data.products.sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);
    setInventoryData(sortedInventory)
    setExpiryDateData(response.data.data.products)
   // console.log(expiryDateData,'expiry date data main')
    const inventoryLength= response.data.data.products.map((item)=>item.inventoryData.length).reduce((acc,cv)=>cv +acc,0)
setInventoryBatches(inventoryLength)
setIsPreLoaderRunning(false)
         
        }


        catch(err){
         // console.log(err,'6t fetch product error');
        }
      }



      const fetchUnwindAllProducts=async()=>{

           setIsPreLoaderRunning(true)
        const url=`${prefix}/products/unwind-verified`
    
    
            try {
    
              const response= await axios.get(url,{withCredentials:true})
           //   console.log(response,'invent');
        setUnwindInventoryData(response.data.data.products)
        setIsPreLoaderRunning(false)
             
            }
    
    
            catch(err){
           //   console.log(err,'6t fetch product error');
            }
          }
    








      const fetchProductInfo=async ()=>{

       
        const itemId= localStorage.getItem('product-id')
      

        setIsPreLoaderRunning(true)
      


      
        const url = `${prefix}/products/${itemId}`
        try{
      
          const response= await axios.get(url,{withCredentials:true})
      
        setSpecificData(response.data)
      
          //console.log(response.data[0].image[0].url,'6t whats response');
          setUpb(response.data[0].upb)
          setBatchNo(response.data[0].inventoryData.length)
          
          setIsPreLoaderRunning(false)
        }
      
        catch(err){
      
        }
      }




const resetLoadingText=()=>{

 
  const t= setTimeout(()=>{

    setLoadingMessage('')
    setApiError(null)
  },5000)


  return ()=>clearTimeout(t)
}




const fetchProfile = async () => {
  setIsPreLoaderRunning(true)


  try {
   

    //setIsPreLoaderRunning(true);

    const url = `${prefix}/users/my-profile`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    const response = await axios.get(url, config);
 

    //console.log('check profile reponse what is response', response);
    //console.log('profile-Data res',response.status);

    if (response.status === 200) {
      const profileData = response.data.data.data;
    //  console.log('API Response:', response);
       
 
    //  console.log('Final state isv:', profileData.isVerified);
    //console.log('isVerified:', profileData.isVerified);
      setUserName(profileData.firstName);
      setLastName(profileData.lastName);
    
      setUserNo(profileData.telephone);
      setUserEmail(profileData.email);
      setUserRole(profileData.role)
      setUserVerified(profileData.isVerified);
      

      setIsPreLoaderRunning(false)
     // setUserVerified(profileData.isVerified)

    //  console.log('username', userName);

    //  console.log('check profile fetched sucessfully inside function BEFORE STATE SET', noApiError);
      //setNoApiError(true);
   
    } else {
      //console.log('response.data', response.data);
    }
  } catch (error) {
 
      //setNoApiError(false);
  

    
  } finally {
    // Code here will run whether there was an error or not



    // ... any other cleanup code ...
  }
};


 








     
    



    return(
        <AppContext.Provider value={
            {
          prefix,
          count,
          setCount,
           tables,
           setTables,
           setFinalCost,
           finalCost,
            colate,
            setColate,
            collatedData,
            setCollatedData,
            arrangeCostData,
            setCostData,
            costData,
            loadingMessage,
            setLoadingMessage,
            fetchAllProducts,
            fetchUnwindAllProducts,
            inventoryData,
            expiryDateData,
            setInventoryData,
            unwindInventoryData,
            upb,
            setUpb,
            batchNo,
            setBatchNo,
            specificData,
            fetchProductInfo,
            formattedDate,
            setCostData,
            resetLoadingText,
            salesTotal,
            inventoryQuantity,
            setInventoryQuantity,
            fetchProfile,
            userName,
            secondName,
            userEmail,
            userNo,
            userRole,
            userVerified,
            setSearchInput,
            searchInput,
            apiError,
            setApiError,
            inventoryBatches,
            isPreLoaderRunning,
            setIsPreLoaderRunning,
            isSearching,
            setIsSearching,
         
               
            }
        }>
            {children}
        </AppContext.Provider>
    )


    
}

export const useGlobal=()=>{
    return useContext(AppContext)
}
