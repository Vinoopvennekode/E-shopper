const mongoose=require('mongoose')


const connectDB=async()=>{
    try{
        const db=await mongoose.connect(process.env.MONGODB_CONNECT,{
            useUnifiedTopology:true,
            useNewUrlParser:true

        })
        console.log(`mongdb connected:${db.connection.host}`);
    }catch(error){
        console.log(error.message);
        process.exit()
    }
}

module.exports = connectDB