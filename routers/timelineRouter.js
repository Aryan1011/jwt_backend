const router = require("express").Router();
const Timeline = require("../models/timelineModel");
const auth =require("../middleware/auth");

router.post("/", auth ,async (req,res)=>{
    try{
        const {name} = req.body;
        const newTimeline = new Timeline({
            name
        });
        const savedTimeline = await newTimeline.save();
        res.json(savedTimeline);
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }
})

router.get("/",auth, async (req,res)=>{
    try{
       const timelines = await Timeline.find();
       res.json(timelines);
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }  
})

module.exports = router;