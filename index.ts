import fs = require('fs');

const file = fs.readFileSync('Wortschatzstatistik.txt', 'utf8');

type Datum = {
  page: number;
  marked: number;
  actual: number;
  total: number;
};

const data: Datum[] = [];

for (const line of file.split('\n')) {
  const match = /(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/.exec(line);
  if (!match) continue;
  const [_, page, marked, actual, total] = match.map(s => +s);
  data.push({page, marked, actual, total});
}

const averageEntriesPerPage = +(data.reduce((a, e) => a + e.total, 0) / data.length).toFixed(2);
const averageMarkedPerPage = +(data.reduce((a, e) => a + e.marked, 0) / data.length).toFixed(2);
const averageActualPerPage = +(data.reduce((a, e) => a + e.actual, 0) / data.length).toFixed(2);

const firstPage = 29;
const lastPage =  1287;
const totalPages =  lastPage - firstPage + 1;

const estimatedTotalNumberOfEntries = Math.round(averageEntriesPerPage * totalPages);
const estimatedTotalNumberOfMarked = Math.round(averageMarkedPerPage * totalPages);
const estimatedTotalNumberOfActual = Math.round(averageActualPerPage * totalPages);

const percentOfMarkedFromEntries = (averageMarkedPerPage / averageEntriesPerPage * 100).toFixed(2);
const percentOfActualFromEntries = (averageActualPerPage / averageEntriesPerPage * 100).toFixed(2);

console.log(`total pages: ${totalPages}`);
console.log(`data instances: ${data.length}`);

console.log('\n');

console.log(`averageEntriesPerPage = ${averageEntriesPerPage}`);
console.log(`averageMarkedPerPage = ${averageMarkedPerPage}`);
console.log(`averageActualPerPage = ${averageActualPerPage}`);

console.log('\n');

console.log(`estimatedTotalNumberOfEntries = ${estimatedTotalNumberOfEntries}`);
console.log(`estimatedTotalNumberOfMarked = ${estimatedTotalNumberOfMarked}`);
console.log(`estimatedTotalNumberOfActual = ${estimatedTotalNumberOfActual}`);

console.log('\n');

console.log(`percentOfMarkedFromEntries = ${percentOfMarkedFromEntries}%`);
console.log(`percentOfActualFromEntries = ${percentOfActualFromEntries}%`);
