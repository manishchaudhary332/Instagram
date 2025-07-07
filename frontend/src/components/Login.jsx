import React, { useState } from 'react'
import {Input} from "./ui/input"
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/Redux/authSlice'

const Login = () => {
    const [input, setinput] = useState({
        email:"",
        password:"",
    })

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

const changeEventHandler = (e) => {
    setinput({
        ...input,
        [e.target.name]: e.target.value
    })
}

const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input); 
    try {
        setLoading(true);
        const res = await axios.post("http://localhost:8000/api/v1/user/login",input,{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        if(res.data.success) {
            dispatch(setAuthUser(res.data.user));
            navigate("/")
           toast.success(res.data.message);
              setinput({
                
                email:"",
                password:"",
              })
            
        }
    } catch (error) {
       console.log("Login failed:", error);
  const msg = error.response?.data?.message || "Something went wrong";
  toast.error(msg);
    }finally{
         setLoading(false);
    }
}


  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm  text-center'>Login to See Photos & Vedio from your Friend</p>
            </div>
            
            <div>
                <span className='font-medium'>Email</span>
                <Input
                type="text"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
                ></Input>
            </div>
            <div>
                <span className='font-medium'>Password</span>
                <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
                ></Input>
            </div>  
            {
                loading ? (
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        please wait..
                    </Button>
                ):(
                    <Button type="submit" className="my-4">Login</Button>
                )
            }
            
            <span className='text-center'>Dosen't have an account? <Link className='text-blue-600' to="/signup">Signup</Link></span>
        </form>
    </div>
  )
}

export default Login