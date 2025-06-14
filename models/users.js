const {Schema,model} = require('mongoose');
const bcrypt = require('bcrypt')


const userSchema = new Schema({
    first_name: {
        type:String,
        required: true
    },
    last_name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: { type: String, required: true },
})

async function hashpassword(next){
    const user = this ;

    if (!user.isModified('password')) return next();

    try{
        const hash = await bcrypt.hash(user.password, 5);
        user.password = hash;
        next();

    } catch(err){
        next(err);
    }
}
userSchema.pre("save", hashpassword)

userSchema.methods.isValidPassword = async function (password) {

    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
    
}


const userModel=model('users', userSchema)

model.exports={
    userModel
}