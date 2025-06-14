const userModel = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const create = async(req,res) => {
    const {first_name, last_name, email,password} = req.body;
    try{
        const userexists = await userModel.findOne({
            email: email,
        })
        if (userexists){
           res.json({message:"User already exists"}) }
        const user = await userModel.create({
            first_name:first_name,
            last_name: last_name,
            email:email,
            password:password,

        });
        const secret = process.env.JWT_SECRET;
        const token = await jwt.sign(
            {first_name: user.first_name, email:user.email, _id:user._id},
            secret
        );
        res.status(302).redirect("/login");
    } catch(error){
        console.log(error);
        res.status
    }    
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      email: email,
    });
    // console.log(user)

    if (!user) {
      return  res.status(404).redirect("/signup");

    }

    const validPassword = await user.isValidPassword(password);
    console.log(email);

    if (!validPassword) {
       return res.status(302).redirect("/unknown");

    }

    const token = await jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 });
    res.status(200).redirect("/create");
  } catch (error) {
    console.log(error); 
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
    create,
    login,
};