import dotenv from 'dotenv';
import express from 'express';
import { callAI} from './AIagent/aIAgent.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

//file upload configuration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/credentials')
  },
  filename: function (req, file, cb) {
    cb(null, "credentials.json")
  }
})

const upload = multer({ storage: storage })
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure environment variables
dotenv.config({path:'./.env'});
const app =express();
const port = process.env.PORT || 8000;

// some changes engine
app.set("view engine","ejs")
app.set("views", path.join(__dirname, "../views"));

//Middleware to serve static files
app.use(express.static(path.join(__dirname,"../public")));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// Define routes
app.get('/student', async (req,res)=>{
    let prompt ="give me charts or graphs for student name and marks by calling readValue function from toolAi.js";
    const metadata = await callAI(prompt);
    res.send(metadata);
});
app.get("/", async (req,res)=>{
    res.render("userChat.ejs")
})
app.post('/ask',async (req, res) => {
  console.log(req.body)
  let data =req.body
  let prompt = data.prompt;
  let aiResponse = await callAI(prompt);
  res.json({answer: aiResponse});
  console.log("hello from post request",data.prompt)
})

app.post('/upload', upload.single('uploaded_file'), (req, res) => {
    // File information is available in req.file
    console.log(req.file);
    console.log(req.body);
    res.redirect('/');
});


//start server
app.listen(port ,(req,res)=>{
    console.log(`server is running on port ${port}`);
});