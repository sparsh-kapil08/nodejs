const express=require("express");
const app=express();
const Router=express.Router();
const db=require("../db");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));


Router.post("/signup",async (req,res)=>{
    console.log(req.body);
    if(!req.body.email || !req.body.password || !req.body.name){
        return res.status(400).json({message:"Please provide all the details"})
    }
    const check=await db.query("SELECT * FROM USERS WHERE email=$1",[req.body.email]);
    if(check.rows.length>0){
        return res.status(400).json({message:"User already exists"})
    }
    else{
        const pass=await bcrypt.hash(req.body.password,10);
        const user=await db.query("INSERT INTO USERS(email,password,name) VALUES($1,$2,$3) RETURNING id",[req.body.email,pass,req.body.name]);
        if(user){
            const token=jwt.sign({id:user.rows[0].id},process.env.SECRET,{
                expiresIn:"1h"
            });
            res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none"
            });
            return res.status(201).json({message:"User created successfully",});

        }
        else{
            return res.status(400).json({message:"Internal Server Error"});
        }
    }
});

Router.post("/login",async (req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message:"Please provide all the details"})
    }
    const user=await db.query("SELECT * FROM USERS WHERE EMAIL=$1",[req.body.email]);
    if(user.rows.length==0){
        return res.status(400).json({message:"User does not exist"})
    }
    else{
        const valid=await bcrypt.compare(req.body.password,user.rows[0].password);
        if(!valid){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        else{
            const token=jwt.sign({id:user.rows[0].id},process.env.SECRET,{
                expiresIn:"1h"
            });
            res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none"
            });
            return res.status(200).json({message:"User logged in successfully",user:user.rows[0]});
        }
    }
});
Router.post("/logout",(req,res)=>{
    res.cookie("token","",{
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    res.json({message:"User logged out successfully"})
})
Router.get("/home",async (req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    else{
        try{
            const check=jwt.verify(token,process.env.SECRET);
            return res.status(200).json({message:"Welcome to the home page",user:check.id})
        }
        catch(err){
            return res.status(401).json({message:"Unauthorized/Wrong Credentials"})
        }
    }
});
module.exports=Router;
