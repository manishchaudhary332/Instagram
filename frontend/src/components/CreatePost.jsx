import { Dialog, DialogContent,DialogTitle,DialogDescription } from '@radix-ui/react-dialog';
import React, { use, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/Redux/postSlice';
import Posts from './Posts';

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const {posts} = useSelector(store => store.post)

    const filechangeHandler =async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl =  await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    } else {
      console.log('No file selected');
    }
    imageRef.current.value = ''; // Reset the input field
  }

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if(imagePreview) formData.append("image", file);
    try {
        setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost",formData,{
        headers:{
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      if(res?.data?.success) {
        dispatch(setPosts([res.data.post,...posts ]))
        toast.success(res.data.message);
        setOpen(false);
        setCaption("");
        setImagePreview("");
        setFile("");
      } 
    } catch (error) {
      console.error(error); // helpful for debugging
       toast.error(error?.response?.data?.message || "Something went wrong");

    }finally{
        setLoading(false);
    }
  };

//   console.log("Redux user: ", user);

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
  onInteractOutside={() => setOpen(false)}
  className="!w-[95%] md:!w-[500px] !max-w-none !p-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
>
  <div className="flex flex-col gap-4">
    {/* Title */}
    <DialogTitle className="text-left font-bold text-lg">Create New Post</DialogTitle>

    <DialogDescription className="text-sm text-gray-500">
      Share a new post with your followers.
    </DialogDescription>

    {/* Avatar + Username */}
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt="Image" className="h-[30px] w-[30px] rounded-full" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="font-semibold text-sm">{user?.username}</h1>
        <span className="text-gray-600 text-sm">Bio here.....</span>
      </div>
    </div>

    {/* Caption */}
    <Textarea
      value={caption}
      onChange={(e) => setCaption(e.target.value)}
      className="focus-visible:ring-transparent border border-gray-200 resize-none rounded-md"
      placeholder="Write a caption"
    />

    {/* Image Preview */}
    {imagePreview && (
      <div className="w-full h-[200px] overflow-hidden rounded-md">
        <img src={imagePreview} alt="Preview" className="object-cover h-full w-full" />
      </div>
    )}

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <input ref={imageRef} type="file" className="hidden" onChange={filechangeHandler} />
      <Button
        onClick={() => imageRef.current.click()}
        className="bg-[#0995F6] hover:bg-[#75add6] w-full sm:w-auto"
      >
        Select from Computer
      </Button>

      {imagePreview && (
        loading ? (
          <Button className="w-full sm:w-auto">
            <Loader2 className="mr-2 h-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button type="submit" onClick={createPostHandler} className="w-full sm:w-auto">
            Post
          </Button>
        )
      )}
    </div>
  </div>
</DialogContent>

    </Dialog>
  );
};

export default CreatePost;
