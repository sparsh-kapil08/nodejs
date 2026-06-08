const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");
const cors=require("cors");
dotenv.config();
const port=process.env.PORT;
const Router=require("./controller/authrouter");
app.use(cors({
    origin: process.env.URL,
    credentials: true
}))
app.use(cookieParser());
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