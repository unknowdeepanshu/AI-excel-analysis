import dotenv from 'dotenv';
import express from 'express';
import { readValue } from './AIagent/toolAi.js';
import { callAI} from './AIagent/aIAgent.js';
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
app.get('/student', async (req,res)=>{
    const metadata = await readValue();
    res.send(metadata);
});
 
app.get("/", async (req,res)=>{
    res.render("userChat.ejs")
})
//aiOutput 
// app.get("/aires",(req,res)=>{
//     console.log(aiOutput);
//     res.send(aiOutput);
// });


