import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import React, { useRef, useEffect, use, useState } from "react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
    const [text, settext] = useState("");
    const [open, setopen] = useState(false);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            settext(inputText);
        }else{
            settext("");
        }
    }


  const firstButtonRef = useRef(null);

  useEffect(() => {
    if (firstButtonRef.current) {
      firstButtonRef.current.focus(); // set focus on first button
    }
  }, []);

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="Post_Image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-medium">username</h1>
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
            <Button
              variant="ghost"
              className="w-full justify-start text-[#ED4956] font-semibold"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src="https://images.unsplash.com/photo-1749740559443-4ecd3538c31b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D"
          alt="Post_img"
        />
      </div>
      
        <div className="flex items-center justify-between my-2">
          <div className="flex justify-center gap-3">
            <FaRegHeart size={"22px"} className="cursor-pointer hover:text-gray-600" />
            <MessageCircle onClick={()=> setopen(true)} className="cursor-pointer hover:text-gray-600" />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
        </div>
        <span className="font-medium block mb-2">1k like</span>
        <p>
            <span className="font-medium mr-2 ">username</span>
            caption
        </p>
        <span onClick={()=> setopen(true)} className="cursor-pointer">View all Comments</span>
        <CommentDialog open={open} setopen={setopen}/>
        <div className="flex">
            <input type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a Comment"
            className="outline-none text-sm w-full"  />
            {
               
                text &&  <span className="text-[#3BADF8]">Post</span>
            }
        </div>
      </div>
   
  );
};

export default Post;
