

import React, { useState, useEffect } from 'react'
import {useQuery,} from 'react-query'
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
//import {shoes, } from './context'
import { useGlobal, input } from './context'
import { FaSearch, FaPhone, FaTimes, FaEnvelope, FaFacebook, FaTwitter, FaInstagram,  FaEye,FaUser , FaCloud, FaPlug } from 'react-icons/fa'; 
import axios from 'axios'
import LayOut from './lay-out';

const timestampInMilliseconds = Date.now();
const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

const dateValue = new Date(timestampInSeconds * 1000);

export const Revenue=()=>{
const {prefix,setIsPreLoaderRunning} =useGlobal()
const [date,setDate]=useState(dateValue)
const report='day'




 return (
  <>

  <LayOut>
  <h1>this is revenue</h1>


  </LayOut>
  
  </>
 )
}
