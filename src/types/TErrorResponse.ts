import type { TvalidationErrors } from "./TValidationErrors";

export type TErrorResponse={
     status: number;
  error: string |TvalidationErrors;
  message: string;
}