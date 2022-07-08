const router = require("express").Router();
const Member = require("../models/memberModel");
const auth =require("../middleware/auth");

router.post("/", auth ,async (req,res)=>{
    try{
        const {name} = req.body;
        const newMember = new Member({
            name
        });
        const savedMember = await newMember.save();
        res.json(savedMember);
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }
})

router.get("/",auth, async (req,res)=>{
    try{
       const members = await Member.find();
       res.json(members);
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }  
})

module.exports = router;