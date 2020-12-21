const mongoose = require('mongoose')
/**
 * author
 * like
 * createdAt
 * content
 * imageUrl
 * comment
 */

 const PostSchema = new mongoose.Schema({
     like:{
         type: Array,
     },
     content:{
         type: String,
     },
     imageUrl:{
         type: Array,
     },
     comment:{
         type: Array,
     },
     author:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'User',
     }
     
 },{
     timestamps: true,
 });

 const PostModel = mongoose.model('Post', PostSchema);

 module.exports = PostModel;