const express=require("express");
const app=express();
const dotenv=require("dotenv");
dotenv.config();
const port=process.env.PORT;
const Router=require("./controller/authrouter");
app.use(Router);
app.get("/",(req,res)=>{
    res.json({message:"Hello World"})
});
app.listen(port,(err)=>{
    if(err){
        console.log("Not connected",err);
    }
    console.log("Connected to port",port);
});