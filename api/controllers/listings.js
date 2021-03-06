const mongoose = require('mongoose');
const Listing = require('../models/listing');


exports.listings_get_all = (_req, res, _next )  => {
  Listing.find()
  .select('name price location _id listingImage garage bedrooms bathrooms sqft listingdate descriptionn realtor')
  .populate('realtor', 'name')
  .exec()
  .then(docs => {
    const response ={
      count:docs.length,
      listings: docs.map(doc =>{ 
        console.log(doc);
        return{
          name:doc.name,
          price: doc.price,
          location:doc.location,
          listingImage: doc.listingImage,
          garage:doc.garage,
          bedrooms:doc.bedrooms,
          bathrooms:doc.bathrooms,
          sqft:doc.sqft,
          listingdate:doc.listingdate,
          description:doc.description,
          realtor:doc.realtor,          
          _id: doc._id,
          request: {
            type: 'GET',
            url:'http://localhost:3000/listings/'+ doc._id
          }
        }
      })
    }
    // if (docs.length>= 0){
      res.status(200).json(response);
    // }else {
    //   res.status(404).json({
    //     message:' no entries found'
    //   })
    // }
   
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}


exports.listings_create_listing =  (req, res, _next )  => {
  const listing = new Listing({
    _id: new mongoose.Types.ObjectId(),
    name:req.body.name,
    price: req.body.price,
    location: req.body.location,
    listingImage:req.body.listingImage,
    garage:req.body.garage,
    bedrooms:req.body.bedrooms,
    bathrooms:req.body.bathrooms,
    sqft:req.body.sqft,
    description:req.body.description,
    realtor:req.body.realtor
  });
  listing.save()
  .then(result => { //save is a method provided by mongoose models
    console.log(result);
    res.status(201).json({
      message:"created listing successfully",

      createdListing: {
        name:result.name,
        price:result.price,
        location:result.location,
        _id:result._id,
        listingImage:result.listingImage,
        garage:result.garage,
        bedrooms:result.bedrooms,
        bathrooms:result.bathrooms,
        sqft:result.sqft,
        listingdate:result.listingdate,
        description:result.description,
        realtor:result.realtor,
        request:{
          type:'POST',
          url:'http://localhost:3000/listings/'+ result._id
        }
      }
    });
  })

  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
  }
  
 

exports.listings_get_listing =  (req, res, _next) => {
  const id = req.params.listingId;
  Listing.findById(id)
  .select('name price location _id listingImage garage bedrooms bathrooms sqft listingdate description')
  .populate('realtor', 'name')
  .exec()
  .then(doc => {
    console.log("from database", doc);
    res.status(200).json(doc);
    if (doc){
      res.status(200).json({
        listing: doc,
        request:{
           type: 'GET',
           url:'http://localhost:3000/listings/'
        }
      });
    }else{
      res.status(404).json({message:'No valid entry found for provided ID'});
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err});
  });
}


exports.listings_update_listing = (req, res, _next) => {
  const id = req.params.listingId;
 const updateOps = {};
 for (const ops of req.body){
   for(let key of Object.keys(ops)){
    updateOps[key] = ops[key];
   }   
 }
  Listing.updateOne({_id: id}, {$set: updateOps })
  .exec()
  .then(result => {
    res.status(200).json({
        message:'listing updated',
        request:{
          type:'POST', 
          url:'http://localhost:3000/listings/'+ id
        }
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
}

exports.listings_delete_listing = (req, res, _next) => {
  const id = req.params.listingId;
  Listing.remove({_id: id })
  .exec()
  .then(result => {
    res.status(200).json({
      message:'listing deleted',
      request:{
        type:'GET',
        url:'http://localhost:3000/listings/',
        body:{name: 'String', price: 'Number',location:'String',listingImage:'String',garage:'Number',bedrooms:'Number',bathrooms:'Number',sqft:'Number',listingdate:'Number',realtor:'String',description:'String'}
      }
    });
  })
  .catch(err =>{
    res.status(500).json({
      error: err
    });
  });//removing object in DB that fulfill the criteria
}