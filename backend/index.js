import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"



const PORT = process.env.PORT || 3000;

dotenv.config({})

app.get("/",(req,res)=>{
    return res.status(200).json({
            message:"I AM coming From Backend",
            success:true,
    })
    
})
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOptions = {
    origin:'http://localhost:5173',
    Credentials:true 
}
app.use(cors(corsOptions))

app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)


app.listen(PORT,()=>{
    connectDB()
    console.log(`server is runnin on ${PORT}`);
    
})