const express=require('express')
const admin_route=new express()


admin_route.set("view engine","ejs");
admin_route.set("views","./views/admin");