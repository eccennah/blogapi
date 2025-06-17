const {Schema,model}= require('mongoose')

const articleSchema = new Schema({
    title:{type:String,unique:true,required:true},
    description :{type: String},
    author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
    },
    state: { type: String, 
    default: 'draft'},
     read_count: { type: Number, required: true, default: 0 },
    reading_time:{type: Number },
    tags:{ type:String},
    user_id:{type: Schema.Types.ObjectId,
  ref: 'user'},
    body:{type:String,required:true},
  

},  {timestamps:true})

articleSchema.pre('save', function (next) {
    this.updatedAt = new Date(); 
    next();
  });


const articleModel = model('articles', articleSchema)

module.exports ={
    articleModel
}