import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
// Obtain client instance for authenticated requests
const client = await auth.getClient();
// Instance of Google Sheets API
const googleSheets = google.sheets({ version: 'v4', auth: client });
// Get metadata about spreadsheet
const spreadsheetId = process.env.spreadsheetId;
// Get metadata about spreadsheet
let metadata =await googleSheets.spreadsheets.get(
    {
    auth,
    spreadsheetId
    }
)
// Read rows from spreadsheet
let data =await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range:"sheet1"
})
export {data};