const express=require("express");
const app=express();
const port=3000;
const fs=require("fs");
const x=require("./MOCK_DATA.json");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users",(req,res)=>{
    if(req.query.id){
        const item=x.find((item)=>item.id==req.query.id);
        if(item){
            const html=`<h1>${item.first_name} ${item.last_name}</h1><p>${item.email}</p><p>${item.gender}</p>`;
            res.send(html);
        }else{
            res.status(404).send("<h1>user not found</h1>");
        }
    }else{
        const html=x.map((item)=>{return`<h2>${item.first_name} ${item.last_name}</h2>`}).join("");
        res.send(html);
    }
});
app.put("/users/put",(req,res)=>{
    console.log(req.body);
    x.push({...req.body,id:x.length+1});
    fs.writeFile("MOCK_DATA.json",JSON.stringify(x),(err)=>{
        console.log(err);
    });
    res.send("<p>data received</p>");
});
app.delete("/users/delete/:id",(req,res)=>{
    const index=x.findIndex((item)=>item.id==req.params.id);
    if(index>=0){
        x.splice(index,1);
    }
    fs.writeFile("MOCK_DATA.json",JSON.stringify(x),(err)=>{
        console.log(err);
    });
    res.send("<p>data deleted</p>");
});
app.post("/users/post",(req,res)=>{
    const index=x.findIndex((item)=>item.id==req.body.id);
    if(index>=0){
        x[index]={...x[index],first_name:req.body.first_name};
    }
    fs.writeFile("MOCK_DATA.json",JSON.stringify(x),(err)=>{
        console.log(err);
    });
    res.send("<p>Update Complete</p>");
});
app.use((req,res)=>{
    res.status(404).send("<h1>page not found</h1>");
});
app.listen(port,(error)=>{
    console.log("server is running on port "+port);
})