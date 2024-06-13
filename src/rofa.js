import slugify from 'slugify'
import User from '../database/models/users.js'
import Exception from '../utils/exception.js'
import validateProduct from '../validations/product.validation.js'
import { validateInventory,validateSales } from '../validations/product.validation.js'
import Msg from '../utils/resMsg.js'
import Product from '../database/models/products.js'
import Inventory from '../database/models/inventory.js'
import Sales from '../database/models/sales.js'
import Costs from '../database/models/costs.js'
import Lasts from '../database/models/lasts.js'
import Changes from '../database/models/change.js'

import generateInvoice from '../utils/pdf-generator.js'
//cloudinary code start here'
import {config} from 'dotenv';
import cloudinary from 'cloudinary';
import { findOne } from './authentication.js'
import moment from 'moment-timezone';
import mongoose, { Mongoose } from 'mongoose'
import logger from '../utils/logger.js'







//mport '

config()

 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
 })

const userAttributes = 'firstName lastName email telephone address'

const sellerInclude = {
  path: 'seller',
  select: userAttributes,
}





export async function addProduct(req, res, next) {
  const session = await mongoose.startSession();







  
  try {
    session.startTransaction();
    const data = req.body;
    const userID = req.user._id;
    const user = await User.findById(userID);
    const userShop= req.user.shop

    


    if (!user) {
      return res.status(404).send('You are not authorized to perform this action');
    }


const doesProductExist = await Product.findOne({
  $or: [{ sku:data.sku }, {name:data.name }],shop:userShop
})

if (doesProductExist) throw new Exception('product already exist in your inventory, please check the name or sku ', 400)


    const transactionDate=  moment(data.transactionDate).tz('Africa/Lagos').toDate();

   
   


  

    if (!data.brand || data.brand.trim() === '') {
      data.brand = 'N/A';
    }

     if (!data.description || data.description.trim() === '') {
      data.description = 'N/A';
    }
  
  




    const { error } = validateProduct(data);

    if (error) {
      throw new Exception(error.details[0].message, 400);
    }

    const productData = {
      name: data.name,
      image: data.image,
      sku: data.sku,
      brand: data.brand,
      available: data.available,
      status: data.status,
      upb: data.upb,
      currentPrice: data.price,
      measurement: data.measurement,
      category: data.category,
      description: data.description,
      createdBy: { firstName: user.firstName, lastName: user.lastName },
      available:true,
      status:'verified',
    };

    const westAfricaExpirationDate = moment(data.expiryDate).tz('Africa/Lagos').toDate();

    const inventoryData = {
      batch: data.batch,
      expiryDate: westAfricaExpirationDate,
      quantity: data.quantity,
      price: data.price,
      costPrice:data.costPrice,
      initialQuantity:data.quantity,
      cpq:data.costPrice/data.quantity,
      createdBy: { firstName: user.firstName, lastName: user.lastName },
     
    };

   
   
    const productInstance = new Product({shop:userShop,... productData});


    if (transactionDate){
      productInstance.createdAt = transactionDate; 
    }
  
  
    else{
      productInstance.createdAt = new Date();  
    }
  


    



    await productInstance.save({ session });
    

    const inventoryInstance = new Inventory({ product: productInstance._id,shop:userShop, ...inventoryData });
    

    if (transactionDate){
      inventoryInstance.createdAt = transactionDate; 
    }
  
  
    else{
      inventoryInstance.createdAt = new Date();  
    }


    await inventoryInstance.save({ session });



  



const changeData={
  quantityChange:data.quantity,
  createdBy: { firstName: user.firstName, lastName: user.lastName },
}




const changeInstance= new Changes({shop:userShop,inventory:inventoryInstance._id,product:productInstance._id,...changeData,})



if (transactionDate){
  changeInstance.createdAt = transactionDate; 
}


else{
  changeInstance.createdAt = new Date();  
}




 await  changeInstance.save({session})



 




    await session.commitTransaction();

    Msg(res, { product: productInstance, inventory: inventoryInstance }, 'Product added to the inventory', 201);
  } catch (error) {
    await session.abortTransaction();
    if (error.name === 'MongoError' && error.code === 11000) {
      // Duplicate key error (code 11000)
      return res.status(400).send('Duplicate key error: The SKU/Name already exists.');
    }
    next(new Exception(error.message, error.status));
  } finally {
    session.endSession();
  }
}





export const addInventory=async(req,res,next)=>{

  const session= await mongoose.startSession()




  try{

  session.startTransaction()
    const { id } = req.params
    const userID = req.user._id;
    const userShop= req.user.shop
    const user = await User.findOne({_id:userID,shop:userShop});
  
    const data = req.body;
    const transactionDate=  moment(data.transactionDate).tz('Africa/Lagos').toDate();

    if (!user) {
      return res.status(404).send('You are not authorized to perform this action');
    }



  
    const { error } = validateInventory(data);

    if (error) {
      throw new Exception(error.details[0].message, 400);
    }
const inventoryData={
  batch: data.batch,
  expiryDate:data.expiryDate,
  quantity: data.quantity,
      price: data.price,
      costPrice:data.costPrice,
      initialQuantity:data.quantity,
      cpq:data.costPrice/data.quantity,
      createdBy: { firstName: user.firstName, lastName: user.lastName },
}


const product= await Product.findById(id)
if(!product){
  return  res.status(404).send('product not found');
}


const updatedProduct= await Product.findOneAndUpdate({_id:id}, {$set:{currentPrice:data.price}},{new:true, session})

const  InventoryInstance= new Inventory({product:updatedProduct._id,shop:userShop,...inventoryData})
if (transactionDate){
  InventoryInstance.createdAt = transactionDate; 
}


else{
  InventoryInstance.createdAt = new Date();  
}


await   InventoryInstance.save({session})


const invID= InventoryInstance._id


const changeData={
  quantityChange:data.quantity,
  createdBy: { firstName: user.firstName, lastName: user.lastName },
}




const changeInstance= new Changes({shop:userShop,inventory:InventoryInstance._id,product:product._id,...changeData})



if (transactionDate){
  changeInstance.createdAt = transactionDate; 
}


else{
  changeInstance.createdAt = new Date();  
}




await   changeInstance.save({session})



const total= await Inventory.find({_id:product._id,shop:userShop,},{session})




const TotalAtHand=total.map((item)=>item.quantity).reduce((item,acc)=>{
return item + acc
},0)

if(TotalAtHand>=product.restockLevel){
  await Product.findOneAndUpdate({_id:id}, {$set:{isRestock:true}},{new:true, session})
}

else{

  await Product.findOneAndUpdate({_id:id}, {$set:{isRestock:false}},{new:true, session})

}


 await  session.commitTransaction()


  return res.status(200).send({Inventory:InventoryInstance,product:updatedProduct })


    

  }


  catch(err){
  await  session.abortTransaction()
  console.log(err, 'error from inventory');
    res.status(500).send('internal server error')

   
  }


  finally{

    session.endSession()

  }

}











export async function findProduct(req, res, next) {



  try {






    const { id } = req.params


    const product= await Product.findById(id)


    if(!product){
      res.status(404).send('product not found')

      return
    }



    const result = await Product.aggregate([


      {
        $match:{
          _id:  new mongoose.Types.ObjectId(id)
        }
    
    
      },
    
      {
        $lookup:{
          from:'inventories',
          foreignField:'product',
          localField:'_id',
          as:'inventoryData'
          
        }
      },
      
      {
       $sort:{
      createdAt:-1
       }


      }
    
    
    
    
    
    
    
    ])


    





 return res.status(200).send(result)






   
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}




export  const recordSales=async(req,res,next)=>{


  
    const session= await mongoose.startSession()
  
    try{

      






      const userShop= req.user.shop


   





  
  
      session.startTransaction()
      
      const {id}= req.params
      const data=req.body


      
      const userID = req.user._id;
  

let transactionDate=null
if (data.date){
   transactionDate=  moment(data.date).tz('Africa/Lagos').toDate();
}



     


      



  





    
  
      const user = await User.findOne({_id:userID,shop:userShop});
  if (!user) {
    return res.status(404).send('You are not authorized to perform this action');
  }
  
     
  
  const product=  await Product.findById(id)
  
  if (!product){
    return res.status(404).send('product not found')
  }
  
  
  
  const {error}=validateSales(data)
  
  if (error){
    throw new Exception(error.details[0].message, 400);
  }
  
  
  let temporaryQuantity=data.quantity
  let permanentQuantity=data.quantity
  
  if(data.packages==='bulks'){
  
  
    temporaryQuantity= data.quantity * product.upb
    permanentQuantity= data.quantity * product.upb
  
  }
  
  


    




  


  
  
  
  
  const populatedProduct= await Product.aggregate([
  
  
    {
      $match:{
        _id:  new mongoose.Types.ObjectId(id)
      }
  
  
    },
  
    {
      $lookup:{
        from:'inventories',
        foreignField:'product',
        localField:'_id',
        as:'inventoryData'
        
      }
    },
    
    {
     $sort:{
    expiryDate:1
     }
  
  
    }
  
  
  
  
  
  
  
  ])
  
 
  const inventory= populatedProduct[0].inventoryData




  if (inventory.length === 0) {
  
    await session.abortTransaction();
  return res.status(400).send("The product you're attempting to sell is currently out of stock, kindly check the inventory level and restock.");


}




  const  allInventoryQuantity= inventory.map((inv)=>{
    return inv.quantity
  }).reduce((item,acc)=>{


    return item+acc

  },0)





  const itemInBulk=allInventoryQuantity/product.upb
 

  if (temporaryQuantity>allInventoryQuantity){

    await session.abortTransaction();
    return res.status(400).send(`The quantity you are trying to sell exceeds the available quantity in the inventory. you have ${itemInBulk} quantities in bulk and  ${allInventoryQuantity} quantities in pieces, please check the inventory and try again.`);
     
  }

  const endDate= moment(data.date).toDate()
const pastQuantity= await Changes.aggregate([
     {
      $match:{
        shop:new mongoose.Types.ObjectId(userShop),
        createdAt: {
          $lte:endDate
        },
        product:new mongoose.Types.ObjectId(id),
      }
     },{
      $group:{
        _id:null,
        quantity:{
          $sum:"$quantityChange"
        }
      }
     }
])


let totalPast=0

if (pastQuantity.length!==0){
  totalPast=pastQuantity[0].quantity
}



if (pastQuantity.length===0 || temporaryQuantity>totalPast){
  await session.abortTransaction();
    return res.status(400).send(`It seems like you're trying to sell items that is more than what you have in your inventory as at the specified sales record date. Please make sure to record them before proceeding with the sale, you can also check your inventory report and  history for guidance`);

}

let salesCost=0;

 
  
  for (let i=0; i< inventory.length; i++){
  
    const element= inventory[i]



    if (element){





      if (element.quantity>0){

        if (temporaryQuantity>=element.quantity){
      
           salesCost+=element.quantity*element.cpq
          temporaryQuantity-=element.quantity;
      
          element.quantity=0;
          if (element.quantity === 0) {
      
      
      const inventoryInstance= await Inventory.find({product:element.product})
      
      if (inventoryInstance.length===1){
      
        const firstObject= inventoryInstance[0]
      
      
       
      const foundLast= await Lasts.findOne({product:firstObject.product})
      
      
      
      const newObj = {
        price: firstObject.price,
        createdBy: firstObject.createdBy,
        costPrice: firstObject.costPrice,
        cpq: firstObject.cpq,
        batch: firstObject.batch,
        expiryDate: firstObject.expiryDate,
        product: firstObject.product,
        createdAt: firstObject.createdAt,
        shop:userShop
      };
      
      
      
      
      
      
      
      
      if (foundLast){
      
      
      
      
        try{
       const  updatedLast= await Lasts.findOneAndUpdate(
        { product: firstObject.product,shop:userShop },
        newObj,
        { new: true, session: session }
      );
         
          
       }
       
       catch(err){
         console.log('error updating last',err)
        }
      
      
      
      }
      
      
      else{
      
        
      
      
        try{
          const newDocument = new Lasts(newObj);
           await newDocument.save({ session });
       
         
       }
       
       
       catch(err){
         console.log ('error creating a new last',err)
       }
       
      
      }
      
      
      
      
      
      
      
      
        
      }
      
      
      
      
            await Inventory.deleteOne({ _id: element._id }).session(session);
          }
      
        }
      
        else {
      
          salesCost+=temporaryQuantity*element.cpq
      
          element.quantity-=temporaryQuantity;
      
          await Inventory.updateOne({_id:element._id},{$set:{quantity:element.quantity}}).session(session)
      
          break
        }
      
      
      
      
      
         }
        



else {
   
  Msg(res, 'The inventory is empty', 401);
}






    }




  
  
  
  
  }
  

  




  const  afterInventoryQuantity= totalPast-permanentQuantity




  const salesData={

    
   
  
    packages:data.packages,
    ppu:data.ppu,
    quantity:permanentQuantity,
    cost:data.cost,
    createdBy:{ firstName: user.firstName, lastName: user.lastName },
    buyingCost:salesCost

  }
  



 


  const salesInstance= new Sales({product:id,shop:userShop,...salesData})





  if (transactionDate){
    salesInstance.createdAt = transactionDate;

 
  }



  
  await salesInstance.save({ session });



const negativeChange= -1 * permanentQuantity

  const changeData={
    quantityChange:negativeChange,
    createdBy: { firstName: user.firstName, lastName: user.lastName },
  }
  
  
  
  
  const changeInstance= new Changes({shop:userShop,sales:salesInstance._id,product:product._id,...changeData})
  
  
  
  if (transactionDate){
    changeInstance.createdAt = transactionDate; 
  }
  
  
  else{
    changeInstance.createdAt = new Date();  
  }
  
  
  
  
   await  changeInstance.save({session})


  

   await session.commitTransaction()

 
  
  



  
  
  
  
  
  
  Msg(res, { result: salesData }, 'sales recorded sucessfully', 201);
  
  
  
  
  
  
      
  
    }
  
    catch(err){
  
      await session.abortTransaction()

      console.log('error recording sales',err);
  
    }
  
  
    finally{
  
      session.endSession()
  
    }
  
  }
  














export async function fetchProducts(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      throw new Exception(
        "you don't have the privilege to perform the action",
        400
      )
    }
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'seller',
        select: userAttributes,
      })
      .populate([
        {
          path: 'reviews',
          select: 'review',
          populate: { path: 'user', select: 'firstName email _id' },
        },
      ])
      .exec()

    
     



    Msg(res, { products, })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function fetchVerifiedProducts(req, res, next) {



  try {

    const userShop=req.user.shop

    const products=  await Product.aggregate([

      {
        $match:{
          shop:  new mongoose.Types.ObjectId(userShop)
        }
      },

      {
        $lookup:{
  
            from:'inventories',
            localField:'_id',
            foreignField:'product',
            as:'inventoryData',
  
        },
      
      },
      
      {
        $sort:{
          "salesData.createdAt": -1,
        }
      }
  
    ])
    




    Msg(res, { products,})
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}


export async function fetchUnwindVerifiedProducts(req, res, next) {

  
  
    try {
      const userShop=req.user.shop
  
  
  const products=  await Product.aggregate([



    {
      $match:{
        shop:  new mongoose.Types.ObjectId(userShop)
      }
    },




    {


      $lookup:{

          from:'inventories',
          localField:'_id',
          foreignField:'product',
          as:'inventoryData',

      },
    
    },
    {
      $unwind: {
        path: '$inventoryData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort:{
        "salesData.createdAt": -1,
      }
    }

  ])
  

 
  
  
      Msg(res, { products,})
    } catch (err) {
      next(new Exception(err.message, err.status))
    }
  }









  export const fetchSalesRecord = async (req, res, next) => {
    const { date, reportType } = req.params;
  
   

  
    const startDate = moment(date).startOf(reportType).toDate();
  
    const startChange = moment(date).endOf('day').toDate();
  
    try {
      const userShop=req.user.shop





      const results = await Sales.aggregate([
        {
          $match: {
            shop: new mongoose.Types.ObjectId(userShop),
            createdAt: {
              $gte: moment(date).startOf('day').toDate(),
              $lt: moment(date).endOf('day').toDate()
            }
          }
        },
        {
          $lookup: {
            from: 'changes',
            localField: '_id',
            foreignField: 'sales',
            as: 'saleChanges'
          }
        },
        {
          $unwind: '$saleChanges'
        },
        {
          $lookup:{
            from:"changes",
            let: { salesChangeCreatedAt: '$saleChanges.createdAt', product: '$saleChanges.product' },
            pipeline:[
              {
                $match: {
                  $expr:{
                    $and:[
                      {$lt:['$createdAt',"$$salesChangeCreatedAt" ]},
                      {$eq:[  '$product',"$$product" ]}
                    ]
                  }
                }
              }
            ],
            as:"refinedChanges"
          }
        },
        {
          $unwind:'$refinedChanges',
        },
        {
          $lookup:{
            from:'products',
            foreignField:'_id',
            localField:"product",
            as:'salesProduct'
          }
        },
        { $unwind:'$salesProduct' },
        {
          $group:{
            _id:'$_id',
            quantityBefore:{
              $sum:"$refinedChanges.quantityChange"
            },
            name:{
              $first:"$salesProduct.name",
            },
            sku:{
              $first:"$salesProduct.sku",
            },
            product:{
              $first:"$salesProduct._id",
            },
            upb:{
              $first:"$salesProduct.upb",
            },
            category:{
              $first:"$salesProduct.category",
            },
            quantity:{
              $first:"$quantity"
            },
            packages:{
              $first:"$packages"
            },
            buyingCost:{
              $first:"$buyingCost"
            },
            cost:{
              $first:"$cost"
            },
            ppu:{
              $first:"$ppu"
            },
            createdBy:{
              $first:"$createdBy",
            },
            createdAt:{
              $first:"$createdAt",
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ]);
      

     
     










   
      return res.status(200).send( results);
    } catch (error) {
      console.error('Error fetching sales record:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  






export const fetchCostsRecord = async (req, res, next) => {
  const {date,reportType} =req.params
 


  




const startDate = moment(date).startOf(`${reportType}`).tz('UTC').toDate();




  try {

    const userShop=req.user.shop


    const results = await Product.aggregate([

      {
        $match:{
          shop:  new mongoose.Types.ObjectId(userShop)
        }
      },
  
    
      {
        $lookup: {
          from: 'costs',
          localField: '_id',
          foreignField: 'product',
          as: 'costsData',
        }
      },

      {
        $unwind: "$costsData" 
      },

      
      {
        $match: date
          ? {
              "costsData.createdAt": {
                $gte: startDate,
                $lt: moment(startDate).endOf(`${reportType}`).toDate()
              }
            }
          : {} // Empty match condition if dateToSearch is not provided
      },
      
      {
        $sort: {
          "costsData.createdAt": -1
        },
      }
    ]);

  
   

  return res.status(200).send(results);
  } catch (error) {

    console.log(error, 'error from cost')
    console.error('Error fetching sales record:', error);
    res.status(500).send('Internal Server Error');
  }
}















export const editProduct=async(req,res,next)=>{

  const {id}= req.params

  const data= req.body

  const userShop=req.user.shop

try{

  const product =await Product.findOne({_id:id,shop:userShop})
  if(!product){
    res.status(404).send('product not found')
  }

  const result = await Product.findByIdAndUpdate(id, data, {
    new: true,
  })

  Msg(res, { products: result })


}


catch(err){

  res.status(500).send('internal server error')

}



}






export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    if (!product) throw new Exception('product  not found ', 400)

    const data = await Product.findByIdAndUpdate(product._id, req.body, {
      new: true,
    }).lean()

    Msg(res, { product: data })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function updateProductStatus(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    if (!product) throw new Exception('product  not found ', 400)

    product.status = req.body.status
    product.available = req.body.available

    const data = await Product.findOneAndUpdate(
      { _id: product._id },
      { ...product },
      {
        new: true,
      }
    )

    Msg(res, { product: data })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function userDeleteProduct(req, res, next) {

const session= await mongoose.startSession()
  try {

      session.startTransaction()
    const { id } = req.params
    const userShop=req.user.shop

const item= await Product.findOne({_id:id,shop:userShop})

if(!item){
  return res.status(404).send('product not found')
}
const image= item.image

const cloudId=image.map((item)=>{
  return item.cloudId || undefined
})


const validCloudId = cloudId.filter((element) => element !== undefined);

 await Sales.deleteMany({product:id}).session(session)
 await Inventory.deleteMany({product:id}).session(session)
await  Changes.deleteMany({product:id}).session(session)
 await Lasts.deleteMany({product:id}).session(session)

    const product = await Product.findOneAndDelete(
      { _id: id, }).session(session)


    if (validCloudId.length) {

      for (let i=0;i<cloudId.length;i++){
        const element=cloudId[i]
          const result = await cloudinary.uploader.destroy(element)
         console.log(`Deleted resource with public_id: ${element}`, result)
          }
    
      
    }


 await session.commitTransaction()
 


    Msg(res, { product: 'product deleted' })
  }
  
  catch (err) {

    await session.abortTransaction()
    next(new Exception(err.message, err.status))
  }


finally{
  await session.endSession()
}

}


















export async function adminDeleteProduct(req, res, next) {
  try {
  
    const { id } = req.params
    const item= await Product.findOne({_id:id})
    const image= item.image

  const cloudId=image.map((item)=>{
  return item.cloudId || undefined
})


const validCloudId = cloudId.filter((element) => element !== undefined);

    const product = await Product.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
        deletedAt: new Date(),
      }
    )

    if (validCloudId.length) {

      for (let i=0;i<cloudId.length;i++){
        const element=cloudId[i]
          const result = await cloudinary.uploader.destroy(element)
          console.log(`Deleted resource with public_id: ${element}`, result)
          }
     
    }



    Msg(res, { product: 'product deleted' })
  }
  
  
  catch (err) {
    next(new Exception(err.message, err.status))
  }
}



export async function searchProducts(req, res, next) {

  const { query} = req.query
  


  try {






   

const userShop= req.user.shop





const products = await Product.aggregate([
  {
    $match: {
      $and: [
        {
          $or: [
            { name: { $regex: `.*${query}.*`, $options: 'i' } },
            { sku: { $regex: `.*${query}.*`, $options: 'i' } },
            { category: { $regex: `.*${query}.*`, $options: 'i' } }
          ]
        },
        { shop:  new mongoose.Types.ObjectId(userShop) }
      ]
    }
  },
  {
    $lookup: {
      from: 'inventories',
      localField: '_id',
      foreignField: 'product',
      as: 'inventoryData'
    }
  },
  {
    $limit: 10
  }
]);







  

    if (!products) throw new Exception('products  not found ', 400)

    Msg(res, { products })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}







export const deleteSalesRecord= async(req,res,next)=>{
  const session = await mongoose.startSession();
  const {id,prd}=req.params
  const userID=req.user._id
  const userShop=req.user.shop
  const user = await User.findOne({_id:userID,shop:userShop});
  if (  !user){
    return res.status(404).send('You are not authorized to perform this action');
  }
  try{
    
    
    session.startTransaction();

    
const sale= await Sales.findById(id)
const inventories= await Inventory.find({product:prd})




if(inventories.length===0){
  const LastInvArrays= await Lasts.find({product:prd,shop:userShop})

  if (LastInvArrays.length!==0){
    const firstObject= LastInvArrays[0]
    const newObj = {
      price: firstObject.price,
      createdBy: firstObject.createdBy,
      costPrice: firstObject.costPrice,
      quantity: sale.quantity,
      cpq: firstObject.cpq,
      batch: firstObject.batch,
      expiryDate: firstObject.expiryDate,
      product: firstObject.product,
      createdAt: firstObject.createdAt,
      shop:userShop
    };

    const createdInv= new Inventory(newObj)
 await   createdInv.save({session})

  }
}


else{
 
  const firstInv= inventories[0]
  firstInv.quantity+=sale.quantity
 await firstInv.save({session})
 
}


await   Sales.findByIdAndDelete(id).session(session)

await   Changes.findOneAndDelete({sales:id}).session(session)

await session.commitTransaction()


return res.status(200).json({message:"record deleted sucessfully"})
  }

  catch(err){
    console.log(err);
    await session.abortTransaction()
    return  res.status(500).json({ error: 'Internal Server Error' });
  }

  finally{
    session.endSession();
  }
}












export async function fetchSeller(req, res, next) {
  try {
    const uniqueSellers = await Product.find().distinct('seller')
    const sellers = await User.find({
      _id: { $in: uniqueSellers },
    }).select(userAttributes)

    Msg(res, { sellers })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}


export const userFetchUnverifiedProducts=async(req,res,next)=>{


  const session= await mongoose.startSession()
  try{
    const userId  = req.user._id
    if(!userId){
  return   res.status(400).json({message:'unauthorized user'})
    }



    
    const products= await Product.find({$or:[{available:false,seller:userId},{status:'pending',seller:userId}]})
  


 return res.status(200).json({success:true,data:products})
   

  }



  catch(err){
    console.log(err);
  return  res.status(500).json({ error: 'Internal Server Error' });
 }


}










export const uploadCloudinary = async (req, res) => {

 




  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the buffer to a base64-encoded string
    const base64String = req.file.buffer.toString('base64');


    const folder = 'inventory'; 
  




    // Upload the base64-encoded string to Cloudinary
    const result = await cloudinary.v2.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`, {
      resource_type: 'auto',
    });

    // Respond with the Cloudinary upload result
    const uploadedImage = {
      url: result.secure_url,
      type: result.format,
      cloudId: result.public_id,
    };

 //   console.log('Uploaded image:', uploadedImage);
    return res.status(200).json(uploadedImage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




  export const editInventory=async(req,res,next)=>{


    const session = await mongoose.startSession();
    const {id}= req.params
    const data= req.body
    const userID = req.user._id;
    const user = await User.findById(userID);






if(data.expiryDate){
  data.expiryDate=moment(data.expiryDate).tz('Africa/Lagos').toDate();
}


if (data.transactionDate){

  data.createdAt= moment(data.transactionDate).tz('Africa/Lagos').toDate();

}





    if (!user || user.role!=='admin') {
      return res.status(404).send('You are not authorized to perform this action');
    }

  try{
    session.startTransaction();
    
const product= await Inventory.findById(id)




const comingQuantity= data.quantity



const quantitySold= product.initialQuantity-product.quantity

if(quantitySold===0){
 


  if (data.quantity){
    data.initialQuantity=data.quantity
  }




}




else if (quantitySold>0) {

 
data.initialQuantity=data.quantity

if (quantitySold>data.quantity){
  await session.abortTransaction();
  return   res.status(400).send(`The quantity entered conflicts with the quantity sold`);
}


else{
  data.quantity-=quantitySold
}




}




    if (data.costPrice && !data.quantity){
      data.cpq= data.costPrice/product.quantity
    }
    
    if (!data.costPrice && data.quantity){
      data.cpq= product.costPrice/comingQuantity
    }

    if (data.costPrice && data.quantity){
      data.cpq= data.costPrice/comingQuantity
    }
   

    
const inventoryInstance = await Inventory.findByIdAndUpdate(id, data, {
  new: true,
})

await inventoryInstance.save({session})











if (data.quantity){
  const changeData= {
    quantityChange:data.quantity
  }
  
  const changeInstance= await Changes.findOneAndUpdate({inventory:id},changeData,{new:true})

await changeInstance.save({session})

}








await session.commitTransaction();


Msg(res,  { message: 'batch updated' });

  
  
  }


  catch(err){
    await session.abortTransaction();
     console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  
  }
finally{
  session.endSession();
}
  
  
  }



  export const deleteInventory=async(req,res,next)=>{
    const session = await mongoose.startSession();
    const {id}= req.params
    const userID = req.user._id;
    const user = await User.findById(userID);

    if (!user || user.role!=='admin') {
      return res.status(404).send('You are not authorized to perform this action');
    }


    try{

      session.startTransaction()
      await Inventory.findByIdAndDelete(id).session(session)
      await   Changes.findOneAndDelete({inventory:id}).session(session)
      await session.commitTransaction();
      Msg(res, { message: 'batch deleted' } );

    }


    catch(err){

      await session.abortTransaction();
      console.error(err);
     return res.status(500).json({ error: 'Internal Server Error' });

    }

    finally{
      session.endSession();
    }


  }




  

  export const deleteAllSales=async(req,res)=>{
    const session = await mongoose.startSession();
    try{
      session.startTransaction();
const sales= await Sales.find()




const Inventories= await Inventory.find()

for (const sale of sales){
  const foundInventory = Inventories.find(inv => inv.product.equals(sale.product));


  
  if (foundInventory){
    foundInventory.quantity += sale.quantity;
   await foundInventory.save({ session })
   await Sales.deleteOne({ _id: sale._id }).session(session); 
  }

  else{
    
    await session.abortTransaction();
    return res.status(400).json({ message: 'No matching inventory. Transaction aborted.' });

  }
}

await session.commitTransaction();

// Send final response after all updates are done
return res.status(200).json({ message: 'All sales deleted successfully' });

    }


    catch(err){

      await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' })

    }

    finally {
      session.endSession();
    }

  }


export const fetchIndividualSales=async(req,res,)=>{


const userShop=req.user.shop


const {reportType,id}=req.params






  
  try{


    const today = new Date();



let start =moment(today).startOf(`${reportType}`)
const  groupStart =moment(today).startOf('year')


if (reportType==='one-week'){
  start=moment(today).subtract(1,'week')
}

if (reportType==='one-month'){
  start=moment(today).subtract(1,'month')
}



if (reportType==='three-months'){
  start=moment(today).subtract(3,'months')
}


if (reportType==='six-months'){
  start=moment(today).subtract(6,'months')
}



if (reportType==='one-year'){
  start=moment(today).subtract(1,'year')
}







  const endOfDay=moment(today).endOf('day').toDate()



const sales= await Sales.aggregate([
  {
    $match:{
      shop: new mongoose.Types.ObjectId(userShop),
      product: new mongoose.Types.ObjectId(id),
      createdAt:{
        $gte:start.toDate(),
        $lte:endOfDay,
      }

    }
  },

  {
    $group:{

      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      sales:{
        $sum:"$cost",
      },

      buyingCost:{
        $sum:"$buyingCost"
      },
      


    }
  }


])





const piecesPrice= await Sales.aggregate([
  {
    $match:{
      shop: new mongoose.Types.ObjectId(userShop),
      product: new mongoose.Types.ObjectId(id),
      packages:'pieces',
      createdAt:{
        $gte:start.toDate(),
        $lte:endOfDay,
      }

    }
  },

  {
    $group:{

      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
       ppu:{
        $last:"$ppu"
       }
      


    }
  }


])



const bulksPrice= await Sales.aggregate([
  {
    $match:{
      shop: new mongoose.Types.ObjectId(userShop),
      product: new mongoose.Types.ObjectId(id),
      packages:'bulks',
      createdAt:{
        $gte:start.toDate(),
        $lte:endOfDay,
      }

    }
  },

  {
    $group:{

      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
       ppu:{
        $last:"$ppu"
       }
      


    }
  }


])











const  groupedRevenue= await Sales.aggregate([
  {
    $match:{
      shop: new mongoose.Types.ObjectId(userShop),
      product: new mongoose.Types.ObjectId(id),
      createdAt:{
        $gte:groupStart.toDate(),
        $lte:endOfDay,
      }

    }
  },

  {
    $group:{

      _id: { $month:"$createdAt"},
      sales:{
        $sum:"$cost",
      },

      buyingCost:{
        $sum:"$buyingCost"
      }

    }
  }


])





  

   


    



    Msg(res,{revenue:sales,grouped:groupedRevenue,wholeSale:bulksPrice,retail:piecesPrice}, 'data fetched successfully', 200);

  }
catch(err){
  console.log(err)

  res.status(500).send('internal server error')
}

}


 
  export const fetchAllRevenue=async(req,res)=>{
    try{



      const userShop= req.user.shop
      const {date,reportType}=req.params

      console.log(reportType,'report type');

      let start= moment(date).startOf(`${reportType}`)
      let end= moment(date).endOf('day')

      if(reportType==='quarter'){

        const falledQuarter=parseInt((moment(date).month()+3)/3)

        console.log(falledQuarter,'falled-quarter');
        start= moment(date).subtract(3,'months')



     switch(falledQuarter){
         case 1:
   
         start=moment().startOf('year')
         end= moment(start).add(3,'months').subtract(1,'day');
         break;
         case 2:
          start=moment().startOf('year').add(3,'months')
          end= moment(start).add(3,'months').subtract(1,'day');
          break;

          case 3:
            start=moment().startOf('year').add(6,'months')
            end= moment(start).add(3,'months').subtract(1,'day');
          break;

          case 4:
            start=moment().startOf('year').add(9,'months')
            end= moment(start).add(3,'months').subtract(1,'day');
          break;

     }

      }

      


      const sales= await Sales.aggregate([
        {
          $match:{

            shop: new mongoose.Types.ObjectId(userShop),
            createdAt:{
              $gte:start.toDate(),
             $lt: end.toDate(),
            }


          }
        },

        {
          $lookup:{
            from:'products',
            foreignField:'_id',
            localField:'product',
            as:'product'
          }
        },
        {
           $group:{
            _id:null,
            sales:{
              $sum:"$cost",
            },
            cost:{
              $sum:"$buyingCost"
            }
           }
        }
      ])






      res.status(200).send({revenue:sales})

    }


    catch(err){


  console.log(err)
      return res.status(500).send('internal server error')
    }

  }



 export  const fetchFinancialData= async(req,res)=>{
    try{


      const {date,reportType}= req.params
      const userShop= req.user.shop
      let start;
      const end=moment(date).endOf(`${date}`)


     
    

      switch(reportType){
        case 'week':
        start=moment(date).subtract(1,'week')
        
        break;

        case 'month':
          start=moment(date).subtract(1,'month')
         
          break;

         case 'six-month':
          start=moment(date).subtract(6,'months')
            break;
            case 'year':
              start=moment(date).subtract(1,'year')
                break;

                case 'ytd':
               start=moment(date).startOf('year')
              break;
    
            


      }


      const lineData= await Sales.aggregate(
        [
          {
           $match:{

            shop:new mongoose.Types.ObjectId(userShop),
            createdAt:{
              $gte:start.toDate(),
              $lt:end.toDate()
            }

           },
          },


          {



            $group:{
              _id:{
                $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
              },
              sales:{
                $sum:"$cost"
              },
             cost:{
                $sum:"$buyingCost"
              },
             } 
          }

           


            
           
          
          
        ]
      )


const barStart= moment(date).startOf('year')


const barData= await Sales.aggregate(
  [

    {
      $match:{
        shop:new mongoose.Types.ObjectId(userShop),
        createdAt:{
          $gte:barStart.toDate(),
          $lt:end.toDate(),
        }
      }
    },
    {
      $group:{
        _id:{
          $dateToString:{
            format:"%m", date:"$createdAt"
          }
        },
        sales:{
          $sum:"$cost"
        },
        
        cost:{
          $sum:"$buyingCost"
        }
      }
      },{
        $sort:{
          _id:1
        }
      }
    
  ]
)

console.log(lineData);



Msg(res, {line:lineData,bar:barData }, 'Financial data fetched', 201);

    }



    catch(err){
      console.log(err);

      res.status(500).send('Internal Server Error')
    }
  }


  export const fetchProductData=async(req,res)=>{

    try{

      const {date,reportType}= req.params
      const userShop= req.user.shop
      let start;
      const end=moment(date).endOf(`${date}`)


     
    

      switch(reportType){
        case 'week':
        start=moment(date).subtract(1,'week')
        
        break;

        case 'month':
          start=moment(date).subtract(1,'month')
         
          break;

         case 'six-month':
          start=moment(date).subtract(6,'months')
            break;
            case 'year':
              start=moment(date).subtract(1,'year')
                break;

                case 'ytd':
               start=moment(date).startOf('year')
              break;
    
            


      }



      const barData=await Sales.aggregate(
        [
          {
            $match:{
              shop: new mongoose.Types.ObjectId(userShop),
              createdAt:{
                $gte:start.toDate(),
                $lt:end.toDate()
              }
            }
          },
          
          {
            $lookup:{
              from:'products',
              foreignField:'_id',
              localField:'product',
              as:'product',
             
            }
          },
      
          
        {
          $unwind: "$product"
        },
          {
            $group:{
              _id:"$product.name",
              sales:{
                $sum:"$cost"
              },
              cost:{
                $sum:"$buyingCost"
              },
              sku:{
                $first:"$product.sku"
              }
            }
          }
        ]
      )







      const pieData=await Sales.aggregate(
        [
          {
            $match:{
              shop: new mongoose.Types.ObjectId(userShop),
              createdAt:{
                $gte:start.toDate(),
                $lt:end.toDate()
              }
            }
          },
          
          {
            $lookup:{
              from:'products',
              foreignField:'_id',
              localField:'product',
              as:'product',
             
            }
          },
      
          
        {
          $unwind: "$product"
        },
          {
            $group:{
              _id:"$product.category",
              sales:{
                $sum:"$cost"
              },
              cost:{
                $sum:"$buyingCost"
              }
            }
          }
        ]
      )





      Msg(res, {pie:pieData,bar:barData }, 'Financial data fetched', 201);

    }

    catch(err){
      console.log(err);

      res.status(500).send('Internal Server Error')
    }

  }



  export const FetchInventoryHistory=async(req,res,)=>{

    try{


      const {date} =req.params
      const userShop= req.user.shop


     

      const endDate= moment(date).endOf('day').toDate()

      

      const history= await Changes.aggregate(
        [
          {
            $match:{
              shop:new mongoose.Types.ObjectId(userShop),
              createdAt:{
                $lte:endDate
              }

            }
          },{
            $lookup:{
              from:'products',
              foreignField:'_id',
              localField:'product',
              as:'product'
            }
          },{
            $unwind:'$product'
          },
          {
            $group:{
              _id:"$product._id",
              name:{
                $first:"$product.name"
                
              },
              sku:{
                $first:"$product.sku"
                
              },
              upb:{
                $first:"$product.upb"
                
              },
              
              quantity:{
                $sum:"$quantityChange"
              },
             
              
            }
          }
        ]
      )

      Msg(res,  { inventory: history });
      

    }

   catch(err){
      console.log(err);

      res.status(500).send('Internal Server Error')
    }


  }



 export  const fetchChanges= async(req,res)=>{
    try {

     


      const userShop=req.user.shop
      const {id,page}=req.params
      const limitNo=8
      const skipNo= (page-1) *limitNo




      const product= await Product.findById(id)
      const inventory= await Inventory.find({product:id, shop:userShop})
const changes= await Changes.aggregate([
  {
    $match:{
      shop:new mongoose.Types.ObjectId(userShop),
      product:new mongoose.Types.ObjectId(id),
  }
},{
  $lookup:{
    from:'changes',
    let:{product:'$product',icreatedAt:'$createdAt',ishop:'$shop'},
    pipeline:[

      {
        $match:{
          $expr:{

            $and:[
              {$eq:['$product','$$product']},
              {$eq:['$shop','$$ishop']},
              {$lte:['$createdAt','$$icreatedAt']}

              
            ]
  
          }
        }

      }
      
    ],
    as:"refinedChange"
  }
},{
  $unwind:"$refinedChange"
},{
  $group:{
    _id:"$_id",
    quantity:{
      $first:"$quantityChange"
    },
    createdBy:{
      $first:"$createdBy"
    },

    createdAt:{
      $first:"$createdAt"
    },
    
    
    quantityAfter:{
      $sum:"$refinedChange.quantityChange"
    }
  }
},{

  $project:{
    _id:1,
    createdBy:1,
    createdAt:1,
    quantityAfter:1,
    quantity:1,
    quantityBefore:{
      $subtract: [ "$quantityAfter", "$quantity" ] 
    }
    
  }

},

{
  $sort:
    { createdAt: -1 }
  
},{
  $skip:skipNo
},{
  $limit:limitNo
}
])





      const allQuantity= inventory.map((item)=>{
        return item.quantity
      }).reduce((item,acc)=>{
         return item + acc
      },0)

const productData={
  name:product.name,
  sku:product.sku,
  upb:product.upb,
  total:allQuantity
}


   Msg(res,  { history: changes,product:productData });
      


    }


 
    catch(err){
      console.log(err);

      res.status(500).send('Internal Server Error')
    }

  }





  export  const fetchChangesReport= async(req,res)=>{
    try {

     


      const userShop=req.user.shop
      const {date,id,reportType}=req.params
      let start;
      const end=moment(date).endOf(`${date}`)
      switch(reportType){
        case 'week':
        start=moment(date).subtract(1,'week')
        
        break;

        case 'month':
          start=moment(date).subtract(1,'month')
         
          break;

         case 'six-month':
          start=moment(date).subtract(6,'months')
            break;
            case 'year':
              start=moment(date).subtract(1,'year')
                break;

        
    
            


      }
    




const changes= await Changes.aggregate([
  {
    $match:{
      shop:new mongoose.Types.ObjectId(userShop),
      product:new mongoose.Types.ObjectId(id),
      createdAt:{
        $gte:start.toDate(),
        $lt:end.toDate()
      }
  }
},{
  $lookup:{
    from:'changes',
    let:{product:'$product',icreatedAt:'$createdAt',ishop:'$shop'},
    pipeline:[

      {
        $match:{
          $expr:{

            $and:[
              {$eq:['$product','$$product']},
              {$eq:['$shop','$$ishop']},
              {$lte:['$createdAt','$$icreatedAt']}

              
            ]
  
          }
        }

      }
      
    ],
    as:"refinedChange"
  }
},{
  $unwind:"$refinedChange"
},{
  $group:{
   
     _id:"$_id",
    createdAt:{
      $first:"$createdAt"
    },
    
    
    quantityAfter:{
      $sum:"$refinedChange.quantityChange"
    }
  }
},

{
  $sort:
    { createdAt: -1 }
  
}
])







   Msg(res,  { history: changes,});
      


    }


 
    catch(err){
      console.log(err);

      res.status(500).send('Internal Server Error')
    }

  }