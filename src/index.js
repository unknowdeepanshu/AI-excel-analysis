import dotenv from 'dotenv';
import express from 'express';
import { data } from './googleSheets.js';


dotenv.config({path:'./.env'});
const app =express();
const port = process.env.PORT || 8000;
app.get('/',(req,res)=>{
    res.send(data.data);
});
app.listen(port ,(req,res)=>{
    console.log(`server is running on port ${port}`);
});