const express = require("express");
const path =require("path");
const {connectToMongoDB}=require("./connect");

const URL =require("./models/url");
const cookieParser=require("cookie-parser")
const {restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth");

const staticRoute=require("./routes/staticRouter");
const urlRoute=require("./routes/url");
const userRoute=require("./routes/user")

const app=express();
const port=8002;

connectToMongoDB("mongodb+srv://8477073843dk:7mibhbHXMx3FqWUK@project.alssd.mongodb.net/?retryWrites=true&w=majority&appName=project")
.then(()=>console.log("MongoDB connection established")
);

app.set("view engine","ejs");//for server side rendering 
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);


app.get("/url/:shortId",async (req,res)=>{
   const shortId=req.params.shortId; 
  const entry= await URL.findOneAndUpdate({
        shortId,
   },{
    $push:{
        visitHistory:{
            timestamp:Date.now(),},
    }
   });
   res.redirect(entry.redirectURL);
});

app.listen(port,()=>console.log(`Server Started at PORT ${port}`));
