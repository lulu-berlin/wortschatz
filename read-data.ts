
import {readFileSync} from 'fs';

export type Datum = {
  page: number;
  marked: number;
  actual: number;
  total: number;
};

const PATTERN = /(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;

export const readData = (filename: string): Datum[] =>
  readFileSync(filename, 'utf8')
    .split('\n')
    .map(line => PATTERN.exec(line))
    .filter(match => match)
    .map(match => {
      if (!match) throw new Error('should not happen');
      const [_, page, marked, actual, total] = match.map(s => +s);
      return {page, marked, actual, total};
    });
