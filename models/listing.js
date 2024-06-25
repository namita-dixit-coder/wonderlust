const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require("./review.js");  

const listingSchema = new Schema({
    title: {
        type: String,
       // required: true,
    },
    description: String,
    image: {
    url:String,
    filename:String,
  },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    category:{
        type:String,
        enum: ["farm","arctic","camping","trending","mountains","deserts","forests","pools","castles","Iconic Cities","Rooms"]

    }
  }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}})
        console.log('reviews also deleted')
    }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
