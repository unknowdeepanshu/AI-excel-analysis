import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.join(__dirname, '../.env')
});

let file_json

export const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, './credentials/credentials.json'),
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

// Obtain client instance for authenticated requests
const client = await auth.getClient();
// Instance of Google Sheets API
export const googleSheets = google.sheets({ version: 'v4', auth: client });
// Get metadata about spreadsheet
export const spreadsheetId = process.env.spreadsheetId || spreadsheetId;