const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
require('dotenv').config();

const user = require("../models/users");


verifyToken = (req,res,next) =>{
    let token = req.headers["x-access-token"]
    const authHeader = req.headers.authorization;
    if (authHeader) {
        token = authHeader.split (" ")[1];
    }
    if (!token) {
        return res.status(403).send({message:"Not authorized!"});
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err,decoded) =>{
        if(err) {
              return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};


module.exports = {verifyToken};
