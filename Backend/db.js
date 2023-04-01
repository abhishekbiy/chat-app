const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDatabase = ()=>{
    // console.log(process.env.DB_PASS);
    mongoose.connect(`mongodb+srv://mern-chat:${process.env.DB_PASS}@cluster0.s4khifz.mongodb.net/chatappdata?retryWrites=true&w=majority`).then(()=>console.log('connected to database'))
    .catch(e=>{
        console.log("error connecting to database");
        console.log(e)
    });
}

module.exports=connectDatabase;