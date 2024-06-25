const { model } = require("mongoose");
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index= async (req,res,next)=>{
    const allListings= await Listing.find({});
res.render("listings/index.ejs", { allListings });
}


//rendering new form
module.exports.renderNewForm = async(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","Please login to create new listing");
       return res.redirect("/login")
    }
    res.render("listings/new.ejs")

}


//show listing
module.exports.showListings = (async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","path doesn't exists!!");
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
});


//posting new listing(create)
module.exports.createListing = async (req, res,next) => { 
  let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing= await newListing.save();
    console.log(savedListing);
    req.flash("success","new listing created!!")
    res.redirect("/listings");
}



//render edit form
module.exports.renderEditForm = async (req,res,next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","path doesn't exists!!");
        res.redirect("/listings")
    }
    let originalImageurl = listing.image.url;
    originalImageurl = originalImageurl.replace("/upload","/upload/w_250");
    console.log(originalImageurl);
    res.render("listings/edit.ejs",{listing,originalImageurl})
}

module.exports.updateListing = async(req,res,next)=>{
    let { id } = req.params;
    req.body.listing.image = {
            url: req.body.listing.image,
            filename: ""
        }
        if(!req.body.listing){
            throw new ExpressError(400,"Send Valid data for listing")
        }  
        if(typeof req.file !== "undefined")  {
        let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save();
        } 
        
       req.flash("success","Listing Updated")
        res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async(req,res,next)=>{
    let {id} = req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
        req.flash("success","Listing deleted!!")

    res.redirect("/listings");
    

}