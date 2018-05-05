import {existsSync} from 'fs';
import {readData, isDataValid} from './read-data';

function error(msg: string) {
  console.error(msg);
  console.error('\n');

  process.exit(1);
}

if (process.argv.length !== 3) {
  error('Usage: ts-node index.ts [input-filename]');
}

const [_, __, INPUT_FILENAME] = process.argv;

if (!existsSync(INPUT_FILENAME)) {
  error(`File not found '${INPUT_FILENAME}'`);
}

const data = readData(INPUT_FILENAME);

if (!isDataValid(data)) {
  error(`File '${INPUT_FILENAME}' contains invalid data`);
}

const averageEntriesPerPage = data.reduce((a, e) => a + e.total, 0) / data.length;
const averageMarkedPerPage = data.reduce((a, e) => a + e.marked, 0) / data.length;

const firstPage = 29;
const lastPage =  1287;
const totalPages =  lastPage - firstPage + 1;

const estimatedTotalNumberOfEntries = Math.round(averageEntriesPerPage * totalPages);
const estimatedTotalNumberOfMarked = Math.round(averageMarkedPerPage * totalPages);

const percentOfMarkedFromEntries = averageMarkedPerPage / averageEntriesPerPage * 100;

console.log(`total pages: ${totalPages}`);
console.log(`data instances: ${data.length}`);

console.log('\n');

console.log(`averageEntriesPerPage = ${+averageEntriesPerPage.toFixed(2)}`);
console.log(`averageMarkedPerPage = ${+averageMarkedPerPage.toFixed(2)}`);

console.log('\n');

console.log(`estimatedTotalNumberOfEntries = ${+estimatedTotalNumberOfEntries.toFixed(2)}`);
console.log(`estimatedTotalNumberOfMarked = ${+estimatedTotalNumberOfMarked.toFixed(2)}`);

console.log('\n');

console.log(`percentOfMarkedFromEntries = ${+percentOfMarkedFromEntries.toFixed(2)}%`);

console.log('\n');
