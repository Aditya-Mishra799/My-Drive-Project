import express from "express"
import cors from "cors"
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import apiMainRouter from "./routers/api.main.route.js"
import pool from "./config/db.js"

dotenv.config()
const app = express()

const port = process.env.PORT || 5000
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
}))

app.get('/', (req, res) => res.send('Server is running on port: ' + port))
app.get("/healthz", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),                
        timestamp: new Date().toISOString(),     
        memory: process.memoryUsage(),          
        pid: process.pid,                        
        node_version: process.version,
    });
});
app.use('/api', apiMainRouter)
app.use(errorHandler)


export default app