const Listing = require("../models/listing.js");

const Review = require("../models/review.js");


module.exports.createReview =async(req,res)=>{

    let listing = await Listing.findById(req.params.id);

   let newRaview = new Review(req.body.review);
      newRaview.author = req.user._id;
   listing.reviews.push(newRaview);
   await newRaview.save();
   await listing.save();
   req.flash("sucess","New Review Created!");
 

     res.redirect(`/listings/${listing._id}`);
     
  };


  module.exports.distroyReview =async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted!");

    res.redirect(`/listings/${id}`);
  };