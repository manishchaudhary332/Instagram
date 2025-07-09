import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/Redux/postSlice'; // ✅ correct path to your postSlice.js



const CommentDialog = ({ open, setopen }) => {
    const [text, setText] = useState('');
    const {selectedPost,posts} = useSelector(store=>store.post)
    const [comment, setcomment] = useState([])

    const dispatch = useDispatch()

    useEffect(()=>{
      if(selectedPost){
        setcomment(selectedPost.comments)
      }
    },[selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()) {
            setText(inputText);
        }else{
            setText('');
        }
    }

    
const sendMessageHandler = async () => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      const updatedCommentData = [...comment, res.data.comment];
      setcomment(updatedCommentData);

      const updatedPostData = posts.map((p) =>
        p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
      );
      dispatch(setPosts(updatedPostData));

      toast.success(res?.data?.message || "Comment added successfully");
      setText(""); // ✅ clear input
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    console.error(error);
  }
};



  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setopen(false)}
        className="bg-white p-0 rounded-md"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          width: '80vw',
          height: '80vh',
          maxWidth: '900px',
          maxHeight: '90vh',
          zIndex: 50,
          display: 'flex',
          padding: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="w-[70vw] h-[600px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg flex overflow-hidden">
  {/* Left Image Side */}
  <div className="w-1/2 h-full">
    <img
      src={selectedPost?.image}
      alt="Comment Image"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Right Content Side */}
  <div className="w-1/2 h-full flex flex-col justify-start p-4 relative border-l border-gray-200">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Link to="#">
          <Avatar>
            <AvatarImage
              className="h-[30px] w-[30px] rounded-full"
              src={selectedPost?.author?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <Link to="#" className="font-bold text-sm">
          {selectedPost?.author?.username}
        </Link>
      </div>

      {/* More Options */}
      <Dialog>
        <DialogTrigger asChild>
          <MoreHorizontal className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent
          className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-sm flex flex-col items-center space-y-2"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "fixed",
            zIndex: 100,
          }}
        >
          <div className="text-[#ED4956] font-semibold w-full text-center cursor-pointer">
            Unfollow
          </div>
          <div className="w-full text-center cursor-pointer">
            Add to Favorites
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <hr />

    {/* Comment List */}
    <div className="flex-1 overflow-y-auto max-h-40 p-4">
      {
        comment.map((comment)=> <Comment key={comment._id} comment={comment}/>)
      }
    </div>

    {/* Comment Input */}
    {/* Comment Input */}
<div className="p-4 mt-auto border-t border-gray-200 bg-white">
  <div className="flex items-center gap-3">
    <input
      value={text}
      onChange={changeEventHandler}
      type="text"
      placeholder="Add a Comment..."
      className="w-full outline-none border border-gray-300 p-2 rounded"
    />
    <Button
      disabled={!text.trim()}
      onClick={sendMessageHandler}
      variant="outline"
      className="hover:bg-green-400 bg-green-900 text-white"
    >
      Send
    </Button>
  </div>
</div>

  </div>
</div>

      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
