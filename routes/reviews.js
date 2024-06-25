const express = require("express");
const router = express.Router( {mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js")
//Posting Reviews
router.post("/",isLoggedIn,validateReview, 
wrapAsync(reviewController.createReview));

//Deleting Reviews
router.delete("/:reviewId",
isLoggedIn,
isReviewAuthor,
wrapAsync(reviewController.destroyReview)
);

module.exports = router;
