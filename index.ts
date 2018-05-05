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

const dataInstances = data.length;

const allEntries = data.reduce((acc, {total}) => acc + total, 0);
const allMarked = data.reduce((acc, {marked}) => acc + marked, 0);

const averageEntriesPerPage = allEntries / dataInstances;
const averageMarkedPerPage = allMarked / dataInstances;

const FIRST_PAGE = 29;
const LAST_PAGE =  1287;
const TOTAL_PAGES =  LAST_PAGE - FIRST_PAGE + 1;

const estimatedTotalNumberOfEntries = Math.round(averageEntriesPerPage * TOTAL_PAGES);
const estimatedTotalNumberOfMarked = Math.round(averageMarkedPerPage * TOTAL_PAGES);

const percentOfMarkedFromEntries = averageMarkedPerPage / averageEntriesPerPage * 100;

console.log(`total pages: ${TOTAL_PAGES}`);
console.log(`data instances: ${dataInstances}`);

console.log('\n');

console.log(`averageEntriesPerPage = ${+averageEntriesPerPage.toFixed(2)}`);
console.log(`averageMarkedPerPage = ${+averageMarkedPerPage.toFixed(2)}`);

console.log('\n');

console.log(`estimatedTotalNumberOfEntries = ${+estimatedTotalNumberOfEntries.toFixed(2)}`);
console.log(`estimatedTotalNumberOfMarked = ${+estimatedTotalNumberOfMarked.toFixed(2)}`);

console.log('\n');

console.log(`percentOfMarkedFromEntries = ${+percentOfMarkedFromEntries.toFixed(2)}%`);

console.log('\n');
