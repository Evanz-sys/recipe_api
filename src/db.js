import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://Admin:090504Ja@ac-v7rwcxj-shard-00-00.am7mhvv.mongodb.net:27017,ac-v7rwcxj-shard-00-01.am7mhvv.mongodb.net:27017,ac-v7rwcxj-shard-00-02.am7mhvv.mongodb.net:27017/?replicaSet=atlas-8n0285-shard-0&ssl=true&authSource=admin")
        console.log("is connected")
    } catch (error) {
        console.log(error);
    }
}
