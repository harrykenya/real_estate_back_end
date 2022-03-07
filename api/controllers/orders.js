const  mongoose = require('mongoose');
const Order= require('../models/order');
const Product = require( '../models/listing');

exports.orders_get_all = (_req, res, _next )=> {
  Order.find()
  .select('product quantity _id')
  .populate('product','name')
  .exec()
  .then(docs => {
    res.status(200).json(docs);
    count:docs.length
    orders: docs.map(doc=>{ 
      return{
        _id:doc._id,
        product:doc.product ,
        quantity:doc.quantity,
        Request:{
          type:'POST',
          url: 'http://localhost:3000/orders/'+doc_id
        },
      }
    });
    })
  .catch(err =>{
    res.statusCode(500).json({
      error:err
    })
  })
}

exports.orders_create_order =  (req, res, _next ) => {
  Product.findById(req.body.productId)
  .then(product =>{
    if(!product){
      return res.status(404).json({
        message:'product not found'
      })
    }
    const order = new order ({
      _id: mongoose.Types.ObjectId(),
      quantity:req.body.quantity,
      product:req.body.productId
    });
     return order
    .save()
  })
  .then(result =>{
    console.log(result);
    res.status(201).json({
      message:'Order stored',
      createdOrder:{
        _id: result._id,
        product:result.product,
        quantity:result.quantity
      },
      request:{
        type:'GET',
        url:'http://localhost:3000/orders/ '+ result._id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
          });
        });
      }

 exports.orders_get_order = (req, res, _next ) => {
  Order.findById(req.params.orderId)
  .populate('product')
   .exec()
   .then(order=>{
     if(!order){
       return res.status(404).json({
         message:'Order  not found'
       });
     };
     res.status(200).json({
         order: order,
         request:{
           type:'GET',
           url:'http://localhost:3000/orders'
         }
     })
   })
  .catch(err =>{
    res.status(500).json({
    error: err  
    })
  })
 }     

 exports.orders_delete_orders =  (req, res, _next ) => {
  Order.remove({_id: req.params.orderId})
  .exec()
  .then(result=>{
   res.status(200).json({
       order: order,
       request:{
         type:'POST',
         url:'http://localhost:3000/orders',
         body:{productId:'ID', quantity:'Number'}
       }
   })
  .catch(err =>{
   res.status(500).json({
   error: err  
   })
 })
 });
 }