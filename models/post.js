const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,

    },

    shortDesc: {
        type: String,
        required: true,
    },

    link: {
        type: String,
    },

    ingredients: {
        type: String,
        required: true,
    },

    recipe: {
        type: String,
        required: true,
    },

    tags:[{
        require:true,
        type: String
    }] ,
    
    createdAt:{
        type:String,
        required:true,
    },

    recipeImg:{
        type: String
    },

    savedBy:[
        {
            type: mongoose.ObjectId
        }
    ]

});


const Post = mongoose.model("Post", postSchema);

module.exports = Post;