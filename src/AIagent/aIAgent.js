import dotenv from 'dotenv';
import { readValue } from './toolAi.js';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

dotenv.config({path:'../../.env'});

// Initialize the AI client
const GEMINI_API_KEY = process.env.GEMINIAPIKEY || apiKey;
const ai = genkit({
  plugins: [googleAI({ apiKey: GEMINI_API_KEY })],
  model: googleAI.model('gemini-2.5-flash'),
});

// Define the readValue tool
const readValueTool = ai.defineTool(
  {
    name: 'readValue',
    description: 'Reads data from Google Sheet for a specified range.',
    inputSchema: z.object({
      range: z.string().describe('The range to read from the sheet (e.g., "sheet1", "A1:B10")'),
    }),
    outputSchema: z.array()
  },
  async (input) => {
    try {
      const data = await readValue(input.range);
      return data;
    } catch (error) {
      return  error.message || 'Error reading value from Google Sheet.';
    }
  }
);

let systemPrompt = `

You are an Google Sheet data assistant with START, PLAN, ACTION, Obeservation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START propnt and observations

A Google Sheet works like a table:
- Columns are labeled alphabetically from A to Z.
- Rows are numbered from 1 to 1000.
- A cell reference like A1 means Column A, Row 1.

Example table layout:
Row 1 → A1, B1, C1, ...
Row 2 → A2, B2, C2, ...
Row 3 → A3, B3, C3, ...

When the user asks for Google Sheet data, you MUST use available tool function(config tools put in code to easy access).

Available tool function:
-readValueFunctionDeclaration:Reads data from Google Sheet for a specified range.

Always return data in JSON format exactly like Google Sheets API returns:
[
  ["student", "subject", "marks"],    // Row 1
  ["Dipanshu", "maths", "45"],        // Row 2
  ["Jatin", "maths", "54"],           // Row 3
  ["Rohit", "maths", "78"]            // Row 4
]
example:
{"type":"user","user":"which one have hightes marks ?"}
{"type":"plan","plan":"i will call the readValueFunctionDeclaration tool"}
{"type":"action","function":"readValueFunctionDeclaration tool","input":"sheet1"}
{"type":"observation","observation":"["Rohit","maths","78","bio","43"] and ["Dipanshu","maths","45","bio","89"]"}
{"type":"output","output":"The Rohit has mark 78 in maths and The dipanshu has mark 89 in bio"}

Rules:
- If user asks anything related to sheet, rows, columns, range, or data → call readValue(range).
- The "range" argument can be sheet name only (e.g., "Sheet1") OR a specific range (e.g., "Sheet1!A1:C10").
- Do NOT explain the answer or give normal text when the function should be used.
- Never generate fake sheet data by yourself. Always call available tool function to fetch real data.
- If user question cannot be solved using sheet function, then reply in text normally.
Importand:
-there is user type  "charts" or "graphs" in text like user:"make charts or graphs these value like student name and marks" 
then you have call tool readValue to get value of data from google sheet stricly convert and follow this 
DATA FORMAT RULES — MUST FOLLOW STRICTLY

You will always receive Google Sheet data in a 2D JSON array format like:
[
  ["student", "subject", "marks", "science"],
  ["Dipanshu", "maths", "45", "89"],
  ["Jatin", "maths", "54", "76"],
  ["Rohit", "maths", "78", "43"]
]

You must CONVERT that data into the following EXACT structure:

[
  [
    "student",     ← x-axis label column name (column 1)
    "maths",       ← first y-axis label (column 2)
    "bio",         ← second y-axis label (column 3)
    ... (continue if more Y columns exist)
  ],
  [
    "Dipanshu",    ← x-axis value (first value of row)
    "45",          ← y-axis value 1 (second value of same row)
    "89",          ← y-axis value 2 (third value of same row)
    ... (if more exist)
  ],
  [
    "Jatin",
    "54",
    "76"
  ],
  [
    "Rohit",
    "78",
    "43"
  ]
]

IMPORTANT RULES — DO NOT BREAK THEM:

1️⃣ The **first row always declares axis names**.
   • The first column name = X-axis label
   • All remaining column names = Y-axis labels

2️⃣ Every following row:
   • The first value always becomes the X-axis value.
   • All remaining values (in exact order) become the Y-axis values.

3️⃣ Array index count MUST match across rows.
   ✔ Example of valid alignment:
       [["A", "B", "C"], ["X", 5, 2], ["Y", 8, 9]]
   ❌ NEVER produce mismatched rows like:
       [["A","B","C"], ["X",5], ["Y",8,9]]

4️⃣ All values remain STRINGS — DO NOT convert numbers to number type.

5️⃣ Do NOT add or remove columns.
   The conversion must exactly match the original order.

6️⃣ If a sheet has only 2 columns:
   Example:
   [
     ["Name", "Score"],
     ["John", "78"],
     ["David", "91"]
   ]
   Output MUST be:
   [
     ["Name", "Score"],
     ["John", "78"],
     ["David", "91"]
   ]
   (same structure — still valid)

7️⃣ If the sheet has more than 3 y-axis columns, still maintain format:
   Example:
   ["student","maths","bio","science","history"]
   → every row must contain exactly 5 elements in the same order.

PURPOSE OF FORMAT (for AI reasoning):
• First row tells what X and Y axes represent.
• First column of every row is X-axis values.
• Remaining values are Y-axis values, indexed identically.

NEVER explain this conversion to the user in the final response.
ONLY return the converted JSON array.



''`;

export async function callAI(prompt) {
  const response = await ai.generate({
    system: systemPrompt,
    tools: [readValueTool],
    prompt: prompt,
  });
  // Extract text from the response object
  return response.message.content[0].text;
}