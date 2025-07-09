import { setAuthUser } from '@/Redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { use, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/Redux/postSlice'

const LeftSidebar = () => {
    const navigate = useNavigate();

    const {user} = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const LogoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout", {withCredentials: true});
            if(res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate("/login")
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }

    }

    


    const sidebarHandler = (textType) => {
        if(textType == "Logout") {
            LogoutHandler();
        }else if(textType == "Create"){
             setOpen(true);
        }
    }
    const sidebarItems =[
    {icon:<Home/>,text:"Home" },
    {icon:<Search/>,text:"Search" },
    {icon:<TrendingUp/>,text:"Explore" },
    {icon:<MessageCircle/>,text:"Messages" },
    {icon:<Heart/>,text:"Notifications" },
    {icon:<PlusSquare/>,text:"Create" },
    {icon:(
        <Avatar>
  <AvatarImage
    className="h-[25px] w-[25px] rounded-full"
    src={
      user?.profilePicture?.trim()
        ? user.profilePicture
        : "/default-avatar.png" // 👈 fallback image
    }
    alt="User"
  />
  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
</Avatar>

    ),text:"Profile" },
    {icon:<LogOut/>,text:"Logout" },
    
]



  return (
    <div className="px-4 border-r border-gray-300 w-[16%] h-screen fixed left-0 top-0 bg-white z-10">

        <div className='flex flex-col'>
            <h1 className='mb-5'>LOGO</h1>
            {
            sidebarItems.map((item,index)=>{ 
                return(
                    <div onClick={()=> sidebarHandler(item.text)} key={index} className='flex items-center gap-4 relative hover:bg-gray-200 cursor-pointer  rounded-md p-3 my-3'>
                        {item.icon}
                        <span>{item.text}</span>
                    </div>
                )
            })
            
        }
        </div>  
        
        <CreatePost open={open} setOpen={setOpen}/>
    </div>
  )
}

export default LeftSidebar