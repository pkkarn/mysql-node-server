const Post = require('../models/postSchema')

async function createPost(newPost) {
  try {
    // Create a new post using the Post model
    const post = await Post.create(newPost);

    return post.toJSON();
  } catch (err) {
    console.error('Error creating post:', err);
  }
}


module.exports = {
    createPost: createPost
}
