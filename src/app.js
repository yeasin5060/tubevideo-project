import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()
app.use(express.json({limit : "30kb"}))
app.use(express.urlencoded({limit : "20kb" , extended : true}))

app.use(cors({
    origin : "*"
}))

app.use(cookieParser())
app.use(express.static("public"))

export{app}