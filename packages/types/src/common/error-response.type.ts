export enum ErrorType {
  BAD_REQUEST = 'BadRequest',
  NOT_FOUND = 'NotFound',
}

export interface ErrorResponseDto {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}
