import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import App from './App';

import { AppProvider } from './context';
import { QueryClientProvider,queryClient } from './query-provider';
import './index.css'
import Login from './login';
import SignUp from './sign-up';
import Home from './dashboard';
import LayOut  from './lay-out';
import Register from './register';

import SalesRecord from './sales-record';
import SalesOrder from './sales'
import Invetory from './inventory';
import History  from './inventory-history';
import Search from './search';
import ProductInfo from './item-info';
import EditProduct from './edit-product';
import AddToInventory from './add-inventory';
import Report from './report';
import Settings from './settings';
import Admin from './admin';
import  Subscription  from './subscription';
import { Preloader } from './preloader';
import { ForgotPassWord } from './forgot-password';
import ErrorBoundary from './error-boundary';
import { Revenue } from './revenue';
import Notification from './notification';
import Upgrade from './upgrade';



//import{load} from './App'
//every object to be rendered must be imported to the root file in this case index.js...last file listed will always be the file to be rendered //

const router=createBrowserRouter(
  [
    {
      path:'/',
      element:<App></App>,
      exact:true
    },



    {
      path:'/sign-up',
      element:(
        <>
      <ErrorBoundary>
        
      <SignUp></SignUp>

        </ErrorBoundary>  
        
        </>
      )
      
      
      
      
    },



    {
      path:'/log-in',
      element:(
        <>
      <ErrorBoundary>
        
      <Login></Login>

        </ErrorBoundary>  
        
        </>
      )
      
      
      
      
    },



    {
      path:'/lay-out',
      element:(
        <>
      <ErrorBoundary>
        
      <LayOut></LayOut>

        </ErrorBoundary>  
        
        </>
      )
      
      
      
      
    },

    {
      path:'/dashboard',
      element:(
        <>
      <ErrorBoundary>
        <Home></Home>
        </ErrorBoundary>  
        
        </>
      )
      
      
    },




    {
      path:'/register',

      element:(
        <>
      <ErrorBoundary>
      <Register></Register>
        </ErrorBoundary>  
        
        </>
      )


    
      
    },
    {
      path:'/sales-record',

      element:(
        <>
      <ErrorBoundary>
      <SalesRecord></SalesRecord>
        </ErrorBoundary>  
        
        </>
      )
     
      
    },

    {
      path:'/sales',

      element:(
        <>
      <ErrorBoundary>
      <SalesOrder></SalesOrder>
        </ErrorBoundary>  
        
        </>
      )

      
    },

    {
      path:'/inventory',
      element:(
        <>
      <ErrorBoundary>
      <Invetory></Invetory>
        </ErrorBoundary>  
        
        </>
      )
    
      
    },

   
    {
      path:'/inventory/history',
      element:(
        <>
      <ErrorBoundary>
      <History></History>
        </ErrorBoundary>  
        
        </>
      )
    
      
    },


    {
      path:'/search',

      element:(
        <>
      <ErrorBoundary>
      <Search></Search>
        </ErrorBoundary>  
        
        </>
      )
 
      
    },

    {
      path:'/product-info',

      element:(
        <>
      <ErrorBoundary>
      <ProductInfo></ProductInfo>
        </ErrorBoundary>  
        
        </>
      )
      
    },

    {
      path:'/edit-product',
      element:(
        <>
      <ErrorBoundary>
      <EditProduct></EditProduct>
        </ErrorBoundary>  
        
        </>
      )
    
      
    },
    
    {
      path:'/add-inventory',

      element:(
        <>
      <ErrorBoundary>
      <AddToInventory></AddToInventory>
        </ErrorBoundary>  
        
        </>
      )
    
      
    },
    

        
    {
      path:'/financials',
      element:(
        <>
      <ErrorBoundary>
      <Report></Report>
        </ErrorBoundary>  
        
        </>
      )
   
      
    },

    {
      path:'/financials/revenue',
      element:(
        <>
      <ErrorBoundary>
      <Revenue></Revenue>
        </ErrorBoundary>  
        
        </>
      )
   
      
    },


    {
      path:'/profile',
      element:(
        <>
      <ErrorBoundary>
      <Settings></Settings>
        </ErrorBoundary>  
        
        </>
      )
     
      
    },

    {
      path:'/settings',
      element:(
        <>
      <ErrorBoundary>
      <Admin></Admin>
        </ErrorBoundary>  
        
        </>
      )
   
      
    },

    {
      path:'/notifications',
      element:(
        <>
          <ErrorBoundary>
          <Notification>
       
       </Notification> 

          </ErrorBoundary>
    
        
        </>
      )
      
      
    },


    {
      path:'/subscriptions',
      element:(
        <>
         <ErrorBoundary>
        <Subscription></Subscription> 

          </ErrorBoundary>
        
        </>
      )
      
      
    },


    {
      path:'/subscriptions/upgrade',
      element:(
        <>
         <ErrorBoundary>
        <Upgrade></Upgrade> 

          </ErrorBoundary>
        
        </>
      )
      
      
    },










    {
      path:'preloader',
      element:(
        <>
      <ErrorBoundary>
      <Preloader></Preloader>
        </ErrorBoundary>  
        
        </>
      )
      
    },
    
    {
      path:'forgot-password',
      element:(
        <>
      <ErrorBoundary>
      <ForgotPassWord></ForgotPassWord>
        </ErrorBoundary>  
        
        </>
      )
    }
    
    
    
    
    
  
     
   
  ]
)


ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RouterProvider router={router}></RouterProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);