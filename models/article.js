const {Schema,model}= require('mongoose')

const articleSchema = new Schema({
    title:{type:String,unique:true,required:true},
    description :{type: String},
    author:{type:String,required:true },
    state: { type: String, 
    default: 'draft'},
     read_count: { type: Number, required: true, default: 0 },
    reading_time:{type: Number },
    tags:{ type:String},
    body:{type:String,required:true,},
    timestamp:{}
})

articleSchema.pre('save', function (next) {
    this.updatedAt = new Date(); 
    next();
  });


const articleModel = model('articles', articleSchema)

module.exports ={
    articleModel
}