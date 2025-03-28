// Bram Adams (bramadams.dev) 2025
// row headers (for Chase Credit Card): Transaction Date	Post Date	Description	Category	Type	Amount	Memo
// to run: node filter_csv.js input.csv output.csv


const fs = require('fs');
const csv = require('fast-csv');
const dotenv = require('dotenv')

dotenv.config()

const inputFile = process.argv[2] || 'input.csv';
const outputFile = process.argv[3] || 'filtered.csv';


// Keywords to filter by (e.g., SUPABASE, SQSP, etc.)
const keywords = JSON.parse(process.env.KEYWORDS);
// Read and filter CSV
const results = [];

let isFirstRow = true;
let total = 0;

fs.createReadStream(inputFile)
  .pipe(csv.parse({ headers: false, delimiter: ',' })) // Adjust delimiter if needed
  .on('data', (row) => {
    if (isFirstRow) {
      isFirstRow = false; // Skip the first row
      return;
    }
        
    const searchField = row[2]; // Assuming the vendor name is in column 3 (index 2)
    if (keywords.some(keyword => searchField.includes(keyword))) {
      results.push(row);
      total += Number(row[5])
    }
  })
  .on('end', () => {
    // Write filtered results
    const ws = fs.createWriteStream(outputFile);
    csv.write(results, { headers: false, delimiter: ',' }).pipe(ws);
    console.log(`Filtered CSV saved to ${outputFile}`);
    console.log(`Total amount spent: ${total}`)
  });

