const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { validateReview,isLoggedIn ,isReviewAuthor} = require("../middleware.js");



const reviewController = require("../controllers/review.js");



//Reviews
//post route


router.post("/", isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));

    
     //Delete reviews

     router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.distroyReview));

     module.exports=router;