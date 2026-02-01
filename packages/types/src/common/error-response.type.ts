export enum ErrorType {
  BAD_REQUEST = 'BadRequest',
  NOT_FOUND = 'NotFound',
}

export interface ErrorResponseDto {
  error: string
}
