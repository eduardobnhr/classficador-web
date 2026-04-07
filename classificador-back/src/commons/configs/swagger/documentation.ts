import { HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiCookieAuth,
  ApiSecurity,
} from '@nestjs/swagger';

export class Documentation {
  static create(apiBodyDto: any, ApiResponseEntity: any): MethodDecorator {
    const decorators = [
      ApiCookieAuth('access_token'),
      ApiSecurity('x-csrf-token'),
      ApiBody({ type: apiBodyDto }),
      ApiResponse({ type: ApiResponseEntity, status: HttpStatus.CREATED }),
      ApiUnauthorizedResponse(this.createErrorResponseSchema('Unauthorized')),
      ApiBadRequestResponse(this.createErrorResponseSchema('Bad Request')),
      ApiConflictResponse(this.createErrorResponseSchema('Conflict')),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];

    return this.applyDecorators(decorators);
  }

  static list(ApiResponseEntity: any): MethodDecorator {
    const decorators = [
      ApiCookieAuth('access_token'),
      ApiSecurity('x-csrf-token'),
      ApiResponse({ type: ApiResponseEntity, isArray: true, status: HttpStatus.OK }),
      ApiUnauthorizedResponse(this.createErrorResponseSchema('Unauthorized')),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];

    return this.applyDecorators(decorators);
  }

  static findOne(ApiResponseEntity: any): MethodDecorator {
    const decorators = [
      ApiCookieAuth('access_token'),
      ApiSecurity('x-csrf-token'),
      ApiResponse({ type: ApiResponseEntity, status: HttpStatus.OK }),
      ApiNotFoundResponse(this.createErrorResponseSchema('Not Found')),
      ApiUnauthorizedResponse(this.createErrorResponseSchema('Unauthorized')),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];

    return this.applyDecorators(decorators);
  }

  static update(apiBodyDto: any, ApiResponseEntity: any): MethodDecorator {
    const decorators = [
      ApiCookieAuth('access_token'),
      ApiSecurity('x-csrf-token'),
      ApiBody({ type: apiBodyDto }),
      ApiResponse({ type: ApiResponseEntity, status: HttpStatus.OK }),
      ApiBadRequestResponse(this.createErrorResponseSchema('Bad Request')),
      ApiConflictResponse(this.createErrorResponseSchema('Conflict')),
      ApiUnauthorizedResponse(this.createErrorResponseSchema('Unauthorized')),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];

    return this.applyDecorators(decorators);
  }

  static delete(): MethodDecorator {
    const decorators = [
      ApiCookieAuth('access_token'),
      ApiSecurity('x-csrf-token'),
      ApiResponse({ status: HttpStatus.NO_CONTENT }),
      ApiBadRequestResponse(this.createErrorResponseSchema('Bad Request')),
      ApiUnauthorizedResponse(this.createErrorResponseSchema('Unauthorized')),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];

    return this.applyDecorators(decorators);
  }

  private static applyDecorators(decorators: MethodDecorator[]): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      for (const decorator of decorators) {
        decorator(target, propertyKey, descriptor);
      }
    };
  }

  private static createErrorResponseSchema(example: string) {
    return {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: example,
              },
            },
          },
        },
      },
    };
  }

  static login(apiBodyDto: any, ApiResponseEntity: any): MethodDecorator {
    const decorators = [
      ApiBody({ type: apiBodyDto }),
      ApiResponse({ type: ApiResponseEntity, status: HttpStatus.OK }),
      ApiUnauthorizedResponse(this.createErrorResponseSchema('Unauthorized')),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];
 
    return this.applyDecorators(decorators);
  }
 
  static health(): MethodDecorator {
    const decorators = [
      ApiResponse({ status: HttpStatus.OK }),
      ApiInternalServerErrorResponse(this.createErrorResponseSchema('Internal Server Error')),
    ];
 
    return this.applyDecorators(decorators);
  }
}
