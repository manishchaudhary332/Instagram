import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
import dotenv from "dotenv"
const PORT = process.env.PORT || 3000;

dotenv.config({})

app.get("/",(req,res)=>{
    return res.status(200).json({
            message:"I AM coming From Balcend",
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


app.listen(PORT,()=>{
    console.log(`server is runnin on ${PORT}`);
    
})