const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const express=require("express")
const app=new express()

app.get("/",(req,res)=>{
    res.send("wellcome to all")
})


app.listen(3001,()=>{
    console.log("server running on 3001");
})