import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/Redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, settext] = useState("");
  const [open, setopen] = useState(false);
  const {user} = useSelector(store => store.auth)
  const {posts} = useSelector(store => store.post)
  const dispatch = useDispatch()
  const [liked, setliked] = useState(post.likes.includes(user?._id) || false)
  const [postLike , setpostLike] = useState(post.likes.length)
  const [comment,setcomment] = useState(post.comments)

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      settext(inputText);
    } else {
      settext("");
    }
  };

  const firstButtonRef = useRef(null);

  useEffect(() => {
    if (firstButtonRef.current) {
      firstButtonRef.current.focus(); // set focus on first button
    }
  }, []);

  const likeOrDislikeHandler = async ()=>{
    try {
      const action = liked ? 'dislike' : 'like'
        const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`,{withCredentials:true})
        if(res.data.success){
          const updatedLikes = liked ? postLike -1 : postLike +1;
          setpostLike(updatedLikes)
          setliked(!liked)
          const updatedPostData = posts.map(p=>
            p._id == post._id ? {
              ...p,
              likes:liked ? p.likes.filter( id => id != user._id): [...p.likes,user._id ]

              }:p
            )
            dispatch(setPosts(updatedPostData))
          toast.success(res.data.message)
        }
    } catch (error) {
      console.log(error);
      
    }
  }

  const commentHandler = async ()=>{
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,{text}, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        const updatedCommentData = [...comment,res.data.comment]
        setcomment(updatedCommentData);

        const updatedPostData = posts.map(p=>
          p.id == post._id ? {...p, comments:updatedCommentData} : p
        )
        dispatch(setPosts) 
        toast.success(res.data.message)
        settext("")
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const deletePostHandler =async ()=>{
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`,{withCredentials:true})

      if(res.data.success){
        const updatedPostData = posts.filter((postItem)=> postItem?._id != post?._id)
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data)
      
    }
  }
  

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage className="h-[30px] w-[30px] rounded-full"
              src={
                post.author?.profilePicture &&
                post.author.profilePicture.trim() !== ""
                  ? post.author.profilePicture
                  : "/default-avatar.png"
              }
              alt="Post_Image"
            />
            <AvatarFallback>
              {post.author?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
              <div>
          <h1 className="font-medium">{post.author?.username}</h1>
          {user?._id == post.author._id && <Badge variant="secondary">Author</Badge>  }    
              </div>
        </div>

        {/* More Options Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-start space-y-3"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              position: "fixed",
              zIndex: 50,
              backgroundColor: "white",
            }}
          >
            <Button
              ref={firstButtonRef}
              variant="ghost"
              className="w-full justify-start text-[#ED4956] font-semibold"
            >
              Unfollow
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-semibold"
            >
              Add to Favorites
            </Button>
            {
              user  && user?._id == post?.author._id  && <Button onClick={deletePostHandler} variant="ghost" className="w-full justify-start text-[#ED4956] font-semibold"
            >
              Delete
            </Button>
            }
            
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src={post.image}
          alt="Post_img"
        />
      </div>

      <div className="flex items-center justify-between my-2">
        <div className="flex justify-center gap-3">
          {
            liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className="cursor-pointer text-red-600"/>: <FaRegHeart onClick={likeOrDislikeHandler}
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          }
          
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post))
              setopen(true)
            } }
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLike}likes</span>
      <p>
        <span className="font-medium mr-2 ">{post.author?.username}</span>
        {post.caption}
      </p>
      {
        comment.length > 0 && (
            <span onClick={() => {
              dispatch(setSelectedPost(post))
              setopen(true)
            } } className="cursor-pointer">
        View all {comment.length} Comments
      </span>
        )
      }
      
      <CommentDialog open={open} setopen={setopen} />
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a Comment"
          className="outline-none text-sm w-full"
        />
        {text && <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
