import dotenv from 'dotenv';
import express from 'express';
import { rowData } from './googleSheets.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure environment variables
dotenv.config({path:'./.env'});
const app =express();
const port = process.env.PORT || 8000;

//start server
app.listen(port ,(req,res)=>{
    console.log(`server is running on port ${port}`);
});
// some changes engine
app.set("view engine","ejs")
app.set("views", path.join(__dirname, "../views"));

//Middleware to serve static files
app.use(express.static(path.join(__dirname,"../public")));

// Define routes
app.get('/student',(req,res)=>{
    res.send(rowData.data);
});
 
app.get("/",(req,res)=>{
    res.render("userChat.ejs")
})

