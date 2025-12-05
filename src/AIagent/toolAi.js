import { googleSheets, auth, spreadsheetId } from '../googleSheets.js';

//export function use call data from google sheet---------------------------------------------

//First  tool:-read value from google sheet
export async function readValue(range="sheet1") {
    let response = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:range
    });
    return response.data.values;
}

//Second tool:-Write value to google sheet
export async function WriteValue(){
    
}