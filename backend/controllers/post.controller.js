import sharp from "sharp";
import { Post } from "../models/post.model.js";
import User from "../models/user.model.js";
export const addNewPost = async (req, res) => {
    try{
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) {
            return res.status(400).json({ message: "Image is required", success: false });
        }

        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize(800, 800, {
                fit:'inside', })
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toBuffer();

            // buffer to data URI
            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

            const cloudResponse = await cloudinary.uploader.upload(fileUri);

            const post = await Post.create({
                caption,
                image: cloudResponse.secure_url,
                author: authorId,
            });

            const user = await User.findById(authorId).select("-password");
            if(user) {
                user.posts.push(post._id);
                await user.save();
            } 

            await post.populate({path: "author", select: "-password"});

            return res.status(201).json({
                message: "Post created successfully",
                post,
                success: true,
            });

    }catch (error) {
        console.error("Error in addNewPost controller:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username,profilePicture" })
            .populate({ path: "comments",
                        short: { createdAt: -1 },
                        populate: { path: "author", select: "username profilePicture" }
             });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
            success: true,
        });
    } catch (error) {
        console.error("Error in getAllPosts controller:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const userId = req.id;

        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" }) 
            .populate({ path: "comments",
                        sort: { createdAt: -1 },
                        populate: { path: "author", select: "username profilePicture" }
             });

       

        return res.status(200).json({
            message: "User posts fetched successfully",
            posts,
            success: true,
        });
    } catch (error) {
        console.error("Error in getUserPost controller:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId  = req.params.id;
        

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }
        // like logic   
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId },});
        await post.save();

        // impliment socket io for real applaction

        return res.status(200).json({
            message: "Post liked successfully",
            success: true,
        })
    } catch (error) {
        console.error("Error in likePost controller:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId  = req.params.id;
        

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }
        // like logic   
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId },});
        await post.save();

        // impliment socket io for real applaction

        return res.status(200).json({
            message: "Post disliked successfully",
            success: true,
        })
    } catch (error) {
        console.error("Error in likePost controller:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId  = req.id;
        const {text}  = req.body;

        if (!comment) {
            return res.status(400).json({ message: "Comment is required", success: false });
        }

        const post = await Post.findById(postId);
        if (!text) {
            return res.status(404).json({ message: "text not found", success: false });
        }

        const comment = await Comment.create({
            text,
            author: commentKrneWalaUserKiId,
            post: postId,
        }).populate({
            path: "author",
            select: "username profilePicture"
        })
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
            success: true,
        });
        
        }catch (error) {
            console.log(error);
            
        }
    }

    export const getCommentsOfPost = async (req, res) => {
         try{
            const postId = req.params.id;

            const comments = await Comment.find({ post: postId }).populate('author','username profilePicture')
            if(!comments || comments.length === 0) {
                return res.status(404).json({ message: "No comments found for this post", success: false });
            }
            return res.status(200).json({
                message: "Comments fetched successfully",
                comments,
                success: true,
            });

         }catch(error){
            console.log(error);
            
         }
    }

    export const deletePost = async (req, res) => {
        try{
            const postId = req.params.id;
            const authorId = req.id;

            const post  = await Post.findById(postId);
            if(!post) {
                return res.status(404).json({ message: "Post not found", success: false });
            }
            // check tha user logged in is the Owner of the post
            if(post.author.toString() !== authorId) { 
                return res.status(403).json({ message: "You are not authorized to delete this post", success: false });
            }

            await post.findByIdAndDelete(postId);
            // remove post id from user posts
            let user = await User.findById(authorId);
            user.posts = user.posts.filter((post) => post.toString() !== postId);
            await user.save();

            // delete associated comments
            await Comment.deleteMany({ post: postId });

            return res.status(200).json({
                message: "Post deleted successfully",
                success: true,
            });

        }catch(error) {
            console.error("Error in deletePost controller:", error);
            return res.status(500).json({ message: "Internal Server Error", success: false });
        }
    }

    export const bookmarkPost = async (req, res) => {
        try {
            const postId = req.params.id;
            const authorId = req.id;
            const post = await Post.findById(postId);

            if(!post) {
                return res.status(404).json({ message: "Post not found", success: false });
            }

            const user = await User.findById(authorId);
            if(user.bookmarks.includes(post._id)) {
                // If post is already bookmarked, remove it
                await user.updateOne({ $pull: { bookmarks: post._id } });
                await user.save();
                return res.status(200).json({
                    type:'unsaved',
                    message: "Post removed from bookmarks",
                    success: true,
                });
            }else{
                // bookmarked krna pdega
                await user.updateOne({ $addToSet: { bookmarks: post._id } });
                await user.save();
                return res.status(200).json({
                    type:'saved',
                    message: "Post  bookmarked",
                    success: true,
                });
            }
        } catch (error) {
            console.log(error);
            
        }
    }