export enum PollExportErrorType {
  NOT_FOUND = 0,
  NO_LINKED_SPREADSHEET = 1,
}

export class PollExportError extends Error {
  type: PollExportErrorType;

  constructor(messsage: string, type: PollExportErrorType) {
    super(messsage);

    this.type = type;
  }
}
