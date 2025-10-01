import { withSearchParams } from '../../../searchParams';
import { fetchGoogleApi, fetchGoogleApiObject } from '../base';
import { BatchUpdateSpreadsheetBody, Spreadsheet } from './types';

export * from './types';

type GetSpreadsheetOptions = {
  spreadsheetId: string;
  includeGridData?: boolean;
};

const BASE_URL = 'https://sheets.googleapis.com/v4';

export function getSpreadsheet(
  access: string,
  { spreadsheetId, ...rest }: GetSpreadsheetOptions
) {
  return fetchGoogleApiObject<Spreadsheet>(
    'GET',
    withSearchParams(`${BASE_URL}/spreadsheets/${spreadsheetId}`, rest),
    access
  );
}

export function batchUpdateSpreadsheet(
  access: string,
  { spreadsheetId, ...body }: BatchUpdateSpreadsheetBody
) {
  return fetchGoogleApi(
    'POST',
    new URL(`${BASE_URL}/spreadsheets/${spreadsheetId}:batchUpdate`),
    access,
    body
  );
}
