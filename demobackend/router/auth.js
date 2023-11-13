const express= require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

require('../db/conn');

const User = require('../models/userSchema');

router.get('/',(req,res)=>
{
    res.send("Hello world from router")
});


//SIGNUP ROUTER


router.post('/userregisterapi',async (req,res)=>
{
    // console.log(req.body);
    // res.json({message:req.body});

    

    const {name,email,phone,password,cpassword} = req.body;

    if(!name || !email || !phone || !password ||!cpassword)
    {
        return res.status(422).json({error:"Please fill the fileds"})
    }

    try
    {
        const userExist = await User.findOne({email:email});

        if(userExist)
        {
            return res.status(422).json({error:"User already exsist"});
  
        }
        else if(password !== cpassword)
        {
            return res.status(422).json({error:"Password do not match"});
        }
        else
        {
            
        const finalusers = new User({name,email,phone,password,cpassword});

        await finalusers.save();
        res.status(201).json({message:"User Registered successfully"});
        }

    }
    catch(err)
    {
        console.log(err);
    }
})

//LOGIN ROUTER


router.post('/userloginapi',async (req,res)=>
{

    // console.log(req.body);
    // res.json({message:"Awsome"});

    try{
    const{email,password} = req.body;

    if(!email || !password)
    {
        return res.status(400).json({error:"PLease fill the data"})
    }

    const loginusers =await  User.findOne({email
    :email});

    console.log(loginusers);

    if(loginusers)
    {
        const isMatch = await bcrypt.compare(password,loginusers.password);

       const  token = await loginusers.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken",token,{
            expires:new Date(Date.now()+259000000),
            httpOnly:true
        });

        if( !isMatch)
        {
            res.status(400).json({error:"Invalid cridentials"});
        }
        else{
            res.json({message:"User logged in Sucessfuly"});
        }
    }
    else
    {
        res.status(400).json({message:"User does not exsist"});
    }

    }
    catch(err)
    {
        console.log(err);
    }
})


router.get("/getdata/:email", async (req, res) => {
    try {
        const {email} = req.params;
        const indivisualuser = await User.findOne({email:email});
        console.log(indivisualuser);
        res.status(201).json(indivisualuser);
    }
    catch (error) {
        console.log(error);
        res.status(422).json(error);
    }
})


router.get("/logout",(req,res)=>{
    console.log("hello logout about");
    res.clearCookie("jwtoken",{path:"/"});
    res.status(200).send("user logout");
  });

module.exports = router;