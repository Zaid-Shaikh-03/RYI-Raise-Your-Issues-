import express from "express";
import authRoutes from "./routes/auth.routes.js"
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js"

const app = express();
app.use(express.json())
// to parse from data(urlencoded)
app.use(express.urlencoded({extended:true}))
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use("/api/auth",authRoutes);



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
});
