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

const averageMarkedPercentPerPage = data.reduce((acc, {total, marked}) => acc + (marked / total * 100), 0) / dataInstances;

const FIRST_PAGE = 29;
const LAST_PAGE =  1287;
const TOTAL_PAGES =  LAST_PAGE - FIRST_PAGE + 1;

const estimatedTotalNumberOfEntries = Math.round(averageEntriesPerPage * TOTAL_PAGES);
const estimatedTotalNumberOfKnown = Math.round(averageMarkedPerPage * TOTAL_PAGES);

const worstPages = data
  .map(({page, marked, total}) => ({
    page,
    unmarked: total - marked
  }))
  .sort((a, b) => b.unmarked - a.unmarked)
  .map(({page}) => page);

console.log(`data instances / total pages: ${dataInstances} / ${TOTAL_PAGES} = ${+(dataInstances / TOTAL_PAGES * 100).toFixed(2)}%`);
console.log(`all marked entries / all entries: ${allMarked} / ${allEntries} = ${+(allMarked / allEntries * 100).toFixed(2)}%`);
console.log(`estimated no. of known / entries: ${+estimatedTotalNumberOfKnown.toFixed(2)} / ${+estimatedTotalNumberOfEntries.toFixed(2)}`);
console.log(`average marked per pages / entries per page: ${+averageEntriesPerPage.toFixed(2)} / ${+averageMarkedPerPage.toFixed(2)}`);
console.log(`averageMarkedPercentPerPage = ${+averageMarkedPercentPerPage.toFixed(2)}%`);
console.log('worst pages:', worstPages.slice(0, 10));

console.log('\n');

