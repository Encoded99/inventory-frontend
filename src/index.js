import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import App from './App';

import { AppProvider } from './context';
import { QueryClientProvider,queryClient } from './query-provider';
import './index.css'
import Home from './dashboard';
import LayOut  from './lay-out';
import Register from './register';

import SalesRecord from './sales-record';
import SalesOrder from './sales'
import Invetory from './inventory';
import ProductInfo from './item-info';
import EditProduct from './edit-product';
import AddToInventory from './add-inventory';
import Report from './report';
import Settings from './settings';
import Admin from './admin';
import { Preloader } from './preloader';
import { ForgotPassWord } from './forgot-password';



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
      path:'/lay-out',
      element:<LayOut></LayOut>,
      
    },

    {
      path:'/dashboard',
      element:<Home></Home>,
      
    },




    {
      path:'/register',
      element:<Register></Register>,
      
    },
    {
      path:'/sales-record',
      element:<SalesRecord></SalesRecord>,
      
    },

    {
      path:'/sales',
      element:<SalesOrder></SalesOrder>,
      
    },

    {
      path:'/inventory',
      element:<Invetory></Invetory>,
      
    },

    {
      path:'/product-info',
      element:<ProductInfo></ProductInfo>,
      
    },

    {
      path:'/edit-product',
      element:<EditProduct></EditProduct>,
      
    },
    
    {
      path:'/add-inventory',
      element:<AddToInventory></AddToInventory>,
      
    },
    

        
    {
      path:'/financials',
      element:<Report></Report>,
      
    },


    {
      path:'/settings',
      element:<Settings></Settings>,
      
    },

    {
      path:'/admin',
      element:<Admin></Admin>,
      
    },
    {
      path:'preloader',
      element:<Preloader></Preloader>
    },
    
    {
      path:'forgot-password',
      element:<ForgotPassWord></ForgotPassWord>
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