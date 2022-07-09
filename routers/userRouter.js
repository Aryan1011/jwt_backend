const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//register
router.post("/", async (req, res) => {
    try {
        const { email, name, batch, branch, phone, about, password, passwordVerify } = req.body;

        //validation
        if (!email || !name || !batch || !branch || !phone || !about || !password || !passwordVerify)
            return res.status(400)
                .json({ errorMessage: "Please Enter all required fields." });


        if (password.length < 6)
            return res.status(400)
                .json({ errorMessage: "Please Enter all password with at least 6 characters" });

        if (password !== passwordVerify)
            return res.status(400)
                .json({ errorMessage: "Please Enter matched passwords" });


        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res.status(400)
                .json({ errorMessage: "Account with this Email Exist" });


        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // save a new user account to thte db

        const newUser = new User({
            email, name, batch, branch, phone, about, passwordHash
        })

        const savedUser = await newUser.save();

        // sign the token
        const token = jwt.sign({
            user: savedUser._id,
        },
            process.env.JWT_SECRET
        );

        // send the token in a http only cookie
        res.cookie("token", token, {
            httpOnly: true,
        })
            .send();


    } catch (err) {
        console.err(err);
        res.status(500).send();
    }


});

//log in

router.post("/login", async (req, res) => {
    try {
        const { email, password} = req.body;

        //validate
        if (!email || !password)
            return res.status(400)
                .json({ errorMessage: "Please Enter all required fields." });


        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(401)
                .json({ errorMessage: "Wrong Email or Password" });

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect)
            return res.status(401)
                .json({ errorMessage: "Wrong Email or Password" });

        // sign the token
        const token = jwt.sign({
            user: existingUser._id,
        },
            process.env.JWT_SECRET
        );

        // send the token in a http only cookie
        res.cookie("token", token, {
            httpOnly: true,
        })
            .send();

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

// set cookie expire
router.get("/logout",(req,res)=>{
    res.cookie("token","",{
        httpOnly:true,
        expires: new Date(0)
    })
    .send();
});

// is the token with you valid
router.get("/loggedIn",(req,res)=>{
    try{
        const token =  req.cookies.token;
        if(!token) return res.json(false);

        jwt.verify(token, process.env.JWT_SECRET);
        res.send(true);
    }
    catch(err){
        console.error(err);
        res.json(false);
    }
})



module.exports = router;