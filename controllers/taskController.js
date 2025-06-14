const taskModel = require('../models/task')


const create = async(req,res) => {
    try{
        const task = new Task({
            title :req.body.title,
            userId: req.userId
        });
        await task.save();
        res.status(200).json({message:"Task has been created"})
    } catch(err){
        res.status(400).json({error:err.message});
    }
};

const deleteTask = async(req,res) =>{
    try { 
       const deletedTask = await taskModel.findByIdAndDelete(req.params.id);
    }
}



module.exports = {
    create,
    delete,
    update,
}