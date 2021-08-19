const Post = require("../models/Post")
const User = require("../models/User")


exports.createNewPost = async (req, res) => {

          const newPost = new Post(req.body)

          try {
                    const savedPost = await newPost.save()

                    res.status(200).json(savedPost)
          } catch (err) {
                    res.status(500).json(err)
          }
}

exports.updatePost = async (req, res) => {
          
          const post = await Post.findById(req.params.id)
          
          try {

                    if (post.userId === req.body.userId) {
                              await post.updateOne( 
                                        {
                                                  $set: req.body
                                        }
                              )

                              res.status(200).json("The Post Has Been Updated")
                    } else {
                              res.status(403).json("You Can Only Update Your Post")
                    }
          } catch (err) {
                    res.status(500).json(err)
          }
}

exports.delPost = async (req, res) => {
          
          const post = await Post.findById(req.params.id)
          
          try {

                    if (post.userId === req.body.userId) {
                              await post.deleteOne()

                              res.status(200).json("The Post Has Been Deleted")
                    } else {
                              res.status(403).json("You Can Only Delete Your Post")
                    }
          } catch (err) {
                    res.status(500).json(err)
          }
}

exports.likeUnlikePost = async (req, res) => {
          try {
                    const post = await Post.findById(req.params.id)

                    if(!post.likes.includes(req.body.userId)) {
                              await post.updateOne(
                                        {
                                                  $push: {
                                                            likes: req.body.userId
                                                  }
                                        }
                              )

                              res.status(200).json("The Post Has Been Liked")
                    }else {
                              await post.updateOne(
                                        {
                                                  $pull: {
                                                            likes: req.body.userId
                                                  }
                                        }
                              )

                              res.status(200).json("The Post Has Been Unliked")
                    }
          } catch (err) {
                    res.status(500).json(err)
          }
}

exports.getApost = async (req, res) => {
          try {
                    const post = await Post.findById(req.params.id)

                    res.status(200).json(post)
          } catch (err) {
                    res.status(500).json(err)
          }
}

exports.getAllPosts = async (req, res) => {
          try {
                    const allPosts = await Post.find()

                    res.status(200).json(allPosts)
          } catch (err) {
                    res.status(500).json(err)
          }
}

exports.getYourPostAndYourFrdPosts = async (req, res) => {

          try {
                    const currentUser = await User.findById(req.body.userId)               
                    const userPosts = await Post.find({userId: currentUser._id})

                    const friendPosts = await Promise.all(
                              currentUser.followings.map((friendId) => {
                                        return Post.find({userId: friendId})
                              })
                    )

                    // show both user and frds posts
                    res.status(200).json(userPosts.concat(...friendPosts))
          } catch (err) {
                    res.status(500).json(err)
          }
}