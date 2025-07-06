import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
const sidebarItems =[
    {icon:<Home/>,text:"Home" },
    {icon:<Search/>,text:"Search" },
    {icon:<TrendingUp/>,text:"Explore" },
    {icon:<MessageCircle/>,text:"Messages" },
    {icon:<Heart/>,text:"Notifications" },
    {icon:<PlusSquare/>,text:"Create" },
    {icon:(
        <Avatar>
          <AvatarImage className='h-[25px] rounded-full' src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
       </Avatar> 
    ),text:"Profile" },
    {icon:<LogOut/>,text:"Logout" },
]
const LeftSidebar = () => {
    const navigate = useNavigate();


    const LogoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout", {withCredentials: true});
            if(res.data.success) {
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
        }
    }

  return (
    <div className=' left-0 px-4 border-r border-gray-300  w-[16%]  h-screen p-15 '>
        <div className='flex flex-col  '>
            <h1 className='mb-5'>LOGO</h1>
            {
            sidebarItems.map((item, index) => (
                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer relative my-3 '>
                    <span className='text-xl'>{item.icon}</span>
                    <span className='text-[15px]'>{item.text}</span>
                </div>
            ))}
        </div>
        
    </div>
  )
}

export default LeftSidebar