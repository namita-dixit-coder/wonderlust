
const mongoose = require('mongoose');
const initData = require("../init/data.js")
const Listing = require("../models/listing.js")
main().
then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ 
    ...obj,
    owner: "6665de595f15e8e90ddc9923",
 }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();
