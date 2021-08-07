const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;
require('./db/conn');
const Register = require("./models/register");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");

//get the data from input field

app.use(express.urlencoded({ extended: false }));

// ---------------------------------html connection code start-------------------------------------- 
// below line use for html page run

// const path = require("path");
// const static_path = path.join(__dirname,"../public");
// console.log(static_path);
// app.use(express.static(static_path));

//----------------------------------html connection code end---------------------------------------


// ---------------------------------hbs connection code start-------------------------------------- 
// below line use for page hbs run
const path = require("path");
const template_path = path.join(__dirname, "../template/views");
const parl_path = path.join(__dirname, "../template/partials");
app.set("view engine", "hbs");
app.set("views", template_path);

hbs.registerPartials(parl_path);

//----------------------------------hbs connection code end---------------------------------------
// app.get("/", (req, res)=>{
//     res.send("this is login form");
// });

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    try {
        const pass = req.body.pass;
        const confirmpas = req.body.cpass;
        if (pass === confirmpas) {
            const registerEmployee = new Register({
                firstname: req.body.fname,
                lastname: req.body.lname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.pass,
                confirmpas: req.body.cpass
            })

            // this is middle ware part
            const token = await registerEmployee.generateAuthToken();
            console.log(`this is token generator part ${token}`);
            // middle ware part end
            const registered = await registerEmployee.save();
            console.log(registered);
            res.status(201).render("index");

        } else {
            console.log("not matching");
        }
    } catch (err) {
        res.status(400).send(err);
    }
});


// login check

app.post("/login",async(req, res) => {
    try {
        const lemail = req.body.lemail;
        const lpassword = req.body.lpassword;
        const checkemail = await Register.findOne({email : lemail});

        const isMatch = await bcrypt.compare(lpassword, checkemail.password);
         // this is middle ware part
         const token = await checkemail.generateAuthToken();
         console.log(`this is login token generator part ${token}`);
         // middle ware part end
       if(isMatch){
        res.status(201).render("index");
        console.log('successfully login');
       }
       else{
        console.log('invalid details');
       }
    } catch (error) {
        res.status(400).send("invalid email Or Password");
    }
});

// -----------------------------password hashing using bcrypt -------------------------------//

// const securePass = async (password)=>{
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordMatch =await bcrypt.compare(password,passwordHash);
//     console.log(passwordMatch);

// }

// securePass("farrukh123");



//---------------------------------------Generate token when user login------------------------------------------

//jwt.sign({given unique id},secret key min 32 keyword,{login expire time});

// const createToken =async()=>{
//     const token = await jwt.sign({_id:"610c09649853cd0e3c1f5720"},"thisisfarrukhferoziamfullstackwebdeveloper",{
//         expiresIn:"2 second"
//     });
//     console.log(token);

//     // for user verify
//     const userver = await jwt.verify(token, "thisisfarrukhferoziamfullstackwebdeveloper");
//     console.log(userver);

// }

// createToken();

app.listen(port, () => {
    console.log(`this app is run on port no. ${port}`);
});

// test test