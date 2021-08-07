const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    gender:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    age:{
        type:Number,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    confirmPas:{
        type:String,
        require:true
    },
    tokens:[{
        tokenn:{
            type:String,
            require:true
        }
    }]
})


// token generator part use in app.js page

employeeSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        // const token = jwt.sign({_id:this._id.toString()}, "mynameisfarrukhferoziamfullstackwebdevloper");
        // secret key direct islye m yha nhi likh rha ho jb bhi host kronga to secret key chori hone ka dr h tu iske
        // lye .env file create krta ho or wha ja kr secret key derha ho or npm i dotenv package install krha ho
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({tokenn : token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}



// pre method m hm password ko hashing krhe hote h or iske undr jo save function likha h wo bad m run hoga pehle
// pre function run hoga then data add krega save function app.js k file m jha add ka function likha h

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        console.log(`before hasing password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`after hasing password is ${this.password}`);
    }
})

// now we create a collection

const Register = new mongoose.model("register",employeeSchema);
module.exports = Register;