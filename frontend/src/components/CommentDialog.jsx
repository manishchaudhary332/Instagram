import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const CommentDialog = ({ open, setopen }) => {
    const [text, setText] = useState('');

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()) {
            setText(inputText);
        }else{
            setText('');
        }
    }

    const sendMessageHandler = () => {
        alert(text);

    }


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
        {/* Left Image Side */}
        <div className="w-1/2 h-full">
          <img
            src="https://images.unsplash.com/photo-1749740559443-4ecd3538c31b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D"
            alt="Comment Image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content Side */}
        <div className="w-1/2 h-full flex flex-col justify-start p-4 relative border-l border-gray-200">
          {/* Header with Avatar + Username + More */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="#">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <Link to="#" className="font-bold text-sm">
                username
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
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  position: 'fixed',
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
          <div className='flex-1 overflow-y-auto max-h-96 p-4'>
            comments ayenge
          </div>
          <div className='p-4'>
            <div className='flex items-center gap-3 '>
                <input value={text} onChange={changeEventHandler} type='text' placeholder='Add a Comment...' className='w-full outline-none border border-gray-300 p-2 rounded ' />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline' className="hover:bg-green-400 bg-green-900 text-white">Send</Button>
            </div>
          </div>

          {/* You can add comments or other right-side content here */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
