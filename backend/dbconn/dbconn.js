const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient, GridFSBucket } = require('mongodb'); 

let bucket;

const connectToMongo = async ()=> {
    try {
       await mongoose.connect(process.env.MONGO_ATLAS)
       console.log("Connected To ATLAS")

       // Initialize MongoClient for GridFS
       const client = new MongoClient(process.env.MONGO_ATLAS);
       await client.connect();
       const db = client.db(); // Get the database instance
       bucket = new GridFSBucket(db, { bucketName: 'uploads' });
       console.log('GridFSBucket initialized')
       }
       
     catch (error) {
        console.log(`Failed to connect to ATLAS, trying to connect to local`, error)
        try {
                await mongoose.connect(process.env.MONGO_LOCAL)
                console.log("Connected To LOCAL");
        } catch (error) {
            console.log(`Something went wrong, cant connect to ATLAS or LOCAL`, error)
        }
    }
}

// Function to get the initialized bucket
const getBucket = () => {
    if (!bucket) {
        throw new Error('GridFSBucket has not been initialized yet');
    }
    return bucket;
};


module.exports = { connectToMongo, getBucket }