const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsycn = require('../utils/wrapAsync.js');
const { isLoggedIn,isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/",)
.get(wrapAsycn(listingController.index))
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsycn(listingController.createListing)
    );

//New Route
router.get("/new", 
isLoggedIn, 
listingController.renderNewForm);

//update route
router.route("/:id")
.get(wrapAsycn(listingController.showListings))
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsycn(listingController.updateListing))
.delete(isLoggedIn, 
    isOwner, 
    wrapAsycn(listingController.destroyListing))


//Edit Route
router.get("/:id/edit", 
isLoggedIn,
isOwner,
wrapAsycn(listingController.renderEditForm));


module.exports = router;