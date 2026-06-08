const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const fs=require("fs");
dotenv.config();
const port=process.env.PORT;
const Router=require("./controller/authrouter");
const frontendOrigin=process.env.FRONTEND_URL || "http://localhost:5173";
const taskRouter=require("./controller/crud");
app.use(cors({
    origin:frontendOrigin,
    credentials:true
}));
app.use(cookieParser());
app.use(Router);
app.use(taskRouter);

app.listen(port,(err)=>{
    if(err){
        console.log("Not connected",err);
    }
    console.log("Connected to port",port);
});