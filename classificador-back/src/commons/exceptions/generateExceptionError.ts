import { HttpException } from '@nestjs/common';

export function GenerateException(error: any): never {
  // console.log("🚀 ~ GenerateException ~ error:", error)
  let status = 500;

  if (error instanceof HttpException) {
    status = error.getStatus();
  } else if (error.status) {
    status = error.status;
  } else if (error.response?.status) {
    status = error.response.status;
  }

  throw new HttpException(
    error.message || 'Internal server error', 
    status
  );
}
