const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
  title: {
    type: String,
    required: true,
    minlength: 6,
  },
  text: {
    type: String,
    required: true,
    minlength: 6,
  },
  author: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

const Post = mongoose.model("Post", postSchema)

module.exports = Post
