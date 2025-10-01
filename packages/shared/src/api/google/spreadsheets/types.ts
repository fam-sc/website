export type CellNotation = `${string}${number}`;
export type A1Range = `${CellNotation}:${CellNotation}`;
export type A1Notation = `${string}!${A1Range}` | A1Range;

export type ValueInputOption =
  | 'INPUT_VALUE_OPTION_UNSPECIFIED'
  | 'RAW'
  | 'USER_ENTERED';

export type ValueRenderOption =
  | 'FORMATTED_VALUE'
  | 'UNFORMATTED_VALUE'
  | 'FORMULA';

export type ValueDateTimeRenderOption = 'SERIAL_NUMBER' | 'FORMATTED_STRING';

export type Dimension = 'DIMENSION_UNSPECIFIED' | 'ROWS' | 'COLUMNS';

export type ConditionType = 'BOOLEAN';

export type NumberFormatType = 'DATE_TIME';

export type Value = string | number | boolean;

type BuildPath<
  Prefix extends string | null,
  Property extends string,
> = Prefix extends null ? Property : `${Prefix}.${Property}`;

type ObjectFields<T extends object, Prefix extends string | null> = {
  [K in keyof T & string]: BaseFields<T[K], BuildPath<Prefix, K>>;
}[keyof T & string];

type BaseFields<T, Path extends string | null> = T extends (infer E)[]
  ? BaseFields<E, Path>
  : T extends object
    ? Path | ObjectFields<T, Path>
    : Path;

export type Fields<T> = '*' | BaseFields<T, null>;

export type ValueRange = {
  range: A1Notation;
  majorDimension?: Dimension;
  values: Value[][];
};

export type GridRange = {
  sheetId: number;
  startRowIndex?: number;
  endRowIndex?: number;
  startColumnIndex?: number;
  endColumnIndex?: number;
};

export type Color = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export type ColorStyle = {
  rgbColor: Color;
};

export type NumberFormat = {
  type: NumberFormatType;
  pattern?: string;
};

export type CellFormat = {
  backgroundColorStyle?: ColorStyle;
  numberFormat?: NumberFormat;
};

type Union<T> = { [K in keyof T]: Record<K, T[K]> }[keyof T];

export type ExtendedValue = Union<{
  numberValue: number;
  stringValue: string;
  boolValue: boolean;
  formulaValue: string;
}>;

export type BooleanCondition = {
  type: ConditionType;
  values: [];
};

export type DataValidationRule = {
  condition: BooleanCondition;
  showCustomUi: boolean;
};

export type CellData = {
  userEnteredValue?: ExtendedValue;
  userEnteredFormat?: CellFormat;
  dataValidation?: DataValidationRule;
};

export type RowData = {
  values: CellData[];
};

export type GridProperties = {
  frozenRowCount: number;
};

export type SheetProperties = {
  sheetId: number;
  gridProperties: GridProperties;
};

export type BatchUpdateSpreadsheetBody = {
  spreadsheetId: string;
  requests: Request[];
};

type Requests = {
  repeatCell: {
    range: GridRange;
    cell: CellData;
    fields: Fields<CellData>;
  };
  updateCells: {
    range: GridRange;
    rows: RowData[];
    fields: Fields<RowData>;
  };
  appendCells: {
    sheetId: number;
    rows: RowData[];
    fields: Fields<RowData>;
  };
  updateSheetProperties: {
    properties: SheetProperties;
    fields: Fields<SheetProperties>;
  };
};

export type Request = Union<Requests>;

export type Sheet = {
  properties: {
    sheetId: number;
  };
};

export type Spreadsheet = {
  sheets: Sheet[];
};
