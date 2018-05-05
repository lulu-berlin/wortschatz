import {existsSync, writeFileSync} from 'fs';
import {readData, Datum} from './read-data';

if (process.argv.length !== 4) {
  throw new Error('Usage: ts-node migrate.ts [input-filename] [output-filename]');
}

const [_, __, INPUT_FILENAME, OUTPUT_FILENAME] = process.argv;

if (!existsSync(INPUT_FILENAME)) {
  const msg = `File named ${INPUT_FILENAME} doesn't exist`;
  console.error(msg);
  throw new Error(msg);
}

const isDataValid = (data: Datum[]): boolean => {
  if (data.length === 0) {
    return false;
  }

  const pages: number[] = [];
  
  for (const datum of data) {
    if (
      (Object.keys(datum).length !== 4) ||
      !('page' in datum) || !Number.isInteger(datum.page) || (datum.page < 0) ||
      !('marked' in datum) || !Number.isInteger(datum.marked) || (datum.marked < 0) ||
      !('actual' in datum) || !Number.isInteger(datum.actual) || (datum.actual < 0) ||
      !('total' in datum) || !Number.isInteger(datum.total) || (datum.total < 1)
    ) {
      return false;
    }

    if (pages.some(p => p === datum.page)) {
      return false;
    }

    pages.push(datum.page);
  }

  return true;
};

const data = readData(INPUT_FILENAME);

if (!isDataValid(data)) {
  const msg = `The data in file '${INPUT_FILENAME}' is not valid`;
  console.error(msg);
  throw new Error(msg);
}

const newData = 
  [
    {page: 'Seite', actual: 'Markierte Einträge', total: 'Gesamtzahl der Einträge'},
    {page: '=====', actual: '==================', total: '======================='},
    ...[...data].sort((a, b) => a.page - b.page)
    .map(({page, actual, total}) => ({
      page: page.toString(),
      actual: actual.toString(),
      total: total.toString(),
    }))
  ]

const COLUMN_WIDTH = Math.max(
  ...newData.map(({page, actual, total}) => Math.max(
    page.length,
    actual.length,
    total.length
  ))) + 10;

const spaces = (s: string) => Array(COLUMN_WIDTH - s.length - 1).join(' ');

const result =
  newData
    .map(({page, actual, total}) => `${page}${spaces(page)}${actual}${spaces(actual)}${total}`)
    .join('\n');

writeFileSync(OUTPUT_FILENAME, result, 'utf8');
