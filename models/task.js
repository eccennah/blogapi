const {Schema, model} = require('mongoose');


const task = new Schema({
    title:{type:string, required:true},
    userId: {
        type: String,
        required: true,
    },
    state:{
        type:String,
        default:'pending',
    }
    

})



const taskModel = model('tasks',task)

module.exports = {taskModel}