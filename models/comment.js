const {Schema,model} = require('mongoose');

const commentScheme = new Schema({
    content:{
        type: String,
        required: true,
    },
    blogID:{
        type: Schema.Types.ObjectId,
        ref: 'blog',
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',

    },
},{timestamps:true}
);

const Comment = model('comment',commentScheme);

module.exports = Comment;